'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Types ────────────────────────────────────────────────────── */

interface FAQCategory {
  id: string
  name: string
  slug: string
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: FAQCategory
  order: number
}

interface FAQListProps {
  faqs: FAQItem[]
  categories: FAQCategory[]
}

/* ── Component ────────────────────────────────────────────────── */

export function FAQList({ faqs, categories }: FAQListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  /* ── Filtered & grouped ── */

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return faqs.filter((faq) => {
      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      const matchesCategory = activeCategory === 'all' || faq.category.slug === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [faqs, searchQuery, activeCategory])

  const groupedFaqs = useMemo(() => {
    const grouped: Record<string, FAQItem[]> = {}
    for (const faq of filteredFaqs) {
      const catName = faq.category.name
      if (!grouped[catName]) grouped[catName] = []
      grouped[catName].push(faq)
    }
    return grouped
  }, [filteredFaqs])

  const categoryNames = Object.keys(groupedFaqs)
  const hasResults = categoryNames.length > 0

  /* ── Handlers ── */

  function toggleOpen(id: string) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  /* ── Render ── */

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* ── Search ── */}
        <div className="relative mb-8">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-tertiary)]"
            aria-hidden
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            aria-label="Search frequently asked questions"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3.5 pl-12 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-colors focus:border-[var(--color-accent-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]/20"
          />
        </div>

        {/* ── Category Tabs ── */}
        <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="FAQ categories">
          <button
            role="tab"
            aria-selected={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              activeCategory === 'all'
                ? 'bg-[var(--color-accent-blue)] text-white shadow-md'
                : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] hover:text-[var(--color-text)]',
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                activeCategory === cat.slug
                  ? 'bg-[var(--color-accent-blue)] text-white shadow-md'
                  : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] hover:text-[var(--color-text)]',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ── FAQ Groups ── */}
        {hasResults ? (
          Object.entries(groupedFaqs).map(([categoryName, categoryFaqs], groupIndex) => (
            <motion.div
              key={categoryName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
              className="mb-12 last:mb-0"
            >
              <h2 className="mb-6 font-heading text-2xl font-bold text-[var(--color-text)]">
                {categoryName}
              </h2>

              <div className="space-y-3">
                {categoryFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
                  >
                    <button
                      onClick={() => toggleOpen(faq.id)}
                      aria-expanded={openId === faq.id}
                      aria-controls={`faq-answer-${faq.id}`}
                      className={cn(
                        'flex w-full items-center justify-between px-6 py-4 text-left transition-colors',
                        'hover:bg-[var(--color-surface-secondary)]',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
                      )}
                    >
                      <span className="pr-4 text-sm font-medium text-[var(--color-text)] md:text-base">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-200',
                          openId === faq.id && 'rotate-180',
                        )}
                        aria-hidden
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {openId === faq.id && (
                        <motion.div
                          key={`answer-${faq.id}`}
                          id={`faq-answer-${faq.id}`}
                          role="region"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[var(--color-border)] px-6 py-4">
                            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <p className="text-[var(--color-text-tertiary)]">
              {searchQuery
                ? 'No matching questions found. Try a different search term.'
                : 'No FAQs available in this category.'}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
