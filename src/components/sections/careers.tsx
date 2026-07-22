'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  MapPin,
  Briefcase,
  ArrowUpRight,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import {
  culturePillars,
  benefits,
  positions,
  type Position,
} from '@/data/careers'

/* ------------------------------------------------------------------ */
/*  Position Type Badge                                                */
/* ------------------------------------------------------------------ */

function TypeBadge({ type }: { type: Position['type'] }) {
  const styles: Record<Position['type'], string> = {
    remote: 'bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)]',
    hybrid: 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]',
    onsite: 'bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple)]',
  }

  return (
    <span
      className={cn(
        'inline-block rounded-full px-3 py-0.5 text-xs font-medium',
        styles[type],
      )}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Culture Pillar Card                                                */
/* ------------------------------------------------------------------ */

function CultureCard({
  icon: Icon,
  title,
  description,
  index,
  prefersReducedMotion,
}: {
  icon: typeof culturePillars[number]['icon']
  title: string
  description: string
  index: number
  prefersReducedMotion: boolean | null
}) {
  const content = (
    <div
      className={cn(
        'group relative rounded-xl border border-[var(--glass-border)]',
        'bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-xl',
        'transition-all duration-300',
        'hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg',
      )}
    >
      {/* Hover gradient overlay */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300',
          'bg-gradient-to-br from-[var(--color-accent-blue)]/[0.04] to-[var(--color-accent-cyan)]/[0.04]',
          'group-hover:opacity-100',
        )}
        aria-hidden
      />

      <div className="relative z-10">
        <div
          className={cn(
            'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg',
            'bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-[var(--color-accent-cyan)]/10',
            'text-[var(--color-accent-blue)] transition-colors duration-300',
            'group-hover:from-[var(--color-accent-blue)]/20 group-hover:to-[var(--color-accent-cyan)]/20',
            'group-hover:text-[var(--color-accent-cyan)]',
          )}
        >
          <Icon className="h-6 w-6" />
        </div>

        <h3 className="mb-2 font-heading text-lg font-semibold text-[var(--color-text)]">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
    </div>
  )

  if (prefersReducedMotion) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
    >
      {content}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Benefit Card                                                       */
/* ------------------------------------------------------------------ */

function BenefitCard({
  icon: Icon,
  title,
  description,
  index,
  prefersReducedMotion,
}: {
  icon: typeof benefits[number]['icon']
  title: string
  description: string
  index: number
  prefersReducedMotion: boolean | null
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
          'bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)]',
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-heading text-base font-semibold text-[var(--color-text)]">
          {title}
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
    </div>
  )

  if (prefersReducedMotion) return content

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
    >
      {content}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Position Card                                                      */
/* ------------------------------------------------------------------ */

function PositionCard({
  position,
  index,
  prefersReducedMotion,
}: {
  position: Position
  index: number
  prefersReducedMotion: boolean | null
}) {
  const handleApplyClick = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
      // Dispatch custom event for contact form to pick up
      window.dispatchEvent(
        new CustomEvent('prefill-inquiry', {
          detail: { type: 'career', position: position.title },
        }),
      )
    }
  }

  const content = (
    <div
      className={cn(
        'group relative rounded-xl border border-[var(--glass-border)]',
        'bg-[var(--glass-bg)] p-5 shadow-sm backdrop-blur-xl',
        'transition-all duration-300',
        'hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg',
        'cursor-pointer',
      )}
      onClick={handleApplyClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleApplyClick()
      }}
      tabIndex={0}
      role="button"
      aria-label={`Apply for ${position.title}`}
    >
      {/* Hover gradient overlay */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300',
          'bg-gradient-to-br from-[var(--color-accent-blue)]/[0.04] to-[var(--color-accent-cyan)]/[0.04]',
          'group-hover:opacity-100',
        )}
        aria-hidden
      />

      <div className="relative z-10">
        {/* Title + Chevron */}
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-heading text-base font-semibold text-[var(--color-text)]">
            {position.title}
          </h3>
          <ArrowUpRight
            className={cn(
              'mt-0.5 h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]',
              'transition-all duration-300',
              'group-hover:text-[var(--color-accent-blue)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
            )}
          />
        </div>

        {/* Meta */}
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {position.department}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {position.location}
          </span>
          <TypeBadge type={position.type} />
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {position.description}
        </p>
      </div>
    </div>
  )

  if (prefersReducedMotion) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
    >
      {content}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Growth Path SVG — career progression visual                        */
/* ------------------------------------------------------------------ */

