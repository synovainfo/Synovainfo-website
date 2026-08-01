'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQItem[]
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="py-20 md:py-28 bg-[var(--color-surface-secondary)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-blue)]">
            Frequently Asked Questions
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text)] md:text-4xl">
            Answers for enterprise leaders evaluating services.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
            Browse the most common questions about delivery, integration, compliance, and ongoing support.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id
            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[var(--color-surface-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
                >
                  <span className="text-sm font-semibold text-[var(--color-text)] md:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-200',
                      isOpen && 'rotate-180',
                    )}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-[var(--color-border)] px-6 py-4"
                    >
                      <p className="text-sm leading-7 text-[var(--color-text-secondary)] md:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
