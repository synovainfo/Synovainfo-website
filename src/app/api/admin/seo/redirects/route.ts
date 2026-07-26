// =============================================================================
// GET  /api/admin/seo/redirects — list all redirects
// POST /api/admin/seo/redirects — create a new redirect
// Permission: seo:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withPermission } from "@/lib/authorization";
import { getAllRedirects, createRedirect } from "@/lib/redirect";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const createRedirectSchema = z.object({
  source: z
    .string()
    .min(1, "Source path is required")
    .max(500, "Source path must be at most 500 characters")
    .startsWith("/", "Source path must start with /"),
  target: z
    .string()
    .min(1, "Target path is required")
    .max(500, "Target path must be at most 500 characters")
    .startsWith("/", "Target path must start with /"),
  type: z.union([z.literal(301), z.literal(302)]).default(301),
  wildcard: z.boolean().default(false),
});

// ---------------------------------------------------------------------------
// GET — list all redirects
// ---------------------------------------------------------------------------

export const GET = withPermission(async () => {
  try {
    const redirects = await getAllRedirects();
    return NextResponse.json({ redirects });
  } catch (error) {
    console.error("[SEO_REDIRECTS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch redirects" },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// POST — create a new redirect
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = createRedirectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const redirect = await createRedirect(parsed.data);

    return NextResponse.json({ redirect }, { status: 201 });
  } catch (error: unknown) {
    // Handle Prisma unique constraint violation on source
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

    console.error("[SEO_REDIRECTS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create redirect" },
      { status: 500 },
    );
  }
}, "pages:manage");
