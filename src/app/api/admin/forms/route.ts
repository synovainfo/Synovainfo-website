// =============================================================================
// GET  /api/admin/forms — paginated list with submission stats
// POST /api/admin/forms — create form with optional fields
// Permission: pages:manage
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
  status: z.enum(["true", "false"]).optional(),
  sort: z.enum(["name", "status", "createdAt"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const fieldSchema = z.object({
  type: z.enum(["TEXT", "EMAIL", "TEXTAREA", "SELECT", "CHECKBOX", "RADIO", "FILE", "PHONE", "DATE"]),
  label: z.string().min(1, "Label is required"),
  placeholder: z.string().optional().nullable(),
  required: z.boolean().optional().default(false),
  validationRules: z.any().optional().nullable(),
  options: z.array(z.string()).optional().nullable(),
  order: z.number().int().optional().default(0),
});

const createFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional().nullable(),
  submitButtonText: z.string().optional().default("Submit"),
  successMessage: z.string().optional().nullable(),
  emailNotification: z.string().email().optional().nullable(),
  status: z.boolean().optional().default(true),
  fields: z.array(fieldSchema).optional().default([]),
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
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status !== undefined) where.status = status === "true";

    const [forms, total] = await Promise.all([
      prisma.form.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: { select: { fields: true, submissions: true } },
          submissions: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { createdAt: true },
          },
        },
      }),
      prisma.form.count({ where }),
    ]);

    const formsWithStats = forms.map((form) => ({
      ...form,
      fieldCount: form._count.fields,
      submissionCount: form._count.submissions,
      lastSubmissionAt: form.submissions[0]?.createdAt ?? null,
      _count: undefined,
    }));

    return NextResponse.json({
      forms: formsWithStats,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error("[FORMS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch forms" },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = createFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, slug, description, submitButtonText, successMessage, emailNotification, status, fields } = parsed.data;

    // Check slug uniqueness
    const existing = await prisma.form.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Conflict", message: "A form with this slug already exists" },
        { status: 409 },
      );
    }

    const form = await prisma.form.create({
      data: {
        name,
        slug,
        description,
        submitButtonText,
        successMessage,
        emailNotification,
        status,
        fields: {
          create: fields.map((f) => ({
            type: f.type,
            label: f.label,
            placeholder: f.placeholder,
            required: f.required,
            validationRules: f.validationRules ?? undefined,
            options: f.options ?? undefined,
            order: f.order,
          })),
        },
      },
      include: {
        fields: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json({ form }, { status: 201 });
  } catch (error) {
    console.error("[FORMS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create form" },
      { status: 500 },
    );
  }
}, "pages:manage");
