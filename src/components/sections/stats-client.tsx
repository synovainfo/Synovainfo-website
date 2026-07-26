'use client'

import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Zap, Server, Globe2, ArrowRight } from 'lucide-react'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import type { Stat } from '@/data/stats'

interface StatsClientProps {
  initialStats: Stat[]
}

export function StatsClient({ initialStats }: StatsClientProps) {
  return (
    <SectionWrapper id="stats" className="bg-[#080E18] text-white py-24 border-t border-white/10">
      <SectionHeader
        badge="Chapter 7: Real-Time Telemetry & SLA Outcomes"
        title="Live Executive Telemetry & Performance Dashboard"
        subtitle="Real-time monitoring across 250+ enterprise deployments, evaluating sub-5ms edge latency, throughput velocity, and SLA uptime."
        alignment="center"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-12 items-center max-w-6xl mx-auto">
        {/* Left Telemetry SVG Graph */}
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl border border-white/15 bg-zinc-950/90 p-4 md:p-6 shadow-2xl overflow-hidden">
            <img
              src="/images/home/realistic/analytics-dashboard.jpg"
              alt="Live Telemetry Analytics Dashboard"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right Executive KPI Telemetry Widgets */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Global Edge Latency</span>
              <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-2">4.2 ms</div>
            <div className="text-xs text-zinc-400 mt-1 font-light">Sub-5ms response across 14 global edge regions</div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Event Stream Throughput</span>
              <Server className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-2">1.4M req/sec</div>
            <div className="text-xs text-zinc-400 mt-1 font-light">Kafka CDC pipeline stream velocity with zero loss</div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Availability Guarantee</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-2">99.999%</div>
            <div className="text-xs text-zinc-400 mt-1 font-light">Contractual SLA uptime backed by multi-region failover</div>
          </div>
        </div>
      </div>

      {/* Original Lifetime Impact Metrics */}
      <div className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10 border-t border-white/10 pt-16">
          {initialStats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 mb-2">
                {stat.prefix}{stat.value}{stat.suffix}
              </div>
              <div className="text-sm font-bold tracking-widest uppercase text-blue-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

