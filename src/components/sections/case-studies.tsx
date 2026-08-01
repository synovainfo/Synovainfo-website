'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  ArrowRight,
  X,
  ShieldCheck,
  Cpu,
} from 'lucide-react'
import Link from 'next/link'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { caseStudies, type CaseStudy } from '@/data/case-studies'

// ── Case Studies Component ──────────────────────────────────────────

export function CaseStudies() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null)

  return (
    <SectionWrapper id="case-studies" className="bg-surface-secondary py-24" glow glowVariant="gold">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 mb-16 max-w-3xl">
          <span className="section-label inline-block">
            Proven Enterprise Impact
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-corporate-navy leading-[1.1]">
            Executive Case Studies &<br/> ROI Verification.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            How Synova partners with Fortune 500 leaders to architect secure, scalable, and high-performance digital ecosystems.
          </p>
        </div>

        {/* Magazine Spread Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Featured Case Study (Full width on mobile, spans 8 cols on desktop) */}
          {caseStudies.length > 0 && (
            <div
              className="lg:col-span-8 group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-corporate-gold/30 hover:shadow-md cursor-pointer flex flex-col justify-end min-h-[500px] p-8 md:p-12"
              onClick={() => setSelectedStudy(caseStudies[0])}
            >
              {/* Background gradient simulating a hero image */}
              <div className="absolute inset-0 bg-gradient-to-br from-corporate-gold/5 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(249,115,22,0.05),transparent_65%)] pointer-events-none" />
              
              <div className="relative z-10 w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-corporate-gold/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-corporate-gold">
                    <Building2 className="h-3.5 w-3.5" />
                    {caseStudies[0].industry}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    {caseStudies[0].timeline}
                  </span>
                </div>
                
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-corporate-navy leading-tight mb-4 group-hover:text-corporate-gold transition-colors">
                  {caseStudies[0].title}
                </h3>
                <p className="text-base text-slate-600 mb-8 line-clamp-2 max-w-xl">
                  {caseStudies[0].overview}
                </p>

                <div className="grid grid-cols-3 gap-6 border-t border-slate-200 pt-6">
                  {caseStudies[0].results.map((res, i) => (
                    <div key={i}>
                      <div className="text-2xl md:text-3xl font-extrabold text-corporate-gold">
                        {res.value}
                      </div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                        {res.metric}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute top-8 right-8 h-12 w-12 rounded-full bg-corporate-gold flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <ArrowRight className="h-5 w-5 text-white" />
              </div>
            </div>
          )}

          {/* Secondary Case Studies (Stack vertically on right side) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {caseStudies.slice(1, 3).map((study) => (
              <div
                key={study.id}
                className="group relative flex-1 flex flex-col justify-between rounded-3xl border border-slate-200 bg-white shadow-sm p-8 transition-all hover:border-corporate-gold/30 hover:shadow-md cursor-pointer min-h-[240px]"
                onClick={() => setSelectedStudy(study)}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center rounded-full bg-orange-50 border border-corporate-gold/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-corporate-gold">
                      {study.industry}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-corporate-gold transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-corporate-navy leading-snug mb-3 group-hover:text-corporate-gold transition-colors">
                    {study.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-6">
                    <div className="text-xl font-extrabold text-corporate-gold">
                      {study.results[0].value}
                    </div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
                      {study.results[0].metric}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedStudy && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[2rem] border border-white/10 bg-corporate-navy-dark p-8 md:p-12 text-white shadow-2xl custom-scrollbar"
            >
              <button
                onClick={() => setSelectedStudy(null)}
                className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-corporate-gold mb-4">
                <Building2 className="h-4 w-4" /> {selectedStudy.industry} Architecture Audit
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold pr-12 leading-[1.1] mb-8">
                {selectedStudy.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 my-8 border-y border-white/10 py-8">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-corporate-gold flex items-center gap-2 mb-4">
                    <ShieldCheck className="h-4 w-4" /> The Challenge
                  </h4>
                  <p className="text-sm text-slate-300 leading-[1.8] font-medium">
                    {selectedStudy.challenge}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-corporate-gold flex items-center gap-2 mb-4">
                    <Cpu className="h-4 w-4" /> Engineered Solution
                  </h4>
                  <p className="text-sm text-slate-300 leading-[1.8] font-medium">
                    {selectedStudy.solution}
                  </p>
                </div>
              </div>

              <div className="mb-10">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Verified Executive Metrics
                </h4>
                <div className="grid grid-cols-3 gap-4 bg-black/20 p-6 rounded-2xl border border-white/5 text-center">
                  {selectedStudy.results.map((res, i) => (
                    <div key={i}>
                      <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                        {res.value}
                      </div>
                      <div className="text-[9px] font-bold tracking-widest text-corporate-gold-light uppercase">
                        {res.metric}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/10 gap-6">
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedStudy.technologies.map(t => (
                    <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-slate-300 uppercase">
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  href="/contact"
                  onClick={() => setSelectedStudy(null)}
                  className="shrink-0 inline-flex items-center gap-2 rounded-full bg-corporate-gold px-8 py-3.5 text-xs font-bold text-white hover:bg-corporate-gold-dark transition-colors shadow-[0_0_20px_rgba(249,115,22,0.25)]"
                >
                  Request Similar Architecture <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
