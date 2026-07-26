// =============================================================================
// GET  /api/admin/newsletter/campaigns — list campaigns
// POST /api/admin/newsletter/campaigns — create a new campaign
// Permission: newsletter:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional().default(""),
  status: z.string().optional(),
  sort: z.enum(["subject", "status", "sentAt", "createdAt"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const createCampaignSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  body: z.string().min(1, "Body is required"),
  status: z.enum(["draft", "scheduled"]).optional().default("draft"),
});

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const parsed = listQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { page, pageSize, search, status, sort, order } = parsed.data;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;

    const [campaigns, total] = await Promise.all([
      prisma.newsletter.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.newsletter.count({ where }),
    ]);

    return NextResponse.json({
      campaigns,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error("[CAMPAIGNS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch campaigns" },
      { status: 500 },
    );
  }
}, "newsletter:manage");

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = createCampaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { subject, body: campaignBody, status } = parsed.data;

    const campaign = await prisma.newsletter.create({
      data: {
        subject,
        body: campaignBody,
        status,
        recipientCount: 0,
        sentAt: null,
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("[CAMPAIGNS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create campaign" },
      { status: 500 },
    );
  }
}, "newsletter:manage");
