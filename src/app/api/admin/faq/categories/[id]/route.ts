// =============================================================================
// GET    /api/admin/faq/categories/[id] — single FAQ category with its FAQs
// PUT    /api/admin/faq/categories/[id] — update FAQ category
// DELETE /api/admin/faq/categories/[id] — delete FAQ category
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const updateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200).optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    )
    .optional(),
  description: z.string().max(1000).optional().nullable(),
  order: z.number().int().optional(),
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
  const category = await prisma.fAQCategory.findUnique({
    where: { id },
    include: {
      faqs: { orderBy: { order: "asc" } },
    },
  });
  if (!category) {
    return {
      error: NextResponse.json(
        { error: "Not Found", message: "FAQ category not found" },
        { status: 404 },
      ),
    };
  }
  return { category };
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

    return NextResponse.json({ category: result.category });
  } catch (error) {
    console.error("[FAQ_CATEGORY_GET]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch FAQ category",
      },
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
    if (parsed.data.slug && parsed.data.slug !== result.category.slug) {
      const slugExists = await prisma.fAQCategory.findUnique({
        where: { slug: parsed.data.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          {
            error: "Conflict",
            message: "A category with this slug already exists",
          },
          { status: 409 },
        );
      }
    }

    const category = await prisma.fAQCategory.update({
      where: { id },
      data: parsed.data,
      include: {
        faqs: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("[FAQ_CATEGORY_PUT]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to update FAQ category",
      },
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

    await prisma.fAQCategory.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "FAQ category deleted successfully",
    });
  } catch (error) {
    console.error("[FAQ_CATEGORY_DELETE]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to delete FAQ category",
      },
      { status: 500 },
    );
  }
}, "pages:manage");
