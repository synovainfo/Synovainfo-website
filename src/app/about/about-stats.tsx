'use client'

import { StatCounter } from '@/components/ui/stat-counter'

interface DbStat {
  id: string
  label: string
  value: string
  prefix: string | null
  suffix: string | null
}

export function AboutStats({ stats }: { stats: DbStat[] }) {
  const mappedStats = stats.map((s) => ({
    id: s.id,
    label: s.label,
    value: parseInt(s.value, 10) || 0,
    prefix: s.prefix ?? '',
    suffix: s.suffix ?? '',
  }))

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mappedStats.map((stat, i) => (
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
  )
}
