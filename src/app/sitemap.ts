import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://synovainfo.com";

// =============================================================================
// Static pages
// =============================================================================

const STATIC_PAGES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "about", priority: 0.8, changeFrequency: "monthly" },
  { path: "services", priority: 0.9, changeFrequency: "weekly" },
  { path: "industries", priority: 0.8, changeFrequency: "monthly" },
  { path: "blog", priority: 0.8, changeFrequency: "daily" },
  { path: "case-studies", priority: 0.7, changeFrequency: "weekly" },
  { path: "contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "careers", priority: 0.7, changeFrequency: "daily" },
  { path: "faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "resources", priority: 0.6, changeFrequency: "weekly" },
  { path: "privacy", priority: 0.4, changeFrequency: "yearly" },
  { path: "terms", priority: 0.4, changeFrequency: "yearly" },
];

// =============================================================================
// Sitemap
// =============================================================================

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // 1. Static pages
  for (const page of STATIC_PAGES) {
    entries.push({
      url: `${BASE_URL}/${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  // 2. Dynamic services
  const services = await prisma.service.findMany({
    where: { status: true, deletedAt: null },
    select: { slug: true, updatedAt: true },
  });
  for (const service of services) {
    entries.push({
      url: `${BASE_URL}/services/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // 3. Dynamic industries
  const industries = await prisma.industry.findMany({
    where: { status: true, deletedAt: null },
    select: { slug: true, updatedAt: true },
  });
  for (const industry of industries) {
    entries.push({
      url: `${BASE_URL}/industries/${industry.slug}`,
      lastModified: industry.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // 4. Dynamic blog posts
  const blogPosts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { slug: true, updatedAt: true, publishedAt: true },
  });
  for (const post of blogPosts) {
    entries.push({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // 5. Dynamic careers
  const careers = await prisma.career.findMany({
    where: { status: true, deletedAt: null },
    select: { slug: true, updatedAt: true },
  });
  for (const career of careers) {
    entries.push({
      url: `${BASE_URL}/careers/${career.slug}`,
      lastModified: career.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // 6. Dynamic case studies (pages with slug starting with "case-studies/")
  const caseStudies = await prisma.page.findMany({
    where: {
      slug: { startsWith: "case-studies/" },
      status: "PUBLISHED",
      deletedAt: null,
    },
    select: { slug: true, updatedAt: true },
  });
  for (const cs of caseStudies) {
    entries.push({
      url: `${BASE_URL}/${cs.slug}`,
      lastModified: cs.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // 7. Dynamic custom pages (PUBLISHED, not admin/api, not already listed)
  const excludedSlugs = new Set([
    ...STATIC_PAGES.map((p) => p.path || "home"),
    "admin",
    "api",
  ]);
  const customPages = await prisma.page.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      NOT: {
        OR: [
          { slug: { startsWith: "admin/" } },
          { slug: { startsWith: "api/" } },
          { slug: { startsWith: "case-studies/" } },
          { slug: { in: [...excludedSlugs] } },
        ],
      },
    },
    select: { slug: true, updatedAt: true },
  });
  for (const page of customPages) {
    entries.push({
      url: `${BASE_URL}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
