'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { resolveIcon } from '@/lib/resolve-icon'

interface MappedService {
  id: string
  title: string
  slug: string
  shortDescription: string
  icon: string
}

interface MappedIndustryDetail {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  capabilities: string[]
  services: MappedService[]
}

interface IndustryDetailClientProps {
  industry: MappedIndustryDetail
}

function Breadcrumb({ industryName }: { industryName: string }) {
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
          <Link
            href="/industries"
            className="transition-colors hover:text-[var(--color-accent-blue)]"
          >
            Industries
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
            {industryName}
          </span>
        </li>
      </ol>
    </nav>
  )
}

function HeroSection({ industry }: { industry: MappedIndustryDetail }) {
  const Icon = resolveIcon(industry.icon)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      <Breadcrumb industryName={industry.name} />

      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            'flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl',
            'bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-[var(--color-accent-cyan)]/10',
            'shadow-lg shadow-[var(--color-accent-blue)]/5',
          )}
        >
          <Icon className="h-10 w-10 text-[var(--color-accent-blue)]" />
        </motion.div>

        {/* Text */}
        <div>
          <span className="mb-3 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
            Industry
          </span>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
            {industry.name}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
            {industry.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function CapabilitiesSection({
  capabilities,
}: {
  capabilities: string[]
}) {
  if (capabilities.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
        Our Capabilities
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((cap, index) => (
          <motion.div
            key={cap}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className={cn(
              'flex items-start gap-3 rounded-xl border border-[var(--glass-border)]',
              'bg-[var(--glass-bg)] p-4 shadow-sm backdrop-blur-xl',
              'transition-all duration-300 hover:border-[var(--color-accent-blue)]/20',
            )}
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-emerald)]" />
            <span className="text-sm font-medium text-[var(--color-text)]">
              {cap}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

function RelatedServicesSection({
  services,
}: {
  services: MappedService[]
}) {
  if (services.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
        Related Services
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const ServiceIcon = resolveIcon(service.icon)

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Link
                href={`/services/${service.slug}`}
                className={cn(
                  'group relative flex h-full flex-col rounded-xl border border-[var(--glass-border)]',
                  'bg-[var(--glass-bg)] p-5 shadow-sm backdrop-blur-xl',
                  'transition-all duration-300',
                  'hover:border-[var(--color-accent-blue)]/30 hover:shadow-md',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
                )}
              >
                <div
                  className={cn(
                    'pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300',
                    'bg-gradient-to-br from-[var(--color-accent-blue)]/[0.03] to-[var(--color-accent-cyan)]/[0.03]',
                    'group-hover:opacity-100',
                  )}
                  aria-hidden
                />

                <div className="relative z-10 flex flex-col gap-3">
                  <div
                    className={cn(
                      'inline-flex h-10 w-10 items-center justify-center rounded-lg',
                      'bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-[var(--color-accent-cyan)]/10',
                    )}
                  >
                    <ServiceIcon className="h-5 w-5 text-[var(--color-accent-blue)]" />
                  </div>

                  <h3 className="font-heading text-base font-semibold text-[var(--color-text)]">
                    {service.title}
                  </h3>

                  <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {service.shortDescription}
                  </p>

                  <span className="mt-auto flex items-center gap-1 text-xs font-medium text-[var(--color-accent-blue)] opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Learn More
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}

function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-[var(--glass-border)]',
          'bg-gradient-to-br from-[var(--color-accent-blue)]/[0.04] to-[var(--color-accent-cyan)]/[0.04]',
          'p-10 shadow-sm backdrop-blur-xl md:p-16',
        )}
      >
        {/* Decorative icon */}
        <div
          className="pointer-events-none absolute -bottom-8 -right-8 opacity-[0.04]"
          aria-hidden
        >
          <Building2 className="h-48 w-48" />
        </div>

        <div className="relative z-10 text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
            Ready to Transform Your Industry?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-[var(--color-text-secondary)]">
            Let&apos;s discuss how Synova Infotech can help your organisation
            leverage technology to overcome sector-specific challenges and
            achieve measurable results.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/industries"
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-7 py-3.5 text-sm font-semibold',
                'text-[var(--color-text)] transition-all duration-300',
                'hover:border-[var(--color-accent-blue)]/30 hover:bg-[var(--color-accent-blue)]/[0.04]',
                'active:scale-[0.97]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
              )}
            >
              Browse All Industries
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export function IndustryDetailClient({
  industry,
}: IndustryDetailClientProps) {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <HeroSection industry={industry} />

        {/* Divider */}
        <div className="mb-16 border-t border-[var(--color-border)]" />

        {/* Capabilities */}
        <CapabilitiesSection capabilities={industry.capabilities} />

        {/* Related Services */}
        <RelatedServicesSection services={industry.services} />

        {/* CTA */}
        <CTASection />
      </div>
    </section>
  )
}
