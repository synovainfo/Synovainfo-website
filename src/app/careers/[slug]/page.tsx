import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  MapPin,
  Briefcase,
  Banknote,
  Building2,
  Wifi,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react'
import type { CareerType } from '@/generated/prisma/enums'

/* ── Types ─────────────────────────────────────────────────────── */

interface CareerDetail {
  id: string
  title: string
  slug: string
  department: string | null
  location: string | null
  type: CareerType
  description: string | null
  requirements: unknown
  benefits: unknown
  salaryMin: number | null
  salaryMax: number | null
  createdAt: Date
}

/* ── Helpers ────────────────────────────────────────────────────── */

function formatSalary(min: number | null, max: number | null): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n)

  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  if (max) return `Up to ${fmt(max)}`
  return ''
}

function formatType(type: CareerType): string {
  const map: Record<string, string> = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
    REMOTE: 'Remote',
  }
  return map[type] ?? type
}

const typeStyles: Record<string, string> = {
  FULL_TIME: 'bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)]',
  PART_TIME: 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]',
  CONTRACT: 'bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple)]',
  REMOTE: 'bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]',
}

function getDepartmentColor(dept: string | null): string {
  const colors: Record<string, string> = {
    Engineering: 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]',
    Design: 'bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple)]',
    Marketing: 'bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)]',
    Sales: 'bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]',
  }
  return colors[dept ?? ''] ?? 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]'
}

/**
 * Parse requirements JSON field.
 * Supports both:
 *   - Array: ["req1", "req2"]  → requirements
 *   - Object: { requirements: string[], responsibilities: string[] }
 */
function parseRequirements(raw: unknown): {
  requirements: string[]
  responsibilities: string[]
} {
  if (!raw) return { requirements: [], responsibilities: [] }

  if (Array.isArray(raw)) {
    return {
      requirements: raw.filter((r): r is string => typeof r === 'string'),
      responsibilities: [],
    }
  }

  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>
    const reqs = Array.isArray(obj.requirements)
      ? obj.requirements.filter((r): r is string => typeof r === 'string')
      : Array.isArray(obj.reqs)
        ? obj.reqs.filter((r): r is string => typeof r === 'string')
        : []
    const resps = Array.isArray(obj.responsibilities)
      ? obj.responsibilities.filter((r): r is string => typeof r === 'string')
      : []
    return { requirements: reqs, responsibilities: resps }
  }

  return { requirements: [], responsibilities: [] }
}

function parseBenefits(raw: unknown): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.filter((b): b is string => typeof b === 'string')
  return []
}

/* ── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const career = await prisma.career.findUnique({
    where: { slug, status: true, deletedAt: null },
    select: { title: true, department: true, description: true },
  })

  if (!career) return {}

  return {
    title: `${career.title} | Careers | Synova Infotech`,
    description:
      career.description?.slice(0, 160) ??
      `Join Synova Infotech as a ${career.title} in ${career.department ?? 'our team'}. Apply today.`,
    openGraph: {
      title: `${career.title} — Synova Infotech Careers`,
      description: career.description?.slice(0, 200) ?? '',
      type: 'article',
    },
  }
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const career = (await prisma.career.findUnique({
    where: { slug, status: true, deletedAt: null },
  })) as CareerDetail | null

  if (!career) {
    notFound()
  }

  // Parse JSON fields
  const { requirements, responsibilities } = parseRequirements(career.requirements)
  const benefits = parseBenefits(career.benefits)
  const salaryText = formatSalary(career.salaryMin, career.salaryMax)

  // Similar jobs (same department, exclude current)
  const similarJobs = (await prisma.career.findMany({
    where: {
      status: true,
      deletedAt: null,
      department: career.department,
      id: { not: career.id },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: { id: true, title: true, slug: true, department: true, location: true, type: true },
  })) as Array<{
    id: string
    title: string
    slug: string
    department: string | null
    location: string | null
    type: CareerType
  }>

  /* ── JSON-LD JobPosting Schema ── */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: career.title,
    description: career.description ?? '',
    datePosted: career.createdAt.toISOString(),
    ...(career.salaryMin &&
      career.salaryMax && {
        baseSalary: {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: {
            '@type': 'QuantitativeValue',
            minValue: career.salaryMin,
            maxValue: career.salaryMax,
            unitText: 'YEAR',
          },
        },
      }),
    ...(career.department && { occupationalCategory: career.department }),
    ...(career.location && {
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: career.location,
        },
      },
    }),
    employmentType: formatType(career.type),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Synova Infotech',
      sameAs: 'https://synovainfotech.com',
    },
    ...(career.type === 'REMOTE' && { jobLocationType: 'TELECOMMUTE' }),
  }

  return (
    <>
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
          <Link
            href="/careers"
            className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-accent-blue)]"
          >
            Careers
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" aria-hidden="true" />
          <span className="truncate font-medium text-[var(--color-text)]" aria-current="page">
            {career.title}
          </span>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-surface-secondary)] via-transparent to-[var(--color-accent-blue)]/[0.02] py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[var(--color-accent-blue)] opacity-[0.04] blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[var(--color-accent-cyan)] opacity-[0.03] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Badges Row */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {career.department && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider',
                  getDepartmentColor(career.department),
                )}
              >
                <Building2 className="h-3.5 w-3.5" />
                {career.department}
              </span>
            )}
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider',
                typeStyles[career.type] ?? typeStyles.FULL_TIME,
              )}
            >
              <Briefcase className="h-3.5 w-3.5" />
              {formatType(career.type)}
            </span>
            {career.type === 'REMOTE' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-cyan)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-cyan)]">
                <Wifi className="h-3.5 w-3.5" />
                Remote
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mb-6 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
            {career.title}
          </h1>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[var(--color-text-secondary)]">
            {career.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {career.location}
              </span>
            )}
            {salaryText && (
              <span className="inline-flex items-center gap-2 font-medium text-[var(--color-accent-emerald)]">
                <Banknote className="h-4 w-4" />
                {salaryText}
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Posted {new Date(career.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Apply CTA */}
          <div className="mt-8">
            <Link
              href={`/contact?position=${encodeURIComponent(career.title)}`}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-blue)] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[var(--color-accent-blue)]/20 transition-all duration-300 hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
            >
              Apply Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ── Description ── */}
        {career.description && (
          <section className="mb-12">
            <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)]">
              About This Role
            </h2>
            <div className="prose prose-gray max-w-none text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
              {career.description.split('\n').map((paragraph, i) =>
                paragraph.trim() ? (
                  <p key={i} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ) : null,
              )}
            </div>
          </section>
        )}

        {/* ── Responsibilities ── */}
        {responsibilities.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)]">
              Responsibilities
            </h2>
            <ul className="space-y-3">
              {responsibilities.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-blue)]" />
                  <span className="text-[var(--color-text-secondary)]">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Requirements ── */}
        {requirements.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)]">
              Requirements
            </h2>
            <ul className="space-y-3">
              {requirements.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-emerald)]" />
                  <span className="text-[var(--color-text-secondary)]">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Benefits ── */}
        {benefits.length > 0 && (
          <section className="mb-12">
            <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-xl md:p-8">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent-emerald)]/10 to-[var(--color-accent-cyan)]/10">
                <Sparkles className="h-6 w-6 text-[var(--color-accent-emerald)]" />
              </div>
              <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)]">
                Benefits & Perks
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-emerald)]" />
                    <span className="text-sm text-[var(--color-text-secondary)] md:text-base">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Apply CTA ── */}
        <section className="mb-16 rounded-xl border border-[var(--glass-border)] bg-gradient-to-br from-[var(--color-accent-blue)]/[0.03] to-[var(--color-accent-cyan)]/[0.03] p-8 text-center md:p-12">
          <h2 className="mb-4 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Ready to Apply?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-[var(--color-text-secondary)]">
            If you&apos;re passionate about technology and want to make an impact, we&apos;d love to
            hear from you. Submit your application and we&apos;ll be in touch.
          </p>
          <Link
            href={`/contact?position=${encodeURIComponent(career.title)}`}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-blue)] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[var(--color-accent-blue)]/20 transition-all duration-300 hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
          >
            Apply Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </section>

        {/* ── Similar Jobs ── */}
        {similarJobs.length > 0 && (
          <section>
            <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)]">
              Similar Openings
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similarJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/careers/${job.slug}`}
                  className={cn(
                    'group rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 shadow-sm backdrop-blur-xl',
                    'transition-all duration-300 hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
                  )}
                >
                  <h3 className="mb-2 font-heading text-base font-semibold text-[var(--color-text)] transition-colors duration-200 group-hover:text-[var(--color-accent-blue)]">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                    {job.department && (
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {job.department}
                      </span>
                    )}
                    {job.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                    )}
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                        typeStyles[job.type] ?? typeStyles.FULL_TIME,
                      )}
                    >
                      {formatType(job.type)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
