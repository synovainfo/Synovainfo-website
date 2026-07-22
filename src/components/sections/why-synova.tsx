'use client'

import { type FC } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Users,
  Layers,
  Shield,
  Zap,
  Headphones,
  Cloud,
  Brain,
  Code2,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { RadarChart } from '@/components/ui/radar-chart'
import { MiniStat } from '@/components/ui/mini-stat'
import { advantages, type Advantage } from '@/data/advantages'

// ─── Icon Resolver ───────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
  Users,
  Layers,
  Shield,
  Zap,
  Headphones,
  Cloud,
  Brain,
  Code2,
}

function AdvantageIcon({ iconName }: { iconName: string }) {
  const Icon = iconMap[iconName]
  if (!Icon) return null
  return <Icon className="h-6 w-6" />
}

// ─── Advantage Card ──────────────────────────────────────────────
interface AdvantageCardProps {
  advantage: Advantage
  index: number
  prefersReducedMotion: boolean | null
}

const AdvantageCard: FC<AdvantageCardProps> = ({
  advantage,
  index,
  prefersReducedMotion,
}) => {
  const content = (
    <div
      className={cn(
        'group relative rounded-xl border border-[var(--glass-border)]',
        'bg-[var(--glass-bg)] p-5 shadow-sm backdrop-blur-xl',
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

      <div className="relative z-10 flex items-start gap-4">
        {/* Icon */}
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
            'bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-[var(--color-accent-cyan)]/10',
            'text-[var(--color-accent-blue)] transition-colors duration-300',
            'group-hover:from-[var(--color-accent-blue)]/20 group-hover:to-[var(--color-accent-cyan)]/20',
            'group-hover:text-[var(--color-accent-cyan)]',
          )}
        >
          <AdvantageIcon iconName={advantage.icon} />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <h3 className="font-heading text-base font-semibold text-[var(--color-text)]">
            {advantage.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {advantage.description}
          </p>
        </div>
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
    >
      {content}
    </motion.div>
  )
}

// ─── Data stats for "By the Numbers" ─────────────────────────────
const stats = [
  { value: 99, suffix: '%', label: 'Client Satisfaction' },
  { value: 50, suffix: '+', label: 'Enterprise Clients' },
  { value: 10, suffix: '+', label: 'Years Experience' },
  { value: 200, suffix: '+', label: 'Projects Delivered' },
]

// ─── Section Component ───────────────────────────────────────────
export function WhySynova() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <SectionWrapper id="why-synova">
      <SectionHeader
        badge="Why Synova"
        title="Built for Enterprise Excellence"
        subtitle="We combine deep technical expertise with enterprise discipline to deliver solutions that outperform. Here's what sets us apart."
        alignment="center"
      />

      {/* Two-column layout */}
      <div className="grid gap-10 lg:grid-cols-5">
        {/* Left: Advantages grid */}
        <div className="lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            {advantages.map((adv, index) => (
              <AdvantageCard
                key={adv.id}
                advantage={adv}
                index={index}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </div>

        {/* Right: Radar chart + Stats */}
        <div className="flex flex-col items-center justify-center gap-8 lg:col-span-2">
          <RadarChart className="w-full" />

          {/* Divider */}
          <div className="h-px w-3/4 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

          {/* By the Numbers */}
          <div className="w-full">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]">
              By the Numbers
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <MiniStat
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
