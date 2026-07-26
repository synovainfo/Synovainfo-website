// =============================================================================
// GET  /api/admin/seo/scores — list SEO scores for all published pages
// POST /api/admin/seo/scores — trigger a re-scan of page SEO metadata
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SeoScoreResult {
  id: string;
  pageId: string;
  title: string;
  slug: string;
  score: number;
  recommendations: string[];
  lastChecked: string;
}

// ---------------------------------------------------------------------------
// Scoring logic
// ---------------------------------------------------------------------------

/**
 * Analyse a single page's SEO metadata and return a score (0–100) plus
 * actionable recommendations.
 */
function scorePage(
  id: string,
  title: string,
  slug: string,
  seoTitle: string | null,
  seoDescription: string | null,
  seoKeywords: string | null,
  content: string | null,
): SeoScoreResult {
  const recommendations: string[] = [];
  let score = 100;

  // --- Title check ---
  if (!seoTitle || seoTitle.trim().length === 0) {
    recommendations.push("Missing SEO title");
    score -= 20;
  } else if (seoTitle.length < 30) {
    recommendations.push("SEO title is too short (min 30 characters)");
    score -= 10;
  } else if (seoTitle.length > 60) {
    recommendations.push("SEO title exceeds 60 characters (may be truncated)");
    score -= 5;
  }

  // --- Meta description check ---
  if (!seoDescription || seoDescription.trim().length === 0) {
    recommendations.push("Missing meta description");
    score -= 20;
  } else if (seoDescription.length < 120) {
    recommendations.push("Meta description is too short (min 120 characters)");
    score -= 5;
  } else if (seoDescription.length > 160) {
    recommendations.push("Meta description exceeds 160 characters (may be truncated)");
    score -= 5;
  }

  // --- Keywords check ---
  if (!seoKeywords || seoKeywords.trim().length === 0) {
    recommendations.push("Missing meta keywords");
    score -= 5;
  }

  // --- Content length check ---
  const plainText = content ? stripHtml(content) : "";
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 300) {
    recommendations.push(`Content is too short (${wordCount} words, min 300 recommended)`);
    score -= 10;
  }

  // --- Slug check ---
  if (slug.length > 60) {
    recommendations.push("URL slug is too long (max 60 characters recommended)");
    score -= 5;
  }
  if (slug.includes("--")) {
    recommendations.push("URL slug contains double hyphens");
    score -= 5;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    id,
    pageId: id,
    title,
    slug,
    score,
    recommendations,
    lastChecked: new Date().toISOString(),
  };
}

/** Strip HTML tags to get plain text for word count. */
function stripHtml(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, "").replace(/&[^;]+;/g, " ");
}

// ---------------------------------------------------------------------------
// GET /api/admin/seo/scores
// ---------------------------------------------------------------------------

export const GET = withPermission(async () => {
  try {
    // Try to load cached scores
    const cached = await prisma.setting.findUnique({
      where: { key: "seo.pageScores" },
    });

    if (cached) {
      const data = JSON.parse(cached.value);
      return NextResponse.json({
        scores: data.scores,
        lastUpdated: data.lastUpdated,
        totalPages: data.totalPages,
      });
    }

    // If no cached scores, run a fresh analysis
    const pages = await prisma.page.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      select: { id: true, title: true, slug: true, content: true },
    });

    const scores = scoreAllPages(pages);

    return NextResponse.json({
      scores,
      lastUpdated: new Date().toISOString(),
      totalPages: pages.length,
    });
  } catch (error) {
    console.error("[SEO_SCORES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch SEO scores" },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// POST /api/admin/seo/scores — trigger a full re-scan
// ---------------------------------------------------------------------------

export const POST = withPermission(async () => {
  try {
    const pages = await prisma.page.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
      },
    });

    const scores = pages.map((page) =>
      scorePage(
        page.id,
        page.title,
        page.slug,
        null,
        null,
        null,
        page.content ? JSON.stringify(page.content) : null,
      ),
    );

    const lastUpdated = new Date().toISOString();

    // Cache results in Setting model
    await prisma.setting.upsert({
      where: { key: "seo.pageScores" },
      update: { value: JSON.stringify({ scores, lastUpdated, totalPages: pages.length }) },
      create: {
        key: "seo.pageScores",
        value: JSON.stringify({ scores, lastUpdated, totalPages: pages.length }),
      },
    });

    return NextResponse.json({
      scores,
      lastUpdated,
      totalPages: pages.length,
      message: `Scanned ${pages.length} page(s)`,
    });
  } catch (error) {
    console.error("[SEO_SCORES_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to re-scan SEO scores" },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// Helpers (shared for first-time GET and explicit POST)
// ---------------------------------------------------------------------------

function scoreAllPages(
  pages: Array<{
    id: string;
    title: string;
    slug: string;
    content: unknown;
  }>,
): SeoScoreResult[] {
  return pages.map((page) =>
    scorePage(
      page.id,
      page.title,
      page.slug,
      null,
      null,
      null,
      page.content ? JSON.stringify(page.content) : null,
    ),
  );
}
