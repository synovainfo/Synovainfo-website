'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function TransformationShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Scale and opacity effects for the large background image mask reveal
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.2, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0])
  
  // Parallax text
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section 
      ref={containerRef}
      id="transformation-showcase" 
      className="relative w-full h-[150vh] bg-[#050914] overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Full screen background image */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ scale, opacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#050914] via-transparent to-[#050914] z-10 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050914]/80 via-transparent to-transparent z-10" />
          
          <Image
            src="/images/home/realistic/hero-data-center.jpg"
            alt="Modern Enterprise Data Center Architecture"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
        </motion.div>

        {/* Foreground Content */}
        <div className="relative z-20 container mx-auto px-6 lg:px-12 w-full">
          <motion.div 
            style={{ y }}
            className="max-w-4xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Digital Transformation Architecture
                  </span>
                </div>

                <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
                  Engineer the <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-amber-400">
                    Impossible.
                  </span>
                </h2>

                <p className="text-lg md:text-xl text-slate-300 max-w-xl font-medium leading-relaxed mb-8">
                  We deconstruct monolithic legacy systems and architect hyper-scalable, AI-native multi-cloud ecosystems that define the next era of enterprise computing.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-400/40 transition-colors">
                    <Activity className="h-5 w-5 text-blue-400" />
                    <span className="text-sm font-semibold text-white">Event-Driven Mesh</span>
                    <span className="text-xs text-slate-400">Zero downtime microservices.</span>
                  </div>
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 transition-colors">
                    <Zap className="h-5 w-5 text-cyan-400" />
                    <span className="text-sm font-semibold text-white">Agentic AI Layer</span>
                    <span className="text-xs text-slate-400">Sub-50ms vector inference.</span>
                  </div>
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-400/40 transition-colors">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm font-semibold text-white">Zero-Trust Security</span>
                    <span className="text-xs text-slate-400">mTLS encrypted topologies.</span>
                  </div>
                </div>

                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-3.5 text-sm font-bold text-slate-950 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95"
                >
                  Architect Your Future
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Right Column: Architectural Blueprint Graphic */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-zinc-950/80 p-2 shadow-2xl backdrop-blur-xl">
                  <Image
                    src="/images/home/architecture-blueprint.svg"
                    alt="Synova Enterprise Architecture Blueprint"
                    width={800}
                    height={500}
                    className="w-full h-auto rounded-xl object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-black/70 px-4 py-2 text-xs font-semibold text-cyan-300 backdrop-blur-md border border-white/10">
                    <span>LIVE SYSTEM TOPOLOGY</span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      100% OPERATIONAL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
