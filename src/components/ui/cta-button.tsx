'use client'

import type { ReactNode, MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface CtaButtonProps {
  children: ReactNode
  href: string
  variant?: 'primary' | 'secondary'
  className?: string
}

/**
 * Premium CTA button with two variants:
 * - primary: solid electric-blue background with hover glow
 * - secondary: transparent with white border + hover fill
 *
 * Smooth-scrolls to the target section on click.
 */
export function CtaButton({
  children,
  href,
  variant = 'primary',
  className,
}: CtaButtonProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        // Base styles
        'group relative inline-flex items-center justify-center overflow-hidden',
        'rounded-xl px-7 py-3.5 text-sm font-semibold',
        'transition-all duration-300 ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',

        variant === 'primary' && [
          'bg-[var(--color-accent-blue)] text-white',
          'hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)]',
          'active:scale-[0.97]',
        ],

        variant === 'secondary' && [
          'border border-white/20 text-white',
          'hover:border-white/40 hover:bg-white/[0.06]',
          'active:scale-[0.97]',
        ],

        className,
      )}
    >
      {children}
    </a>
  )
}
