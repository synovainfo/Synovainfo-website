// =============================================================================
// GET    /api/admin/industries/[id] — single industry
// PUT    /api/admin/industries/[id] — update industry
// DELETE /api/admin/industries/[id] — delete industry
// Permission: services:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const updateIndustrySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  capabilities: z.array(z.string()).optional().nullable(),
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
        { error: "Bad Request", message: "Industry ID is required" },
        { status: 400 },
      );
    }

    const industry = await prisma.industry.findUnique({ where: { id } });
    if (!industry) {
      return NextResponse.json(
        { error: "Not Found", message: "Industry not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ industry });
  } catch (error) {
    console.error("[INDUSTRY_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch industry" },
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
        { error: "Bad Request", message: "Industry ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.industry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Industry not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = updateIndustrySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, slug, description, icon, capabilities, status } = parsed.data;

    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.industry.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json(
          { error: "Conflict", message: "An industry with this slug already exists" },
          { status: 409 },
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (capabilities !== undefined) updateData.capabilities = capabilities;
    if (status !== undefined) updateData.status = status;

    const industry = await prisma.industry.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ industry });
  } catch (error) {
    console.error("[INDUSTRY_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update industry" },
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
        { error: "Bad Request", message: "Industry ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.industry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Industry not found" },
        { status: 404 },
      );
    }

    await prisma.industry.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Industry deleted successfully" });
  } catch (error) {
    console.error("[INDUSTRY_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete industry" },
      { status: 500 },
    );
  }
}, "services:manage");
