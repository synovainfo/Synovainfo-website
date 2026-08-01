import { prisma } from '@/lib/prisma'
import { TrustBar } from '@/components/sections/trust-bar'
import { TransformationShowcase } from '@/components/sections/transformation-showcase'
import { WhySynova } from '@/components/sections/why-synova'
import { Testimonials } from '@/components/sections/testimonials'
import { Stats } from '@/components/sections/stats'
import { Insights } from '@/components/sections/insights'
import { Careers } from '@/components/sections/careers'
import { Contact } from '@/components/sections/contact'
import { Clients } from '@/components/sections/clients'
import { About } from '@/components/sections/about'
import { CoreValues } from '@/components/sections/core-values'

import {
  V2CaseStudyEditorial,
  V2IndustryAtlas,
  V2ProcessRail,
  V2ServicesShowcase,
  V2TechnologyTopology,
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
      'why-synova': WhySynova,
      process: V2ProcessRail,
      technologies: V2TechnologyTopology,
      'case-studies': V2CaseStudyEditorial,
      testimonials: Testimonials,
      stats: Stats,
      insights: Insights,
      careers: Careers,
      contact: Contact,
      clients: Clients,
      about: About,
      'core-values': CoreValues,
      cta: V2Cta,
    }

    return (
      <div className="flex flex-col w-full overflow-x-hidden">
        {dbSections.map((section) => {
          const Component = sectionComponents[section.sectionType]
          if (!Component) return null
          return <Component key={section.id} />
        })}
      </div>
    )
  }

  // Default Fortune 500 Enterprise Homepage Sequence (V2 + V1 Rich Content)
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <SynovaHero />
      <TrustBar />
      <TransformationShowcase />
      <V2ServicesShowcase />
      <V2IndustryAtlas />
      <V2ProcessRail />
      <WhySynova />
      <V2TechnologyTopology />
      <V2CaseStudyEditorial />
      <Testimonials />
      <Stats />
      <Insights />
      <About />
      <CoreValues />
      <Careers />
      <Clients />
      <V2Cta />
      <Contact />
    </div>
  )
}

