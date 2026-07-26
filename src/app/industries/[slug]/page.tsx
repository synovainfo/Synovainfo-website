import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { IndustryDetailClient } from './industry-detail-client'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface MappedService {
  id: string
  title: string
  slug: string
  shortDescription: string
  icon: string
}

interface MappedIndustryDetail {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  capabilities: string[]
  services: MappedService[]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const industry = await prisma.industry.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
    },
  })

  if (!industry) return {}

  const description = industry.description
    ? industry.description.slice(0, 160)
    : `${industry.name} industry solutions by Synova Infotech — enterprise technology tailored to sector-specific challenges.`

  return {
    title: industry.name,
    description,
    openGraph: {
      title: `${industry.name} Industry Solutions | Synova Infotech`,
      description,
    },
  }
}

export default async function IndustryDetailPage({ params }: PageProps) {
  const { slug } = await params

  const industry = await prisma.industry.findUnique({
    where: { slug },
    include: {
      services: {
        where: { service: { status: true } },
        include: {
          service: {
            select: {
              id: true,
              title: true,
              slug: true,
              shortDescription: true,
              icon: true,
            },
          },
        },
      },
    },
  })

  if (!industry || !industry.status) {
    notFound()
  }

  const mapped: MappedIndustryDetail = {
    id: industry.id,
    name: industry.name,
    slug: industry.slug,
    description: industry.description ?? '',
    icon: industry.icon ?? 'Building2',
    capabilities: (industry.capabilities as string[]) ?? [],
    services: industry.services
      .filter((si) => si.service)
      .map((si) => ({
        id: si.service.id,
        title: si.service.title,
        slug: si.service.slug,
        shortDescription: si.service.shortDescription ?? '',
        icon: si.service.icon ?? 'Code2',
      })),
  }

  return <IndustryDetailClient industry={mapped} />
}
