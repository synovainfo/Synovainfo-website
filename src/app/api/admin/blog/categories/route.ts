// =============================================================================
// GET  /api/admin/blog/categories — list all categories
// POST /api/admin/blog/categories — create a new category
// Permission: blog:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional().nullable(),
});

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(async () => {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { posts: true } },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("[BLOG_CATEGORIES_GET]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch categories",
      },
      { status: 500 },
    );
  }
}, "blog:manage");

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);

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

    // Check slug uniqueness
    const existing = await prisma.blogCategory.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "A category with this slug already exists",
        },
        { status: 409 },
      );
    }

    const category = await prisma.blogCategory.create({
      data: {
        name,
        slug,
        description: description ?? null,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("[BLOG_CATEGORIES_POST]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create category",
      },
      { status: 500 },
    );
  }
}, "blog:manage");
