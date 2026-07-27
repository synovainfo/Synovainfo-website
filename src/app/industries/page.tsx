import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { IndustriesOverviewClient } from './industries-overview-client'

export const metadata: Metadata = {
  title: 'Industries We Serve',
  description:
    'Synova Infotech delivers enterprise technology solutions across 13 industries — from manufacturing and healthcare to finance, telecom, and beyond.',
  openGraph: {
    title: 'Industries We Serve | Synova Infotech',
    description:
      'Enterprise technology solutions spanning manufacturing, healthcare, retail, logistics, education, government, and more.',
  },
}

interface MappedIndustry {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  capabilities: string[]
}

export default async function IndustriesPage() {
  const industries = await prisma.industry.findMany({
    where: { status: true },
    orderBy: { createdAt: 'asc' },
  })

  const mappedIndustries: MappedIndustry[] = industries.map((ind) => ({
    id: ind.id,
    name: ind.name,
    slug: ind.slug,
    description: ind.description ?? '',
    icon: ind.icon ?? 'Building2',
    capabilities: (ind.capabilities as string[]) ?? [],
  }))

  return <IndustriesOverviewClient industries={mappedIndustries} />
}
