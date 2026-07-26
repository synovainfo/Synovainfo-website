// =============================================================================
// GET    /api/admin/blog/[id] — single blog post detail
// PUT    /api/admin/blog/[id] — update blog post
// DELETE /api/admin/blog/[id] — soft-delete blog post
// Permission: blog:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  content: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  categoryId: z.string().min(1).optional(),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).optional(),
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
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(
  async (
    _request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> },
  ) => {
    try {
      const id = await getId(context);
      if (!id) {
        return NextResponse.json(
          { error: "Bad Request", message: "Post ID is required" },
          { status: 400 },
        );
      }

      const post = await prisma.blogPost.findFirst({
        where: { id, deletedAt: null },
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: {
            include: { tag: { select: { id: true, name: true, slug: true } } },
          },
        },
      });

      if (!post) {
        return NextResponse.json(
          { error: "Not Found", message: "Blog post not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        post: {
          ...post,
          tags: post.tags.map((t) => t.tag),
        },
      });
    } catch (error) {
      console.error("[BLOG_GET_BY_ID]", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Failed to fetch blog post",
        },
        { status: 500 },
      );
    }
  },
  "blog:manage",
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
      const id = await getId(context);
      if (!id) {
        return NextResponse.json(
          { error: "Bad Request", message: "Post ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.blogPost.findFirst({
        where: { id, deletedAt: null },
        include: { tags: { select: { tagId: true } } },
      });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Blog post not found" },
          { status: 404 },
        );
      }

      const body = await request.json();
      const parsed = updatePostSchema.safeParse(body);

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

      // Check slug uniqueness if changing
      if (slug && slug !== existing.slug) {
        const slugExists = await prisma.blogPost.findUnique({
          where: { slug },
        });
        if (slugExists) {
          return NextResponse.json(
            {
              error: "Conflict",
              message: "A post with this slug already exists",
            },
            { status: 409 },
          );
        }
      }

      // Verify category if changing
      if (categoryId && categoryId !== existing.categoryId) {
        const category = await prisma.blogCategory.findUnique({
          where: { id: categoryId },
        });
        if (!category) {
          return NextResponse.json(
            { error: "Validation Error", message: "Category not found" },
            { status: 400 },
          );
        }
      }

      const post = await prisma.$transaction(async (tx) => {
        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title;
        if (slug !== undefined) updateData.slug = slug;
        if (content !== undefined) updateData.content = content;
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
        if (categoryId !== undefined) updateData.categoryId = categoryId;
        if (status !== undefined) updateData.status = status;
        if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
        if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
        if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords;
        if (canonicalUrl !== undefined) updateData.canonicalUrl = canonicalUrl;
        if (ogImage !== undefined) updateData.ogImage = ogImage;
        if (publishedAt !== undefined) {
          updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
        }
        if (scheduledAt !== undefined) {
          updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
        }
        // Auto-set publishedAt when status changes to PUBLISHED
        if (
          status === "PUBLISHED" &&
          existing.status !== "PUBLISHED" &&
          !publishedAt
        ) {
          updateData.publishedAt = new Date();
        }

        // Update the post
        const updated = await tx.blogPost.update({
          where: { id },
          data: updateData,
        });

        // Handle tags replacement
        if (tagIds !== undefined) {
          await tx.tagOnPost.deleteMany({ where: { postId: id } });
          if (tagIds.length > 0) {
            await tx.tagOnPost.createMany({
              data: tagIds.map((tagId) => ({ postId: id, tagId })),
            });
          }
        }

        return updated;
      });

      // Refetch with relations
      const result = await prisma.blogPost.findFirst({
        where: { id, deletedAt: null },
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: {
            include: { tag: { select: { id: true, name: true, slug: true } } },
          },
        },
      });

      return NextResponse.json({
        post: result
          ? { ...result, tags: result.tags.map((t) => t.tag) }
          : null,
      });
    } catch (error) {
      console.error("[BLOG_PUT]", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Failed to update blog post",
        },
        { status: 500 },
      );
    }
  },
  "blog:manage",
);

// ---------------------------------------------------------------------------
// DELETE (soft delete)
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
          { error: "Bad Request", message: "Post ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.blogPost.findFirst({
        where: { id, deletedAt: null },
      });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Blog post not found" },
          { status: 404 },
        );
      }

      await prisma.blogPost.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        message: "Blog post deleted successfully",
      });
    } catch (error) {
      console.error("[BLOG_DELETE]", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Failed to delete blog post",
        },
        { status: 500 },
      );
    }
  },
  "blog:manage",
);
