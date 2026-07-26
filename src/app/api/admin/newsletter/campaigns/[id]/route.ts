// =============================================================================
// GET    /api/admin/newsletter/campaigns/[id] — single campaign
// PUT    /api/admin/newsletter/campaigns/[id] — update / send campaign
// DELETE /api/admin/newsletter/campaigns/[id] — delete campaign
// Permission: newsletter:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const updateCampaignSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200).optional(),
  body: z.string().optional(),
  status: z.enum(["draft", "sent", "scheduled"]).optional(),
});

const sendCampaignSchema = z.object({
  action: z.literal("send"),
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
        { error: "Bad Request", message: "Campaign ID is required" },
        { status: 400 },
      );
    }

    const campaign = await prisma.newsletter.findUnique({
      where: { id },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Not Found", message: "Campaign not found" },
        { status: 404 },
      );
    }

    // Get send stats
    const totalSends = await prisma.newsletterSend.count({
      where: { newsletterId: id },
    });
    const totalOpens = await prisma.newsletterSend.count({
      where: { newsletterId: id, openedAt: { not: null } },
    });

    return NextResponse.json({
      campaign: {
        ...campaign,
        stats: {
          totalSends,
          totalOpens,
          openRate: totalSends > 0 ? Math.round((totalOpens / totalSends) * 100) : 0,
        },
      },
    });
  } catch (error) {
    console.error("[CAMPAIGN_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch campaign" },
      { status: 500 },
    );
  }
}, "newsletter:manage");

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
        { error: "Bad Request", message: "Campaign ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.newsletter.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Campaign not found" },
        { status: 404 },
      );
    }

    // Cannot edit a sent campaign
    if (existing.status === "sent") {
      return NextResponse.json(
        { error: "Bad Request", message: "Cannot modify a sent campaign" },
        { status: 400 },
      );
    }

    const body = await request.json();

    // Handle send action
    const sendParsed = sendCampaignSchema.safeParse(body);
    if (sendParsed.success) {
      const activeCount = await prisma.subscriber.count({ where: { status: "active" } });

      const campaign = await prisma.newsletter.update({
        where: { id },
        data: {
          status: "sent",
          sentAt: new Date(),
          recipientCount: activeCount,
        },
      });

      // Create send records for all active subscribers
      const activeSubscribers = await prisma.subscriber.findMany({
        where: { status: "active" },
        select: { id: true },
      });

      if (activeSubscribers.length > 0) {
        await prisma.newsletterSend.createMany({
          data: activeSubscribers.map((sub) => ({
            newsletterId: id,
            subscriberId: sub.id,
            sentAt: new Date(),
          })),
          skipDuplicates: true,
        });
      }

      return NextResponse.json({
        campaign,
        message: `Campaign sent to ${activeCount} subscriber(s)`,
      });
    }

    // Regular update
    const parsed = updateCampaignSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { subject, body: campaignBody, status } = parsed.data;

    const updateData: Record<string, unknown> = {};
    if (subject !== undefined) updateData.subject = subject;
    if (campaignBody !== undefined) updateData.body = campaignBody;
    if (status !== undefined) {
      updateData.status = status;
      if (status === "scheduled") {
        // Status set to scheduled without sending yet
      }
    }

    const campaign = await prisma.newsletter.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("[CAMPAIGN_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update campaign" },
      { status: 500 },
    );
  }
}, "newsletter:manage");

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
        { error: "Bad Request", message: "Campaign ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.newsletter.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Campaign not found" },
        { status: 404 },
      );
    }

    if (existing.status === "sent") {
      return NextResponse.json(
        { error: "Bad Request", message: "Cannot delete a sent campaign" },
        { status: 400 },
      );
    }

    await prisma.newsletter.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("[CAMPAIGN_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete campaign" },
      { status: 500 },
    );
  }
}, "newsletter:manage");
