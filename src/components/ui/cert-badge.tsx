'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CertBadgeProps {
  name: string
  description: string
  icon: LucideIcon
  index?: number
}

export function CertBadge({ name, description, icon: Icon, index = 0 }: CertBadgeProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.95 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={prefersReducedMotion ? undefined : { once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: 'easeOut',
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -6,
              scale: 1.03,
              transition: { type: 'spring', stiffness: 300, damping: 14 },
            }
      }
      className={cn(
        'group relative flex cursor-default flex-col items-center rounded-2xl border p-6 text-center',
        'border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-sm backdrop-blur-xl',
        'transition-all duration-300',
        'hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg',
      )}
    >
      {/* Glow effect on hover */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500',
          'bg-gradient-to-b from-[var(--color-accent-blue)]/5 to-transparent',
          'group-hover:opacity-100',
        )}
      />

      {/* Icon circle */}
      <motion.div
        whileHover={
          prefersReducedMotion
            ? undefined
            : {
                scale: 1.12,
                backgroundColor: 'rgba(37, 99, 235, 0.18)',
                transition: { type: 'spring', stiffness: 400, damping: 12 },
              }
        }
        className={cn(
          'relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-xl',
          'bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-[var(--color-accent-cyan)]/10',
          'ring-1 ring-[var(--color-accent-blue)]/10',
          'transition-colors duration-300',
        )}
      >
        <Icon className="h-6 w-6 text-[var(--color-accent-blue)]" />
      </motion.div>

      {/* Name */}
      <h3 className="relative z-10 mb-1 font-heading text-base font-semibold text-[var(--color-text)]">
        {name}
      </h3>

      {/* Description */}
      <p className="relative z-10 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
        {description}
      </p>
    </motion.div>
  )
}
