// =============================================================================
// GET  /api/admin/industries — paginated list with search & filter
// POST /api/admin/industries — create a new industry
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
  status: z.enum(["true", "false"]).optional(),
  sort: z.enum(["name", "status", "createdAt"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const createIndustrySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  capabilities: z.array(z.string()).optional().nullable(),
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

    const { page, pageSize, search, status, sort, order } = parsed.data;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status !== undefined) where.status = status === "true";

    const [industries, total] = await Promise.all([
      prisma.industry.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.industry.count({ where }),
    ]);

    return NextResponse.json({
      industries,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error("[INDUSTRIES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch industries" },
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
    const parsed = createIndustrySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, slug, description, icon, capabilities, status } = parsed.data;

    const existing = await prisma.industry.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Conflict", message: "An industry with this slug already exists" },
        { status: 409 },
      );
    }

    const industry = await prisma.industry.create({
      data: {
        name,
        slug,
        description,
        icon,
        capabilities: capabilities !== undefined && capabilities !== null
          ? capabilities
          : Prisma.DbNull,
        status,
      },
    });

    return NextResponse.json({ industry }, { status: 201 });
  } catch (error) {
    console.error("[INDUSTRIES_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create industry" },
      { status: 500 },
    );
  }
}, "services:manage");
