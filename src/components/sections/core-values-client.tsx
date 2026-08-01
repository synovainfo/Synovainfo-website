'use client'

import { Lightbulb, Award, Handshake, ShieldCheck, type LucideIcon } from 'lucide-react'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { ValueCard } from '@/components/ui/value-card'

export interface CoreValueItem {
  id: string
  title: string
  description: string
  icon: string | null
}

// Map DB icon names to lucide components. Falls back to Lightbulb.
const ICON_MAP: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  award: Award,
  handshake: Handshake,
  'shield-check': ShieldCheck,
}

function resolveIcon(name: string | null): LucideIcon {
  if (!name) return Lightbulb
  return ICON_MAP[name.toLowerCase()] ?? Lightbulb
}

interface CoreValuesClientProps {
  values: CoreValueItem[]
}

export function CoreValuesClient({ values }: CoreValuesClientProps) {
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
          const Icon = resolveIcon(value.icon)
          return (
            <ValueCard
              key={value.id}
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
