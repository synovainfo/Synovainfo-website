"use client"

import { type CSSProperties } from "react"

interface BackgroundGlowProps {
  /** CSS color or gradient stop, e.g. 'rgba(249,115,22,0.12)' */
  color?: string
  /** size of the glow element (width & height) */
  size?: string
  /** CSS position for the radial-gradient center, e.g. '80% 15%' */
  position?: string
  className?: string
  variant?: 'gold' | 'blue' | 'emerald'
}

const GLOW_COLORS: Record<NonNullable<BackgroundGlowProps['variant']>, string> = {
  gold: 'rgba(249,115,22,0.16)',
  blue: 'rgba(59,130,246,0.18)',
  emerald: 'rgba(16,185,129,0.16)',
}

export function BackgroundGlow({
  color,
  size = '480px',
  position = '80% 15%',
  className = '',
  variant = 'gold',
}: BackgroundGlowProps) {
  const glowColor = color ?? GLOW_COLORS[variant]
  const style: CSSProperties = {
    width: size,
    height: size,
    background: `radial-gradient(circle at ${position}, ${glowColor} 0%, transparent 45%)`,
    filter: 'blur(48px)',
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '15%',
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: -10,
  }

  return <div aria-hidden="true" style={style} className={className} />
}
