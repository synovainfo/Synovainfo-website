import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { resolveIcon } from '@/lib/resolve-icon'
import { cn } from '@/lib/utils'
import { ArrowRight, CheckCircle2, Shield, FileQuestion, Lightbulb, FolderOpen, AlertTriangle, Lock } from 'lucide-react'

/* ── Types ─────────────────────────────────────────────────────── */

interface ServicePageData {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  fullDescription: string | null
  icon: string | null
  category: string | null
  benefits: unknown
  businessOutcomes: unknown
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  technologies: Array<{
    technology: {
      id: string
      name: string
      slug: string
      icon: string | null
    }
  }>
  industries: Array<{
    industry: {
      id: string
      name: string
      slug: string
      icon: string | null
    }
  }>
}



/* ── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params

  const service = await prisma.service.findUnique({
    where: { slug, status: true },
    select: {
      title: true,
      shortDescription: true,
      seoTitle: true,
      seoDescription: true,
      seoKeywords: true,
    },
  })

  if (!service) return {}

  return {
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.shortDescription ?? '',
    keywords: service.seoKeywords?.split(',').map((k) => k.trim()) ?? [],
  }
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const service = await prisma.service.findUnique({
    where: { slug, status: true },
    include: {
      technologies: {
        include: { technology: true },
      },
      industries: {
        include: { industry: true },
      },
    },
  }) as ServicePageData | null

  if (!service) {
    notFound()
  }

  const Icon = resolveIcon(service.icon)
  const benefits = (service.benefits as string[]) ?? []
  const outcomes = (service.businessOutcomes as string[]) ?? []
  const relatedTechnologies = service.technologies.map((st) => st.technology)
  const relatedIndustries = service.industries.map((si) => si.industry)

  const businessProblems: string[] = []
  const solutionArchitecture = ''
  const keyFeatures: Array<{ title: string; description: string }> = []
  const securityCompliance: string[] = []
  const faqs: Array<{ question: string; answer: string }> = []
  const relatedCaseStudies: any[] = []

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-surface-secondary)] via-transparent to-[var(--color-accent-blue)]/[0.02] py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[var(--color-accent-blue)] opacity-[0.04] blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[var(--color-accent-cyan)] opacity-[0.03] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Icon and Category */}
          <div className="mb-6 flex items-center gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-[var(--color-accent-cyan)]/10">
              <Icon className="h-7 w-7 text-[var(--color-accent-blue)]" />
            </div>
            {service.category && (
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider',
                  categoryStyles[service.category] ?? 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]',
                )}
              >
                {service.category}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mb-6 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
            {service.title}
          </h1>

          {/* Short Description */}
          {service.shortDescription && (
            <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
              {service.shortDescription}
            </p>
          )}
        </div>
      </section>

      {/* ── Full Description ── */}
      {service.fullDescription && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
              Overview
            </h2>
            <div className="prose prose-gray max-w-none text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
              {service.fullDescription.split('\n').map((paragraph, i) => (
                paragraph.trim() ? (
                  <p key={i} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ) : null
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Business Problems ── */}
      {businessProblems.length > 0 && (
        <section className="bg-[var(--color-surface-secondary)] py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-red)]/10">
                <AlertTriangle className="h-5 w-5 text-[var(--color-accent-red)]" />
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
                Business Problems We Solve
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {businessProblems.map((problem, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-red)]" />
                  <span className="text-sm text-[var(--color-text-secondary)] md:text-base">
                    {problem}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Solution Architecture ── */}
      {solutionArchitecture && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-blue)]/10">
                <FolderOpen className="h-5 w-5 text-[var(--color-accent-blue)]" />
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
                Solution Architecture
              </h2>
            </div>
            <div className="prose prose-gray max-w-none text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
              <p>{solutionArchitecture}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Key Features ── */}
      {keyFeatures.length > 0 && (
        <section className="bg-[var(--color-surface-secondary)] py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-emerald)]/10">
                <Lightbulb className="h-5 w-5 text-[var(--color-accent-emerald)]" />
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
                Key Features
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {keyFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-emerald)]" />
                  <div>
                    <span className="block text-sm font-semibold text-[var(--color-text)]">
                      {feature.title}
                    </span>
                    <span className="block text-sm text-[var(--color-text-secondary)]">
                      {feature.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Benefits ── */}
      {benefits.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
              Key Benefits
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-emerald)]" />
                  <span className="text-sm text-[var(--color-text-secondary)] md:text-base">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Business Outcomes ── */}
      {outcomes.length > 0 && (
        <section className="bg-[var(--color-surface-secondary)] py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
              Business Outcomes
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {outcomes.map((outcome, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-blue)]" />
                  <span className="text-sm text-[var(--color-text-secondary)] md:text-base">
                    {outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Security & Compliance ── */}
      {securityCompliance.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-purple)]/10">
                <Lock className="h-5 w-5 text-[var(--color-accent-purple)]" />
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
                Security & Compliance
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {securityCompliance.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-purple)]" />
                  <span className="text-sm text-[var(--color-text-secondary)] md:text-base">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {faqs.length > 0 && (
        <section className="bg-[var(--color-surface-secondary)] py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-cyan)]/10">
                <FileQuestion className="h-5 w-5 text-[var(--color-accent-cyan)]" />
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-[var(--color-text)] md:text-base">
                    {faq.question}
                    <svg
                      className="h-5 w-5 shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related Technologies ── */}
      {relatedTechnologies.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
              Technologies We Use
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedTechnologies.map((tech) => {
                const TechIcon = resolveIcon(tech.icon)
                return (
                  <span
                    key={tech.id}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] shadow-sm backdrop-blur-xl transition-colors duration-300 hover:border-[var(--color-accent-blue)]/30 hover:shadow-md"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent-blue)]/10">
                      <TechIcon className="h-3.5 w-3.5 text-[var(--color-accent-blue)]" />
                    </span>
                    {tech.name}
                  </span>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Related Industries ── */}
      {relatedIndustries.length > 0 && (
        <section className="bg-[var(--color-surface-secondary)] py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
              Industries We Serve
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedIndustries.map((ind) => {
                const IndIcon = resolveIcon(ind.icon)
                return (
                  <Link
                    key={ind.id}
                    href={`/industries/${ind.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] shadow-sm backdrop-blur-xl transition-colors duration-300 hover:border-[var(--color-accent-blue)]/30 hover:shadow-md"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent-blue)]/10">
                      <IndIcon className="h-3.5 w-3.5 text-[var(--color-accent-blue)]" />
                    </span>
                    {ind.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Related Case Studies ── */}
      {relatedCaseStudies.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
              Related Case Studies
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCaseStudies.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/case-studies/${cs.id}`}
                  className="group flex flex-col rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-[var(--color-accent-blue)]/30 hover:shadow-md"
                >
                  <span className="mb-3 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent-blue)]">
                    {cs.industry}
                  </span>
                  <h3 className="font-heading text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent-blue)] transition-colors">
                    {cs.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {cs.overview}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
                    <span>{cs.timeline}</span>
                    <span className="flex items-center gap-1">
                      {cs.results.map((r: { value: string }) => r.value).join(' · ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Section ── */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[var(--color-text-secondary)]">
            Let&apos;s discuss how {service.title} can transform your business. Our team is ready to understand your
            requirements and propose a tailored solution.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-blue)] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[var(--color-accent-blue)]/20 transition-all duration-300 hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
          >
            Contact Us
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  )
}

/* ── Category Styles ──────────────────────────────────────────── */

const categoryStyles: Record<string, string> = {
  development: 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]',
  management: 'bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple)]',
  solutions: 'bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)]',
  support: 'bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]',
}
