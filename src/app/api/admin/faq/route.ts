// =============================================================================
// GET  /api/admin/faq — paginated FAQ items list with category info
// POST /api/admin/faq — create FAQ item
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
  categoryId: z.string().optional(),
  status: z.enum(["true", "false"]).optional(),
  search: z.string().optional().default(""),
  sort: z
    .enum(["question", "order", "status", "createdAt"])
    .optional()
    .default("order"),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

const createSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .max(500, "Question is too long"),
  answer: z.string().min(1, "Answer is required").max(10000, "Answer is too long"),
  categoryId: z.string().min(1, "Category is required"),
  order: z.number().int().optional().default(0),
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

    const { page, pageSize, categoryId, status, search, sort, order } =
      parsed.data;
    const where: Record<string, unknown> = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status !== undefined) {
      where.status = status === "true";
    }

    if (search) {
      where.OR = [
        { question: { contains: search, mode: "insensitive" } },
        { answer: { contains: search, mode: "insensitive" } },
      ];
    }

    const [faqs, total] = await Promise.all([
      prisma.fAQ.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.fAQ.count({ where }),
    ]);

    return NextResponse.json({
      faqs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[FAQ_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch FAQs" },
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

    // Verify category exists
    const category = await prisma.fAQCategory.findUnique({
      where: { id: parsed.data.categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: "Not Found", message: "FAQ category not found" },
        { status: 404 },
      );
    }

    const faq = await prisma.fAQ.create({
      data: parsed.data,
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ faq }, { status: 201 });
  } catch (error) {
    console.error("[FAQ_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create FAQ" },
      { status: 500 },
    );
  }
}, "pages:manage");
