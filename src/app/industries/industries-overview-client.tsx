'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { resolveIcon } from '@/lib/resolve-icon'

interface MappedIndustry {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  capabilities: string[]
}

interface IndustriesOverviewClientProps {
  industries: MappedIndustry[]
}

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-[var(--color-accent-blue)]"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li>
          <span
            className="font-medium text-[var(--color-text)]"
            aria-current="page"
          >
            Industries
          </span>
        </li>
      </ol>
    </nav>
  )
}

function IndustryCard({ industry, index }: { industry: MappedIndustry; index: number }) {
  const Icon = resolveIcon(industry.icon)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link
        href={`/industries/${industry.slug}`}
        className={cn(
          'group relative flex h-full flex-col rounded-xl border border-[var(--glass-border)]',
          'bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-xl',
          'transition-all duration-300',
          'hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
        )}
      >
        {/* Gradient overlay */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300',
            'bg-gradient-to-br from-[var(--color-accent-blue)]/[0.03] to-[var(--color-accent-cyan)]/[0.03]',
            'group-hover:opacity-100',
          )}
          aria-hidden
        />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Icon */}
          <motion.div
            className={cn(
              'inline-flex h-12 w-12 items-center justify-center rounded-xl',
              'bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-[var(--color-accent-cyan)]/10',
              'transition-colors duration-300',
              'group-hover:from-[var(--color-accent-blue)]/20 group-hover:to-[var(--color-accent-cyan)]/20',
            )}
            whileHover={{ scale: 1.1, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Icon className="h-6 w-6 text-[var(--color-accent-blue)] transition-colors duration-300 group-hover:text-[var(--color-accent-cyan)]" />
          </motion.div>

          {/* Name */}
          <h3 className="font-heading text-lg font-semibold text-[var(--color-text)]">
            {industry.name}
          </h3>

          {/* Description */}
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {industry.description}
          </p>

          {/* Capability badges */}
          <div className="mt-auto flex flex-wrap gap-1.5">
            {industry.capabilities.slice(0, 3).map((cap) => (
              <span
                key={cap}
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium',
                  'bg-[var(--color-surface-secondary)] text-[var(--color-text-tertiary)]',
                  'transition-colors duration-200 group-hover:bg-[var(--color-accent-blue)]/10 group-hover:text-[var(--color-accent-blue)]',
                )}
              >
                {cap}
              </span>
            ))}
            {industry.capabilities.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-[var(--color-surface-secondary)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-text-tertiary)]">
                +{industry.capabilities.length - 3}
              </span>
            )}
          </div>

          {/* View detail arrow */}
          <div className="flex items-center gap-1 text-xs font-medium text-[var(--color-accent-blue)] opacity-0 transition-all duration-300 group-hover:opacity-100">
            View Details
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function IndustriesOverviewClient({
  industries,
}: IndustriesOverviewClientProps) {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
            Industries We Serve
          </span>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
            Enterprise Solutions Across Every Sector
          </h1>
          <p className="max-w-2xl text-lg text-[var(--color-text-secondary)] md:text-xl">
            Deep domain expertise spanning multiple industries — from
            manufacturing and healthcare to telecom and finance — delivering
            tailored technology solutions that address sector-specific
            challenges and regulatory requirements.
          </p>
        </motion.div>

        {/* Industries Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {industries.map((industry, index) => (
            <IndustryCard
              key={industry.id}
              industry={industry}
              index={index}
            />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-10 text-center shadow-sm backdrop-blur-xl md:p-16"
        >
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
            Don&apos;t See Your Industry?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-[var(--color-text-secondary)]">
            Our technology solutions are adaptable across sectors. Contact us to
            discuss how we can address your specific industry challenges.
          </p>
          <Link
            href="/contact"
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold',
              'bg-[var(--color-accent-blue)] text-white shadow-lg shadow-[var(--color-accent-blue)]/20',
              'transition-all duration-300 hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)]',
              'active:scale-[0.97]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
            )}
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
