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
 * Premium CTA button with corporate variants:
 * - primary: solid corporate navy with gold hover glow
 * - secondary: transparent with gold border + hover fill
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
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-corporate-gold)]',

        variant === 'primary' && [
          'bg-[var(--color-corporate-navy)] text-white',
          'hover:bg-[var(--color-corporate-gold)] hover:text-[var(--color-corporate-navy)]',
          'hover:shadow-[0_0_30px_-3px_var(--color-corporate-gold)]',
          'active:scale-[0.97]',
        ],

        variant === 'secondary' && [
          'border border-[var(--color-corporate-gold)]/40 text-[var(--color-corporate-gold)]',
          'hover:bg-[var(--color-corporate-gold)] hover:text-[var(--color-corporate-navy)]',
          'active:scale-[0.97]',
        ],

        className,
      )}
    >
      {children}
    </a>
  )
}
