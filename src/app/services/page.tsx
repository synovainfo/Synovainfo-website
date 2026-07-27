import type { Metadata } from 'next'
import { V2PageFrame, V2ServicesShowcase, V2TechnologyTopology } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const metadata: Metadata = {
  title: 'Enterprise Services | Synova Infotech',
  description: 'Enterprise software, cloud, AI, data, cybersecurity, and managed technology services designed for secure business operations.',
}

export default function ServicesPage() {
  return (
    <V2PageFrame content={v2Pages.services}>
      <V2ServicesShowcase />
      <V2TechnologyTopology />
    </V2PageFrame>
  )
}
