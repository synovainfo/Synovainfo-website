// =============================================================================
// GET    /api/admin/forms/[id]/submissions — list submissions + CSV export
// DELETE /api/admin/forms/[id]/submissions — delete a single submission
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
  format: z.enum(["json", "csv"]).optional().default("json"),
  submissionId: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getFormId(
  request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
): Promise<string | null> {
  const params = await context.params;
  const id = params.id;
  return typeof id === "string" ? id : null;
}

/**
 * Escape a value for CSV: wrap in quotes if it contains commas, quotes, or newlines.
 */
function csvEscape(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generate CSV string from submissions using the form's field labels as headers.
 */
function generateCsv(
  submissions: Array<{ id: string; data: unknown; ipAddress: string | null; userAgent: string | null; createdAt: Date }>,
  fieldLabels: string[],
): string {
  const headers = ["ID", ...fieldLabels, "IP Address", "User Agent", "Submitted At"];
  const rows = submissions.map((sub) => {
    const rawData = sub.data;
    const data = rawData && typeof rawData === "object" ? (rawData as Record<string, string>) : {};
    const values = fieldLabels.map((label) => csvEscape(data[label] ?? ""));
    return [
      csvEscape(sub.id),
      ...values,
      csvEscape(sub.ipAddress),
      csvEscape(sub.userAgent),
      csvEscape(sub.createdAt.toISOString()),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\r\n");
}

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(async (
  request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) => {
  try {
    const formId = await getFormId(request, context);
    if (!formId) {
      return NextResponse.json(
        { error: "Bad Request", message: "Form ID is required" },
        { status: 400 },
      );
    }

    // Verify form exists
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: { fields: { orderBy: { order: "asc" }, select: { label: true } } },
    });

    if (!form) {
      return NextResponse.json(
        { error: "Not Found", message: "Form not found" },
        { status: 404 },
      );
    }

    const url = new URL(request.url);
    const parsed = listQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { page, pageSize, format, submissionId } = parsed.data;

    // Single submission detail
    if (submissionId) {
      const submission = await prisma.formSubmission.findUnique({
        where: { id: submissionId },
      });

      if (!submission) {
        return NextResponse.json(
          { error: "Not Found", message: "Submission not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ submission });
    }

    // CSV export
    if (format === "csv") {
      const allSubmissions = await prisma.formSubmission.findMany({
        where: { formId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          data: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
        },
      });

      const fieldLabels = form.fields.map((f) => f.label);
      const csv = generateCsv(allSubmissions, fieldLabels);

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="form-submissions-${form.slug ?? formId}.csv"`,
        },
      });
    }

    // Paginated JSON
    const where = { formId };
    const [submissions, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          data: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
        },
      }),
      prisma.formSubmission.count({ where }),
    ]);

    return NextResponse.json({
      submissions,
      fieldLabels: form.fields.map((f) => f.label),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[SUBMISSIONS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// DELETE — delete a single submission by query param ?submissionId=xxx
// ---------------------------------------------------------------------------

export const DELETE = withPermission(async (
  request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) => {
  try {
    const formId = await getFormId(request, context);
    if (!formId) {
      return NextResponse.json(
        { error: "Bad Request", message: "Form ID is required" },
        { status: 400 },
      );
    }

    const url = new URL(request.url);
    const submissionId = url.searchParams.get("submissionId");

    if (!submissionId) {
      return NextResponse.json(
        { error: "Bad Request", message: "submissionId query parameter is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Not Found", message: "Submission not found" },
        { status: 404 },
      );
    }

    await prisma.formSubmission.delete({ where: { id: submissionId } });

    return NextResponse.json({ success: true, message: "Submission deleted successfully" });
  } catch (error) {
    console.error("[SUBMISSION_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete submission" },
      { status: 500 },
    );
  }
}, "pages:manage");
