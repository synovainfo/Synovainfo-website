// =============================================================================
// GET  /api/admin/leads  — leads grouped by stage (for kanban) or flat list
// POST /api/admin/leads  — create a new lead
// Permission: leads:read (GET), leads:manage (POST)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Query schema for GET
// ---------------------------------------------------------------------------

const listQuerySchema = z.object({
  groupByStage: z
    .enum(["true", "false"])
    .optional()
    .default("true"),
  search: z.string().optional().default(""),
});

// ---------------------------------------------------------------------------
// Create schema for POST
// ---------------------------------------------------------------------------

const createLeadSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(200),
  contactName: z.string().max(200).optional().default(""),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().max(50).optional().default(""),
  serviceInterest: z.string().max(200).optional().default(""),
  value: z.coerce.number().int().min(0).optional().nullable(),
  stage: z
    .enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"])
    .optional()
    .default("NEW"),
  assignedToId: z.string().optional().nullable(),
  source: z.string().max(100).optional().default(""),
  notes: z.string().optional().default(""),
  contactId: z.string().optional().nullable(),
});

// ---------------------------------------------------------------------------
// GET — leads grouped by stage (for kanban) or flat list
// ---------------------------------------------------------------------------

export const GET = withPermission(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const parsed = listQuerySchema.safeParse(
      Object.fromEntries(url.searchParams),
    );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { groupByStage, search } = parsed.data;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { contactName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, image: true },
        },
        _count: {
          select: { activities: true },
        },
      },
    });

    if (groupByStage === "true") {
      // Group by stage for kanban
      const stages = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"] as const;
      const grouped: Record<string, typeof leads> = {};
      for (const stage of stages) {
        grouped[stage] = leads.filter((l) => l.stage === stage);
      }

      return NextResponse.json({
        leads: grouped,
        totals: Object.fromEntries(
          stages.map((s) => [s, grouped[s].length]),
        ),
      });
    }

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("[LEADS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}, "leads:read");

// ---------------------------------------------------------------------------
// POST — create lead (optionally from contact)
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = createLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const lead = await prisma.lead.create({
      data: parsed.data,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    // Create activity for creation
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "CREATED",
        description: `Lead created for ${lead.companyName}`,
        createdById: parsed.data.assignedToId ?? "system",
      },
    }).catch(() => {
      // Non-critical — don't fail the request
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("[LEADS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create lead" },
      { status: 500 },
    );
  }
}, "leads:manage");
