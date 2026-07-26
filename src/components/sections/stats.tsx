import { stats } from '@/data/stats'
import { StatsClient } from './stats-client'

export async function Stats() {
  return <StatsClient initialStats={stats} />
}


