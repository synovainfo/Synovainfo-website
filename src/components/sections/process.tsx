'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { processStages } from '@/data/process'
import {
  Search,
  BarChart3,
  Building2,
  Palette,
  Code2,
  ShieldCheck,
  Rocket,
  Headphones,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionWrapper } from '@/components/layout/section-wrapper'

const iconMap: Record<string, LucideIcon> = {
  Search,
  BarChart3,
  Building2,
  Palette,
  Code2,
  ShieldCheck,
  Rocket,
  Headphones,
}

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Subtle parallax for the sticky image
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  return (
    <SectionWrapper id="process" className="bg-[var(--color-surface)]">
      <div ref={containerRef} className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        
        {/* Left: Sticky Visual & Header */}
        <div className="lg:sticky lg:top-24 flex flex-col gap-8 h-auto lg:h-[calc(100vh-120px)] justify-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-corporate-gold/20 bg-corporate-gold/5">
              <span className="section-label">
                Enterprise Methodology
              </span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-corporate-navy leading-[1.1] mb-6">
              Precision in <br />
              <span className="text-gradient-orange">
                Execution.
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-md">
              A structured, battle-tested 8-stage methodology that ensures every project delivers on time, within budget, and above expectations.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-corporate-gold hover:bg-corporate-gold-dark px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-corporate-gold/25 active:scale-95 mt-8"
            >
              Start Your Project
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="relative w-full aspect-square max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <motion.div style={{ y: imageY }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
              <Image
                src="/images/home/server-rack.png"
                alt="Enterprise Infrastructure Server Rack"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-corporate-navy-dark/80 to-transparent" />
            </motion.div>
          </div>
        </div>

        {/* Right: Scrolling Stages */}
        <div className="flex flex-col gap-12 lg:gap-24 lg:py-[20vh]">
          {processStages.map((stage, index) => {
            const Icon = iconMap[stage.icon] || Code2
            return (
              <motion.div 
                key={stage.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: '-10% 0px -10% 0px', once: true }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative flex flex-col gap-6"
              >
                {/* Connector line between items */}
                {index !== processStages.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-[-3rem] w-[2px] bg-gradient-to-b from-corporate-gold via-corporate-gold-light to-corporate-gold-dark lg:block hidden" />
                )}

                <div className="flex items-start gap-6">
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200">
                    <Icon className="h-7 w-7 text-corporate-gold" />
                    <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-corporate-gold text-[10px] font-bold text-white shadow-md">
                      0{index + 1}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <h3 className="text-2xl font-bold text-corporate-navy">
                      {stage.title}
                    </h3>
                    <p className="text-sm font-semibold text-corporate-gold uppercase tracking-wider">
                      {stage.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="pl-0 lg:pl-22 ml-0 lg:ml-[5.5rem]">
                  <p className="text-base text-slate-600 leading-relaxed mb-6">
                    {stage.fullDesc}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-corporate-gold/40 transition-all duration-300">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                        Deliverables
                      </h4>
                      <ul className="space-y-2">
                        {stage.deliverables.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-corporate-gold mt-0.5" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                        Duration
                      </h4>
                      <div className="flex items-center gap-2 text-sm font-semibold text-corporate-navy">
                        <Clock className="h-4 w-4 text-corporate-gold" />
                        {stage.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </SectionWrapper>
  )
}
