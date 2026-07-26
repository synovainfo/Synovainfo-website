// =============================================================================
// GET  /api/admin/resources — paginated list with search & filter
// POST /api/admin/resources — create a new resource
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

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional().default(""),
  type: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["true", "false"]).optional(),
  sort: z
    .enum(["title", "type", "category", "status", "downloadCount", "createdAt"])
    .optional()
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const createResourceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase alphanumeric with hyphens",
    ),
  description: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  status: z.boolean().optional().default(true),
});

// ---------------------------------------------------------------------------
// GET
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

    const {
      page,
      pageSize,
      search,
      type,
      category,
      status,
      sort,
      order,
    } = parsed.data;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (type) where.type = type;
    if (category) where.category = category;
    if (status !== undefined) where.status = status === "true";

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.resource.count({ where }),
    ]);

    return NextResponse.json({
      resources,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[RESOURCES_GET]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch resources",
      },
      { status: 500 },
    );
  }
}, "resources:manage");

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = createResourceSchema.safeParse(body);

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

    // Check slug uniqueness
    const existing = await prisma.resource.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "A resource with this slug already exists",
        },
        { status: 409 },
      );
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        slug,
        description,
        type,
        fileUrl,
        coverImage,
        category,
        tags: tags !== undefined && tags !== null ? tags : undefined,
        status,
      },
    });

    // Audit log
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    await prisma.auditLog.create({
      data: {
        userId: token?.sub ?? "unknown",
        action: "CREATE",
        resource: "Resource",
        resourceId: resource.id,
        details: { title: resource.title, slug: resource.slug },
      },
    }).catch((err) => console.error("[AUDIT_FAILED]", err));

    return NextResponse.json({ resource }, { status: 201 });
  } catch (error) {
    console.error("[RESOURCES_POST]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create resource",
      },
      { status: 500 },
    );
  }
}, "resources:manage");
