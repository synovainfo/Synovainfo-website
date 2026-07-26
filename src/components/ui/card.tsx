'use client'

import {
  createContext,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/*  Card variants                                                             */
/* -------------------------------------------------------------------------- */

const cardVariants = cva(
  [
    'rounded-xl',
    'transition-all duration-300',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--color-surface)]',
          'border border-[var(--color-border)]',
          'shadow-sm',
        ],
        glass: [
          'border border-[var(--glass-border)] bg-[var(--glass-bg)]',
          'backdrop-blur-xl shadow-sm',
        ],
        bordered: [
          'bg-transparent',
          'border-2 border-[var(--color-border)]',
        ],
        interactive: [
          'bg-[var(--color-surface)]',
          'border border-[var(--color-border)]',
          'shadow-sm',
          'cursor-pointer',
          'hover:border-[var(--color-accent-blue)]/30 hover:shadow-md',
          'transition-all duration-300',
        ],
        flat: [
          'bg-[var(--color-surface-secondary)]',
          'border-none shadow-none',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface CardProps
  extends VariantProps<typeof cardVariants> {
  className?: string
  children: ReactNode
}

function Card({ className, variant, children }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  className?: string
  children: ReactNode
}

function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'border-b border-[var(--color-border)] px-6 py-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface CardBodyProps {
  className?: string
  children: ReactNode
}

function CardBody({ className, children }: CardBodyProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

interface CardFooterProps {
  className?: string
  children: ReactNode
}

function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div
      className={cn(
        'border-t border-[var(--color-border)] px-6 py-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

export { Card, CardHeader, CardBody, CardFooter, cardVariants }
export type { CardHeaderProps, CardBodyProps, CardFooterProps }
// CardProps is already exported via the interface declaration above
