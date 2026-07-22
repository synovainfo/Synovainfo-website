'use client'

import { useRef, useState, useEffect, useCallback, type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Search,
  BarChart3,
  Building2,
  Palette,
  Code2,
  ShieldCheck,
  Rocket,
  Headphones,
  CheckCircle2,
  Clock,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { processStages } from '@/data/process'

gsap.registerPlugin(ScrollTrigger)

// ─── Icon Map ─────────────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
  Search,
  BarChart3,
  Building2,
  Palette,
  Code2,
  ShieldCheck,
  Rocket,
  Headphones,
}

function StageIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = iconMap[iconName]
  if (!Icon) return null
  return <Icon className={className} />
}

// ─── Props ────────────────────────────────────────────────────────
interface ProcessTimelineProps {
  prefersReducedMotion: boolean | null
}

// ─── Component ────────────────────────────────────────────────────
export const ProcessTimeline: FC<ProcessTimelineProps> = ({ prefersReducedMotion }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [pathD, setPathD] = useState('')
  const [lineLength, setLineLength] = useState(0)

  const stage = processStages[activeIndex]

  // ── Measure node positions for SVG path ────────────────────────
  const measurePositions = useCallback(() => {
    if (!timelineRef.current) return
    const nodes = timelineRef.current.querySelectorAll<HTMLElement>('[data-node-idx]')
    const rect = timelineRef.current.getBoundingClientRect()
    const positions: { x: number; y: number }[] = []

    nodes.forEach((node) => {
      const nodeRect = node.getBoundingClientRect()
      positions.push({
        x: nodeRect.left - rect.left + nodeRect.width / 2,
        y: nodeRect.top - rect.top + nodeRect.height / 2,
      })
    })

    if (positions.length >= 2) {
      setPathD(buildSmoothPath(positions))
    }
  }, [])

  useEffect(() => {
    // Measure after mount + on resize
    const timer = setTimeout(measurePositions, 150)
    window.addEventListener('resize', measurePositions)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', measurePositions)
    }
  }, [measurePositions])

  // ── Update line length when path changes ───────────────────────
  useEffect(() => {
    if (!pathRef.current) return
    const len = pathRef.current.getTotalLength()
    if (len > 0 && len !== lineLength) setLineLength(len)
  }, [pathD, lineLength])

  // ── GSAP scroll-triggered line drawing ─────────────────────────
  useEffect(() => {
    if (prefersReducedMotion || !pathRef.current || lineLength === 0) return

    const path = pathRef.current

    gsap.set(path, { strokeDasharray: lineLength, strokeDashoffset: lineLength })

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        onUpdate: (self) => {
          const draw = self.progress * lineLength
          gsap.set(path, { strokeDashoffset: lineLength - draw })
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [prefersReducedMotion, lineLength, pathD])

  // ── Node click ─────────────────────────────────────────────────
  const handleNodeClick = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const gradientId = 'tl-gradient-path'

  return (
    <div ref={containerRef} className="relative">
      {/* ── Timeline Row ────────────────────────────────────── */}
      <div
        ref={timelineRef}
        className="relative flex flex-row items-start justify-between"
      >
        {/* SVG Connecting Line */}
        {pathD && (
          <svg
            className={cn(
              'pointer-events-none absolute inset-0 z-0',
              prefersReducedMotion && 'hidden',
            )}
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            {/* Background line */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            {/* Animated progress line */}
            <path
              ref={pathRef}
              d={pathD}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-accent-blue)" />
                <stop offset="100%" stopColor="var(--color-accent-cyan)" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Nodes */}
        {processStages.map((s, index) => {
          const isActive = index === activeIndex
          const isPast = index < activeIndex

          return (
            <button
              key={s.id}
              data-node-idx={index}
              onClick={() => handleNodeClick(index)}
              className={cn(
                'group relative z-10 flex cursor-pointer flex-col items-center gap-2',
                'transition-all duration-300',
                'w-16 shrink-0 sm:w-[76px]',
              )}
              aria-label={`${s.title} — ${s.shortDesc}`}
            >
              {/* Circle */}
              <div
                className={cn(
                  'relative flex h-11 w-11 items-center justify-center rounded-full border-2',
                  'transition-all duration-500',
                  isActive
                    ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)] text-white shadow-lg shadow-[var(--color-accent-blue)]/25'
                    : isPast
                      ? 'border-[var(--color-accent-blue)]/40 bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-tertiary)]',
                  'hover:border-[var(--color-accent-blue)]/60 hover:shadow-md',
                  'group-hover:scale-110',
                )}
              >
                <StageIcon iconName={s.icon} className="h-5 w-5" />

                {/* Index badge */}
                <span
                  className={cn(
                    'absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full text-[9px] font-bold leading-none',
                    isActive || isPast
                      ? 'bg-[var(--color-accent-blue)] text-white'
                      : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-tertiary)]',
                  )}
                >
                  {isPast ? <CheckCircle2 className="h-2.5 w-2.5" /> : index + 1}
                </span>
              </div>

              {/* Title */}
              <span
                className={cn(
                  'text-center text-[11px] font-semibold leading-tight tracking-wide transition-colors duration-300',
                  isActive
                    ? 'text-[var(--color-accent-blue)]'
                    : isPast
                      ? 'text-[var(--color-text)]'
                      : 'text-[var(--color-text-tertiary)]',
                )}
              >
                {s.title}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Content Panel ────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative mt-8 overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-xl md:p-8"
        >
          {/* Accent bar */}
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-cyan)]" />

          <div className="grid gap-6 md:grid-cols-3">
            {/* Left: Description */}
            <div className="md:col-span-2">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]">
                  <StageIcon iconName={stage.icon} className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-text)]">{stage.title}</h3>
                  <p className="text-sm text-[var(--color-text-tertiary)]">{stage.shortDesc}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {stage.fullDesc}
              </p>
            </div>

            {/* Right: Deliverables & Duration */}
            <div className="space-y-5">
              <div>
                <h4 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-tertiary)]">
                  Deliverables
                </h4>
                <ul className="space-y-2">
                  {stage.deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent-blue)]" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-tertiary)]">
                  Duration
                </h4>
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
                  <Clock className="h-4 w-4 text-[var(--color-accent-blue)]" />
                  {stage.duration}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Smooth SVG Path Builder ──────────────────────────────────────
function buildSmoothPath(positions: { x: number; y: number }[]): string {
  if (positions.length < 2) return ''

  const parts: string[] = []
  parts.push(`M ${positions[0].x} ${positions[0].y}`)

  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1]
    const curr = positions[i]
    const mx = (prev.x + curr.x) / 2
    const my = (prev.y + curr.y) / 2
    parts.push(`Q ${mx} ${prev.y}, ${mx} ${my}`)
    parts.push(`T ${curr.x} ${curr.y}`)
  }

  return parts.join(' ')
}
