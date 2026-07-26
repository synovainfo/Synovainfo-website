// =============================================================================
// GET  /api/admin/services — paginated list with search & filter
// POST /api/admin/services — create a new service
// Permission: services:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional().default(""),
  category: z.string().optional(),
  status: z.enum(["true", "false"]).optional(),
  sort: z.enum(["title", "category", "status", "createdAt"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const createServiceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  shortDescription: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  benefits: z.array(z.string()).optional().nullable(),
  businessOutcomes: z.array(z.string()).optional().nullable(),
  status: z.boolean().optional().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  technologyIds: z.array(z.string()).optional().default([]),
  industryIds: z.array(z.string()).optional().default([]),
});

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const parsed = listQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { page, pageSize, search, category, status, sort, order } = parsed.data;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) where.category = category;
    if (status !== undefined) where.status = status === "true";

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          technologies: { include: { technology: true } },
          industries: { include: { industry: true } },
        },
      }),
      prisma.service.count({ where }),
    ]);

    return NextResponse.json({
      services,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error("[SERVICES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch services" },
      { status: 500 },
    );
  }
}, "services:manage");

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = createServiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const {
      title,
      slug,
      shortDescription,
      fullDescription,
      icon,
      category,
      benefits,
      businessOutcomes,
      status,
      seoTitle,
      seoDescription,
      seoKeywords,
      technologyIds,
      industryIds,
    } = parsed.data;

    // Check slug uniqueness
    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Conflict", message: "A service with this slug already exists" },
        { status: 409 },
      );
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        shortDescription,
        fullDescription,
        icon,
        category,
        benefits: benefits !== undefined && benefits !== null ? benefits : Prisma.DbNull,
        businessOutcomes: businessOutcomes !== undefined && businessOutcomes !== null ? businessOutcomes : Prisma.DbNull,
        status,
        seoTitle,
        seoDescription,
        seoKeywords,
        technologies: {
          create: technologyIds.map((technologyId) => ({ technologyId })),
        },
        industries: {
          create: industryIds.map((industryId) => ({ industryId })),
        },
      },
      include: {
        technologies: { include: { technology: true } },
        industries: { include: { industry: true } },
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("[SERVICES_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create service" },
      { status: 500 },
    );
  }
}, "services:manage");
