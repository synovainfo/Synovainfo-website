'use client'

import { Lightbulb, Award, Handshake, ShieldCheck } from 'lucide-react'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { ValueCard } from '@/components/ui/value-card'

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'Pioneering solutions that anticipate tomorrow\'s challenges and unlock new possibilities for enterprise growth.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'Uncompromising quality in every line of code, every architecture decision, and every client interaction.',
  },
  {
    icon: Handshake,
    title: 'Partnership',
    description:
      'Deep collaboration that transforms vendor relationships into strategic alliances built on trust and shared success.',
  },
  {
    icon: ShieldCheck,
    title: 'Integrity',
    description:
      'Transparent communication, ethical practices, and unwavering commitment to client confidentiality.',
  },
]

export function CoreValues() {
  return (
    <SectionWrapper id="core-values" dark>
      <SectionHeader
        badge="Our Values"
        title="What Drives Us"
        subtitle="The principles that guide every engagement, every architecture decision, and every line of code we deliver."
        alignment="center"
        dark
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value, index) => {
          const Icon = value.icon
          return (
            <ValueCard
              key={value.title}
              icon={<Icon className="h-6 w-6" />}
              title={value.title}
              description={value.description}
              index={index}
            />
          )
        })}
      </div>
    </SectionWrapper>
  )
}
