'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Activity, ShieldCheck, Server } from 'lucide-react'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import type { Stat } from '@/data/stats'

interface StatsClientProps {
  initialStats: Stat[]
}

export function StatsClient({ initialStats }: StatsClientProps) {
  return (
    <SectionWrapper id="stats" className="bg-navy-dark text-white py-24 border-t border-white/10">
      <div className="mb-12 md:mb-16 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block rounded-full bg-corporate-gold/10 px-4 py-1.5 text-sm font-medium text-corporate-gold"
          style={{ marginBottom: '1rem' }}
        >
          Our Delivery Standards
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
        >
          Engineering Discipline &amp; Operational Excellence
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl"
        >
          The standards and practices we apply to every engagement — rigorous quality gates, observability-first architecture, and transparent delivery.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-12 items-center max-w-6xl mx-auto">
        {/* Left Telemetry SVG Graph */}
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl border border-white/15 bg-navy p-4 md:p-6 shadow-2xl overflow-hidden">
            <Image
              src="/images/home/stats-telemetry-dashboard.svg"
              alt="Live telemetry and SLA performance monitoring dashboard"
              width={800}
              height={450}
              loading="lazy"
              sizes="(min-width: 1024px) 640px, 100vw"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right Delivery Practice Widgets */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-corporate-gold">Performance-First Design</span>
              <Activity className="h-4 w-4 text-corporate-gold animate-pulse" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-2">Low-Latency</div>
            <div className="text-xs text-zinc-400 mt-1 font-light">Edge-ready architectures engineered for sub-second response times</div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-corporate-gold">Scalable Throughput</span>
              <Server className="h-4 w-4 text-corporate-gold" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-2">Event-Driven</div>
            <div className="text-xs text-zinc-400 mt-1 font-light">Streaming pipelines designed for high-volume, zero-loss data flow</div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-corporate-gold">Resilient by Default</span>
              <ShieldCheck className="h-4 w-4 text-corporate-gold" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-2">High Availability</div>
            <div className="text-xs text-zinc-400 mt-1 font-light">Multi-region failover patterns built into every reference architecture</div>
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
              <div className="text-4xl md:text-6xl font-extrabold text-white mb-2 leading-tight">
                {stat.prefix}{stat.value}{stat.suffix}
              </div>
              <div className="text-sm font-bold tracking-widest uppercase text-corporate-gold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
