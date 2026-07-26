// =============================================================================
// GET  /api/admin/testimonials — paginated testimonials list
// POST /api/admin/testimonials — create testimonial
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
  sort: z
    .enum(["author", "company", "rating", "status", "order", "createdAt"])
    .optional()
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const createSchema = z.object({
  quote: z.string().min(1, "Quote is required").max(2000, "Quote is too long"),
  author: z
    .string()
    .min(1, "Author name is required")
    .max(200, "Author name is too long"),
  title: z.string().max(200).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  avatar: z.string().max(500).optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().default(5),
  status: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
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

    const { page, pageSize, search, status, sort, order } = parsed.data;
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { author: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { quote: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status !== undefined) {
      where.status = status === "true";
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.testimonial.count({ where }),
    ]);

    return NextResponse.json({
      testimonials,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[TESTIMONIALS_GET]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch testimonials",
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

    const testimonial = await prisma.testimonial.create({
      data: parsed.data,
    });

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    console.error("[TESTIMONIALS_POST]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create testimonial",
      },
      { status: 500 },
    );
  }
}, "pages:manage");
