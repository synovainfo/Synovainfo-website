'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CaseStudyPageData } from './page'
import { CaseStudyCard } from './case-study-card'
import { CaseStudiesHeroVisual } from './case-studies-visuals'

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

/** Preview visuals for the first case studies listed (no featured image). */
const PREVIEW_CARDS = [
  '/images/case-studies/case-study-preview-card-1.svg',
  '/images/case-studies/case-study-preview-card-2.svg',
  '/images/case-studies/case-study-preview-card-3.svg',
  '/images/case-studies/case-study-preview-card-4.svg',
] as const

export function CaseStudiesClient({ caseStudies, industries }: CaseStudiesClientProps) {
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Stable position of each case study in the full list → preview visual.
  const previewIndexById = useMemo(() => {
    const map = new Map<string, number>()
    caseStudies.forEach((cs, index) => {
      map.set(cs.id, index)
    })
    return map
  }, [caseStudies])

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
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl lg:col-span-7"
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

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <CaseStudiesHeroVisual />
            </motion.div>
          </div>

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
                const previewIndex = previewIndexById.get(cs.id) ?? -1
                const fallbackImage =
                  previewIndex >= 0 && previewIndex < PREVIEW_CARDS.length
                    ? PREVIEW_CARDS[previewIndex]
                    : null

                return (
                  <motion.div key={cs.id} variants={cardVariants}>
                    <CaseStudyCard caseStudy={cs} fallbackImage={fallbackImage} />
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
