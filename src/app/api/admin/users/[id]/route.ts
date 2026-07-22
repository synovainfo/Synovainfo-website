// =============================================================================
// GET    /api/admin/users/[id]  — single user detail
// PUT    /api/admin/users/[id]  — update user
// DELETE /api/admin/users/[id]  — delete user (prevent last SUPER_ADMIN)
// Permission: SUPER_ADMIN (users:manage)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";
import { UserRole } from "@/generated/prisma/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RouteParams {
  id: string;
}

// ---------------------------------------------------------------------------
// Update schema
// ---------------------------------------------------------------------------

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .optional()
    .or(z.literal("")),
  role: z.nativeEnum(UserRole, { errorMap: () => ({ message: "Invalid role" }) }).optional(),
  isActive: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract the user id from params */
async function getUserId(context: { params: Promise<RouteParams> }): Promise<string | null> {
  const { id } = await context.params;
  return id ?? null;
}

/** Fetch user or return error response */
async function findUserOrError(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Not Found", message: "User not found" },
        { status: 404 },
      ),
    };
  }
  return { user };
}

// ---------------------------------------------------------------------------
// GET — single user
// ---------------------------------------------------------------------------

export const GET = withPermission(async (
  _request: NextRequest,
  context: { params: Promise<RouteParams> },
) => {
  try {
    const id = await getUserId(context);
    if (!id) {
      return NextResponse.json(
        { error: "Bad Request", message: "User ID is required" },
        { status: 400 },
      );
    }

    const { user, error } = await findUserOrError(id);
    if (error) return error;

    // Fetch recent activity
    const recentActivity = await prisma.auditLog.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        action: true,
        resource: true,
        resourceId: true,
        details: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        image: user.image,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      activity: recentActivity,
    });
  } catch (error) {
    console.error("[USER_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch user" },
      { status: 500 },
    );
  }
}, "users:manage");

// ---------------------------------------------------------------------------
// PUT — update user
// ---------------------------------------------------------------------------

export const PUT = withPermission(async (
  request: NextRequest,
  context: { params: Promise<RouteParams> },
) => {
  try {
    const id = await getUserId(context);
    if (!id) {
      return NextResponse.json(
        { error: "Bad Request", message: "User ID is required" },
        { status: 400 },
      );
    }

    const { user: existing, error } = await findUserOrError(id);
    if (error) return error;

    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, email, password, role, isActive } = parsed.data;

    // Check email uniqueness if changing
    if (email && email !== existing.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return NextResponse.json(
          { error: "Conflict", message: "A user with this email already exists" },
          { status: 409 },
        );
      }
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Hash password if changing (non-empty string)
    if (password && password.length > 0) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        image: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[USER_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update user" },
      { status: 500 },
    );
  }
}, "users:manage");

// ---------------------------------------------------------------------------
// DELETE — remove user (prevent deleting last SUPER_ADMIN)
// ---------------------------------------------------------------------------

export const DELETE = withPermission(async (
  _request: NextRequest,
  context: { params: Promise<RouteParams> },
) => {
  try {
    const id = await getUserId(context);
    if (!id) {
      return NextResponse.json(
        { error: "Bad Request", message: "User ID is required" },
        { status: 400 },
      );
    }

    const { user, error } = await findUserOrError(id);
    if (error) return error;

    // Prevent deleting the last SUPER_ADMIN
    if (user.role === "SUPER_ADMIN") {
      const superAdminCount = await prisma.user.count({
        where: { role: "SUPER_ADMIN", isActive: true },
      });

      if (superAdminCount <= 1) {
        return NextResponse.json(
          {
            error: "Forbidden",
            message: "Cannot delete the last active SUPER_ADMIN. Promote another user first.",
          },
          { status: 403 },
        );
      }
    }

    // Hard delete (user has relations with onDelete cascade for some models)
    // Use a transaction to clean up relations
    await prisma.$transaction([
      // Delete audit logs for this user
      prisma.auditLog.deleteMany({ where: { userId: id } }),
      // Delete activities
      prisma.activity.deleteMany({ where: { userId: id } }),
      // Unassign leads
      prisma.lead.updateMany({ where: { assignedToId: id }, data: { assignedToId: null } }),
      // Unassign contacts
      prisma.contact.updateMany({ where: { assignedToId: id }, data: { assignedToId: null } }),
      // Delete the user
      prisma.user.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete user" },
      { status: 500 },
    );
  }
}, "users:manage");
