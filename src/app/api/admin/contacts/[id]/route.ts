// =============================================================================
// GET    /api/admin/contacts/[id] — contact detail with activity
// PUT    /api/admin/contacts/[id] — update contact (status, assignee, notes)
// DELETE /api/admin/contacts/[id] — delete contact
// Permission: leads:read (GET), leads:manage (PUT, DELETE)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Update schema for PUT
// ---------------------------------------------------------------------------

const updateContactSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  company: z.string().max(200).optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().max(50).optional(),
  service: z.string().max(200).optional(),
  message: z.string().optional(),
  source: z.string().max(100).optional(),
  status: z
    .enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"])
    .optional(),
  assignedToId: z.string().nullable().optional(),
  notes: z.string().optional(),
});

// ---------------------------------------------------------------------------
// GET — contact detail with activities and assigned user
// ---------------------------------------------------------------------------

export const GET = withPermission(async (request: NextRequest, context: { params: Promise<Record<string, string | string[] | undefined>> }) => {
  try {
    const id = (await context.params).id as string;

    const contact = await prisma.contact.findUnique({
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

    if (!contact) {
      return NextResponse.json(
        { error: "Not Found", message: "Contact not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("[CONTACT_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch contact" },
      { status: 500 },
    );
  }
}, "leads:read");

// ---------------------------------------------------------------------------
// PUT — update contact
// ---------------------------------------------------------------------------

export const PUT = withPermission(async (request: NextRequest, context: { params: Promise<Record<string, string | string[] | undefined>> }) => {
  try {
    const p = await context.params;
    const id = typeof p.id === "string" ? p.id : "";
    const body = await request.json();
    const parsed = updateContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Check existence
    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Contact not found" },
        { status: 404 },
      );
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: parsed.data,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("[CONTACT_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update contact" },
      { status: 500 },
    );
  }
}, "leads:manage");

// ---------------------------------------------------------------------------
// DELETE — delete contact
// ---------------------------------------------------------------------------

export const DELETE = withPermission(async (request: NextRequest, context: { params: Promise<Record<string, string | string[] | undefined>> }) => {
  try {
    const p = await context.params;
    const id = typeof p.id === "string" ? p.id : "";

    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Contact not found" },
        { status: 404 },
      );
    }

    await prisma.contact.delete({ where: { id } });

    return NextResponse.json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("[CONTACT_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete contact" },
      { status: 500 },
    );
  }
}, "leads:manage");
