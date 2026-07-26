// =============================================================================
// GET  /api/admin/careers/[careerId]/applications — list applications for a career
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  status: z
    .enum(["NEW", "REVIEWED", "SHORTLISTED", "REJECTED", "HIRED"])
    .optional(),
  search: z.string().optional().default(""),
  sort: z
    .enum(["name", "email", "status", "createdAt"])
    .optional()
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(async (
  request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) => {
  try {
    const params = await context.params;
    const careerId = params.id;
    if (typeof careerId !== "string") {
      return NextResponse.json(
        { error: "Bad Request", message: "Career ID is required" },
        { status: 400 },
      );
    }

    // Verify career exists
    const career = await prisma.career.findUnique({
      where: { id: careerId },
      select: { id: true, title: true },
    });
    if (!career) {
      return NextResponse.json(
        { error: "Not Found", message: "Career not found" },
        { status: 404 },
      );
    }

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

    const { page, pageSize, status, search, sort, order } = parsed.data;
    const where: Record<string, unknown> = { careerId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      prisma.careerApplication.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.careerApplication.count({ where }),
    ]);

    return NextResponse.json({
      applications,
      career: { id: career.id, title: career.title },
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[APPLICATIONS_GET]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch applications",
      },
      { status: 500 },
    );
  }
}, "pages:manage");
