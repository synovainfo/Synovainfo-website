// =============================================================================
// PUT    /api/admin/blog/tags/[id] — update tag
// DELETE /api/admin/blog/tags/[id] — delete tag
// Permission: blog:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const updateTagSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getId(
  context: {
    params: Promise<Record<string, string | string[] | undefined>>;
  },
): Promise<string | null> {
  const params = await context.params;
  const id = params.id;
  return typeof id === "string" ? id : null;
}

// ---------------------------------------------------------------------------
// PUT
// ---------------------------------------------------------------------------

export const PUT = withPermission(
  async (
    request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> },
  ) => {
    try {
      const id = await getId(context);
      if (!id) {
        return NextResponse.json(
          { error: "Bad Request", message: "Tag ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.tag.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Tag not found" },
          { status: 404 },
        );
      }

      const body = await request.json();
      const parsed = updateTagSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "Validation Error",
            details: parsed.error.flatten().fieldErrors,
          },
          { status: 400 },
        );
      }

      const { name, slug } = parsed.data;

      // Check slug uniqueness if changing
      if (slug && slug !== existing.slug) {
        const slugExists = await prisma.tag.findUnique({ where: { slug } });
        if (slugExists) {
          return NextResponse.json(
            {
              error: "Conflict",
              message: "A tag with this slug already exists",
            },
            { status: 409 },
          );
        }
      }

      const updateData: Record<string, unknown> = {};
      if (name !== undefined) updateData.name = name;
      if (slug !== undefined) updateData.slug = slug;

      const tag = await prisma.tag.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({ tag });
    } catch (error) {
      console.error("[BLOG_TAG_PUT]", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: "Failed to update tag" },
        { status: 500 },
      );
    }
  },
  "blog:manage",
);

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

export const DELETE = withPermission(
  async (
    _request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> },
  ) => {
    try {
      const id = await getId(context);
      if (!id) {
        return NextResponse.json(
          { error: "Bad Request", message: "Tag ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.tag.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Tag not found" },
          { status: 404 },
        );
      }

      await prisma.tag.delete({ where: { id } });

      return NextResponse.json({
        success: true,
        message: "Tag deleted successfully",
      });
    } catch (error) {
      console.error("[BLOG_TAG_DELETE]", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: "Failed to delete tag" },
        { status: 500 },
      );
    }
  },
  "blog:manage",
);
