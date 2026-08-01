'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { RadarChart } from '@/components/ui/radar-chart'
import { resolveIcon } from '@/lib/resolve-icon'

import type { Advantage } from '@/data/advantages'

interface WhySynovaClientProps {
  initialAdvantages: Advantage[]
}

const MATURITY_STEPS = [
  {
    level: 'Level 01: Monolith Legacy',
    status: 'High Debt & Latency',
    desc: 'Siloed relational databases, fragile deployment scripts, 3-day data lags, and reactive incident responses.',
    score: '32/100 Benchmark',
  },
  {
    level: 'Level 02: Cloud-Native Hybrid',
    status: 'Automated Containerization',
    desc: 'Kubernetes orchestration, gRPC service mesh, sub-10ms Redis caching, and automated CI/CD pipelines.',
    score: '78/100 Benchmark',
  },
  {
    level: 'Level 03: Autonomous Agentic AI',
    status: 'Synova Target State',
    desc: 'Zero-Trust mTLS security, Kafka CDC event streams, vLLM inference engines, and 99.999% SLA resilience.',
    score: '98/100 Industry Peak',
  },
]

/** Pillar visuals — unused home SVGs, each matching its advantage theme (dark navy panels). */
const PILLAR_IMAGES = [
  '/images/home/global-delivery-map.svg', // Experienced Team → global delivery network
  '/images/home/microservices-topology.svg', // Scalable Architecture → K8s mesh topology
  '/images/home/cybersecurity-shield.svg', // Security-First → zero-trust shield
]

export function WhySynovaClient({ initialAdvantages }: WhySynovaClientProps) {
  const [selectedLevel, setSelectedLevel] = useState(2)

  return (
    <SectionWrapper id="why-synova" className="bg-[var(--color-surface)] py-24">
      <SectionHeader
        badge="Chapter 5: Capability Maturity & ROI"
        title="Enterprise Capability Dashboard & Benchmark Scorecard"
        subtitle="Evaluate how Synova’s architectural maturity and zero-trust engineering standards outperform traditional IT consulting benchmarks."
        alignment="center"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 my-12 items-center max-w-6xl mx-auto">
        {/* Left Architecture Maturity Matrix */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-corporate-gold mb-2">
            Architecture Capability Maturity Matrix
          </div>

          <div className="space-y-3">
            {MATURITY_STEPS.map((step, idx) => {
              const isActive = idx === selectedLevel
              return (
                <button
                  key={step.level}
                  onClick={() => setSelectedLevel(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'border-corporate-gold bg-corporate-gold/5 shadow-xl shadow-corporate-gold/10'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-corporate-gold/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                      <Layers className={`h-4 w-4 ${isActive ? 'text-corporate-gold' : 'text-zinc-400'}`} />
                      {step.level}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      idx === 2 ? 'bg-corporate-gold/10 text-corporate-gold' : 'bg-zinc-500/10 text-zinc-500'
                    }`}>
                      {step.score}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-2 font-light leading-relaxed">
                    {step.desc}
                  </div>
                </button>
              )
            })}
          </div>

          {/* ROI Simulator Badge */}
          <div className="mt-6 p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[var(--color-text)]">Synova SLA Guarantee</div>
              <div className="text-xs text-[var(--color-text-secondary)]">Zero-Downtime Migration & 99.999% SLA Uptime</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-extrabold text-corporate-gold">3.2x Average ROI</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)]">Verified across 250+ Audits</div>
            </div>
          </div>
        </div>

        {/* Right Radar Chart Visualizer */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] shadow-xl">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-4 text-center">
            Capability Scorecard vs Industry Benchmark
          </div>
          <RadarChart className="w-full" />
          <div className="mt-4 flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-corporate-gold">
              <span className="h-2.5 w-2.5 rounded-full bg-corporate-gold" /> Synova Engineering
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" /> Industry Benchmark
            </span>
          </div>
        </div>
      </div>

      {/* Core Differentiators — ITHPL alternating image-text blocks */}
      <div className="mt-24 rounded-3xl border border-slate-200/70 bg-surface-secondary p-6 sm:p-10 lg:p-14">
        <div className="mb-14">
          <span className="section-label">Why Synova</span>
          <h3 className="mt-3 text-2xl lg:text-3xl font-bold text-corporate-navy mb-2">
            Engineering Trust <span className="text-gradient-orange">Framework</span>
          </h3>
          <p className="text-[var(--color-text-secondary)]">Six pillars of enterprise-grade engineering excellence validated across 250+ deployments.</p>
        </div>

        <div className="relative">
          {/* Vertical connector line — orange gradient timeline rail */}
          <div className="absolute left-8 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-corporate-gold via-corporate-gold-light to-corporate-gold-dark hidden md:block" />

          <div className="space-y-16 lg:space-y-24">
            {initialAdvantages.map((adv, idx) => {
              const isEven = idx % 2 === 0
              const PillarIcon = resolveIcon(adv.icon)
              const imageSrc = PILLAR_IMAGES[idx % PILLAR_IMAGES.length]
              return (
                <motion.div
                  key={adv.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative md:pl-20"
                >
                  {/* Timeline node */}
                  <div className="absolute left-8 top-10 -translate-x-1/2 z-10 hidden md:block h-5 w-5 rounded-full bg-corporate-gold border-4 border-white shadow-lg shadow-corporate-gold/30" />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
                    {/* Image block */}
                    <div className={`pl-16 md:pl-0 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="relative overflow-hidden rounded-2xl shadow-xl border border-slate-200/80 aspect-[4/3]">
                        <Image
                          src={imageSrc}
                          alt={`${adv.title} — Synova enterprise engineering`}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-cover"
                        />
                        <div className="absolute bottom-4 left-4 rounded-lg bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-sm">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-corporate-gold">
                            Pillar 0{idx + 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pillar card — white with orange icon badge */}
                    <div className={`pl-16 md:pl-0 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-corporate-gold/40 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-corporate-gold flex items-center justify-center shadow-lg shadow-corporate-gold/30">
                            <PillarIcon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-corporate-gold">
                            Pillar 0{idx + 1}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-corporate-navy mb-3">{adv.title}</h4>
                        <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                          {adv.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
