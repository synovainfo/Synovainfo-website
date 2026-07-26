// =============================================================================
// GET    /api/admin/forms/[id] — single form with fields
// PUT    /api/admin/forms/[id] — update form and its fields
// DELETE /api/admin/forms/[id] — delete form with cascade
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const fieldSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["TEXT", "EMAIL", "TEXTAREA", "SELECT", "CHECKBOX", "RADIO", "FILE", "PHONE", "DATE"]),
  label: z.string().min(1, "Label is required"),
  placeholder: z.string().optional().nullable(),
  required: z.boolean().optional().default(false),
  validationRules: z.any().optional().nullable(),
  options: z.array(z.string()).optional().nullable(),
  order: z.number().int().optional().default(0),
});

const updateFormSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional().nullable(),
  submitButtonText: z.string().optional(),
  successMessage: z.string().optional().nullable(),
  emailNotification: z.string().email().optional().nullable(),
  status: z.boolean().optional(),
  fields: z.array(fieldSchema).optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getId(
  context: { params: Promise<Record<string, string | string[] | undefined>> },
): Promise<string | null> {
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
        { error: "Bad Request", message: "Form ID is required" },
        { status: 400 },
      );
    }

    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        fields: { orderBy: { order: "asc" } },
      },
    });

    if (!form) {
      return NextResponse.json(
        { error: "Not Found", message: "Form not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ form });
  } catch (error) {
    console.error("[FORM_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch form" },
      { status: 500 },
    );
  }
}, "pages:manage");

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
        { error: "Bad Request", message: "Form ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.form.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Form not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = updateFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, slug, description, submitButtonText, successMessage, emailNotification, status, fields } = parsed.data;

    // Check slug uniqueness if changing
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.form.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json(
          { error: "Conflict", message: "A form with this slug already exists" },
          { status: 409 },
        );
      }
    }

    // Update form and fields in a transaction
    const form = await prisma.$transaction(async (tx) => {
      // Update form data
      const updateData: Record<string, unknown> = {};
      if (name !== undefined) updateData.name = name;
      if (slug !== undefined) updateData.slug = slug;
      if (description !== undefined) updateData.description = description;
      if (submitButtonText !== undefined) updateData.submitButtonText = submitButtonText;
      if (successMessage !== undefined) updateData.successMessage = successMessage;
      if (emailNotification !== undefined) updateData.emailNotification = emailNotification;
      if (status !== undefined) updateData.status = status;

      // If fields provided, replace all fields
      if (fields !== undefined) {
        await tx.formField.deleteMany({ where: { formId: id } });
        if (fields.length > 0) {
          await tx.formField.createMany({
            data: fields.map((f) => ({
              formId: id,
              type: f.type,
              label: f.label,
              placeholder: f.placeholder,
              required: f.required,
              validationRules: f.validationRules ?? undefined,
              options: f.options ?? undefined,
              order: f.order,
            })),
          });
        }
      }

      return tx.form.update({
        where: { id },
        data: updateData,
        include: {
          fields: { orderBy: { order: "asc" } },
        },
      });
    });

    return NextResponse.json({ form });
  } catch (error) {
    console.error("[FORM_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update form" },
      { status: 500 },
    );
  }
}, "pages:manage");

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
        { error: "Bad Request", message: "Form ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.form.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Form not found" },
        { status: 404 },
      );
    }

    await prisma.form.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Form deleted successfully" });
  } catch (error) {
    console.error("[FORM_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete form" },
      { status: 500 },
    );
  }
}, "pages:manage");
