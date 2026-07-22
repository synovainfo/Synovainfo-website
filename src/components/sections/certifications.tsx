'use client'

import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { CertBadge } from '@/components/ui/cert-badge'
import { certifications } from '@/data/certifications'

export function Certifications() {
  return (
    <SectionWrapper id="certifications">
      <SectionHeader
        badge="Certifications & Compliance"
        title="Enterprise-Grade Quality Standards"
        subtitle="Our commitment to excellence is validated by global standards and industry partnerships — ensuring every solution meets the highest benchmarks."
        alignment="center"
      />

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {certifications.map((cert, i) => (
            <CertBadge
              key={cert.id}
              name={cert.name}
              description={cert.description}
              icon={cert.icon}
              index={i}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
