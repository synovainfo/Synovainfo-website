import type { Metadata } from 'next'
import { V2CaseStudyEditorial, V2PageFrame, V2ProcessRail } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export interface CaseStudyPageData {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  content: Record<string, unknown> | null
  publishedAt: Date | null
}

export const metadata: Metadata = {
  title: 'Case Studies | Synova Infotech',
  description: 'Enterprise implementation stories covering problem framing, architecture, delivery governance, adoption, and business outcomes.',
}

export default function CaseStudiesPage() {
  return (
    <V2PageFrame content={v2Pages.caseStudies}>
      <V2CaseStudyEditorial />
      <V2ProcessRail />
    </V2PageFrame>
  )
}
