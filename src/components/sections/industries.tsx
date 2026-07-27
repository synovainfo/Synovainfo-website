import { industries } from '@/data/industries'
import { IndustriesClient } from './industries-client'

export async function Industries() {
  return <IndustriesClient initialIndustries={industries} />
}


