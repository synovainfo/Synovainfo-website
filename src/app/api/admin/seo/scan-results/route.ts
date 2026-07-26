// =============================================================================
// GET /api/admin/seo/scan-results — retrieve latest broken link scan results
// Permission: pages:manage
// =============================================================================

import { NextResponse } from "next/server";
import { withPermission } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// GET /api/admin/seo/scan-results
// ---------------------------------------------------------------------------

export const GET = withPermission(async () => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "seo.brokenLinkScan" },
    });

    if (!setting) {
      return NextResponse.json({
        scan: null,
        message: "No scan results available yet. Run a scan first.",
      });
    }

    const scan = JSON.parse(setting.value);

    return NextResponse.json({ scan });
  } catch (error) {
    console.error("[SEO_SCAN_RESULTS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch scan results" },
      { status: 500 },
    );
  }
}, "pages:manage");
