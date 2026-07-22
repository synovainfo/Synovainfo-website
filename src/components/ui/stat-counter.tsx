'use client'

import { useRef, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface StatCounterProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  index?: number
  duration?: number
}

export function StatCounter({
  value,
  suffix = '',
  prefix = '',
  label,
  index = 0,
  duration = 2,
}: StatCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const el = numRef.current
    if (!el) return

    /* ── Reduced motion: show final value instantly ── */
    if (prefersReducedMotion) {
      el.textContent = `${prefix}${value.toLocaleString()}${suffix}`
      return
    }

    /* ── Animate with GSAP ── */
    const proxy = { current: 0 }
    const delay = index * 0.12

    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        current: value,
        duration,
        ease: 'power3.out',
        delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 88%',
          once: true,
        },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.floor(proxy.current).toLocaleString()}${suffix}`
        },
        onComplete: () => {
          el.textContent = `${prefix}${value.toLocaleString()}${suffix}`
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [value, suffix, prefix, index, duration, prefersReducedMotion])

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative flex flex-col items-center text-center',
        'rounded-2xl border border-white/10 bg-white/[0.03] p-8',
        'backdrop-blur-sm transition-colors duration-300',
        'hover:border-[var(--color-accent-blue)]/20',
      )}
    >
      {/* Accent line */}
      <div className="absolute left-1/2 top-0 h-0.5 w-12 -translate-x-1/2 rounded-full bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-cyan)] opacity-60" />

      {/* Number */}
      <span
        ref={numRef}
        className="mb-2 bg-gradient-to-b from-white to-white/70 bg-clip-text font-heading text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-6xl"
      >
        {prefix}0{suffix}
      </span>

      {/* Label */}
      <span className="text-sm font-medium tracking-wide text-white/60 md:text-base">
        {label}
      </span>
    </div>
  )
}
