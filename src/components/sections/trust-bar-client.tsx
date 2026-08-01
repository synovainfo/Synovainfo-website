'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ShieldCheck, Cpu } from 'lucide-react'

export interface TrustBarPartner {
  id: string
  name: string
  role: string | null
}

export interface TrustBarCertification {
  id: string
  name: string
}

interface TrustBarClientProps {
  partners: TrustBarPartner[]
  certifications: TrustBarCertification[]
}

// ── Trust Bar Client Component ───────────────────────────────────

export function TrustBarClient({ partners, certifications }: TrustBarClientProps) {
  const shouldReduceMotion = useReducedMotion()
  // Duplicate the list once for a seamless loop; the duplicate is aria-hidden.
  const looped = [...partners, ...partners]

  return (
    <section className="relative z-20 overflow-hidden border-y border-slate-200 bg-white py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-corporate-gold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-corporate-gold" />
          Technology Ecosystem
        </div>
        {certifications.length > 0 && (
          <div className="flex gap-4 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            {certifications.map((cert, i) => (
              <span key={cert.id} className="flex items-center gap-4">
                {i > 0 && <span aria-hidden="true">•</span>}
                {cert.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Logo Marquee */}
      {partners.length > 0 && (
        <div className="group relative flex w-full overflow-hidden mask-gradient-edges py-2">
          <motion.div
            animate={shouldReduceMotion ? undefined : { x: ['0%', '-50%'] }}
            transition={
              shouldReduceMotion
                ? undefined
                : { repeat: Infinity, ease: 'linear', duration: 40 }
            }
            className="flex whitespace-nowrap gap-8 pr-8 w-max group-hover:[animation-play-state:paused]"
          >
            {looped.map((partner, idx) => (
              <div
                key={`${partner.id}-${idx}`}
                aria-hidden={idx >= partners.length}
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-3 shadow-sm transition-all duration-500 hover:border-corporate-gold/60 hover:shadow-md cursor-default group/card"
              >
                <Cpu className="h-5 w-5 text-slate-400 group-hover/card:text-corporate-gold transition-colors duration-500" />
                <span className="text-sm font-bold tracking-wide text-slate-600 group-hover/card:text-corporate-navy transition-colors duration-500">
                  {partner.name}
                </span>
                {partner.role && (
                  <span className="rounded-md bg-orange-50 border border-corporate-gold/20 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase text-corporate-gold">
                    {partner.role}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  )
}
