'use client'

import { ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function TransformationShowcase() {
  return (
    <section id="transformation-showcase" className="relative w-full overflow-hidden bg-navy-dark py-20 md:py-28">
      {/* Muted looping background video — decorative, below the fold, loaded on demand */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="h-full w-full object-cover opacity-40"
        >
          <source src="/images/home/video-server-ai.mp4" type="video/mp4" />
        </video>
        {/* Dark navy gradient overlay keeps copy readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-corporate-navy-dark via-corporate-navy-dark/85 to-corporate-navy-dark" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-white/10 bg-white/5">
              <span className="flex h-2 w-2 rounded-full bg-corporate-gold animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-corporate-gold">
                Chapter 1: Digital Transformation Architecture
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
              Engineer the <br />
              <span className="text-gradient-orange">
                Impossible.
              </span>
            </h2>

            <p className="text-lg md:text-xl text-slate-300 max-w-xl font-medium leading-relaxed mb-8">
              We deconstruct monolithic legacy systems and architect hyper-scalable, AI-native multi-cloud ecosystems that define the next era of enterprise computing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col gap-2 p-4 rounded-xl border border-white/10 bg-white/[0.04] hover:border-corporate-gold/50 transition-colors">
                <Activity className="h-5 w-5 text-corporate-gold" />
                <span className="text-sm font-semibold text-white">Event-Driven Mesh</span>
                <span className="text-xs text-slate-400">Zero downtime microservices.</span>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded-xl border border-white/10 bg-white/[0.04] hover:border-corporate-gold/50 transition-colors">
                <Zap className="h-5 w-5 text-corporate-gold" />
                <span className="text-sm font-semibold text-white">Agentic AI Layer</span>
                <span className="text-xs text-slate-400">Sub-50ms vector inference.</span>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded-xl border border-white/10 bg-white/[0.04] hover:border-corporate-gold/50 transition-colors">
                <ShieldCheck className="h-5 w-5 text-corporate-gold" />
                <span className="text-sm font-semibold text-white">Zero-Trust Security</span>
                <span className="text-xs text-slate-400">mTLS encrypted topologies.</span>
              </div>
            </div>

            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-corporate-gold hover:bg-corporate-gold-dark px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-corporate-gold/25 active:scale-95"
            >
              Architect Your Future
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right Column: Architectural Blueprint Graphic */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-navy p-2 shadow-2xl">
              <Image
                src="/images/home/architecture-blueprint.svg"
                alt="Synova Enterprise Architecture Blueprint"
                width={800}
                height={500}
                className="w-full h-auto rounded-xl object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-black/70 px-4 py-2 text-xs font-semibold text-corporate-gold border border-white/10">
                <span>LIVE SYSTEM TOPOLOGY</span>
                <span className="flex items-center gap-1.5 text-corporate-gold">
                  <span className="h-2 w-2 rounded-full bg-corporate-gold animate-ping" />
                  100% OPERATIONAL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
