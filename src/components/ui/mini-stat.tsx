'use client'

import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface MiniStatProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  className?: string
}

export function MiniStat({ value, suffix, prefix, label, className }: MiniStatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [displayed, setDisplayed] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      const id = setTimeout(() => {
        setDisplayed(value)
        setHasAnimated(true)
      }, 0)
      return () => clearTimeout(id)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 2000
          const start = performance.now()

          function tick(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress)
            setDisplayed(Math.round(eased * value))
            if (progress < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div ref={ref} className={cn('text-center', className)}>
      <div className="font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl">
        {prefix}
        {displayed.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
        {label}
      </div>
    </div>
  )
}
