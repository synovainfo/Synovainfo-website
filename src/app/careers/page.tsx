import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { ChevronRight } from 'lucide-react'
import { CareersList } from './careers-list'

/* ── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findFirst({
    where: { slug: 'careers', status: 'PUBLISHED', deletedAt: null },
    select: { title: true, excerpt: true },
  })

  return {
    title: page?.title ? `${page.title} | Synova Infotech` : 'Careers | Synova Infotech',
    description:
      page?.excerpt ??
      'Join Synova Infotech and build enterprise software solutions. Explore open positions in engineering, design, marketing, and more.',
  }
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function CareersPage() {
  const [careers, page] = await Promise.all([
    prisma.career.findMany({
      where: { status: true, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.page.findFirst({
      where: { slug: 'careers', status: 'PUBLISHED', deletedAt: null },
    }),
  ])

  // Not required — careers can exist without a CMS page entry
  // But if page is missing, we use defaults

  const mapped = careers.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    department: c.department,
    location: c.location,
    type: c.type,
    salaryMin: c.salaryMin,
    salaryMax: c.salaryMax,
  }))

  const departments = [...new Set(mapped.map((c) => c.department).filter(Boolean))] as string[]
  const locations = [...new Set(mapped.map((c) => c.location).filter(Boolean))] as string[]

  const badge = (page?.content as Record<string, string> | null)?.badge ?? 'Join Our Team'
  const title = page?.title ?? 'Careers at Synova'
  const subtitle =
    (page?.content as Record<string, string> | null)?.subtitle ??
    'Build cutting-edge enterprise solutions alongside talented professionals who share your passion for technology and innovation.'

  return (
    <>
      {/* ── Breadcrumb ── */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-accent-blue)]"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" aria-hidden="true" />
          <span className="font-medium text-[var(--color-text)]" aria-current="page">
            Careers
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

        {/* ── Hero Visual ── */}
        <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/5] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-xl sm:aspect-[21/6]">
            <Image
              src="/images/careers/careers-hero.svg"
              alt="Synova careers hero illustration of a team building enterprise software solutions"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1280px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-heading text-3xl font-bold text-[var(--color-accent-blue)]">
              {mapped.length}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Open Positions</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-3xl font-bold text-[var(--color-accent-blue)]">
              {departments.length}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Departments</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-3xl font-bold text-[var(--color-accent-blue)]">
              {locations.length}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Locations</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-3xl font-bold text-[var(--color-accent-blue)]">
              {mapped.filter((c) => c.type === 'REMOTE').length}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Remote Friendly</p>
          </div>
        </div>
      </section>

      {/* ── Team Culture ── */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg sm:aspect-[16/9] lg:aspect-[21/9]">
            <Image
              src="/images/careers/team-collab.webp"
              alt="Synova team members collaborating around a shared workspace"
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1280px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* ── Careers List with Filters ── */}
      <CareersList careers={mapped} departments={departments} locations={locations} />

      {/* ── CTA Section ── */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl">
            Don&apos;t See the Right Fit?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[var(--color-text-secondary)]">
            We&apos;re always looking for talented individuals. Send us your resume and we&apos;ll
            reach out when a matching position opens.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-blue)] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[var(--color-accent-blue)]/20 transition-all duration-300 hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
          >
            Get in Touch
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
