// =============================================================================
// GET    /api/admin/careers/[id] — single career with application count
// PUT    /api/admin/careers/[id] — update career
// DELETE /api/admin/careers/[id] — delete career
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const updateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    )
    .optional(),
  department: z.string().max(200).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  type: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE"])
    .optional(),
  description: z.string().optional().nullable(),
  requirements: z.array(z.string()).optional().nullable(),
  benefits: z.array(z.string()).optional().nullable(),
  salaryMin: z.number().int().positive().optional().nullable(),
  salaryMax: z.number().int().positive().optional().nullable(),
  status: z.boolean().optional(),
  featured: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getId(
  context: { params: Promise<Record<string, string | string[] | undefined>> },
): Promise<string | null> {
  const params = await context.params;
  const id = params.id;
  return typeof id === "string" ? id : null;
}

async function findOrError(id: string) {
  const career = await prisma.career.findUnique({
    where: { id },
    include: {
      _count: { select: { applications: true } },
    },
  });
  if (!career) {
    return {
      error: NextResponse.json(
        { error: "Not Found", message: "Career not found" },
        { status: 404 },
      ),
    };
  }
  return { career };
}

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(async (
  _request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) => {
  try {
    const id = await getId(context);
    if (!id) {
      return NextResponse.json(
        { error: "Bad Request", message: "ID is required" },
        { status: 400 },
      );
    }

    const result = await findOrError(id);
    if (result.error) return result.error;

    return NextResponse.json({ career: result.career });
  } catch (error) {
    console.error("[CAREER_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch career" },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// PUT
// ---------------------------------------------------------------------------

export const PUT = withPermission(async (
  request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) => {
  try {
    const id = await getId(context);
    if (!id) {
      return NextResponse.json(
        { error: "Bad Request", message: "ID is required" },
        { status: 400 },
      );
    }

    const result = await findOrError(id);
    if (result.error) return result.error;

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Check slug uniqueness if changing
    if (parsed.data.slug && parsed.data.slug !== result.career.slug) {
      const slugExists = await prisma.career.findUnique({
        where: { slug: parsed.data.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          {
            error: "Conflict",
            message: "A career with this slug already exists",
          },
          { status: 409 },
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { requirements: reqs, benefits: ben, ...cleanData } = parsed.data;
    const career = await prisma.career.update({
      where: { id },
      data: {
        ...cleanData,
        requirements: reqs ?? Prisma.DbNull,
        benefits: ben ?? Prisma.DbNull,
      },
      include: {
        _count: { select: { applications: true } },
      },
    });

    return NextResponse.json({ career });
  } catch (error) {
    console.error("[CAREER_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update career" },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

export const DELETE = withPermission(async (
  _request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) => {
  try {
    const id = await getId(context);
    if (!id) {
      return NextResponse.json(
        { error: "Bad Request", message: "ID is required" },
        { status: 400 },
      );
    }

    const result = await findOrError(id);
    if (result.error) return result.error;

    await prisma.career.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Career deleted successfully",
    });
  } catch (error) {
    console.error("[CAREER_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete career" },
      { status: 500 },
    );
  }
}, "pages:manage");
