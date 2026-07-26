// =============================================================================
// GET  /api/admin/statistics — list all statistics
// POST /api/admin/statistics — create a single statistic
// PUT  /api/admin/statistics — batch reorder / update multiple
// Permission: services:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const createSchema = z.object({
  label: z.string().min(1, "Label is required").max(200),
  value: z.string().min(1, "Value is required").max(200),
  prefix: z.string().optional().nullable(),
  suffix: z.string().optional().nullable(),
  isVisible: z.boolean().optional().default(true),
});

const batchUpdateSchema = z.object({
  statistics: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().min(0).optional(),
      isVisible: z.boolean().optional(),
      label: z.string().min(1).max(200).optional(),
      value: z.string().min(1).max(200).optional(),
      prefix: z.string().optional().nullable(),
      suffix: z.string().optional().nullable(),
    }),
  ),
});

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(async () => {
  try {
    const statistics = await prisma.statistic.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ statistics });
  } catch (error) {
    console.error("[STATISTICS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch statistics" },
      { status: 500 },
    );
  }
}, "services:manage");

// ---------------------------------------------------------------------------
// POST — create a single statistic
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { label, value, prefix, suffix, isVisible } = parsed.data;

    // Calculate the next order value
    const maxOrder = await prisma.statistic.aggregate({
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const statistic = await prisma.statistic.create({
      data: {
        label,
        value,
        prefix: prefix ?? null,
        suffix: suffix ?? null,
        order: nextOrder,
        isVisible,
      },
    });

    return NextResponse.json({ statistic }, { status: 201 });
  } catch (error) {
    console.error("[STATISTICS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create statistic" },
      { status: 500 },
    );
  }
}, "services:manage");

// ---------------------------------------------------------------------------
// PUT — batch reorder / update
// ---------------------------------------------------------------------------

export const PUT = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = batchUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { statistics } = parsed.data;

    await prisma.$transaction(
      statistics.map((item) =>
        prisma.statistic.update({
          where: { id: item.id },
          data: {
            ...(item.order !== undefined && { order: item.order }),
            ...(item.isVisible !== undefined && { isVisible: item.isVisible }),
            ...(item.label !== undefined && { label: item.label }),
            ...(item.value !== undefined && { value: item.value }),
            ...(item.prefix !== undefined && { prefix: item.prefix }),
            ...(item.suffix !== undefined && { suffix: item.suffix }),
          },
        }),
      ),
    );

    const updated = await prisma.statistic.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ statistics: updated });
  } catch (error) {
    console.error("[STATISTICS_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update statistics" },
      { status: 500 },
    );
  }
}, "services:manage");
