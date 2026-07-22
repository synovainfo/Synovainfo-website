'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X, CheckCircle2, Tags, Briefcase, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Service } from '@/data/services'

interface ServiceModalProps {
  service: Service
  open: boolean
  onOpenChange: (open: boolean) => void
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
      {children}
    </span>
  )
}

export function ServiceModal({ service, open, onOpenChange }: ServiceModalProps) {
  const Icon = service.icon

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
                  'fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2',
                  'rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-0 shadow-2xl backdrop-blur-2xl',
                  'max-h-[85vh] overflow-y-auto',
                  'focus:outline-none',
                )}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 px-6 py-5 backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-blue)]/10">
                      <Icon className="h-6 w-6 text-[var(--color-accent-blue)]" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-bold text-[var(--color-text)]">
                        {service.title}
                      </Dialog.Title>
                      <Dialog.Description className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {service.shortDescription}
                      </Dialog.Description>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      aria-label="Close service details"
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
                  {/* Full Description */}
                  <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
                    {service.fullDescription}
                  </p>

                  {/* Technologies */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
                      <Tags className="h-4 w-4 text-[var(--color-accent-blue)]" />
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech) => (
                        <Tag key={tech}>{tech}</Tag>
                      ))}
                    </div>
                  </div>

                  {/* Industries */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
                      <Briefcase className="h-4 w-4 text-[var(--color-accent-emerald)]" />
                      Industries
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {service.industries.map((ind) => (
                        <Tag key={ind}>{ind}</Tag>
                      ))}
                    </div>
                  </div>

                  {/* Benefits & Outcomes Grid */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Benefits */}
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 p-4">
                      <h4 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
                        Key Benefits
                      </h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-emerald)]" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Business Outcomes */}
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-accent-blue)]/5 p-4">
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                        <TrendingUp className="h-4 w-4 text-[var(--color-accent-blue)]" />
                        Business Outcomes
                      </h4>
                      <ul className="space-y-2">
                        {service.businessOutcomes.map((outcome) => (
                          <li key={outcome} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-blue)]/10 text-[10px] font-bold text-[var(--color-accent-blue)]">
                              ↗
                            </span>
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
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
