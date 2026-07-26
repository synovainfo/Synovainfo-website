'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BlurLevel = 'sm' | 'md' | 'lg'

interface GlassCardProps {
  children: ReactNode
  className?: string
  blur?: BlurLevel
  hoverEffect?: boolean
}

const blurMap: Record<BlurLevel, string> = {
  sm: 'backdrop-blur-md',
  md: 'backdrop-blur-xl',
  lg: 'backdrop-blur-2xl',
}

/**
 * Specialized glassmorphism card using CSS variables from the design system.
 *
 * - `blur`: controls backdrop-blur intensity (sm | md | lg)
 * - `hoverEffect`: enables subtle lift + border highlight on hover
 */
export function GlassCard({
  children,
  className,
  blur = 'md',
  hoverEffect = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--glass-border)]',
        'bg-[var(--glass-bg)] shadow-sm',
        blurMap[blur],
        'transition-all duration-300',
        hoverEffect &&
          'hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg hover:-translate-y-0.5',
        className,
      )}
    >
      {children}
    </div>
  )
}

