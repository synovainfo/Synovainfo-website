'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import type { CaseStudyPageData } from './page'

interface CaseStudiesClientProps {
  caseStudies: CaseStudyPageData[]
  industries: string[]
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function CaseStudiesClient({ caseStudies, industries }: CaseStudiesClientProps) {
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    return caseStudies.filter((cs) => {
      const content = cs.content as Record<string, unknown> | null
      const industry = (content?.industry as string | undefined) ?? ''
      const title = cs.title.toLowerCase()
      const excerpt = (cs.excerpt ?? '').toLowerCase()
      const q = searchQuery.toLowerCase()

      const matchesIndustry = !activeIndustry || industry === activeIndustry
      const matchesSearch =
        !searchQuery ||
        title.includes(q) ||
        excerpt.includes(q)

      return matchesIndustry && matchesSearch
    })
  }, [caseStudies, activeIndustry, searchQuery])

  return (
    <>
      {/* Header */}
      <section className="bg-[var(--color-primary)] pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)] mb-4">
              Our Work
            </span>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-[var(--color-text)] md:text-5xl lg:text-6xl">
              Case Studies
            </h1>
            <p className="text-lg leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
              Real-world engineering challenges we&apos;ve solved for enterprises across
              industries. Each case study details the architecture, approach, and
              measurable business impact.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Industry pills */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by industry">
              <button
                onClick={() => setActiveIndustry(null)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
                  !activeIndustry
                    ? 'bg-[var(--color-accent-blue)] text-white shadow-sm'
                    : 'bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-blue)]/10',
                )}
              >
                All
              </button>
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setActiveIndustry(ind === activeIndustry ? null : ind)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
                    activeIndustry === ind
                      ? 'bg-[var(--color-accent-blue)] text-white shadow-sm'
                      : 'bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-blue)]/10',
                  )}
                >
                  {ind}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case studies..."
                aria-label="Search case studies"
                className={cn(
                  'w-full rounded-xl border border-[var(--color-border)] py-2.5 pl-10 pr-10 text-sm',
                  'bg-[var(--color-surface-secondary)] text-[var(--color-text)]',
                  'placeholder:text-[var(--color-text-tertiary)]',
                  'focus:border-[var(--color-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-blue)]',
                  'sm:w-72',
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-[var(--color-surface)] pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-4 rounded-full bg-[var(--color-surface-tertiary)] p-4">
                <Search className="h-8 w-8 text-[var(--color-text-tertiary)]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[var(--color-text)]">
                No case studies found
              </h3>
              <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setActiveIndustry(null)
                  setSearchQuery('')
                }}
                className="rounded-xl bg-[var(--color-accent-blue)] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((cs) => {
                const content = cs.content as Record<string, unknown> | null
                const industry = (content?.industry as string) ?? 'Technology'
                const technologies = (content?.technologies as string[]) ?? []
                const results = (content?.results as { metric: string; value: string }[]) ?? []

                return (
                  <motion.div key={cs.id} variants={cardVariants}>
                    <Link
                      href={`/case-studies/${cs.slug}`}
                      className={cn(
                        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--glass-border)]',
                        'bg-[var(--glass-bg)] shadow-sm backdrop-blur-xl',
                        'transition-all duration-300',
                        'hover:shadow-xl hover:border-[var(--color-accent-blue)]/20',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
                      )}
                    >
                      {/* Featured image or gradient placeholder */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-[var(--color-accent-cyan)]/10">
                        {cs.featuredImage ? (
                          <Image
                            src={cs.featuredImage}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <div className="grid grid-cols-4 gap-1 p-6 opacity-20">
                              {Array.from({ length: 16 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="aspect-square rounded-sm bg-[var(--color-accent-blue)]/40"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Industry badge */}
                        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-800 backdrop-blur-sm">
                          {industry}
                        </span>

                        {/* View icon */}
                        <div className="absolute top-3 right-3 rounded-full bg-white/90 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowUpRight className="h-4 w-4 text-zinc-800" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="mb-2 font-heading text-lg font-bold text-[var(--color-text)] leading-snug group-hover:text-[var(--color-accent-blue)] transition-colors duration-200">
                          {cs.title}
                        </h3>

                        <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-2 flex-1">
                          {cs.excerpt}
                        </p>

                        {/* Technologies */}
                        {technologies.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-1.5">
                            {technologies.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="inline-flex items-center rounded-md bg-[var(--color-surface-tertiary)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)]"
                              >
                                {tech}
                              </span>
                            ))}
                            {technologies.length > 4 && (
                              <span className="inline-flex items-center rounded-md bg-[var(--color-surface-tertiary)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)]">
                                +{technologies.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Key results */}
                        {results.length > 0 && (
                          <div className="mt-auto grid grid-cols-3 gap-3 rounded-xl bg-[var(--color-surface-secondary)] p-3">
                            {results.slice(0, 3).map((result) => (
                              <div key={result.metric} className="text-center">
                                <div className="font-heading text-base font-bold text-[var(--color-accent-emerald)]">
                                  {result.value}
                                </div>
                                <div className="text-[10px] leading-tight text-[var(--color-text-tertiary)]">
                                  {result.metric}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
