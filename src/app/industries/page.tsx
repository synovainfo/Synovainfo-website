import type { Metadata } from 'next'
import { V2IndustryAtlas, V2PageFrame, V2ProcessRail } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const metadata: Metadata = {
  title: 'Industries | Synova Infotech',
  description: 'Domain-aware enterprise technology for manufacturing, healthcare, finance, logistics, retail, education, government, and telecom.',
}

export default function IndustriesPage() {
  return (
    <V2PageFrame content={v2Pages.industries}>
      <V2IndustryAtlas />
      <V2ProcessRail />
    </V2PageFrame>
  )
}
