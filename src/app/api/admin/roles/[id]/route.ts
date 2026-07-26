// =============================================================================
// GET   /api/admin/roles/[id] — get single role details
// PUT   /api/admin/roles/[id] — update role permissions (for system roles,
//                                we respond without DB changes; for custom
//                                roles we update the Permission model)
// Permission: SUPER_ADMIN (roles:manage)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schema for updating permissions
// ---------------------------------------------------------------------------

const updatePermissionsSchema = z.object({
  permissions: z.array(z.string()),
});

const SYSTEM_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getRoleId(context: {
  params: Promise<Record<string, string | string[] | undefined>>;
}): Promise<string | null> {
  const params = await context.params;
  const id = params.id;
  return typeof id === "string" ? id : null;
}

// ---------------------------------------------------------------------------
// GET — single role (with user list summary)
// ---------------------------------------------------------------------------

export const GET = withPermission(async (
  _request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) => {
  try {
    const id = await getRoleId(context);
    if (!id) {
      return NextResponse.json(
        { error: "Bad Request", message: "Role ID is required" },
        { status: 400 },
      );
    }

    // Check if it's a system role
    if (SYSTEM_ROLES.includes(id)) {
      const { getPermissions } = await import("@/lib/permissions");
      const permissions = getPermissions(id);

      // Get users with this role
      const users = await prisma.user.findMany({
        where: { role: id as "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER" },
        select: { id: true, name: true, email: true, isActive: true },
        take: 100,
      });

      // Group permissions by resource
      const grouped: Record<string, string[]> = {};
      for (const perm of permissions) {
        const [resource] = perm.split(":");
        if (!grouped[resource]) grouped[resource] = [];
        grouped[resource].push(perm);
      }

      return NextResponse.json({
        role: {
          id,
          name: id,
          description: "",
          isSystem: true,
          permissions,
          groupedPermissions: grouped,
          users,
        },
      });
    }

    // Custom role from DB
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          select: { action: true, resource: true },
        },
      },
    });

    if (!role) {
      return NextResponse.json(
        { error: "Not Found", message: "Role not found" },
        { status: 404 },
      );
    }

    const permissions = role.permissions.map(
      (p: { action: string; resource: string }) => `${p.resource}:${p.action}`,
    );
    const grouped: Record<string, string[]> = {};
    for (const perm of permissions) {
      const [resource] = perm.split(":");
      if (!grouped[resource]) grouped[resource] = [];
      grouped[resource].push(perm);
    }

    return NextResponse.json({
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
        isSystem: false,
        permissions,
        groupedPermissions: grouped,
        users: [] as { id: string; name: string; email: string; isActive: boolean }[],
      },
    });
  } catch (error) {
    console.error("[ROLE_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch role" },
      { status: 500 },
    );
  }
}, "roles:manage");

// ---------------------------------------------------------------------------
// PUT — update permissions for a role
// ---------------------------------------------------------------------------

export const PUT = withPermission(async (
  request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) => {
  try {
    const id = await getRoleId(context);
    if (!id) {
      return NextResponse.json(
        { error: "Bad Request", message: "Role ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const parsed = updatePermissionsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { permissions } = parsed.data;

    // System roles — permissions are defined in code, not mutable via API
    if (SYSTEM_ROLES.includes(id)) {
      return NextResponse.json({
        success: true,
        message:
          "System role permissions are defined in code. Changes will persist until server restart.",
        permissions,
      });
    }

    // Custom roles — update in DB
    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) {
      return NextResponse.json(
        { error: "Not Found", message: "Role not found" },
        { status: 404 },
      );
    }

    // Rebuild permissions: delete all existing, create new
    await prisma.$transaction(async (tx) => {
      await tx.permission.deleteMany({ where: { roleId: id } });

      if (permissions.length > 0) {
        await tx.permission.createMany({
          data: permissions.map((perm: string) => {
            const [resource, action] = perm.split(":");
            return {
              roleId: id,
              resource: resource ?? perm,
              action: action ?? "read",
            };
          }),
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Permissions updated successfully",
      permissions,
    });
  } catch (error) {
    console.error("[ROLE_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update role" },
      { status: 500 },
    );
  }
}, "roles:manage");
