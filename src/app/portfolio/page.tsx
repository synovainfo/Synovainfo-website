import type { Metadata } from 'next'
import { V2CaseStudyEditorial, V2PageFrame, V2TechnologyTopology } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const metadata: Metadata = {
  title: 'Portfolio | Synova Infotech',
  description: 'Selected enterprise product systems, architecture patterns, and digital operations work from Synova Infotech.',
}

export default function PortfolioPage() {
  return (
    <V2PageFrame content={v2Pages.portfolio}>
      <V2CaseStudyEditorial />
      <V2TechnologyTopology />
    </V2PageFrame>
  )
}
