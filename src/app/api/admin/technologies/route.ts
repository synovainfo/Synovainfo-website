// =============================================================================
// GET  /api/admin/technologies — paginated list with search & filter
// POST /api/admin/technologies — create a new technology
// Permission: services:manage
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
  category: z.string().optional(),
  status: z.enum(["true", "false"]).optional(),
  sort: z.enum(["name", "category", "proficiencyLevel", "status", "createdAt"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const createTechnologySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  websiteUrl: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
  proficiencyLevel: z.number().int().min(0).max(100).optional().default(0),
  status: z.boolean().optional().default(true),
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
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) where.category = category;
    if (status !== undefined) where.status = status === "true";

    const [technologies, total] = await Promise.all([
      prisma.technology.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.technology.count({ where }),
    ]);

    return NextResponse.json({
      technologies,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error("[TECHNOLOGIES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch technologies" },
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
    const parsed = createTechnologySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, slug, category, description, icon, websiteUrl, proficiencyLevel, status } = parsed.data;

    const existing = await prisma.technology.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Conflict", message: "A technology with this slug already exists" },
        { status: 409 },
      );
    }

    const technology = await prisma.technology.create({
      data: {
        name,
        slug,
        category,
        description,
        icon,
        websiteUrl: websiteUrl || null,
        proficiencyLevel,
        status,
      },
    });

    return NextResponse.json({ technology }, { status: 201 });
  } catch (error) {
    console.error("[TECHNOLOGIES_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create technology" },
      { status: 500 },
    );
  }
}, "services:manage");
