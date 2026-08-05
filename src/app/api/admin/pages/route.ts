// =============================================================================
// GET  /api/admin/pages — paginated list with search & filter
// POST /api/admin/pages — create a new page
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

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional().default(""),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).optional(),
  template: z.string().optional(),
  sort: z
    .enum(["title", "status", "createdAt", "updatedAt", "publishedAt"])
    .optional()
    .default("updatedAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const createPageSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase alphanumeric with hyphens",
    ),
  excerpt: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).optional().default("DRAFT"),
  featuredImage: z.string().optional().nullable(),
  template: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  scheduledAt: z.string().datetime().optional().nullable(),
  customCss: z.string().optional().nullable(),
  content: z.any().optional(),
});

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

    const { page, pageSize, search, status, template, sort, order } =
      parsed.data;

    const where: Record<string, unknown> = { deletedAt: null };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }
    if (status) where.status = status;
    if (template) where.template = template;

    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          author: { select: { id: true, name: true, image: true } },
          parent: { select: { id: true, title: true } },
          sections: {
            orderBy: { order: "asc" },
            select: { id: true, sectionType: true, title: true, order: true, isVisible: true },
          },
          versions: {
            orderBy: { versionNumber: "desc" },
            take: 1,
            select: { versionNumber: true, createdAt: true },
          },
        },
      }),
      prisma.page.count({ where }),
    ]);

    return NextResponse.json({
      pages,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[PAGES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch pages" },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// POST — create page
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    const authorId = token?.sub ?? "";

    const body = await request.json();
    const parsed = createPageSchema.safeParse(body);

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
    } = parsed.data;

    // Check slug uniqueness
    const existing = await prisma.page.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Conflict", message: "A page with this slug already exists" },
        { status: 409 },
      );
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        excerpt: excerpt ?? null,
        status,
        featuredImage: featuredImage ?? null,
        template: template ?? null,
        parentId: parentId ?? null,
        authorId,
        publishedAt: publishedAt ? new Date(publishedAt) : status === "PUBLISHED" ? new Date() : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        customCss: customCss ?? null,
        content: content ?? Prisma.DbNull,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        parent: { select: { id: true, title: true } },
      },
    });

    // Create initial version
    await prisma.pageVersion.create({
      data: {
        pageId: page.id,
        versionNumber: 1,
        title: page.title,
        slug: page.slug,
        status: page.status,
        content: page.content ?? Prisma.DbNull,
        publishedAt: page.publishedAt,
        createdById: authorId,
      },
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    console.error("[PAGES_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create page" },
      { status: 500 },
    );
  }
}, "pages:manage");
