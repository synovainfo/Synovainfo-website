// =============================================================================
// GET    /api/admin/services/[id] — single service detail
// PUT    /api/admin/services/[id] — update service
// DELETE /api/admin/services/[id] — delete service
// Permission: services:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const updateServiceSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  shortDescription: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  benefits: z.array(z.string()).optional().nullable(),
  businessOutcomes: z.array(z.string()).optional().nullable(),
  status: z.boolean().optional(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  technologyIds: z.array(z.string()).optional(),
  industryIds: z.array(z.string()).optional(),
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
        { error: "Bad Request", message: "Service ID is required" },
        { status: 400 },
      );
    }

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        technologies: { include: { technology: true } },
        industries: { include: { industry: true } },
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Not Found", message: "Service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("[SERVICE_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch service" },
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
        { error: "Bad Request", message: "Service ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Service not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = updateServiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const {
      title,
      slug,
      shortDescription,
      fullDescription,
      icon,
      category,
      benefits,
      businessOutcomes,
      status,
      seoTitle,
      seoDescription,
      seoKeywords,
      technologyIds,
      industryIds,
    } = parsed.data;

    // Check slug uniqueness if changing
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.service.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json(
          { error: "Conflict", message: "A service with this slug already exists" },
          { status: 409 },
        );
      }
    }

    // Update with nested relations using a transaction
    const service = await prisma.$transaction(async (tx) => {
      if (technologyIds !== undefined) {
        await tx.serviceTechnology.deleteMany({ where: { serviceId: id } });
        if (technologyIds.length > 0) {
          await tx.serviceTechnology.createMany({
            data: technologyIds.map((technologyId) => ({ serviceId: id, technologyId })),
          });
        }
      }

      if (industryIds !== undefined) {
        await tx.serviceIndustry.deleteMany({ where: { serviceId: id } });
        if (industryIds.length > 0) {
          await tx.serviceIndustry.createMany({
            data: industryIds.map((industryId) => ({ serviceId: id, industryId })),
          });
        }
      }

      const updateData: Record<string, unknown> = {};
      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) updateData.slug = slug;
      if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
      if (fullDescription !== undefined) updateData.fullDescription = fullDescription;
      if (icon !== undefined) updateData.icon = icon;
      if (category !== undefined) updateData.category = category;
      if (benefits !== undefined) updateData.benefits = benefits;
      if (businessOutcomes !== undefined) updateData.businessOutcomes = businessOutcomes;
      if (status !== undefined) updateData.status = status;
      if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
      if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
      if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords;

      return tx.service.update({
        where: { id },
        data: updateData,
        include: {
          technologies: { include: { technology: true } },
          industries: { include: { industry: true } },
        },
      });
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error("[SERVICE_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update service" },
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
        { error: "Bad Request", message: "Service ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Service not found" },
        { status: 404 },
      );
    }

    await prisma.service.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("[SERVICE_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete service" },
      { status: 500 },
    );
  }
}, "services:manage");
