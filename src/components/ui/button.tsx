'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-xl font-semibold',
    'transition-all duration-300 ease-out',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.97]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-accent-blue)] text-white',
          'hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)]',
          'active:bg-[var(--color-accent-blue)]/90',
        ],
        secondary: [
          'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]',
          'hover:bg-[var(--color-surface-secondary)] hover:border-[var(--color-accent-blue)]/30',
        ],
        ghost: [
          'bg-transparent text-[var(--color-text)]',
          'hover:bg-[var(--color-surface-secondary)]',
        ],
        danger: [
          'bg-red-600 text-white',
          'hover:bg-red-700',
          'active:bg-red-800',
        ],
        glass: [
          'border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--color-text)]',
          'backdrop-blur-xl shadow-sm',
          'hover:border-[var(--color-accent-blue)]/30 hover:shadow-md',
        ],
        link: [
          'bg-transparent text-[var(--color-accent-blue)] underline-offset-4',
          'hover:underline',
          'h-auto px-0 py-0',
        ],
      },
      size: {
        sm: 'h-8 gap-1.5 rounded-lg px-3 text-xs',
        md: 'h-10 gap-2 rounded-xl px-5 text-sm',
        lg: 'h-12 gap-2.5 rounded-xl px-7 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading && (
          <Loader2
            className="h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
