import type { Metadata } from "next";

// =============================================================================
// Types
// =============================================================================

export interface SEOParams {
  /** Page title (site name appended by root layout template) */
  title: string;
  /** Meta description (150-160 chars recommended) */
  description: string;
  /** URL slug or full path (e.g., "about" or "/about") */
  slug?: string;
  /** URL to OG image */
  image?: string;
  /** Publication date (ISO string) */
  publishedAt?: string;
  /** Last modification date (ISO string) */
  updatedAt?: string;
  /** Author name */
  author?: string;
  /** OpenGraph type */
  type?: "website" | "article";
  /** Prevent indexing */
  noIndex?: boolean;
  /** Canonical URL override */
  canonical?: string;
  /** Additional OG image URLs */
  images?: string[];
  /** Keywords */
  keywords?: string[];
  /** JSON-LD structured data */
  jsonLd?: Record<string, unknown>;
}

// =============================================================================
// Helpers
// =============================================================================

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://synovainfotech.com";

function resolveUrl(slug?: string): string {
  if (!slug) return BASE_URL;
  const clean = slug.startsWith("/") ? slug.slice(1) : slug;
  return `${BASE_URL}/${clean}`;
}

// =============================================================================
// Main helper
// =============================================================================

/**
 * Generate a complete Next.js Metadata object for a page.
 *
 * Usage:
 *   export async function generateMetadata(): Promise<Metadata> {
 *     return seo.generateMetadata({ title: "About Us", description: "..." });
 *   }
 *
 * Note: The root layout template (%s | Synova Infotech) handles site name
 * appending, so the title parameter should be just the page title.
 */
export function generateMetadata(params: SEOParams): Metadata {
  const {
    title,
    description,
    slug,
    image,
    publishedAt,
    updatedAt,
    author,
    type = "website",
    noIndex = false,
    canonical,
    images,
    keywords,
  } = params;

  const url = resolveUrl(slug);
  const ogImage = image || undefined;
  const ogImages = images?.map((img) => ({ url: img }));

  const metadata: Metadata = {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonical || url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Synova Infotech",
      locale: "en_US",
      type,
      ...(ogImage && {
        images: ogImages ? [{ url: ogImage }, ...ogImages] : [{ url: ogImage }],
      }),
      ...(type === "article" && {
        publishedTime: publishedAt,
        modifiedTime: updatedAt,
        authors: author ? [author] : undefined,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage || undefined,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    other: {},
  };

  // Attach JSON-LD if provided
  if (params.jsonLd) {
    metadata.other!["application/ld+json"] = JSON.stringify(params.jsonLd);
  }

  return metadata;
}

/**
 * Build a canonical URL from a slug.
 */
export function canonicalUrl(slug: string): string {
  return resolveUrl(slug);
}

/**
 * Build a sitemap entry for a single page.
 */
export function sitemapEntry(
  slug: string,
  options?: {
    lastModified?: Date | string;
    changeFrequency?:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
    priority?: number;
  }
): { url: string; lastModified?: string; changeFrequency?: string; priority?: number } {
  const lastModified = options?.lastModified
    ? new Date(options.lastModified).toISOString()
    : undefined;
  return {
    url: slug.startsWith("http") ? slug : resolveUrl(slug),
    lastModified,
    changeFrequency: options?.changeFrequency,
    priority: options?.priority,
  };
}
