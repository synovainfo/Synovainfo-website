import type { Metadata } from 'next'
import { V2PageFrame, V2ServicesShowcase, V2TechnologyTopology } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const metadata: Metadata = {
  title: 'Enterprise Solutions | Synova Infotech',
  description: 'Reusable enterprise solution blueprints for cloud modernization, AI enablement, workflow automation, data platforms, and security governance.',
}

export default function SolutionsPage() {
  return (
    <V2PageFrame content={v2Pages.solutions}>
      <V2ServicesShowcase />
      <V2TechnologyTopology />
    </V2PageFrame>
  )
}
