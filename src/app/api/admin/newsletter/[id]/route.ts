// =============================================================================
// GET    /api/admin/newsletter/[id] — single subscriber
// PUT    /api/admin/newsletter/[id] — update subscriber
// DELETE /api/admin/newsletter/[id] — delete subscriber
// Permission: newsletter:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const updateSubscriberSchema = z.object({
  email: z.string().email("Valid email is required").optional(),
  name: z.string().optional().nullable(),
  status: z.enum(["active", "unsubscribed", "bounced"]).optional(),
  source: z.string().optional().nullable(),
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
        { error: "Bad Request", message: "Subscriber ID is required" },
        { status: 400 },
      );
    }

    const subscriber = await prisma.subscriber.findUnique({
      where: { id },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Not Found", message: "Subscriber not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ subscriber });
  } catch (error) {
    console.error("[SUBSCRIBER_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch subscriber" },
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
        { error: "Bad Request", message: "Subscriber ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.subscriber.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Subscriber not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = updateSubscriberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { email, name, status, source } = parsed.data;

    // Check email uniqueness if changing
    if (email && email.toLowerCase() !== existing.email) {
      const emailExists = await prisma.subscriber.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (emailExists) {
        return NextResponse.json(
          { error: "Conflict", message: "This email is already subscribed" },
          { status: 409 },
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (email !== undefined) updateData.email = email.toLowerCase();
    if (name !== undefined) updateData.name = name;
    if (status !== undefined) {
      updateData.status = status;
      if (status === "unsubscribed") {
        updateData.unsubscribedAt = new Date();
      } else if (status === "active") {
        updateData.unsubscribedAt = null;
      }
    }
    if (source !== undefined) updateData.source = source;

    const subscriber = await prisma.subscriber.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ subscriber });
  } catch (error) {
    console.error("[SUBSCRIBER_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update subscriber" },
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
        { error: "Bad Request", message: "Subscriber ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.subscriber.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Subscriber not found" },
        { status: 404 },
      );
    }

    await prisma.subscriber.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Subscriber deleted successfully" });
  } catch (error) {
    console.error("[SUBSCRIBER_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete subscriber" },
      { status: 500 },
    );
  }
}, "newsletter:manage");
