import { cn } from '@/lib/utils'

/* ── Brand Colors ── */
const NAVY = '#0F1B2D'
const WHITE = '#FFFFFF'
const ACCENT = '#2563EB'

/* ── Size Presets ── */
const SIZE_MAP = {
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64,
} as const

type FaviconSize = keyof typeof SIZE_MAP

/* ── Props ── */
interface FaviconProps {
  /** Colour variant */
  variant?: 'light' | 'dark'
  /** Preset size */
  size?: FaviconSize
  /** Exact pixel width/height (overrides size preset) */
  dimension?: number
  /** Additional class names */
  className?: string
}

/* ── Simplified geometric S-mark for favicon ────────────────── */
export function Favicon({
  variant = 'dark',
  size = 'md',
  dimension,
  className,
}: FaviconProps) {
  const px = dimension ?? SIZE_MAP[size]
  const fillColor = variant === 'light' ? WHITE : NAVY
  const accentColor = ACCENT

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Synova Infotech favicon"
      className={cn('flex-shrink-0', className)}
    >
      <title>Synova Infotech</title>

      {/* ── Main S-body — compact geometric path ── */}
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
          'H 38'
        }
        stroke={fillColor}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Accent parallelogram ── */}
      <path
        d="M 34 14 L 42 20 L 38 26 L 30 20 Z"
        fill={accentColor}
      />

      {/* ── Small diamond accent ── */}
      <path
        d="M 14 12 L 18 10 L 20 14 L 16 16 Z"
        fill={accentColor}
        opacity="0.6"
      />
    </svg>
  )
}
