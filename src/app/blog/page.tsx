import type { Metadata } from 'next'
import { V2CaseStudyEditorial, V2PageFrame, V2TechnologyTopology } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export interface BlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: Date | null
  viewCount: number
  category: { id: string; name: string; slug: string }
  author: { id: string; name: string; image: string | null }
}

export interface CategorySummary {
  id: string
  name: string
  slug: string
  _count: { posts: number }
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  total: number
}

export const metadata: Metadata = {
  title: 'Blog and Insights | Synova Infotech',
  description: 'Executive and engineering analysis on AI, cloud, cybersecurity, architecture, and enterprise software delivery.',
}

export default function BlogListPage() {
  return (
    <V2PageFrame content={v2Pages.blog}>
      <V2CaseStudyEditorial />
      <V2TechnologyTopology />
    </V2PageFrame>
  )
}
