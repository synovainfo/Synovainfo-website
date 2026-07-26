// =============================================================================
// PUT    /api/admin/seo/redirects/[id] — update a redirect
// DELETE /api/admin/seo/redirects/[id] — delete a redirect
// Permission: seo:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";
import { deleteRedirect } from "@/lib/redirect";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const updateRedirectSchema = z.object({
  source: z
    .string()
    .min(1, "Source path is required")
    .max(500)
    .startsWith("/", "Source path must start with /")
    .optional(),
  target: z
    .string()
    .min(1, "Target path is required")
    .max(500)
    .startsWith("/", "Target path must start with /")
    .optional(),
  type: z.union([z.literal(301), z.literal(302)]).optional(),
  wildcard: z.boolean().optional(),
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

async function findRedirectOrError(id: string) {
  const redirect = await prisma.redirect.findUnique({ where: { id } });
  if (!redirect) {
    return {
      error: NextResponse.json(
        { error: "Not Found", message: "Redirect not found" },
        { status: 404 },
      ),
    };
  }
  return { redirect };
}

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

    const found = await findRedirectOrError(id);
    if (found.error) return found.error;

    const body = await request.json();
    const parsed = updateRedirectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // Map fields to Prisma model
    const data: Record<string, unknown> = {};
    if (parsed.data.source !== undefined) data.source = parsed.data.source;
    if (parsed.data.target !== undefined) data.target = parsed.data.target;
    if (parsed.data.type !== undefined) {
      data.type = parsed.data.type === 301 ? "PERMANENT_301" : "TEMPORARY_302";
    }
    if (parsed.data.wildcard !== undefined) data.isWildcard = parsed.data.wildcard;
    if (parsed.data.status !== undefined) data.status = parsed.data.status;

    const updated = await prisma.redirect.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      redirect: {
        id: updated.id,
        source: updated.source,
        target: updated.target,
        type: updated.type === "PERMANENT_301" ? 301 : 302,
        wildcard: updated.isWildcard,
        active: updated.status,
        hitCount: updated.hitCount,
        createdAt: updated.createdAt,
      },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Conflict", message: "A redirect with this source path already exists" },
        { status: 409 },
      );
    }

    console.error("[SEO_REDIRECTS_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update redirect" },
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

    const found = await findRedirectOrError(id);
    if (found.error) return found.error;

    await deleteRedirect(id);

    return NextResponse.json({
      success: true,
      message: "Redirect deleted successfully",
    });
  } catch (error) {
    console.error("[SEO_REDIRECTS_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete redirect" },
      { status: 500 },
    );
  }
}, "pages:manage");
