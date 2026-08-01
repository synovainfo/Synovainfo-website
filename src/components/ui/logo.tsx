'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'

/* ── Brand Colors ── */
const NAVY = '#1E3A5F'
const WHITE = '#FFFFFF'
const ACCENT = '#F97316'
const ACCENT_DARK = '#EA580C'

/* ── Size Presets ── */
const SIZE_MAP = {
  sm: { icon: 32, viewBox: 48, textSize: 'text-base', subTextSize: 'text-[9px]', gap: 'gap-2' },
  md: { icon: 40, viewBox: 48, textSize: 'text-xl', subTextSize: 'text-[10px]', gap: 'gap-2.5' },
  lg: { icon: 52, viewBox: 48, textSize: 'text-2xl', subTextSize: 'text-xs', gap: 'gap-3' },
  xl: { icon: 72, viewBox: 48, textSize: 'text-4xl', subTextSize: 'text-sm', gap: 'gap-4' },
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
  /** Optional href — renders as Link/a when provided */
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
      aria-label="Synova Infotech geometric logo mark"
    >
      <title>Synova Infotech Logo Mark</title>

      {/* ── Defs ── */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={NAVY} />
          <stop offset="50%" stopColor={ACCENT} />
          <stop offset="100%" stopColor={ACCENT_DARK} />
        </linearGradient>
      </defs>

      {/* ── Main S-body path ── */}
      <path
        d={
          'M 10 10 ' +
          'H 34 ' +
          'A 4 4 0 0 1 38 14 ' +
          'V 18 ' +
          'A 4 4 0 0 1 34 22 ' +
          'L 14 22 ' +
          'V 26 ' +
          'A 4 4 0 0 0 10 30 ' +
          'V 34 ' +
          'A 4 4 0 0 0 14 38 ' +
          'H 38 '
        }
        stroke={fill === WHITE ? 'url(#' + gradientId + ')' : fill}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Accent facet overlay ── */}
      <motion.path
        d="M 34 14 L 42 20 L 38 26 L 30 20 Z"
        fill={`url(#${gradientId})`}
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

      {/* ── Secondary accent diamond ── */}
      <motion.path
        d="M 14 12 L 18 10 L 20 14 L 16 16 Z"
        fill={accent}
        opacity="0.8"
        {...(animated && {
          animate: { opacity: [0.5, 0.9, 0.5] },
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
  href = '/',
}: LogoProps) {
  const s = SIZE_MAP[size]
  const fillColor = variant === 'light' ? WHITE : NAVY
  const accentColor = ACCENT

  const content = (
    <div
      className={cn(
        'group inline-flex items-center no-underline cursor-pointer select-none transition-transform duration-300 ease-out hover:scale-[1.05]',
        s.gap,
        className
      )}
    >
      {/* Icon mark */}
      <div
        className="flex-shrink-0 transition-transform duration-300 group-hover:rotate-[3deg]"
        style={{ width: s.icon, height: s.icon }}
      >
        <SMark fill={fillColor} accent={accentColor} animated={animated} />
      </div>

      {/* Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              'font-extrabold tracking-[0.14em] leading-none transition-opacity duration-200 group-hover:opacity-90',
              variant === 'light' ? 'text-white' : 'text-[#1E3A5F]',
              s.textSize
            )}
          >
            SYNOVA
          </span>
          <span
            className={cn(
              'font-light tracking-[0.28em] leading-tight text-slate-400 dark:text-slate-400 uppercase mt-0.5',
              s.subTextSize
            )}
          >
            INFO
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} aria-label="SYNOVA INFO Home">
        {content}
      </Link>
    )
  }

  return content
}
