'use client'

import { useReducedMotion, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Industry } from '@/data/industries'

interface IndustryCardProps {
  industry: Industry
  index?: number
}

export function IndustryCard({ industry, index = 0 }: IndustryCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const Icon = industry.icon

  const cardContent = (
    <div
      className={cn(
        'group relative rounded-xl border border-[var(--glass-border)]',
        'bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-xl',
        'transition-all duration-300',
        'hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
        'flex h-full flex-col',
      )}
    >
      {/* Subtle gradient overlay on hover */}
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
          whileHover={prefersReducedMotion ? undefined : { scale: 1.1, rotate: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Icon className="h-6 w-6 text-[var(--color-accent-blue)] transition-colors duration-300 group-hover:text-[var(--color-accent-cyan)]" />
        </motion.div>

        {/* Industry name */}
        <h3 className="font-heading text-lg font-semibold text-[var(--color-text)]">
          {industry.name}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {industry.description}
        </p>

        {/* Capability badges */}
        <div className="mt-auto flex flex-wrap gap-1.5">
          {industry.capabilities.map((cap) => (
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
        </div>
      </div>
    </div>
  )

  if (prefersReducedMotion) {
    return cardContent
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      {cardContent}
    </motion.div>
  )
}
