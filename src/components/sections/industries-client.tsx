'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe2, ArrowRight, Activity, MapPin } from 'lucide-react'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'

import type { Industry } from '@/data/industries'

interface IndustriesClientProps {
  initialIndustries: Industry[]
}

const REGIONAL_HUBS = [
  {
    id: 'india-hq',
    name: 'India & Global HQ (Pune)',
    type: 'Core R&D & Engineering Hub',
    metrics: '1,200+ Engineers • 24/7 Operations',
    compliance: 'ISO 27001 • CMMI Level 5',
    sectors: ['Banking & Fintech', 'Smart Manufacturing', 'Healthcare Tech', 'Automotive & EV'],
  },
  {
    id: 'north-america',
    name: 'North America Delivery Hub',
    type: 'Enterprise Solutions & Client Architecture',
    metrics: 'Sub-5ms Latency • Fortune 500 Partners',
    compliance: 'SOC 2 Type II • HIPAA Ready',
    sectors: ['Financial Services', 'Retail & E-Commerce', 'Logistics & Supply Chain'],
  },
  {
    id: 'emea',
    name: 'EMEA & UK Operations',
    type: 'Cloud Mesh & Security Governance',
    metrics: 'Multi-Region Failover • 99.999% SLA',
    compliance: 'GDPR Compliant • Cyber Essentials',
    sectors: ['Pharma & Life Sciences', 'Energy & Utilities', 'Telecommunications'],
  },
  {
    id: 'apac',
    name: 'Asia Pacific Hub (Singapore)',
    type: 'Edge WAN & Logistics Acceleration',
    metrics: 'Sub-10ms Anycast • 24/7 Managed Support',
    compliance: 'MAS TRM Guidelines Compliant',
    sectors: ['Global Logistics', 'Supply Chain Automation', 'Cross-Border Payments'],
  },
]

export function IndustriesClient({ initialIndustries }: IndustriesClientProps) {
  const [activeHubId, setActiveHubId] = useState(REGIONAL_HUBS[0]?.id || '')
  const currentHub = REGIONAL_HUBS.find((h) => h.id === activeHubId) || REGIONAL_HUBS[0]

  return (
    <SectionWrapper id="industries" className="bg-[var(--color-surface-secondary)] text-[var(--color-text)] py-24 border-y border-[var(--color-border-light)]">
      <SectionHeader
        badge="Global Enterprise Footprint"
        title="Engineering Excellence Across Key Industries"
        subtitle="Specialized architecture hubs delivering measurable outcomes across North America, EMEA, and Asia Pacific."
        alignment="center"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 my-12 items-center max-w-6xl mx-auto">
        {/* Left Interactive World Map */}
        <div className="group">
          <div className="relative rounded-3xl border border-slate-200 bg-white p-4 md:p-6 shadow-lg shadow-[var(--color-corporate-navy)]/5 overflow-hidden">
            <img
              src="/images/home/realistic/global-delivery-map.jpg"
              alt="Synova Global Delivery Network Map"
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Right Regional Telemetry Hub Details */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-corporate-gold)] mb-2">
            Select Regional Hub
          </div>

          <div className="space-y-2.5">
            {REGIONAL_HUBS.map((hub) => {
              const isActive = hub.id === activeHubId
              return (
                <button
                  key={hub.id}
                  onClick={() => setActiveHubId(hub.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'border-[var(--color-corporate-gold)] bg-white shadow-md shadow-[var(--color-corporate-gold)]/10'
                      : 'border-slate-200 bg-white hover:border-[var(--color-corporate-gold)]/60 hover:shadow-md hover:bg-[var(--color-corporate-gold)]/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--color-corporate-navy)] flex items-center gap-2">
                      <MapPin className={`h-4 w-4 ${isActive ? 'text-[var(--color-corporate-gold)]' : 'text-[var(--color-text-tertiary)]'}`} />
                      {hub.name}
                    </span>
                    {isActive ? (
                      <ArrowRight className="h-4 w-4 text-[var(--color-corporate-gold)]" />
                    ) : (
                      <Activity className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                    )}
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-1 font-light">{hub.type}</div>
                </button>
              )
            })}
          </div>

          {/* Active Hub Telemetry Card */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-[var(--color-corporate-gold)] shrink-0" />
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-corporate-navy)]">
                Live Hub SLA Metrics & Compliance
              </div>
            </div>
            <div className="text-xs font-semibold text-[var(--color-corporate-navy)]">{currentHub.metrics}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">Governance: <span className="text-[var(--color-corporate-navy)] font-medium">{currentHub.compliance}</span></div>

            <div className="pt-2 border-t border-slate-200">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Primary Sectors</div>
              <div className="flex flex-wrap gap-1.5">
                {currentHub.sectors.map((s) => (
                  <span key={s} className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Expertise — Horizontal scrollable metric cards */}
      <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-[var(--color-corporate-navy)] mb-2">Sector Performance Benchmarks</h3>
          <p className="text-slate-600">Verified engineering outcomes across our core industry verticals.</p>
        </div>
        <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-thin">
          {initialIndustries.map((industry, idx) => {
            const Icon = industry.icon
            return (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="snap-start shrink-0 w-[300px] bg-white border border-slate-200 hover:border-[var(--color-corporate-gold)]/60 hover:shadow-md p-6 rounded-2xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-[var(--color-corporate-gold)]/10 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-[var(--color-corporate-gold)]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[var(--color-corporate-gold)]" />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--color-corporate-gold)] uppercase tracking-wider">Live</span>
                </div>
                <h4 className="text-xl font-bold text-[var(--color-corporate-navy)] mb-2">{industry.name}</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">
                  {industry.description}
                </p>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Capability Score</span>
                    <span className="text-sm font-bold text-[var(--color-corporate-gold)]">94/100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-[var(--color-corporate-gold)] to-[var(--color-corporate-gold-light)]" />
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  {industry.capabilities.slice(0, 3).map((cap, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-corporate-gold)] shrink-0" />
                      {cap}
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
