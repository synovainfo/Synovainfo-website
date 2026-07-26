// =============================================================================
// GET  /api/admin/homepage — list all homepage sections ordered by `order`
// PUT  /api/admin/homepage — bulk upsert/reorder/update homepage sections
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const sectionSchema = z.object({
  sectionType: z.string().min(1),
  title: z.string().optional().nullable(),
  content: z.any().optional().nullable(),
  order: z.number().int().optional(),
  isVisible: z.boolean().optional(),
  settings: z.any().optional().nullable(),
});

const bulkUpdateSchema = z.object({
  sections: z.array(sectionSchema),
});

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(async () => {
  try {
    const sections = await prisma.homepageSection.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ sections });
  } catch (error) {
    console.error("[HOMEPAGE_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch homepage sections" },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// PUT — upsert sections by sectionType
// ---------------------------------------------------------------------------

export const PUT = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = bulkUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { sections } = parsed.data;

    // Upsert each section by sectionType (cannot use Prisma upsert since sectionType lacks @unique)
    await prisma.$transaction(async (tx) => {
      for (const section of sections) {
        const existing = await tx.homepageSection.findFirst({
          where: { sectionType: section.sectionType },
        });

        if (existing) {
          await tx.homepageSection.update({
            where: { id: existing.id },
            data: {
              title: section.title,
              content: section.content ?? undefined,
              order: section.order,
              isVisible: section.isVisible,
              settings: section.settings ?? undefined,
            },
          });
        } else {
          await tx.homepageSection.create({
            data: {
              sectionType: section.sectionType,
              title: section.title,
              content: section.content ?? undefined,
              order: section.order ?? 0,
              isVisible: section.isVisible ?? true,
              settings: section.settings ?? undefined,
            },
          });
        }
      }
    });

    // Refresh all sections
    const refreshedSections = await prisma.homepageSection.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ sections: refreshedSections });
  } catch (error) {
    console.error("[HOMEPAGE_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update homepage sections" },
      { status: 500 },
    );
  }
}, "pages:manage");
