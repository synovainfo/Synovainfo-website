import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ResourcesList } from './resources-list'
import { ChevronRight } from 'lucide-react'

/* ── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findFirst({
    where: { slug: 'resources', status: 'PUBLISHED', deletedAt: null },
    select: { title: true, excerpt: true },
  })

  return {
    title: page?.title ? `${page.title} | Synova Infotech` : 'Resources | Synova Infotech',
    description:
      page?.excerpt ??
      'Access whitepapers, case studies, guides, and datasheets from Synova Infotech covering enterprise technology insights, best practices, and thought leadership.',
  }
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function ResourcesPage() {
  const downloads = await prisma.download.findMany({
    where: { status: true },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  })

  const categories = [...new Set(downloads.map((d) => d.category).filter(Boolean))] as string[]

  return (
    <>
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-accent-blue)]"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" aria-hidden="true" />
          <span className="font-medium text-[var(--color-text)]" aria-current="page">
            Resources
          </span>
        </div>
      </nav>

      {/* ── Header ── */}
      <section className="bg-[var(--color-surface-secondary)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
            Resources
          </span>
          <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] md:text-5xl lg:text-6xl">
            Whitepapers &amp; Resources
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
            Explore our library of whitepapers, case studies, guides, and datasheets — packed with insights to help you
            navigate enterprise technology transformation.
          </p>
        </div>
      </section>

      {/* ── Resource Cards ── */}
      <ResourcesList downloads={downloads} categories={categories} />
    </>
  )
}
