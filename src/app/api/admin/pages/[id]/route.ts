// =============================================================================
// GET    /api/admin/pages/[id] — single page detail
// PUT    /api/admin/pages/[id] — update page (creates version snapshot)
// DELETE /api/admin/pages/[id] — soft-delete page
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getToken } from "next-auth/jwt";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const updatePageSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  excerpt: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).optional(),
  featuredImage: z.string().optional().nullable(),
  template: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  scheduledAt: z.string().datetime().optional().nullable(),
  customCss: z.string().optional().nullable(),
  content: z.any().optional(),
  sections: z
    .array(
      z.object({
        id: z.string().optional(),
        sectionType: z.string(),
        title: z.string().optional().nullable(),
        content: z.any().optional(),
        order: z.number().int().default(0),
        isVisible: z.boolean().default(true),
        settings: z.any().optional(),
      }),
    )
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
          { error: "Bad Request", message: "Page ID is required" },
          { status: 400 },
        );
      }

      const page = await prisma.page.findFirst({
        where: { id, deletedAt: null },
        include: {
          author: { select: { id: true, name: true, image: true } },
          parent: { select: { id: true, title: true } },
          children: {
            where: { deletedAt: null },
            select: { id: true, title: true, slug: true, status: true },
          },
          sections: { orderBy: { order: "asc" } },
          versions: {
            orderBy: { versionNumber: "desc" },
            take: 10,
            select: {
              id: true,
              versionNumber: true,
              createdAt: true,
              title: true,
              status: true,
            },
          },
        },
      });

      if (!page) {
        return NextResponse.json(
          { error: "Not Found", message: "Page not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ page });
    } catch (error) {
      console.error("[PAGE_GET]", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: "Failed to fetch page" },
        { status: 500 },
      );
    }
  },
  "pages:manage",
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
          { error: "Bad Request", message: "Page ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.page.findFirst({
        where: { id, deletedAt: null },
      });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Page not found" },
          { status: 404 },
        );
      }

      const body = await request.json();
      const parsed = updatePageSchema.safeParse(body);

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
        excerpt,
        status,
        featuredImage,
        template,
        parentId,
        publishedAt,
        scheduledAt,
        customCss,
        content,
        sections,
      } = parsed.data;

      // Check slug uniqueness if changing
      if (slug && slug !== existing.slug) {
        const slugExists = await prisma.page.findUnique({
          where: { slug },
        });
        if (slugExists) {
          return NextResponse.json(
            {
              error: "Conflict",
              message: "A page with this slug already exists",
            },
            { status: 409 },
          );
        }
      }

      const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
      });
      const userId = token?.sub ?? "";

      // Use a transaction for atomic update + version tracking + sections
      const page = await prisma.$transaction(async (tx) => {
        // Build update data
        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title;
        if (slug !== undefined) updateData.slug = slug;
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (status !== undefined) updateData.status = status;
        if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
        if (template !== undefined) updateData.template = template;
        if (parentId !== undefined) updateData.parentId = parentId;
        if (customCss !== undefined) updateData.customCss = customCss;
        if (content !== undefined) updateData.content = content ?? Prisma.DbNull;
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

        // Update the page
        const updated = await tx.page.update({
          where: { id },
          data: updateData,
        });

        // Handle sections: delete existing, create new
        if (sections !== undefined) {
          await tx.pageSection.deleteMany({ where: { pageId: id } });
          if (sections.length > 0) {
            await tx.pageSection.createMany({
              data: sections.map((s) => ({
                pageId: id,
                sectionType: s.sectionType,
                title: s.title ?? null,
                content: s.content !== undefined ? s.content : Prisma.DbNull,
                order: s.order,
                isVisible: s.isVisible,
                settings: s.settings !== undefined ? s.settings : Prisma.DbNull,
              })),
            });
          }
        }

        // Create version snapshot
        const latestVersion = await tx.pageVersion.findFirst({
          where: { pageId: id },
          orderBy: { versionNumber: "desc" },
          select: { versionNumber: true },
        });
        const nextVersion = (latestVersion?.versionNumber ?? 0) + 1;

        await tx.pageVersion.create({
          data: {
            pageId: id,
            versionNumber: nextVersion,
            title: updated.title,
            slug: updated.slug,
            status: updated.status,
            content: updated.content ?? Prisma.DbNull,
            publishedAt: updated.publishedAt,
            createdById: userId,
          },
        });

        return updated;
      });

      // Refetch with relations
      const result = await prisma.page.findFirst({
        where: { id, deletedAt: null },
        include: {
          author: { select: { id: true, name: true, image: true } },
          parent: { select: { id: true, title: true } },
          sections: { orderBy: { order: "asc" } },
          versions: {
            orderBy: { versionNumber: "desc" },
            take: 10,
            select: {
              id: true,
              versionNumber: true,
              createdAt: true,
              title: true,
              status: true,
            },
          },
        },
      });

      return NextResponse.json({ page: result });
    } catch (error) {
      console.error("[PAGE_PUT]", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: "Failed to update page" },
        { status: 500 },
      );
    }
  },
  "pages:manage",
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
          { error: "Bad Request", message: "Page ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.page.findFirst({
        where: { id, deletedAt: null },
      });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Page not found" },
          { status: 404 },
        );
      }

      // Soft delete
      await prisma.page.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        message: "Page deleted successfully",
      });
    } catch (error) {
      console.error("[PAGE_DELETE]", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: "Failed to delete page" },
        { status: 500 },
      );
    }
  },
  "pages:manage",
);
