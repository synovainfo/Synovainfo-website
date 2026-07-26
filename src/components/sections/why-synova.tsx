import { advantages } from '@/data/advantages'
import { WhySynovaClient } from './why-synova-client'

export async function WhySynova() {
  return <WhySynovaClient initialAdvantages={advantages.slice(0, 3)} />
}


