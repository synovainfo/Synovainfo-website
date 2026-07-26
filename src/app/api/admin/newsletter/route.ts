// =============================================================================
// GET  /api/admin/newsletter — list subscribers with dashboard stats
// POST /api/admin/newsletter — add a new subscriber
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
  sort: z.enum(["email", "name", "status", "subscribedAt", "createdAt"]).optional().default("subscribedAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const addSubscriberSchema = z.object({
  email: z.string().email("Valid email is required"),
  name: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
});

const importCsvSchema = z.object({
  subscribers: z.array(
    z.object({
      email: z.string().email("Valid email is required"),
      name: z.string().optional().nullable(),
    }),
  ).min(1, "At least one subscriber is required").max(500, "Maximum 500 subscribers per import"),
});

// ---------------------------------------------------------------------------
// GET — list subscribers with dashboard stats
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
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;

    // Fetch subscribers and stats in parallel
    const [subscribers, total, stats] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.subscriber.count({ where }),
      Promise.all([
        prisma.subscriber.count({ where: { status: "active" } }),
        prisma.subscriber.count({ where: { status: "unsubscribed" } }),
        prisma.subscriber.count({ where: { status: "bounced" } }),
        prisma.subscriber.count({
          where: {
            subscribedAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
          },
        }),
      ]),
    ]);

    const [activeCount, unsubscribedCount, bouncedCount, last30Days] = stats;

    return NextResponse.json({
      subscribers,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
      stats: {
        total,
        active: activeCount,
        unsubscribed: unsubscribedCount,
        bounced: bouncedCount,
        last30Days,
      },
    });
  } catch (error) {
    console.error("[NEWSLETTER_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch subscribers" },
      { status: 500 },
    );
  }
}, "newsletter:manage");

// ---------------------------------------------------------------------------
// POST — add subscriber (single or bulk import)
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Detect if this is a bulk import (has "subscribers" array) or single add
    if (body.subscribers !== undefined) {
      // Bulk import
      const parsed = importCsvSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
          { status: 400 },
        );
      }

      const { subscribers } = parsed.data;
      let imported = 0;
      let skipped = 0;
      const errors: { email: string; reason: string }[] = [];

      for (const sub of subscribers) {
        try {
          await prisma.subscriber.create({
            data: {
              email: sub.email.toLowerCase(),
              name: sub.name ?? null,
              source: "import",
              status: "active",
            },
          });
          imported++;
        } catch (err: unknown) {
          if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
            skipped++;
          } else {
            errors.push({ email: sub.email, reason: "Unexpected error" });
          }
        }
      }

      return NextResponse.json({
        imported,
        skipped,
        errors: errors.length > 0 ? errors : undefined,
        message: `Imported ${imported} subscriber(s). ${skipped} duplicate(s) skipped.`,
      }, { status: 201 });
    }

    // Single subscriber
    const parsed = addSubscriberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { email, name, source } = parsed.data;

    // Check duplicate email
    const existing = await prisma.subscriber.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Conflict", message: "This email is already subscribed" },
        { status: 409 },
      );
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email: email.toLowerCase(),
        name: name ?? null,
        source: source ?? "manual",
        status: "active",
      },
    });

    return NextResponse.json({ subscriber }, { status: 201 });
  } catch (error) {
    console.error("[NEWSLETTER_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to add subscriber" },
      { status: 500 },
    );
  }
}, "newsletter:manage");
