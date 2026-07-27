import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { CareersList } from './careers-list'
import { V2Hero, V2Cta } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const metadata: Metadata = {
  title: 'Careers | Synova Infotech',
  description: 'Open roles at Synova Infotech for engineers, designers, consultants, and delivery professionals building enterprise systems.',
}

export default async function CareersPage() {
  const careers = await prisma.career.findMany({
    where: { status: true, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  })

  const mapped = careers.map((career) => ({
    id: career.id,
    title: career.title,
    slug: career.slug,
    department: career.department,
    location: career.location,
    type: career.type,
    salaryMin: career.salaryMin,
    salaryMax: career.salaryMax,
  }))

  const departments = [...new Set(mapped.map((career) => career.department).filter(Boolean))] as string[]
  const locations = [...new Set(mapped.map((career) => career.location).filter(Boolean))] as string[]

  return (
    <>
      <V2Hero content={v2Pages.careers} />
      <CareersList careers={mapped} departments={departments} locations={locations} />
      <V2Cta />
    </>
  )
}
