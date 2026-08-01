import { prisma } from '@/lib/prisma'
import { stats as fallbackStats, type Stat } from '@/data/stats'
import { StatsClient } from './stats-client'

export async function Stats() {
  let initialStats: Stat[] = fallbackStats

  try {
    const dbStats = await prisma.statistic.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    })

    if (dbStats.length > 0) {
      initialStats = dbStats.map((s) => {
        const numeric = Number(s.value)
        return {
          id: s.id,
          value: Number.isNaN(numeric) ? s.value : numeric,
          prefix: s.prefix ?? undefined,
          suffix: s.suffix ?? '',
          label: s.label,
        }
      })
    }
  } catch (error) {
    console.error('Stats: database fallback engaged:', error)
  }

  return <StatsClient initialStats={initialStats} />
}


