import { technologies } from '@/data/technologies'
import { TechnologiesClient } from './technologies-client'

export async function Technologies() {
  return <TechnologiesClient initialTechnologies={technologies} />
}


