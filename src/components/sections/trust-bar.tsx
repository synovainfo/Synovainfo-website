'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Cpu } from 'lucide-react'
import { certifications } from '@/data/certifications'

const PARTNERS = [
  { name: 'AWS Partner Network', role: 'Premier Tier' },
  { name: 'Microsoft Azure', role: 'Solutions Partner' },
  { name: 'Google Cloud', role: 'Enterprise Partner' },
  { name: 'NVIDIA AI ecosystem', role: 'Elite Network' },
  { name: 'Snowflake Data', role: 'Certified Partner' },
  { name: 'Salesforce Enterprise', role: 'Consulting Partner' },
  { name: 'Oracle Cloud', role: 'Infrastructure Partner' },
  { name: 'IBM Red Hat OpenShift', role: 'Cloud Partner' },
]

// ── Trust Bar Component ──────────────────────────────────────────

export function TrustBar() {
  return (
    <section className="relative z-20 overflow-hidden border-y border-white/5 bg-[#080E18] py-8">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#080E18]/50 to-[#080E18] pointer-events-none" />
      
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500/70" />
          Enterprise Trust Ecosystem
        </div>
        <div className="flex gap-4 text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">
          <span>ISO 27001</span>
          <span>•</span>
          <span>SOC 2 Type II</span>
          <span>•</span>
          <span>GDPR Ready</span>
        </div>
      </div>

      {/* Infinite Logo Marquee */}
      <div className="group relative flex w-full overflow-hidden mask-gradient-edges py-2">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 40,
          }}
          className="flex whitespace-nowrap gap-8 pr-8 w-max group-hover:[animation-play-state:paused]"
        >
          {/* We duplicate the partner list twice to ensure seamless looping */}
          {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
            <div
              key={`${partner.name}-${idx}`}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-3 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.08] hover:border-white/30 hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.3)] cursor-default group/card"
            >
              <Cpu className="h-5 w-5 text-zinc-400 group-hover/card:text-blue-400 transition-colors duration-500" />
              <span className="text-sm font-bold tracking-wide text-zinc-300 group-hover/card:text-white transition-colors duration-500">
                {partner.name}
              </span>
              <span className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase text-blue-400">
                {partner.role}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Original Certifications Row */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 px-4">
        {certifications.map((cert) => {
          const Icon = cert.icon
          return (
            <div key={cert.id} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              {Icon && <Icon className="w-4 h-4" />}
              <span className="text-xs font-semibold">{cert.name}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
