import { prisma } from '@/lib/prisma'
import { sanitizeHtml } from '@/lib/xss'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CaseStudyDetailClient } from './case-study-detail-client'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

async function getCaseStudy(slug: string) {
  const page = await prisma.page.findFirst({
    where: {
      slug,
      template: 'case-study',
      status: 'PUBLISHED',
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      featuredImage: true,
      publishedAt: true,
    },
  })
  return page
}

async function getRelatedCaseStudies(currentSlug: string, industry: string, limit = 3) {
  const pages = await prisma.page.findMany({
    where: {
      template: 'case-study',
      status: 'PUBLISHED',
      deletedAt: null,
      slug: { not: currentSlug },
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      content: true,
    },
  })

  // Filter by matching industry on content JSON
  return pages.filter((p) => {
    const content = p.content as Record<string, unknown> | null
    return content?.industry === industry
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getCaseStudy(slug)

  if (!page) {
    return { title: 'Case Study Not Found — Synova Infotech' }
  }

  return {
    title: `${page.title} — Case Study | Synova Infotech`,
    description:
      page.excerpt ??
      `Learn how Synova Infotech delivered ${page.title}.`,
    openGraph: {
      title: `${page.title} — Synova Infotech`,
      description: page.excerpt ?? undefined,
      images: page.featuredImage ? [{ url: page.featuredImage }] : undefined,
      type: 'article',
    },
  }
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params
  const page = await getCaseStudy(slug)

  if (!page) {
    notFound()
  }

  const content = (page.content ?? {}) as Record<string, unknown>
  const industry = (content.industry as string) ?? ''
  const challenge = (content.challenge as string) ?? ''
  const solution = (content.solution as string) ?? ''
  const approach = (content.approach as string) ?? ''
  const technologies = (content.technologies as string[]) ?? []
  const results = (content.results as { metric: string; value: string }[]) ?? []
  const timeline = (content.timeline as string) ?? ''
  const role = (content.role as string) ?? ''

  const relatedStudies = await getRelatedCaseStudies(slug, industry)

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-[var(--color-primary)] pt-28 pb-4 md:pt-36">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
            <li>
              <Link href="/" className="hover:text-[var(--color-accent-blue)] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/case-studies" className="hover:text-[var(--color-accent-blue)] transition-colors">
                Case Studies
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-text-secondary)] truncate max-w-[200px]" aria-current="page">
              {page.title}
            </li>
          </ol>
        </nav>
      </section>

      <CaseStudyDetailClient
        title={page.title}
        excerpt={page.excerpt}
        featuredImage={page.featuredImage}
        industry={industry}
        challenge={challenge}
        solution={solution}
        approach={approach}
        technologies={technologies}
        results={results}
        timeline={timeline}
        role={role}
        content={content}
        relatedStudies={relatedStudies.map((r) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          excerpt: r.excerpt,
          featuredImage: r.featuredImage,
        }))}
      />
    </>
  )
}
