import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ServicesList } from './services-list'
import { ChevronRight } from 'lucide-react'

/* ── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findFirst({
    where: { slug: 'services', status: 'PUBLISHED', deletedAt: null },
    select: { title: true, excerpt: true },
  })

  return {
    title: page?.title ? `${page.title} | Synova Infotech` : 'Our Services | Synova Infotech',
    description:
      page?.excerpt ??
      'Explore Synova Infotech\'s enterprise services — custom software development, cloud solutions, AI/ML, cybersecurity, and digital transformation.',
  }
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function ServicesPage() {
  const [services, page] = await Promise.all([
    prisma.service.findMany({
      where: { status: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.page.findFirst({
      where: { slug: 'services', status: 'PUBLISHED', deletedAt: null },
    }),
  ])



  const mappedServices = services.map((s) => ({
    id: s.id,
    title: s.title,
    shortDescription: s.shortDescription ?? '',
    fullDescription: s.fullDescription ?? '',
    icon: s.icon ?? 'Code2',
    category: (s.category ?? 'development') as 'development' | 'management' | 'solutions' | 'support',
    technologies: [] as string[],
    industries: [] as string[],
    benefits: (s.benefits as string[]) ?? [],
    businessOutcomes: (s.businessOutcomes as string[]) ?? [],
  }))

  const categories = [...new Set(mappedServices.map((s) => s.category))] as string[]

  const badge = (page?.content as Record<string, string> | null)?.badge ?? 'What We Do'
  const title = page?.title ?? 'Enterprise Services'
  const subtitle =
    (page?.content as Record<string, string> | null)?.subtitle ??
    'Seventeen specialized capabilities engineered to transform your business — from custom software and mobile apps to AI-driven procurement and immersive VR training.'

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
            Services
          </span>
        </div>
      </nav>

      {/* ── Header ── */}
      <section className="bg-[var(--color-surface-secondary)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          {badge && (
            <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
              {badge}
            </span>
          )}
          <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
              {subtitle}
            </p>
          )}
        </div>
      </section>

      {/* ── Services Grid with Filter ── */}
      <ServicesList services={mappedServices} categories={categories} />
    </>
  )
}
