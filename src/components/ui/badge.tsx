'use client'

import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  [
    'inline-flex items-center rounded-full font-medium',
    'transition-colors duration-200',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--color-surface-tertiary)]',
          'text-[var(--color-text-secondary)]',
        ],
        primary: [
          'bg-[var(--color-accent-blue)]/10',
          'text-[var(--color-accent-blue)]',
        ],
        success: [
          'bg-[var(--color-accent-emerald)]/10',
          'text-[var(--color-accent-emerald)]',
        ],
        warning: [
          'bg-amber-100 text-amber-800',
          'dark:bg-amber-900/30 dark:text-amber-400',
        ],
        danger: [
          'bg-red-100 text-red-800',
          'dark:bg-red-900/30 dark:text-red-400',
        ],
        outline: [
          'border border-[var(--color-border)] text-[var(--color-text-secondary)]',
          'bg-transparent',
        ],
      },
      size: {
        sm: 'px-2 py-0.5 text-[11px]',
        md: 'px-2.5 py-1 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface BadgeProps
  extends VariantProps<typeof badgeVariants> {
  className?: string
  children: ReactNode
}

function Badge({ className, variant, size, children }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