function GrowthPath({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  const stages = useMemo(
    () => [
      { label: 'Associate', cx: 60, cy: 240, color: 'var(--color-accent-blue)' },
      { label: 'Mid-Level', cx: 180, cy: 160, color: 'var(--color-accent-cyan)' },
      { label: 'Senior', cx: 300, cy: 100, color: 'var(--color-accent-emerald)' },
      { label: 'Lead', cx: 420, cy: 160, color: 'var(--color-accent-purple)' },
      { label: 'Architect', cx: 540, cy: 240, color: 'var(--color-accent-blue)' },
    ],
    [],
  )

  const pathAnim = prefersReducedMotion
    ? {}
    : {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true },
        transition: { duration: 1.5, ease: 'easeInOut' as const },
      }

  const nodeEnter = (i: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { scale: 0, opacity: 0 },
          whileInView: { scale: 1, opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.4, delay: 0.6 + i * 0.15, ease: 'backOut' as const },
        }

  return (
    <div className="w-full">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]">
        Your Growth Path at Synova
      </p>
      <svg
        viewBox="0 0 600 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        aria-hidden="true"
        role="img"
      >
        <defs>
          <radialGradient id="gpGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent-blue)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gpGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent-blue)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--color-accent-emerald)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-accent-purple)" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Background glow */}
        <rect x="30" y="20" width="540" height="280" rx="140" fill="url(#gpGlow)" />

        {/* Curved path connecting stages */}
        <motion.path
          d="M60 240 Q120 300 180 160 Q240 60 300 100 Q360 140 420 160 Q480 180 540 240"
          stroke="url(#gpGrad)"
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
          {...pathAnim}
        />

        {/* Animated dots along the path */}
        {!prefersReducedMotion && (
          <motion.circle
            r={4}
            fill="var(--color-accent-emerald)"
            initial={{ offsetDistance: '0%' }}
            whileInView={{ offsetDistance: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1 }}
            style={{ offsetPath: "path('M60 240 Q120 300 180 160 Q240 60 300 100 Q360 140 420 160 Q480 180 540 240')" }}
          />
        )}

        {/* Stage nodes */}
        {stages.map((stage, i) => (
          <motion.g key={stage.label} {...nodeEnter(i)}>
            {/* Outer glow ring */}
            <circle
              cx={stage.cx}
              cy={stage.cy}
              r={20}
              fill={stage.color}
              fillOpacity={0.08}
            />
            {/* Node circle */}
            <circle
              cx={stage.cx}
              cy={stage.cy}
              r={10}
              fill={stage.color}
              fillOpacity={0.9}
            />
            {/* Inner highlight */}
            <circle
              cx={stage.cx - 3}
              cy={stage.cy - 3}
              r={4}
              fill="white"
              fillOpacity={0.35}
            />
            {/* Label */}
            <text
              x={stage.cx}
              y={stage.cy + 38}
              textAnchor="middle"
              fill="var(--color-text-secondary)"
              fontSize={12}
              fontWeight={500}
              fontFamily="var(--font-sans)"
            >
              {stage.label}
            </text>
          </motion.g>
        ))}

        {/* Directional arrow at end */}
        {!prefersReducedMotion && (
          <motion.g
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.8 }}
          >
            <path
              d="M555 255 L570 240 L585 255"
              stroke="var(--color-accent-emerald)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <text
              x={570}
              y={278}
              textAnchor="middle"
              fill="var(--color-accent-emerald)"
              fontSize={11}
              fontWeight={600}
              fontFamily="var(--font-sans)"
            >
              Director
            </text>
          </motion.g>
        )}

        {/* Static fallback arrow */}
        {prefersReducedMotion && (
          <g>
            <path
              d="M555 255 L570 240 L585 255"
              stroke="var(--color-accent-emerald)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <text
              x={570}
              y={278}
              textAnchor="middle"
              fill="var(--color-accent-emerald)"
              fontSize={11}
              fontWeight={600}
              fontFamily="var(--font-sans)"
            >
              Director
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Careers Section                                                    */
/* ------------------------------------------------------------------ */

export function Careers() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <SectionWrapper id="careers">
      <SectionHeader
        badge="Careers"
        title="Build the Future With Us"
        subtitle="Join a team that values innovation, invests in your growth, and empowers you to make a real impact in enterprise technology."
        alignment="center"
      />

      {/* ─── Culture Pillars ─── */}
      <div className="mb-20">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]">
          Our Culture
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {culturePillars.map((pillar, index) => (
            <CultureCard
              key={pillar.title}
              icon={pillar.icon}
              title={pillar.title}
              description={pillar.description}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>

      {/* ─── Benefits + Growth Path ─── */}
      <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Benefits */}
        <div>
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]">
            What We Offer
          </p>
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={benefit.title}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                index={index}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </div>

        {/* Growth Path */}
        <div className="flex items-center justify-center">
          <GrowthPath prefersReducedMotion={prefersReducedMotion} />
        </div>
      </div>

      {/* ─── Open Positions ─── */}
      <div className="mb-12">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]">
          Open Positions
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {positions.map((position, index) => (
            <PositionCard
              key={position.id}
              position={position}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>

      {/* ─── CTA ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center"
      >
        <p className="mb-6 text-base text-[var(--color-text-secondary)]">
          Don&apos;t see the right fit? We&apos;re always looking for talented people.
        </p>
        <a
          href="#contact"
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-6 py-3',
            'bg-[var(--color-accent-blue)] text-white',
            'font-heading text-sm font-semibold',
            'shadow-lg shadow-[var(--color-accent-blue)]/20',
            'transition-all duration-300',
            'hover:bg-[var(--color-accent-cyan)] hover:shadow-lg hover:shadow-[var(--color-accent-cyan)]/20',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
          )}
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent('prefill-inquiry', {
                detail: { type: 'career', position: 'General Application' },
              }),
            )
          }}
        >
          <Send className="h-4 w-4" />
          Apply Now
        </a>
      </motion.div>
    </SectionWrapper>
  )
}
