'use client'

import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { StatCounter } from '@/components/ui/stat-counter'
import { stats } from '@/data/stats'

export function Stats() {
  return (
    <SectionWrapper id="stats" dark className="relative overflow-hidden">
      {/* ── Animated background gradient ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-1/4 -top-1/4 h-[60vh] w-[60vw] animate-pulse rounded-full opacity-[0.04] blur-3xl"
          style={{ backgroundColor: 'var(--color-accent-blue)' }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 h-[50vh] w-[50vw] animate-pulse rounded-full opacity-[0.03] blur-3xl"
          style={{ backgroundColor: 'var(--color-accent-emerald)' }}
          // Slight animation delay for the second blob
        />
      </div>

      <SectionHeader
        badge="By the Numbers"
        title="Delivering Enterprise Excellence"
        subtitle="Our track record speaks through the metrics that matter — measuring impact across projects, clients, and geographies."
        alignment="center"
        dark
      />

      {/* ── Stats grid ── */}
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <StatCounter
              key={stat.id}
              value={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
              label={stat.label}
              index={i}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
