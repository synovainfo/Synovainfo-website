'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X, Tags, Clock, Target, Lightbulb, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CaseStudy } from '@/data/case-studies'
import { ArchDiagram } from './arch-diagram'

interface CaseStudyModalProps {
  study: CaseStudy
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CaseStudyModal({ study, open, onOpenChange }: CaseStudyModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className={cn(
                  'fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2',
                  'rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-0 shadow-2xl backdrop-blur-2xl',
                  'max-h-[90vh] overflow-y-auto',
                  'focus:outline-none',
                )}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 px-6 py-5 backdrop-blur-md">
                  <div>
                    <span className="mb-2 inline-flex rounded-full bg-[var(--color-accent-blue)]/10 px-3 py-0.5 text-xs font-medium text-[var(--color-accent-blue)]">
                      {study.industry}
                    </span>
                    <Dialog.Title className="mt-2 text-xl font-bold text-[var(--color-text)]">
                      {study.title}
                    </Dialog.Title>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      aria-label="Close case study"
                      className={cn(
                        'ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        'text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-tertiary)] hover:text-[var(--color-text)]',
                      )}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Body */}
                <div className="space-y-6 px-6 py-6">
                  {/* Architecture Diagram */}
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 p-4">
                    <h4 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Architecture Overview</h4>
                    <div className="h-44 sm:h-52">
                      <ArchDiagram type={study.architecture} />
                    </div>
                  </div>

                  {/* Overview */}
                  <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
                    {study.overview}
                  </p>

                  {/* Challenge */}
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                      <Target className="h-4 w-4 text-[var(--color-accent-blue)]" />
                      The Challenge
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {study.challenge}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-accent-blue)]/5 p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                      <Lightbulb className="h-4 w-4 text-[var(--color-accent-blue)]" />
                      Our Solution
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {study.solution}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)]/5 px-4 py-3">
                    <Clock className="h-4 w-4 text-[var(--color-accent-purple)]" />
                    <span className="text-sm font-medium text-[var(--color-accent-purple)]">
                      {study.timeline}
                    </span>
                  </div>

                  {/* Technologies & Results Grid */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Technologies */}
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
                        <Tags className="h-4 w-4 text-[var(--color-accent-cyan)]" />
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {study.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Results */}
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
                        <TrendingUp className="h-4 w-4 text-[var(--color-accent-emerald)]" />
                        Key Results
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {study.results.map((result) => (
                          <div
                            key={result.metric}
                            className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-2.5"
                          >
                            <span className="text-sm text-[var(--color-text-secondary)]">
                              {result.metric}
                            </span>
                            <span className="font-heading text-base font-bold text-[var(--color-accent-emerald)]">
                              {result.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
