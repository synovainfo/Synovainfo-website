// =============================================================================
// GET    /api/admin/clients/[id] — single client
// PUT    /api/admin/clients/[id] — update client
// DELETE /api/admin/clients/[id] — delete client
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
  name: z.string().min(1, "Name is required").max(200).optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    )
    .optional(),
  description: z.string().max(5000).optional().nullable(),
  logo: z.string().max(500).optional().nullable(),
  websiteUrl: z.string().max(500).optional().nullable(),
  industry: z.string().max(200).optional().nullable(),
  order: z.number().int().optional(),
  status: z.boolean().optional(),
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
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) {
    return {
      error: NextResponse.json(
        { error: "Not Found", message: "Client not found" },
        { status: 404 },
      ),
    };
  }
  return { client };
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

    return NextResponse.json({ client: result.client });
  } catch (error) {
    console.error("[CLIENT_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch client" },
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

    // Check slug uniqueness if changing
    if (parsed.data.slug && parsed.data.slug !== result.client.slug) {
      const slugExists = await prisma.client.findUnique({
        where: { slug: parsed.data.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          {
            error: "Conflict",
            message: "A client with this slug already exists",
          },
          { status: 409 },
        );
      }
    }

    const client = await prisma.client.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ client });
  } catch (error) {
    console.error("[CLIENT_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update client" },
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

    await prisma.client.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("[CLIENT_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete client" },
      { status: 500 },
    );
  }
}, "pages:manage");
