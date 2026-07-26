// =============================================================================
// GET    /api/admin/technologies/[id] — single technology
// PUT    /api/admin/technologies/[id] — update technology
// DELETE /api/admin/technologies/[id] — delete technology
// Permission: services:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const updateTechnologySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  websiteUrl: z.string().url().optional().nullable().or(z.literal("")),
  proficiencyLevel: z.number().int().min(0).max(100).optional(),
  status: z.boolean().optional(),
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
        { error: "Bad Request", message: "Technology ID is required" },
        { status: 400 },
      );
    }

    const technology = await prisma.technology.findUnique({ where: { id } });
    if (!technology) {
      return NextResponse.json(
        { error: "Not Found", message: "Technology not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ technology });
  } catch (error) {
    console.error("[TECHNOLOGY_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch technology" },
      { status: 500 },
    );
  }
}, "services:manage");

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
        { error: "Bad Request", message: "Technology ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.technology.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Technology not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = updateTechnologySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, slug, category, description, icon, websiteUrl, proficiencyLevel, status } = parsed.data;

    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.technology.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json(
          { error: "Conflict", message: "A technology with this slug already exists" },
          { status: 409 },
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl || null;
    if (proficiencyLevel !== undefined) updateData.proficiencyLevel = proficiencyLevel;
    if (status !== undefined) updateData.status = status;

    const technology = await prisma.technology.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ technology });
  } catch (error) {
    console.error("[TECHNOLOGY_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update technology" },
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
        { error: "Bad Request", message: "Technology ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.technology.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Technology not found" },
        { status: 404 },
      );
    }

    await prisma.technology.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Technology deleted successfully" });
  } catch (error) {
    console.error("[TECHNOLOGY_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete technology" },
      { status: 500 },
    );
  }
}, "services:manage");
