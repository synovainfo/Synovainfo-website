import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { FAQList } from './faq-list'
import { ChevronRight } from 'lucide-react'

/* ── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findFirst({
    where: { slug: 'faq', status: 'PUBLISHED', deletedAt: null },
    select: { title: true, excerpt: true },
  })

  return {
    title: page?.title ? `${page.title} | Synova Infotech` : 'FAQ | Synova Infotech',
    description:
      page?.excerpt ??
      'Find answers to frequently asked questions about Synova Infotech — our services, process, technology expertise, and enterprise solutions.',
  }
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function FAQPage() {
  const [faqs, categories] = await Promise.all([
    prisma.fAQ.findMany({
      where: { status: true },
      include: { category: true },
      orderBy: { order: 'asc' },
    }),
    prisma.fAQCategory.findMany({
      where: { faqs: { some: { status: true } } },
      orderBy: { order: 'asc' },
    }),
  ])

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
            FAQ
          </span>
        </div>
      </nav>

      {/* ── Header ── */}
      <section className="bg-[var(--color-surface-secondary)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
            FAQ
          </span>
          <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] md:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
            Everything you need to know about our services, process, and solutions. Can&apos;t find what you&apos;re
            looking for?{' '}
            <Link
              href="/contact"
              className="font-medium text-[var(--color-accent-blue)] underline-offset-2 hover:underline"
            >
              Contact us
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── FAQ List ── */}
      <FAQList faqs={faqs} categories={categories} />
    </>
  )
}
