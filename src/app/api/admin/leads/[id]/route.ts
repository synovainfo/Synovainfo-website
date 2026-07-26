// =============================================================================
// GET    /api/admin/leads/[id] — lead detail with activity
// PUT    /api/admin/leads/[id] — update lead (stage, value, notes, assignee)
// DELETE /api/admin/leads/[id] — delete lead
// Permission: leads:read (GET), leads:manage (PUT, DELETE)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";
import { getToken } from "next-auth/jwt";

// ---------------------------------------------------------------------------
// Update schema for PUT
// ---------------------------------------------------------------------------

const updateLeadSchema = z.object({
  companyName: z.string().min(1).max(200).optional(),
  contactName: z.string().max(200).optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().max(50).optional(),
  serviceInterest: z.string().max(200).optional(),
  value: z.coerce.number().int().min(0).optional().nullable(),
  stage: z
    .enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"])
    .optional(),
  assignedToId: z.string().nullable().optional(),
  source: z.string().max(100).optional(),
  notes: z.string().optional(),
});

// ---------------------------------------------------------------------------
// GET — lead detail with activities
// ---------------------------------------------------------------------------

export const GET = withPermission(async (request: NextRequest, context: { params: Promise<Record<string, string | string[] | undefined>> }) => {
  try {
    const p = await context.params;
    const id = typeof p.id === "string" ? p.id : "";

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, image: true },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 50,
          include: {
            createdBy: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Not Found", message: "Lead not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("[LEAD_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch lead" },
      { status: 500 },
    );
  }
}, "leads:read");

// ---------------------------------------------------------------------------
// PUT — update lead and log activity on stage/value changes
// ---------------------------------------------------------------------------

export const PUT = withPermission(async (request: NextRequest, context: { params: Promise<Record<string, string | string[] | undefined>> }) => {
  try {
    const p = await context.params;
    const id = typeof p.id === "string" ? p.id : "";
    const body = await request.json();
    const parsed = updateLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Check existence and get previous state
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Lead not found" },
        { status: 404 },
      );
    }

    // Track changes for activity log
    const changes: string[] = [];
    if (parsed.data.stage && parsed.data.stage !== existing.stage) {
      changes.push(
        `Stage changed from ${existing.stage} to ${parsed.data.stage}`,
      );
    }
    if (
      parsed.data.value !== undefined &&
      parsed.data.value !== existing.value
    ) {
      changes.push(
        `Value changed from ${existing.value ?? "N/A"} to ${parsed.data.value ?? "N/A"}`,
      );
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: parsed.data,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, image: true },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 50,
          include: {
            createdBy: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      },
    });

    // Log activity if there were changes
    if (changes.length > 0) {
      const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
      });

      await prisma.leadActivity.create({
        data: {
          leadId: id,
          type: "UPDATED",
          description: changes.join("; "),
          createdById: token?.sub ?? "system",
        },
      });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("[LEAD_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update lead" },
      { status: 500 },
    );
  }
}, "leads:manage");

// ---------------------------------------------------------------------------
// DELETE — delete lead
// ---------------------------------------------------------------------------

export const DELETE = withPermission(async (request: NextRequest, context: { params: Promise<Record<string, string | string[] | undefined>> }) => {
  try {
    const p = await context.params;
    const id = typeof p.id === "string" ? p.id : "";

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Lead not found" },
        { status: 404 },
      );
    }

    await prisma.lead.delete({ where: { id } });

    return NextResponse.json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("[LEAD_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete lead" },
      { status: 500 },
    );
  }
}, "leads:manage");
