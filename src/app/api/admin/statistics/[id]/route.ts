// =============================================================================
// PUT    /api/admin/statistics/[id] — update single statistic
// DELETE /api/admin/statistics/[id] — delete statistic
// Permission: services:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const updateStatisticSchema = z.object({
  label: z.string().min(1, "Label is required").max(200).optional(),
  value: z.string().min(1, "Value is required").max(200).optional(),
  prefix: z.string().optional().nullable(),
  suffix: z.string().optional().nullable(),
  order: z.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getId(context: {
  params: Promise<Record<string, string | string[] | undefined>>;
}): Promise<string | null> {
  const params = await context.params;
  const id = params.id;
  return typeof id === "string" ? id : null;
}

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
        { error: "Bad Request", message: "Statistic ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.statistic.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Statistic not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = updateStatisticSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { label, value, prefix, suffix, order, isVisible } = parsed.data;

    const updateData: Record<string, unknown> = {};
    if (label !== undefined) updateData.label = label;
    if (value !== undefined) updateData.value = value;
    if (prefix !== undefined) updateData.prefix = prefix;
    if (suffix !== undefined) updateData.suffix = suffix;
    if (order !== undefined) updateData.order = order;
    if (isVisible !== undefined) updateData.isVisible = isVisible;

    const statistic = await prisma.statistic.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ statistic });
  } catch (error) {
    console.error("[STATISTIC_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update statistic" },
      { status: 500 },
    );
  }
}, "services:manage");

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
        { error: "Bad Request", message: "Statistic ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.statistic.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Statistic not found" },
        { status: 404 },
      );
    }

    await prisma.statistic.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Statistic deleted successfully" });
  } catch (error) {
    console.error("[STATISTIC_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete statistic" },
      { status: 500 },
    );
  }
}, "services:manage");
