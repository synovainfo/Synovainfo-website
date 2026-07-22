'use client'

import { useReducedMotion } from 'framer-motion'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { ProcessTimeline } from '@/components/ui/process-timeline'

export function Process() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <SectionWrapper id="process">
      <SectionHeader
        badge="Our Development Process"
        title="Enterprise-Grade Delivery Methodology"
        subtitle="A structured, battle-tested 8-stage methodology that ensures every project delivers on time, within budget, and above expectations."
        alignment="center"
      />

      <ProcessTimeline prefersReducedMotion={prefersReducedMotion} />
    </SectionWrapper>
  )
}
