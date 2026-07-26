// =============================================================================
// POST /api/admin/seo/scan — trigger a broken link scan
// Permission: pages:manage
//
// This endpoint scans published pages for broken links by crawling their
// content (anchors <a>), HEAD-requesting each external URL, and recording
// results. Results are stored as JSON under the "seo.brokenLinks" setting.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BrokenLinkEntry {
  id: string;
  sourcePage: string;
  sourcePageTitle: string;
  brokenUrl: string;
  statusCode: number;
  anchorText: string;
  foundAt: string;
}

interface ScanResult {
  id: string;
  startedAt: string;
  completedAt: string;
  totalUrls: number;
  brokenCount: number;
  links: BrokenLinkEntry[];
}

// ---------------------------------------------------------------------------
// Scan logic
// ---------------------------------------------------------------------------

/**
 * Extract all external links from page content JSON.
 * Returns anchor elements with href, text, and source page info.
 */
function extractLinks(
  pageId: string,
  pageTitle: string,
  pageSlug: string,
  content: unknown,
): Array<{ url: string; text: string }> {
  const links: Array<{ url: string; text: string }> = [];
  if (!content || typeof content !== "object") return links;

  const walk = (obj: Record<string, unknown>) => {
    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item && typeof item === "object") walk(item as Record<string, unknown>);
        }
      } else if (value && typeof value === "object") {
        walk(value as Record<string, unknown>);
      }
    }
  };

  // Simple recursive walk to find href/text pairs in content JSON
  const raw = JSON.stringify(content);
  const hrefRegex = /"href"\s*:\s*"([^"]+)"/g;
  const textRegex = /"text"\s*:\s*"([^"]+)"/g;

  const hrefs: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = hrefRegex.exec(raw)) !== null) {
    hrefs.push(m[1]);
  }

  const texts: string[] = [];
  while ((m = textRegex.exec(raw)) !== null) {
    texts.push(m[1]);
  }

  for (const url of hrefs) {
    if (isHttpUrl(url)) {
      links.push({
        url,
        text: texts.length > 0 ? texts[0] : url,
      });
    }
  }

  return links;
}

/**
 * Check if a string looks like an HTTP(S) URL.
 */
function isHttpUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Perform a HEAD request to check if a URL returns a healthy status.
 * Returns the status code or 0 if the request fails entirely.
 */
async function checkUrl(url: string): Promise<number> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "manual",
      headers: { "User-Agent": "Synova-SEO-Scanner/1.0" },
    });

    clearTimeout(timeout);
    return response.status;
  } catch {
    return 0;
  }
}

// ---------------------------------------------------------------------------
// POST /api/admin/seo/scan
// ---------------------------------------------------------------------------

export const POST = withPermission(async () => {
  try {
    const startedAt = new Date().toISOString();
    const scanId = crypto.randomUUID();

    // Fetch all published pages
    const pages = await prisma.page.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      select: { id: true, title: true, slug: true, content: true },
    });

    // Extract all links from all pages
    const allLinks: Array<{
      sourceId: string;
      sourceTitle: string;
      sourceSlug: string;
      url: string;
      text: string;
    }> = [];

    for (const page of pages) {
      const pageLinks = extractLinks(page.id, page.title, page.slug, page.content);
      for (const link of pageLinks) {
        allLinks.push({
          sourceId: page.id,
          sourceTitle: page.title,
          sourceSlug: page.slug,
          ...link,
        });
      }
    }

    // Check each unique external URL (deduplicate)
    const uniqueUrls = [...new Set(allLinks.map((l) => l.url))];
    const checked = new Map<string, number>();

    // Check in batches of 5 to avoid overwhelming the network
    const batchSize = 5;
    for (let i = 0; i < uniqueUrls.length; i += batchSize) {
      const batch = uniqueUrls.slice(i, i + batchSize);
      const results = await Promise.all(batch.map((url) => checkUrl(url)));
      for (let j = 0; j < batch.length; j++) {
        checked.set(batch[j], results[j]);
      }
    }

    // Build broken links list
    const brokenLinks: BrokenLinkEntry[] = [];
    for (const link of allLinks) {
      const statusCode = checked.get(link.url) ?? 200;

      // Consider 4xx, 5xx, or 0 (unreachable) as broken
      if (statusCode === 0 || (statusCode >= 400 && statusCode !== 401 && statusCode !== 403)) {
        brokenLinks.push({
          id: crypto.randomUUID(),
          sourcePage: link.sourceSlug,
          sourcePageTitle: link.sourceTitle,
          brokenUrl: link.url,
          statusCode,
          anchorText: link.text,
          foundAt: startedAt,
        });
      }
    }

    const completedAt = new Date().toISOString();
    const scanResult: ScanResult = {
      id: scanId,
      startedAt,
      completedAt,
      totalUrls: uniqueUrls.length,
      brokenCount: brokenLinks.length,
      links: brokenLinks,
    };

    // Store in Setting model
    await prisma.setting.upsert({
      where: { key: "seo.brokenLinkScan" },
      update: { value: JSON.stringify(scanResult) },
      create: { key: "seo.brokenLinkScan", value: JSON.stringify(scanResult) },
    });

    return NextResponse.json({
      scan: scanResult,
      message: `Scan complete: ${brokenLinks.length} broken link(s) found out of ${uniqueUrls.length} checked`,
    });
  } catch (error) {
    console.error("[SEO_SCAN_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to run broken link scan" },
      { status: 500 },
    );
  }
}, "pages:manage");
