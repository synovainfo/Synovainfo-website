import { prisma } from '@/lib/prisma'
import { Hero } from '@/components/sections/hero'
import { TrustBar } from '@/components/sections/trust-bar'
import { TransformationShowcase } from '@/components/sections/transformation-showcase'
import { Services } from '@/components/sections/services'
import { Industries } from '@/components/sections/industries'
import { WhySynova } from '@/components/sections/why-synova'
import { Process } from '@/components/sections/process'
import { Technologies } from '@/components/sections/technologies'
import { CaseStudies } from '@/components/sections/case-studies'
import { Testimonials } from '@/components/sections/testimonials'
import { Stats } from '@/components/sections/stats'
import { Insights } from '@/components/sections/insights'
import { Careers } from '@/components/sections/careers'
import { Contact } from '@/components/sections/contact'
import { Clients } from '@/components/sections/clients'
import { About } from '@/components/sections/about'
import { CoreValues } from '@/components/sections/core-values'

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
      hero: Hero,
      'trust-bar': TrustBar,
      'transformation-showcase': TransformationShowcase,
      services: Services,
      industries: Industries,
      'why-synova': WhySynova,
      process: Process,
      technologies: Technologies,
      'case-studies': CaseStudies,
      testimonials: Testimonials,
      stats: Stats,
      insights: Insights,
      careers: Careers,
      contact: Contact,
      clients: Clients,
      about: About,
      'core-values': CoreValues,
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

  // Default Fortune 500 15-Section Enterprise Homepage Sequence
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Hero />
      <TrustBar />
      <TransformationShowcase />
      <Services />
      <Industries />
      <WhySynova />
      <Process />
      <Technologies />
      <CaseStudies />
      <Testimonials />
      <Stats />
      <Insights />
      <About />
      <CoreValues />
      <Careers />
      <Contact />
      <Clients />
    </div>
  )
}

