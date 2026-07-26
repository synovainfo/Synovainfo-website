// =============================================================================
// GET    /api/admin/testimonials/[id] — single testimonial
// PUT    /api/admin/testimonials/[id] — update testimonial
// DELETE /api/admin/testimonials/[id] — delete testimonial
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
  quote: z.string().min(1, "Quote is required").max(2000).optional(),
  author: z.string().min(1, "Author name is required").max(200).optional(),
  title: z.string().max(200).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  avatar: z.string().max(500).optional().nullable(),
  rating: z.number().int().min(1).max(5).optional(),
  status: z.boolean().optional(),
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
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) {
    return {
      error: NextResponse.json(
        { error: "Not Found", message: "Testimonial not found" },
        { status: 404 },
      ),
    };
  }
  return { testimonial };
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

    return NextResponse.json({ testimonial: result.testimonial });
  } catch (error) {
    console.error("[TESTIMONIAL_GET]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch testimonial",
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

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("[TESTIMONIAL_PUT]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to update testimonial",
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

    await prisma.testimonial.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("[TESTIMONIAL_DELETE]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to delete testimonial",
      },
      { status: 500 },
    );
  }
}, "pages:manage");
