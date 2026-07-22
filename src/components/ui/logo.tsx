'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ── Brand Colors ── */
const NAVY = '#0F1B2D'
const WHITE = '#FFFFFF'
const ACCENT = '#2563EB'

/* ── Size Presets ── */
const SIZE_MAP = {
  sm: { icon: 32, viewBox: 48, textSize: 'text-sm', subTextSize: 'text-[10px]', gap: 'gap-2' },
  md: { icon: 48, viewBox: 48, textSize: 'text-lg', subTextSize: 'text-xs', gap: 'gap-2.5' },
  lg: { icon: 64, viewBox: 48, textSize: 'text-xl', subTextSize: 'text-sm', gap: 'gap-3' },
  xl: { icon: 96, viewBox: 48, textSize: 'text-3xl', subTextSize: 'text-base', gap: 'gap-4' },
} as const

type LogoSize = keyof typeof SIZE_MAP
type LogoVariant = 'light' | 'dark'

/* ── Props ── */
interface LogoProps {
  /** Colour variant */
  variant?: LogoVariant
  /** Preset size */
  size?: LogoSize
  /** Show "SYNOVA INFOTECH" wordmark */
  showText?: boolean
  /** Additional class names */
  className?: string
  /** Enable subtle gradient animation on the S-mark accent */
  animated?: boolean
  /** Optional href — renders as <a> when provided */
  href?: string
}

/* ── Geometric S-mark ────────────────────────────────────────── */
function SMark({
  fill,
  accent,
  animated,
}: {
  fill: string
  accent: string
  animated?: boolean
}) {
  const gradientId = useId()

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Synova Infotech geometric S mark"
    >
      <title>Synova Infotech S Mark</title>

      {/* ── Defs ── */}
      <defs>
        {animated && (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accent} />
            <stop offset="50%" stopColor={fill} />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
        )}
      </defs>

      {/* ── Main S-body — thick geometric path ── */}
      <path
        d={
          'M 10 10 ' +        // start top-left
          'H 34 ' +            // top bar rightward
          'A 4 4 0 0 1 38 14 ' +  // top-right outer curve
          'V 18 ' +            // right vertical down
          'A 4 4 0 0 1 34 22 ' +  // inner curve left
          'L 14 22 ' +         // middle cross-bar leftward
          'V 26 ' +            // middle vertical down
          'A 4 4 0 0 0 10 30 ' +  // bottom-left outer curve
          'V 34 ' +            // left vertical down
          'A 4 4 0 0 0 14 38 ' +  // bottom curve right
          'H 38 '              // bottom bar rightward
        }
        stroke={fill}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Accent facet — diagonal parallelogram overlay ── */}
      <motion.path
        d="M 34 14 L 42 20 L 38 26 L 30 20 Z"
        fill={animated ? `url(#${gradientId})` : accent}
        className={cn(animated && 'origin-center')}
        {...(animated && {
          animate: {
            rotate: [0, 3, 0, -3, 0],
            scale: [1, 1.04, 1, 1.04, 1],
          },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        })}
      />

      {/* ── Secondary accent — small diamond highlight ── */}
      <motion.path
        d="M 14 12 L 18 10 L 20 14 L 16 16 Z"
        fill={accent}
        opacity="0.6"
        {...(animated && {
          animate: { opacity: [0.4, 0.8, 0.4] },
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        })}
      />
    </svg>
  )
}

/* ── Logo Component ──────────────────────────────────────────── */
export function Logo({
  variant = 'dark',
  size = 'md',
  showText = true,
  className,
  animated = false,
  href,
}: LogoProps) {
  const s = SIZE_MAP[size]
  const fillColor = variant === 'light' ? WHITE : NAVY
  const accentColor = ACCENT

  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href
    ? { href, 'aria-label': 'Synova Infotech — Home' as const }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        'group inline-flex items-center no-underline',
        s.gap,
        className,
      )}
    >
      {/* Icon mark */}
      <div
        className="flex-shrink-0"
        style={{ width: s.icon, height: s.icon }}
      >
        <SMark fill={fillColor} accent={accentColor} animated={animated} />
      </div>

      {/* Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              'font-bold tracking-[0.12em] leading-none',
              s.textSize,
            )}
            style={{ color: fillColor }}
          >
            SYNOVA
          </span>
          <span
            className={cn(
              'font-medium tracking-[0.25em] leading-tight',
              s.subTextSize,
            )}
            style={{
              color: fillColor,
              opacity: variant === 'light' ? 0.7 : 0.55,
            }}
          >
            INFOTECH
          </span>
        </div>
      )}
    </Wrapper>
  )
}
