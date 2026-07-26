// =============================================================================
// GET  /api/admin/faq/categories — list FAQ categories with item counts
// POST /api/admin/faq/categories — create FAQ category
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const createSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  description: z.string().max(1000).optional().nullable(),
  order: z.number().int().optional().default(0),
});

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Math.min(
      Number(url.searchParams.get("pageSize")) || 50,
      100,
    );

    const [categories, total] = await Promise.all([
      prisma.fAQCategory.findMany({
        orderBy: { order: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: { select: { faqs: true } },
        },
      }),
      prisma.fAQCategory.count(),
    ]);

    return NextResponse.json({
      categories,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[FAQ_CATEGORIES_GET]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch FAQ categories",
      },
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
    const existing = await prisma.fAQCategory.findUnique({
      where: { slug: parsed.data.slug },
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

    const category = await prisma.fAQCategory.create({
      data: parsed.data,
      include: {
        _count: { select: { faqs: true } },
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("[FAQ_CATEGORIES_POST]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create FAQ category",
      },
      { status: 500 },
    );
  }
}, "pages:manage");
