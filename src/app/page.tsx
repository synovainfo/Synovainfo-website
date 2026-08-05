import { prisma } from '@/lib/prisma'
import { TrustBar } from '@/components/sections/trust-bar'
import { TransformationShowcase } from '@/components/sections/transformation-showcase'
import { Insights } from '@/components/sections/insights'
import { Contact } from '@/components/sections/contact'
import {
  V2IndustryAtlas,
  V2ServicesShowcase,
  V2Cta,
} from '@/components/v2/enterprise-visuals'
import { SynovaHero } from '@/components/sections/synova-hero'

export const revalidate = 60

export default async function Home() {
  let dbSections: Array<{ id: string; sectionType: string; isVisible: boolean; order: number }> = []
  try {
    dbSections = await prisma.homepageSection.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Database query fallback for homepage:', error)
  }

  // If Prisma has custom section configurations, render them dynamically
  if (dbSections.length > 0) {
    const sectionComponents: Record<string, React.ComponentType> = {
      hero: SynovaHero,
      'trust-bar': TrustBar,
      'transformation-showcase': TransformationShowcase,
      services: V2ServicesShowcase,
      industries: V2IndustryAtlas,
      insights: Insights,
      contact: Contact,
      cta: V2Cta,
    }

    return (
      <div className="flex flex-col w-full overflow-x-hidden">
        <SynovaHero />
        <TrustBar />
        <TransformationShowcase />
        <V2ServicesShowcase />
        <V2IndustryAtlas />
        <Insights />
        <V2Cta />
        <Contact />
      </div>
    )
  }

  // Default Fortune 500 Enterprise Homepage Sequence (Streamlined)
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <SynovaHero />
      <TrustBar />
      <TransformationShowcase />
      <V2ServicesShowcase />
      <V2IndustryAtlas />
      <Insights />
      <V2Cta />
      <Contact />
    </div>
  )
}

