'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlobalPresencePanel } from './global-presence-panel'
import { IndustryCard, type MappedIndustry } from './industry-card'

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

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 md:mb-16"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg md:aspect-[21/10]">
            <Image
              src="/images/industries/industries-hero.svg"
              alt="Enterprise technology solutions spanning manufacturing, healthcare, finance, and more"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1280px"
              className="object-cover object-center"
            />
          </div>
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

        {/* Global Presence */}
        <GlobalPresencePanel />

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
