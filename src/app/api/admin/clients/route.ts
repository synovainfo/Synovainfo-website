// =============================================================================
// GET  /api/admin/clients — paginated clients list
// POST /api/admin/clients — create client
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
    .enum(["name", "industry", "status", "order", "createdAt"])
    .optional()
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const createSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  description: z.string().max(5000).optional().nullable(),
  logo: z.string().max(500).optional().nullable(),
  websiteUrl: z.string().max(500).optional().nullable(),
  industry: z.string().max(200).optional().nullable(),
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

    const { page, pageSize, search, status, sort, order } = parsed.data;
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status !== undefined) {
      where.status = status === "true";
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.client.count({ where }),
    ]);

    return NextResponse.json({
      clients,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[CLIENTS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch clients" },
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
    const existing = await prisma.client.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "A client with this slug already exists",
        },
        { status: 409 },
      );
    }

    const client = await prisma.client.create({
      data: parsed.data,
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error("[CLIENTS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create client" },
      { status: 500 },
    );
  }
}, "pages:manage");
