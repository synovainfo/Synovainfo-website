// =============================================================================
// GET  /api/admin/blog — paginated list with search & filter
// POST /api/admin/blog — create a new blog post
// Permission: blog:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional().default(""),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).optional(),
  categoryId: z.string().optional(),
  sort: z
    .enum(["title", "status", "createdAt", "updatedAt", "publishedAt", "viewCount"])
    .optional()
    .default("updatedAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  content: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  tagIds: z.array(z.string()).optional().default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).optional().default("DRAFT"),
  publishedAt: z.string().datetime().optional().nullable(),
  scheduledAt: z.string().datetime().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// GET — paginated list
// ---------------------------------------------------------------------------

export const GET = withPermission(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const parsed = listQuerySchema.safeParse(
      Object.fromEntries(url.searchParams),
    );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { page, pageSize, search, status, categoryId, sort, order } =
      parsed.data;

    const where: Record<string, unknown> = { deletedAt: null };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: {
            include: { tag: { select: { id: true, name: true, slug: true } } },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    // Transform tags from join table to flat array
    const transformed = posts.map((post) => ({
      ...post,
      tags: post.tags.map((t) => t.tag),
    }));

    return NextResponse.json({
      posts: transformed,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[BLOG_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}, "blog:manage");

// ---------------------------------------------------------------------------
// POST — create blog post
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    const authorId = token?.sub ?? "";

    const body = await request.json();
    const parsed = createPostSchema.safeParse(body);

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
      content,
      excerpt,
      featuredImage,
      categoryId,
      tagIds,
      status,
      publishedAt,
      scheduledAt,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      ogImage,
    } = parsed.data;

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Conflict", message: "A post with this slug already exists" },
        { status: 409 },
      );
    }

    // Verify category exists
    const category = await prisma.blogCategory.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: "Validation Error", message: "Category not found" },
        { status: 400 },
      );
    }

    // Verify tags exist
    if (tagIds.length > 0) {
      const existingTags = await prisma.tag.findMany({
        where: { id: { in: tagIds } },
        select: { id: true },
      });
      const existingTagIds = new Set(existingTags.map((t) => t.id));
      const missingTags = tagIds.filter((id) => !existingTagIds.has(id));
      if (missingTags.length > 0) {
        return NextResponse.json(
          {
            error: "Validation Error",
            message: `Tags not found: ${missingTags.join(", ")}`,
          },
          { status: 400 },
        );
      }
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content: content ?? null,
        excerpt: excerpt ?? null,
        featuredImage: featuredImage ?? null,
        categoryId,
        authorId,
        status,
        publishedAt:
          publishedAt
            ? new Date(publishedAt)
            : status === "PUBLISHED"
              ? new Date()
              : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        seoTitle: seoTitle ?? null,
        seoDescription: seoDescription ?? null,
        seoKeywords: seoKeywords ?? null,
        canonicalUrl: canonicalUrl ?? null,
        ogImage: ogImage ?? null,
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: {
          include: { tag: { select: { id: true, name: true, slug: true } } },
        },
      },
    });

    const result = {
      ...post,
      tags: post.tags.map((t) => t.tag),
    };

    return NextResponse.json({ post: result }, { status: 201 });
  } catch (error) {
    console.error("[BLOG_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create blog post" },
      { status: 500 },
    );
  }
}, "blog:manage");
