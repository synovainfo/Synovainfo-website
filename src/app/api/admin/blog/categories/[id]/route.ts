// =============================================================================
// PUT    /api/admin/blog/categories/[id] — update category
// DELETE /api/admin/blog/categories/[id] — delete category
// Permission: blog:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const updateCategorySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().optional().nullable(),
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
          { error: "Bad Request", message: "Category ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.blogCategory.findUnique({
        where: { id },
      });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Category not found" },
          { status: 404 },
        );
      }

      const body = await request.json();
      const parsed = updateCategorySchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "Validation Error",
            details: parsed.error.flatten().fieldErrors,
          },
          { status: 400 },
        );
      }

      const { name, slug, description } = parsed.data;

      // Check slug uniqueness if changing
      if (slug && slug !== existing.slug) {
        const slugExists = await prisma.blogCategory.findUnique({
          where: { slug },
        });
        if (slugExists) {
          return NextResponse.json(
            {
              error: "Conflict",
              message: "A category with this slug already exists",
            },
            { status: 409 },
          );
        }
      }

      const updateData: Record<string, unknown> = {};
      if (name !== undefined) updateData.name = name;
      if (slug !== undefined) updateData.slug = slug;
      if (description !== undefined) updateData.description = description;

      const category = await prisma.blogCategory.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({ category });
    } catch (error) {
      console.error("[BLOG_CATEGORY_PUT]", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Failed to update category",
        },
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
          { error: "Bad Request", message: "Category ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.blogCategory.findUnique({
        where: { id },
      });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Category not found" },
          { status: 404 },
        );
      }

      // Check if category has posts
      const postCount = await prisma.blogPost.count({
        where: { categoryId: id, deletedAt: null },
      });
      if (postCount > 0) {
        return NextResponse.json(
          {
            error: "Conflict",
            message: `Cannot delete category with ${postCount} associated post(s). Reassign posts first.`,
          },
          { status: 409 },
        );
      }

      await prisma.blogCategory.delete({ where: { id } });

      return NextResponse.json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error("[BLOG_CATEGORY_DELETE]", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Failed to delete category",
        },
        { status: 500 },
      );
    }
  },
  "blog:manage",
);
