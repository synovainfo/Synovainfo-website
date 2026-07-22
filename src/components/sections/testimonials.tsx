'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { TestimonialCard } from '@/components/ui/testimonial-card'
import { testimonials } from '@/data/testimonials'

const CARDS_PER_PAGE = { desktop: 3, tablet: 2, mobile: 1 } as const

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      if (w < 768) setBreakpoint('mobile')
      else if (w < 1024) setBreakpoint('tablet')
      else setBreakpoint('desktop')
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return breakpoint
}

export function Testimonials() {
  const [page, setPage] = useState(0)
  const breakpoint = useBreakpoint()

  const cardsPerPage = CARDS_PER_PAGE[breakpoint]

  const totalPages = useMemo(
    () => Math.ceil(testimonials.length / cardsPerPage),
    [cardsPerPage],
  )

  const visibleTestimonials = useMemo(
    () => testimonials.slice(page * cardsPerPage, (page + 1) * cardsPerPage),
    [page, cardsPerPage],
  )

  const goToPage = useCallback(
    (p: number) => {
      setPage(Math.max(0, Math.min(p, totalPages - 1)))
    },
    [totalPages],
  )

  const goNext = useCallback(() => goToPage(page + 1), [goToPage, page])
  const goPrev = useCallback(() => goToPage(page - 1), [goToPage, page])

  // Reset page when breakpoint changes and page exceeds total
  useEffect(() => {
    if (page >= totalPages) {
      const id = setTimeout(() => setPage(0), 0)
      return () => clearTimeout(id)
    }
  }, [totalPages, page])

  const hasPrev = page > 0
  const hasNext = page < totalPages - 1

  return (
    <SectionWrapper id="testimonials">
      <SectionHeader
        badge="Client Testimonials"
        title="Trusted by Enterprise Leaders"
        subtitle="Hear from the technology leaders who partner with us to drive their digital transformation initiatives."
        alignment="center"
      />

      {/* Carousel grid */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${breakpoint}-${page}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className={cn(
              'grid gap-6',
              breakpoint === 'desktop' && 'grid-cols-3',
              breakpoint === 'tablet' && 'grid-cols-2',
              breakpoint === 'mobile' && 'grid-cols-1',
            )}
          >
            {visibleTestimonials.map((testimonial, i) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={page * cardsPerPage + i}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={goPrev}
            disabled={!hasPrev}
            aria-label="Previous testimonials"
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200',
              'border-[var(--color-border)] bg-[var(--color-surface)]',
              'text-[var(--color-text-secondary)] hover:border-[var(--color-accent-blue)]/30 hover:text-[var(--color-accent-blue)]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
              'disabled:cursor-not-allowed disabled:opacity-30',
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial pages">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                role="tab"
                aria-selected={i === page}
                aria-label={`Page ${i + 1} of ${totalPages}`}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
                  i === page
                    ? 'w-8 bg-[var(--color-accent-blue)]'
                    : 'w-2 bg-[var(--color-border)] hover:bg-[var(--color-text-tertiary)]',
                )}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={!hasNext}
            aria-label="Next testimonials"
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200',
              'border-[var(--color-border)] bg-[var(--color-surface)]',
              'text-[var(--color-text-secondary)] hover:border-[var(--color-accent-blue)]/30 hover:text-[var(--color-accent-blue)]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
              'disabled:cursor-not-allowed disabled:opacity-30',
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </SectionWrapper>
  )
}
