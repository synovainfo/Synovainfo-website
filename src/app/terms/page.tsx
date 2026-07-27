import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { renderPageContent } from '@/lib/render-page-content'
import { ChevronRight, Calendar } from 'lucide-react'

/* ── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findFirst({
    where: {
      OR: [{ template: 'terms' }, { slug: 'terms' }],
      status: 'PUBLISHED',
      deletedAt: null,
    },
    select: { title: true, excerpt: true },
  })

  return {
    title: page?.title ? `${page.title} | Synova Infotech` : 'Terms of Service | Synova Infotech',
    description:
      page?.excerpt ??
      'Synova Infotech\'s terms of service govern the use of our website, products, and services.',
  }
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function TermsPage() {
  const page = await prisma.page.findFirst({
    where: {
      OR: [{ template: 'terms' }, { slug: 'terms' }],
      status: 'PUBLISHED',
      deletedAt: null,
    },
  })

  if (!page) {
    notFound()
  }

  const bodyHtml = renderPageContent(page)

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
            Terms of Service
          </span>
        </div>
      </nav>

      {/* ── Content ── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] md:text-5xl">
            {page.title}
          </h1>

          {/* Last updated */}
          <div className="mb-8 flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>
              Last updated:{' '}
              {new Date(page.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <hr className="mb-8 border-[var(--color-border)]" />

          {/* Body */}
          {bodyHtml ? (
            <div
              className="prose prose-gray max-w-none [&_h1]:font-heading [&_h2]:font-heading [&_h3]:font-heading [&_h2]:mt-10 [&_h3]:mt-6 [&_p]:text-[var(--color-text-secondary)] [&_li]:text-[var(--color-text-secondary)] [&_strong]:text-[var(--color-text)]"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : (
            <p className="text-[var(--color-text-secondary)]">
              Content is being updated. Please check back later.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
