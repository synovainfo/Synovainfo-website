// =============================================================================
// GET    /api/admin/resources/[id] — single resource detail
// PUT    /api/admin/resources/[id] — update resource
// DELETE /api/admin/resources/[id] — delete resource
// Permission: resources:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const updateResourceSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  status: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getResourceId(context: {
  params: Promise<Record<string, string | string[] | undefined>>;
}): Promise<string | null> {
  const params = await context.params;
  const id = params.id;
  return typeof id === "string" ? id : null;
}

async function getUserIdFromToken(
  request: NextRequest,
): Promise<string> {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  return token?.sub ?? "unknown";
}

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(
  async (
    _request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> },
  ) => {
    try {
      const id = await getResourceId(context);
      if (!id) {
        return NextResponse.json(
          { error: "Bad Request", message: "Resource ID is required" },
          { status: 400 },
        );
      }

      const resource = await prisma.resource.findUnique({
        where: { id },
      });

      if (!resource) {
        return NextResponse.json(
          { error: "Not Found", message: "Resource not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ resource });
    } catch (error) {
      console.error("[RESOURCE_GET]", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Failed to fetch resource",
        },
        { status: 500 },
      );
    }
  },
  "resources:manage",
);

// ---------------------------------------------------------------------------
// PUT
// ---------------------------------------------------------------------------

export const PUT = withPermission(
  async (
    request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> },
  ) => {
    try {
      const id = await getResourceId(context);
      if (!id) {
        return NextResponse.json(
          { error: "Bad Request", message: "Resource ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.resource.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Resource not found" },
          { status: 404 },
        );
      }

      const body = await request.json();
      const parsed = updateResourceSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "Validation Error",
            details: parsed.error.flatten().fieldErrors,
          },
          { status: 400 },
        );
      }

      const {
        title,
        slug,
        description,
        type,
        fileUrl,
        coverImage,
        category,
        tags,
        status,
      } = parsed.data;

      // Check slug uniqueness if changing
      if (slug && slug !== existing.slug) {
        const slugExists = await prisma.resource.findUnique({
          where: { slug },
        });
        if (slugExists) {
          return NextResponse.json(
            {
              error: "Conflict",
              message: "A resource with this slug already exists",
            },
            { status: 409 },
          );
        }
      }

      const updateData: Record<string, unknown> = {};
      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) updateData.slug = slug;
      if (description !== undefined) updateData.description = description;
      if (type !== undefined) updateData.type = type;
      if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
      if (coverImage !== undefined) updateData.coverImage = coverImage;
      if (category !== undefined) updateData.category = category;
      if (tags !== undefined) updateData.tags = tags;
      if (status !== undefined) updateData.status = status;

      const resource = await prisma.resource.update({
        where: { id },
        data: updateData,
      });

      // Audit log
      const userId = await getUserIdFromToken(request);
      await prisma.auditLog
        .create({
          data: {
            userId,
            action: "UPDATE",
            resource: "Resource",
            resourceId: resource.id,
            details: { title: resource.title, slug: resource.slug },
          },
        })
        .catch((err) => console.error("[AUDIT_FAILED]", err));

      return NextResponse.json({ resource });
    } catch (error) {
      console.error("[RESOURCE_PUT]", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Failed to update resource",
        },
        { status: 500 },
      );
    }
  },
  "resources:manage",
);

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

export const DELETE = withPermission(
  async (
    request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> },
  ) => {
    try {
      const id = await getResourceId(context);
      if (!id) {
        return NextResponse.json(
          { error: "Bad Request", message: "Resource ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.resource.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Resource not found" },
          { status: 404 },
        );
      }

      await prisma.resource.delete({ where: { id } });

      // Audit log
      const userId = await getUserIdFromToken(request);
      await prisma.auditLog
        .create({
          data: {
            userId,
            action: "DELETE",
            resource: "Resource",
            resourceId: id,
            details: { title: existing.title, slug: existing.slug },
          },
        })
        .catch((err) => console.error("[AUDIT_FAILED]", err));

      return NextResponse.json({
        success: true,
        message: "Resource deleted successfully",
      });
    } catch (error) {
      console.error("[RESOURCE_DELETE]", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Failed to delete resource",
        },
        { status: 500 },
      );
    }
  },
  "resources:manage",
);
