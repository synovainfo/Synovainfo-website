// =============================================================================
// GET /api/admin/contacts  — paginated contact list with search, filter, sort
// POST /api/admin/contacts — create a new contact
// Permission: leads:read (GET), leads:manage (POST)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";
import { Prisma } from "@/generated/prisma/client";

// ---------------------------------------------------------------------------
// Query schema for GET
// ---------------------------------------------------------------------------

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional().default(""),
  status: z
    .enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"])
    .optional(),
  service: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sort: z
    .enum(["name", "email", "company", "status", "service", "createdAt"])
    .optional()
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// ---------------------------------------------------------------------------
// Create schema for POST
// ---------------------------------------------------------------------------

const createContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  company: z.string().max(200).optional().default(""),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z.string().max(50).optional().default(""),
  service: z.string().max(200).optional().default(""),
  message: z.string().optional().default(""),
  source: z.string().max(100).optional().default(""),
  status: z
    .enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"])
    .optional()
    .default("NEW"),
  assignedToId: z.string().optional().nullable(),
});

// ---------------------------------------------------------------------------
// GET — paginated list with search, filter, sort
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

    const {
      page,
      pageSize,
      search,
      status,
      service,
      dateFrom,
      dateTo,
      sort,
      order,
    } = parsed.data;

    // Build where clause
    const where: Prisma.ContactWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (service) {
      where.service = { contains: service, mode: "insensitive" };
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    const orderBy: Prisma.ContactOrderByWithRelationInput = {};
    if (sort === "name") orderBy.name = order;
    else if (sort === "email") orderBy.email = order;
    else if (sort === "company") orderBy.company = order;
    else if (sort === "status") orderBy.status = order;
    else if (sort === "service") orderBy.service = order;
    else orderBy.createdAt = order;

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true, image: true },
          },
          _count: {
            select: { activities: true },
          },
        },
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[CONTACTS_GET]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch contacts",
      },
      { status: 500 },
    );
  }
}, "leads:read");

// ---------------------------------------------------------------------------
// POST — create contact
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = createContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const contact = await prisma.contact.create({
      data: parsed.data,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("[CONTACTS_POST]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create contact",
      },
      { status: 500 },
    );
  }
}, "leads:manage");
