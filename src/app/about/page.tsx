import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { AboutStats } from './about-stats'
import {
  GlobalReachSection,
  HeroVisual,
  HqPhoto,
  JourneySection,
  LeadershipSection,
  MissionVisual,
  TeamOfficeBand,
  ValuesVisuals,
} from './about-visuals'
import { ValueCard } from '@/components/ui/value-card'
import {
  Lightbulb,
  Award,
  Handshake,
  ShieldCheck,
  Target,
  Eye,
  ChevronRight,
  Building2,
  MapPin,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Types ─────────────────────────────────────────────────────── */

interface AboutContent {
  whoWeAre?: string
  vision?: string
  mission?: string
  incorporated?: string
  headquarters?: string
  directors?: string
  badge?: string
  title?: string
  subtitle?: string
  values?: Array<{
    icon: string
    title: string
    description: string
  }>
}

/* ── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findFirst({
    where: { slug: 'about', status: 'PUBLISHED', deletedAt: null },
    select: { title: true, excerpt: true },
  })

  return {
    title: page?.title ? `${page.title} | Synova Infotech` : 'About Us | Synova Infotech',
    description:
      page?.excerpt ??
      'Learn about Synova Infotech — our story, vision, mission, and the team behind enterprise technology excellence.',
  }
}

/* ── Default content fallback ──────────────────────────────────── */

const DEFAULT_CONTENT: AboutContent = {
  badge: 'About Synova Infotech',
  title: 'Engineering Enterprise Technology',
  subtitle:
    'We are a team of architects, engineers, and problem-solvers dedicated to building technology that powers business transformation.',
  whoWeAre:
    'Synova Infotech is a Pune-based enterprise technology company specializing in digital transformation, custom software development, and AI-driven solutions. Founded by industry professionals with deep expertise in enterprise architecture, our team brings together decades of collective experience across Fortune 500 environments.',
  vision:
    'To be the most trusted technology partner for enterprises seeking digital transformation — delivering solutions that create measurable business impact.',
  mission:
    'Empower organizations with enterprise-grade software solutions that combine cutting-edge technology with robust architecture, enabling them to achieve operational excellence and sustainable growth.',
  incorporated: '30 June 2026',
  headquarters: 'Pune, India',
  directors: 'Amir Khaja Baig · Tazeen Shahnawaz Shaikh · Sachin Nikam' ,
  values: [
    {
      icon: 'Lightbulb',
      title: 'Innovation',
      description:
        "Pioneering solutions that anticipate tomorrow's challenges and unlock new possibilities for enterprise growth.",
    },
    {
      icon: 'Award',
      title: 'Excellence',
      description:
        'Uncompromising quality in every line of code, every architecture decision, and every client interaction.',
    },
    {
      icon: 'Handshake',
      title: 'Partnership',
      description:
        'Deep collaboration that transforms vendor relationships into strategic alliances built on trust and shared success.',
    },
    {
      icon: 'ShieldCheck',
      title: 'Integrity',
      description:
        'Transparent communication, ethical practices, and unwavering commitment to client confidentiality.',
    },
  ],
}

/* ── Value icon resolver (lightweight, no 'use client') ────────── */

const VALUE_ICONS: Record<string, typeof Lightbulb> = {
  Lightbulb,
  Award,
  Handshake,
  ShieldCheck,
  Target,
  Eye,
  Users,
  Building2,
  MapPin,
}

function resolveValueIcon(name: string) {
  return VALUE_ICONS[name] ?? Lightbulb
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function AboutPage() {
  const [page, stats] = await Promise.all([
    prisma.page.findFirst({
      where: { slug: 'about', status: 'PUBLISHED', deletedAt: null },
    }),
    prisma.statistic.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    }),
  ])



  const content: AboutContent = page?.content
    ? { ...DEFAULT_CONTENT, ...(page.content as Record<string, unknown>) }
    : DEFAULT_CONTENT

  const values = content.values ?? DEFAULT_CONTENT.values ?? []

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
            About
          </span>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-[var(--color-surface-secondary)] py-20 md:py-28">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[var(--color-accent-blue)] opacity-[0.03] blur-3xl" />
          <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[var(--color-accent-cyan)] opacity-[0.03] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: content */}
            <div>
              {content.badge && (
                <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
                  {content.badge}
                </span>
              )}
              <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] md:text-5xl lg:text-6xl">
                {content.title}
              </h1>
              {content.subtitle && (
                <p className="max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
                  {content.subtitle}
                </p>
              )}
            </div>

            {/* Right: hero visual */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-lg">
                <HeroVisual />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3">
              <h2 className="mb-6 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl">
                Who We Are
              </h2>
              <p className="mb-8 text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
                {content.whoWeAre}
              </p>

              {/* Company details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    Incorporated
                  </span>
                  <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                    {content.incorporated}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    Headquarters
                  </span>
                  <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                    {content.headquarters}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Directors
                    </span>
                    <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                      {content.directors}
                    </p>
                  </div>
                </div>
              </div>

              {/* Headquarters photo */}
              <div className="mt-10">
                <HqPhoto />
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="space-y-8 lg:col-span-2">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-accent-blue)]/[0.02] p-6 md:p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-blue)]/10">
                  <Eye className="h-6 w-6 text-[var(--color-accent-blue)]" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-[var(--color-text)]">
                  Our Vision
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
                  {content.vision}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-accent-emerald)]/[0.02] p-6 md:p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-emerald)]/10">
                  <Target className="h-6 w-6 text-[var(--color-accent-emerald)]" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-[var(--color-text)]">
                  Our Mission
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
                  {content.mission}
                </p>
                <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)]">
                  <MissionVisual />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Inside Synova ── */}
      <TeamOfficeBand />

      {/* ── Our Journey ── */}
      <JourneySection />

      {/* ── Leadership ── */}
      <LeadershipSection />

      {/* ── Global Presence ── */}
      <GlobalReachSection />

      {/* ── Core Values ── */}
      {values.length > 0 && (
        <section className="bg-[var(--color-primary)] py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center md:mb-16">
              <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80">
                Our Values
              </span>
              <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                What Drives Us
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl">
                The principles that guide every engagement, every architecture decision, and every line of code we
                deliver.
              </p>
            </div>

            <ValuesVisuals />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => {
                const Icon = resolveValueIcon(value.icon ?? 'Lightbulb')
                return (
                  <ValueCard
                    key={value.title}
                    icon={<Icon className="h-6 w-6" />}
                    title={value.title}
                    description={value.description}
                    index={index}
                  />
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Statistics ── */}
      {stats.length > 0 && (
        <section className="relative overflow-hidden bg-[var(--color-primary)] py-20 md:py-28">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -left-1/4 -top-1/4 h-[60vh] w-[60vw] animate-pulse rounded-full opacity-[0.04] blur-3xl"
              style={{ backgroundColor: 'var(--color-accent-blue)' }} />
            <div className="absolute -bottom-1/4 -right-1/4 h-[50vh] w-[50vw] animate-pulse rounded-full opacity-[0.03] blur-3xl"
              style={{ backgroundColor: 'var(--color-accent-emerald)' }} />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center md:mb-16">
              <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80">
                By the Numbers
              </span>
              <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                Delivering Enterprise Excellence
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl">
                Our track record speaks through the metrics that matter — measuring impact across projects, clients, and
                geographies.
              </p>
            </div>

            <AboutStats stats={stats} />
          </div>
        </section>
      )}

      {/* ── CTA Section ── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl">
            Let&apos;s Build Something Extraordinary
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[var(--color-text-secondary)]">
            Partner with Synova Infotech and transform your enterprise with technology that delivers measurable results.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--color-accent-blue)] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[var(--color-accent-blue)]/20 transition-all duration-300 hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  )
}
