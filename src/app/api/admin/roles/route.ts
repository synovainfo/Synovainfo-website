// =============================================================================
// GET /api/admin/roles — list all roles with their permissions & user counts
// Permission: SUPER_ADMIN (roles:manage)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";
import { Permissions, getPermissions, type Role } from "@/lib/permissions";

// ---------------------------------------------------------------------------
// Role descriptor — maps to the enum values in the User model
// ---------------------------------------------------------------------------

const ROLE_DESCRIPTIONS: Record<string, string> = {
  SUPER_ADMIN: "Full system access with all permissions",
  ADMIN: "Content management with settings access, no user management",
  EDITOR: "Create and edit content, cannot publish or manage users",
  VIEWER: "Read-only access to content and analytics",
};

/** Resource group label (used by the frontend permission editor) */
const RESOURCE_GROUPS: Record<string, string> = {
  pages: "Pages",
  services: "Services",
  industries: "Industries",
  blog: "Blog",
  media: "Media",
  users: "Users",
  roles: "Roles",
  settings: "Settings",
  audit: "Audit Logs",
  leads: "Leads",
  newsletter: "Newsletter",
  forms: "Forms",
  seo: "SEO",
  "site-config": "Site Config",
  theme: "Theme",
};

// ---------------------------------------------------------------------------
// GET — list all roles
// ---------------------------------------------------------------------------

export const GET = withPermission(async () => {
  try {
    // Get user counts per role from the User model
    const userCounts = await prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
    });

    const countMap: Record<string, number> = {};
    for (const entry of userCounts) {
      countMap[entry.role] = entry._count.id;
    }

    // Build roles from the permission matrix
    const roles = (["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"] as Role[]).map((role) => {
      const permissions = getPermissions(role);

      // Group permissions by resource
      const grouped: Record<string, string[]> = {};
      for (const perm of permissions) {
        const [resource] = perm.split(":");
        if (!grouped[resource]) grouped[resource] = [];
        grouped[resource].push(perm);
      }

      return {
        id: role,
        name: role,
        description: ROLE_DESCRIPTIONS[role] ?? "",
        userCount: countMap[role] ?? 0,
        permissions,
        groupedPermissions: grouped,
        isSystem: true, // System roles cannot be deleted
      };
    });

    // Also fetch custom roles from the Role model if any exist
    const customRoles = await prisma.role.findMany({
      include: {
        permissions: {
          select: { action: true, resource: true },
        },
      },
    });

    // Merge custom roles — we map them similarly
    for (const cr of customRoles) {
      const perms = cr.permissions.map((p) => `${p.resource}:${p.action}`);
      const grouped: Record<string, string[]> = {};
      for (const perm of perms) {
        const [resource] = perm.split(":");
        if (!grouped[resource]) grouped[resource] = [];
        grouped[resource].push(perm);
      }

      roles.push({
        id: cr.id,
        name: cr.name,
        description: cr.description ?? "",
        userCount: 0, // Custom roles need a UserRole mapping
        permissions: perms,
        groupedPermissions: grouped,
        isSystem: false,
      });
    }

    return NextResponse.json({
      roles,
      resourceGroups: RESOURCE_GROUPS,
      allPermissions: Permissions,
    });
  } catch (error) {
    console.error("[ROLES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch roles" },
      { status: 500 },
    );
  }
}, "roles:manage");
