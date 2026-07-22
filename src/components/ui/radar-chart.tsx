'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ────────────────────────────────────────────────────────
interface RadarDimension {
  label: string
  synova: number  // 0–1
  industry: number // 0–1
}

const dimensions: RadarDimension[] = [
  { label: 'Quality', synova: 0.95, industry: 0.70 },
  { label: 'Speed', synova: 0.90, industry: 0.65 },
  { label: 'Innovation', synova: 0.85, industry: 0.60 },
  { label: 'Support', synova: 0.95, industry: 0.55 },
  { label: 'Value', synova: 0.80, industry: 0.65 },
  { label: 'Security', synova: 0.90, industry: 0.60 },
]

// ─── Geometry helpers ────────────────────────────────────────────
const N = dimensions.length
const CX = 200
const CY = 200
const MAX_R = 140

function polar(index: number, scale: number): { x: number; y: number } {
  const angle = (2 * Math.PI * index) / N - Math.PI / 2
  return {
    x: CX + MAX_R * scale * Math.cos(angle),
    y: CY + MAX_R * scale * Math.sin(angle),
  }
}

function polygonPath(series: number[]): string {
  return series
    .map((v, i) => {
      const p = polar(i, v)
      return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`
    })
    .join(' ') + 'Z'
}

// ─── Component ───────────────────────────────────────────────────
interface RadarChartProps {
  className?: string
}

export function RadarChart({ className }: RadarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const synovaPathRef = useRef<SVGPathElement>(null)
  const industryPathRef = useRef<SVGPathElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const id = setTimeout(() => setReducedMotion(mq.matches), 0)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => {
      clearTimeout(id)
      mq.removeEventListener('change', handler)
    }
  }, [])

  // GSAP animation
  const animate = useCallback(() => {
    if (!containerRef.current || reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Industry polygon — draw stroke
      if (industryPathRef.current) {
        const length = industryPathRef.current.getTotalLength()
        gsap.set(industryPathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        })
        tl.to(industryPathRef.current, {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: 'power2.out',
        }, 0)
      }

      // Synova polygon — draw stroke + fill
      if (synovaPathRef.current) {
        const length = synovaPathRef.current.getTotalLength()
        gsap.set(synovaPathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fillOpacity: 0,
        })
        tl.to(synovaPathRef.current, {
          strokeDashoffset: 0,
          duration: 1,
          ease: 'power2.out',
        }, 0.3)
        tl.to(synovaPathRef.current, {
          fillOpacity: 0.2,
          duration: 0.5,
          ease: 'power1.out',
        }, 0.6)
      }
    }, containerRef)

    return () => ctx.revert()
  }, [reducedMotion])

  useEffect(() => {
    const cleanup = animate()
    return () => cleanup?.()
  }, [animate])

  // Build point lists
  const synovaPoints = dimensions.map((d) => d.synova)
  const industryPoints = dimensions.map((d) => d.industry)

  // Grid levels
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]

  // Axis lines + label positions
  const axes = dimensions.map((_, i) => ({
    x2: polar(i, 1).x,
    y2: polar(i, 1).y,
    labelPos: polar(i, 1.18),
  }))

  return (
    <div
      ref={containerRef}
      className={cn('flex items-center justify-center', className)}
    >
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full max-w-[360px]"
        role="img"
        aria-label="Radar chart comparing Synova performance against industry average across six dimensions"
      >
        {/* Grid hexagons */}
        {gridLevels.map((level) => {
          const pts = dimensions.map((_, i) => polar(i, level))
          const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z'
          return (
            <path
              key={`grid-${level}`}
              d={d}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="1"
              opacity={0.5}
            />
          )
        })}

        {/* Axis lines */}
        {axes.map((ax, i) => (
          <line
            key={`axis-${i}`}
            x1={CX}
            y1={CY}
            x2={ax.x2}
            y2={ax.y2}
            stroke="var(--color-border)"
            strokeWidth="1"
            opacity={0.4}
          />
        ))}

        {/* Axis labels */}
        {dimensions.map((dim, i) => {
          const p = axes[i].labelPos
          return (
            <text
              key={`label-${i}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[13px] font-medium"
              fill="var(--color-text-secondary)"
            >
              {dim.label}
            </text>
          )
        })}

        {/* Center label */}
        <text
          x={CX}
          y={CY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[11px] font-bold uppercase tracking-wider"
          fill="var(--color-text-tertiary)"
          style={{ pointerEvents: 'none' }}
        >
          Synova
        </text>

        {/* Industry Average polygon */}
        <path
          ref={industryPathRef}
          d={polygonPath(industryPoints)}
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity={reducedMotion ? 1 : undefined}
        />

        {/* Synova polygon */}
        <path
          ref={synovaPathRef}
          d={polygonPath(synovaPoints)}
          fill="var(--color-accent-blue)"
          stroke="var(--color-accent-blue)"
          strokeWidth="2.5"
          opacity={reducedMotion ? 0.25 : undefined}
          fillOpacity={reducedMotion ? 0.2 : undefined}
        />

        {/* Synova data points */}
        {synovaPoints.map((_, i) => {
          const p = polar(i, synovaPoints[i])
          return (
            <circle
              key={`dot-${i}`}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="var(--color-accent-blue)"
              stroke="white"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
          )
        })}

        {/* Legend */}
        <g transform="translate(80, 360)">
          <line x1="0" y1="0" x2="16" y2="0" stroke="var(--color-accent-blue)" strokeWidth="2.5" />
          <text x="22" y="4" className="text-[12px]" fill="var(--color-text)" dominantBaseline="middle">
            Synova
          </text>
          <line x1="100" y1="0" x2="116" y2="0" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeDasharray="4 3" />
          <text x="122" y="4" className="text-[12px]" fill="var(--color-text-secondary)" dominantBaseline="middle">
            Industry Avg
          </text>
        </g>
      </svg>
    </div>
  )
}
