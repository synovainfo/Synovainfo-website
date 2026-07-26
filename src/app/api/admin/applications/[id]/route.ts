// =============================================================================
// GET    /api/admin/applications/[id] — single application detail
// PUT    /api/admin/applications/[id] — update application status
// DELETE /api/admin/applications/[id] — delete application
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const updateSchema = z.object({
  status: z
    .enum(["NEW", "REVIEWED", "SHORTLISTED", "REJECTED", "HIRED"])
    .optional(),
  notes: z.string().optional().nullable(),
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(50).optional().nullable(),
  resumeUrl: z.string().max(500).optional().nullable(),
  coverLetter: z.string().optional().nullable(),
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

async function findOrError(id: string) {
  const application = await prisma.careerApplication.findUnique({
    where: { id },
    include: {
      career: { select: { id: true, title: true, department: true } },
    },
  });
  if (!application) {
    return {
      error: NextResponse.json(
        { error: "Not Found", message: "Application not found" },
        { status: 404 },
      ),
    };
  }
  return { application };
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
        { error: "Bad Request", message: "ID is required" },
        { status: 400 },
      );
    }

    const result = await findOrError(id);
    if (result.error) return result.error;

    return NextResponse.json({ application: result.application });
  } catch (error) {
    console.error("[APPLICATION_GET]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch application",
      },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// PUT — update application status
// ---------------------------------------------------------------------------

export const PUT = withPermission(async (
  request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) => {
  try {
    const id = await getId(context);
    if (!id) {
      return NextResponse.json(
        { error: "Bad Request", message: "ID is required" },
        { status: 400 },
      );
    }

    const result = await findOrError(id);
    if (result.error) return result.error;

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const application = await prisma.careerApplication.update({
      where: { id },
      data: parsed.data,
      include: {
        career: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ application });
  } catch (error) {
    console.error("[APPLICATION_PUT]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to update application",
      },
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
        { error: "Bad Request", message: "ID is required" },
        { status: 400 },
      );
    }

    const result = await findOrError(id);
    if (result.error) return result.error;

    await prisma.careerApplication.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("[APPLICATION_DELETE]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to delete application",
      },
      { status: 500 },
    );
  }
}, "pages:manage");
