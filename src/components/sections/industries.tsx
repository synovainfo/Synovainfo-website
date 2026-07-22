'use client'

import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { IndustryCard } from '@/components/ui/industry-card'
import { industries } from '@/data/industries'

export function Industries() {
  return (
    <SectionWrapper id="industries">
      <SectionHeader
        badge="Industries We Serve"
        title="Enterprise Solutions Across Every Sector"
        subtitle="Deep domain expertise spanning 13 industries — from manufacturing and healthcare to telecom and finance — delivering tailored technology solutions that address sector-specific challenges and regulatory requirements."
        alignment="center"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {industries.map((industry, index) => (
          <IndustryCard key={industry.id} industry={industry} index={index} />
        ))}
      </div>
    </SectionWrapper>
  )
}
