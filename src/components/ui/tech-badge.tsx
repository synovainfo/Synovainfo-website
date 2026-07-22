'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Technology } from '@/data/technologies'

interface TechBadgeProps {
  tech: Technology
  index: number
}

export function TechBadge({ tech, index }: TechBadgeProps) {
  const prefersReducedMotion = useReducedMotion()
  const Icon = tech.icon

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16, scale: 0.9 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={prefersReducedMotion ? undefined : { once: true, margin: '-30px' }}
      transition={{
        duration: 0.45,
        delay: index * 0.04,
        ease: 'easeOut',
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -6,
              scale: 1.04,
              transition: { type: 'spring', stiffness: 300, damping: 12 },
            }
      }
      style={
        prefersReducedMotion
          ? undefined
          : ({
              '--float-duration': `${3 + (index % 5) * 0.6}s`,
              '--float-delay': `${(index % 7) * 0.15}s`,
              animation: 'badge-float var(--float-duration) ease-in-out var(--float-delay) infinite',
            } as React.CSSProperties)
      }
      className={cn(
        'group relative flex cursor-default items-center gap-2.5',
        'rounded-xl border px-3.5 py-2.5',
        'border-[var(--glass-border)] bg-[var(--glass-bg)]',
        'shadow-sm backdrop-blur-xl',
        'transition-colors duration-300',
        'hover:border-[var(--color-accent-blue)]/30 hover:shadow-md',
        'select-none',
      )}
    >
      {/* Icon / First-letter fallback */}
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-blue)]/10 text-xs font-bold text-[var(--color-accent-blue)]">
        {Icon ? (
          <Icon className="h-3.5 w-3.5" />
        ) : (
          tech.name.charAt(0).toUpperCase()
        )}
      </span>

      {/* Label */}
      <span className="text-sm font-medium text-[var(--color-text)]">
        {tech.name}
      </span>

      {/* Tooltip on hover */}
      <div className="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--glass-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] opacity-0 shadow-lg backdrop-blur-xl transition-opacity duration-200 group-hover:opacity-100">
        {tech.description}
      </div>
    </motion.div>
  )
}
