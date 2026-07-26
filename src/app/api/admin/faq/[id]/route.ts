// =============================================================================
// GET    /api/admin/faq/[id] — single FAQ item
// PUT    /api/admin/faq/[id] — update FAQ item
// DELETE /api/admin/faq/[id] — delete FAQ item
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
  question: z
    .string()
    .min(1, "Question is required")
    .max(500)
    .optional(),
  answer: z
    .string()
    .min(1, "Answer is required")
    .max(10000)
    .optional(),
  categoryId: z.string().min(1, "Category is required").optional(),
  order: z.number().int().optional(),
  status: z.boolean().optional(),
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
  const faq = await prisma.fAQ.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!faq) {
    return {
      error: NextResponse.json(
        { error: "Not Found", message: "FAQ not found" },
        { status: 404 },
      ),
    };
  }
  return { faq };
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

    return NextResponse.json({ faq: result.faq });
  } catch (error) {
    console.error("[FAQ_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch FAQ" },
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

    // Verify category exists if changing
    if (parsed.data.categoryId) {
      const category = await prisma.fAQCategory.findUnique({
        where: { id: parsed.data.categoryId },
      });
      if (!category) {
        return NextResponse.json(
          { error: "Not Found", message: "FAQ category not found" },
          { status: 404 },
        );
      }
    }

    const faq = await prisma.fAQ.update({
      where: { id },
      data: parsed.data,
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ faq });
  } catch (error) {
    console.error("[FAQ_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update FAQ" },
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

    await prisma.fAQ.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error("[FAQ_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete FAQ" },
      { status: 500 },
    );
  }
}, "pages:manage");
