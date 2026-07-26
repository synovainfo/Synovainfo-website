// =============================================================================
// GET  /api/admin/careers — paginated careers list with application counts
// POST /api/admin/careers — create career
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional().default(""),
  status: z.enum(["true", "false"]).optional(),
  department: z.string().optional(),
  type: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE"])
    .optional(),
  sort: z
    .enum([
      "title",
      "department",
      "location",
      "type",
      "status",
      "createdAt",
    ])
    .optional()
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const createSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  department: z.string().max(200).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  type: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE"])
    .optional()
    .default("FULL_TIME"),
  description: z.string().optional().nullable(),
  requirements: z.array(z.string()).optional().nullable(),
  benefits: z.array(z.string()).optional().nullable(),
  salaryMin: z.number().int().positive().optional().nullable(),
  salaryMax: z.number().int().positive().optional().nullable(),
  status: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
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

    const { page, pageSize, search, status, department, type, sort, order } =
      parsed.data;
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status !== undefined) {
      where.status = status === "true";
    }

    if (department) {
      where.department = department;
    }

    if (type) {
      where.type = type;
    }

    const [careers, total] = await Promise.all([
      prisma.career.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: { applications: true },
          },
        },
      }),
      prisma.career.count({ where }),
    ]);

    return NextResponse.json({
      careers,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[CAREERS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch careers" },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Check slug uniqueness
    const existing = await prisma.career.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "A career with this slug already exists",
        },
        { status: 409 },
      );
    }

    const career = await prisma.career.create({
      data: {
        ...parsed.data,
        requirements: parsed.data.requirements ?? [],
        benefits: parsed.data.benefits ?? [],
      },
    });

    return NextResponse.json({ career }, { status: 201 });
  } catch (error) {
    console.error("[CAREERS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create career" },
      { status: 500 },
    );
  }
}, "pages:manage");
