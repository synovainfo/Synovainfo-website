import { prisma } from '@/lib/prisma'
import { sanitizeHtml } from '@/lib/xss'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CaseStudiesClient } from './case-studies-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Case Studies — Synova Infotech',
    description:
      'Explore how Synova Infotech delivers enterprise technology solutions across industries — from IoT and AI to cloud-native platforms.',
    openGraph: {
      title: 'Case Studies — Synova Infotech',
      description:
        'Real enterprise technology success stories spanning manufacturing, logistics, finance, and more.',
    },
  }
}

export interface CaseStudyPageData {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  content: Record<string, unknown> | null
  publishedAt: Date | null
}

async function getCaseStudies(): Promise<CaseStudyPageData[]> {
  const pages = await prisma.page.findMany({
    where: {
      template: 'case-study',
      status: 'PUBLISHED',
      deletedAt: null,
    },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      content: true,
      publishedAt: true,
    },
  })

  return pages.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    featuredImage: p.featuredImage,
    content: p.content as Record<string, unknown> | null,
    publishedAt: p.publishedAt,
  }))
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies()

  if (caseStudies.length === 0) {
    notFound()
  }

  // Extract unique industries from content JSON for filter
  const allIndustries = new Set<string>()
  caseStudies.forEach((cs) => {
    const content = cs.content as Record<string, unknown> | null
    if (content?.industry && typeof content.industry === 'string') {
      allIndustries.add(content.industry)
    }
  })

  const industries = Array.from(allIndustries)

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-[var(--color-primary)] pt-28 pb-8 md:pt-36">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
            <li>
              <Link href="/" className="hover:text-[var(--color-accent-blue)] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-text-secondary)]" aria-current="page">
              Case Studies
            </li>
          </ol>
        </nav>
      </section>

      <CaseStudiesClient caseStudies={caseStudies} industries={industries} />
    </>
  )
}
