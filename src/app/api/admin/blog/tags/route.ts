// =============================================================================
// GET  /api/admin/blog/tags — list all tags
// POST /api/admin/blog/tags — create a new tag
// Permission: blog:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const createTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
});

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(async () => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { posts: true } },
      },
    });

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("[BLOG_TAGS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch tags" },
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
    const parsed = createTagSchema.safeParse(body);

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

    // Check slug uniqueness
    const existing = await prisma.tag.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Conflict", message: "A tag with this slug already exists" },
        { status: 409 },
      );
    }

    const tag = await prisma.tag.create({
      data: { name, slug },
    });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    console.error("[BLOG_TAGS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create tag" },
      { status: 500 },
    );
  }
}, "blog:manage");
