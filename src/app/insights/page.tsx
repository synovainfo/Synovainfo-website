import type { Metadata } from 'next'
import { V2CaseStudyEditorial, V2PageFrame, V2TechnologyTopology } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const metadata: Metadata = {
  title: 'Insights | Synova Infotech',
  description: 'Executive intelligence for technology modernization, architecture governance, AI adoption, cloud platforms, and secure delivery.',
}

export default function InsightsPage() {
  return (
    <V2PageFrame content={v2Pages.insights}>
      <V2CaseStudyEditorial />
      <V2TechnologyTopology />
    </V2PageFrame>
  )
}
