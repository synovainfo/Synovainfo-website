'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Zap, Activity, Layers, Cpu, CheckCircle2, TrendingUp } from 'lucide-react'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { RadarChart } from '@/components/ui/radar-chart'

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
          <div className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
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
                      ? 'border-blue-500 bg-blue-500/5 shadow-xl dark:bg-blue-500/10'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-blue-400/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                      <Layers className={`h-4 w-4 ${isActive ? 'text-blue-500' : 'text-zinc-400'}`} />
                      {step.level}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      idx === 2 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-500/10 text-zinc-500'
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
              <div className="text-lg font-extrabold text-emerald-500">3.2x Average ROI</div>
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
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Synova Engineering
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" /> Industry Benchmark
            </span>
          </div>
        </div>
      </div>

      {/* Core Differentiators — Alternating timeline layout */}
      <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">Engineering Trust Framework</h3>
          <p className="text-[var(--color-text-secondary)]">Six pillars of enterprise-grade engineering excellence validated across 250+ deployments.</p>
        </div>
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-cyan-500 to-emerald-500 hidden md:block" />
          
          <div className="space-y-12">
            {initialAdvantages.map((adv, idx) => {
              const isEven = idx % 2 === 0
              return (
                <motion.div
                  key={adv.id}
                  initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-[var(--color-surface)] z-10 hidden md:block" />
                  
                  <div className="md:w-1/2 md:pl-0 pl-16">
                    <div className="bg-[var(--color-surface-secondary)] border border-[var(--color-border)] hover:border-blue-500/30 p-6 rounded-2xl transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-500/10 w-10 h-10 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Pillar 0{idx + 1}</span>
                      </div>
                      <h4 className="text-lg font-bold text-[var(--color-text)] mb-3">{adv.title}</h4>
                      <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                        {adv.description}
                      </p>
                    </div>
                  </div>
                  <div className="md:w-1/2 hidden md:block" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

