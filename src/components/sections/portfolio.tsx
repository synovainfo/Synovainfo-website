'use client'

import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { CaseStudyCard } from '@/components/ui/case-study-card'
import { caseStudies } from '@/data/case-studies'

export function Portfolio() {
  return (
    <SectionWrapper id="portfolio">
      <SectionHeader
        badge="Our Work"
        title="Enterprise Solutions That Deliver Results"
        subtitle="Real-world impact through technology — from IoT-enabled manufacturing floors to AI-optimized supply chains and cloud-native financial platforms. Each case study demonstrates our capability to architect, build, and deploy at scale."
        alignment="center"
      />

      <div className="space-y-8">
        {caseStudies.map((study, index) => (
          <CaseStudyCard key={study.id} study={study} index={index} />
        ))}
      </div>
    </SectionWrapper>
  )
}
