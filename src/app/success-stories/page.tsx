import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Testimonials } from '@/components/sections/testimonials'
import { Clients } from '@/components/sections/clients'
import { V2CaseStudyEditorial, V2Cta } from '@/components/v2/enterprise-visuals'

export const metadata: Metadata = {
  title: 'Success Stories | Synova Infotech',
  description: 'Explore our client success stories, testimonials, and case studies driving digital transformation.',
}

export default function SuccessStoriesPage() {
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
            Success Stories
          </span>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-[var(--color-surface-secondary)] py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[var(--color-accent-blue)] opacity-[0.03] blur-3xl" />
          <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[var(--color-accent-emerald)] opacity-[0.03] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
            Client Impact
          </span>
          <h1 className="mb-6 font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] md:text-5xl lg:text-6xl">
            Success Stories
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
            See how we have partnered with industry leaders to overcome complex challenges, modernize systems, and deliver sustainable value.
          </p>
        </div>
      </section>

      {/* ── Core Sections ── */}
      <div className="flex flex-col w-full overflow-x-hidden">
        <Clients />
        <V2CaseStudyEditorial />
        <Testimonials />
        <V2Cta />
      </div>
    </>
  )
}
