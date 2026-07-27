import type { Metadata } from 'next'
import { V2PageFrame, V2TechnologyTopology, V2ServicesShowcase } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const metadata: Metadata = {
  title: 'Technology Ecosystem | Synova Infotech',
  description: 'Synova technology ecosystem for cloud platforms, APIs, data, AI, observability, security, and governance.',
}

export default function TechnologiesPage() {
  return (
    <V2PageFrame content={v2Pages.technologies}>
      <V2TechnologyTopology />
      <V2ServicesShowcase />
    </V2PageFrame>
  )
}
