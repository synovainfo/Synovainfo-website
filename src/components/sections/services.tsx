import { services } from '@/data/services'
import { ServicesClient } from './services-client'

export async function Services() {
  return <ServicesClient initialServices={services} />
}


