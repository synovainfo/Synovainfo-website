'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Layers, Zap } from 'lucide-react'

// ── Main Hero Component ──────────────────────────────────────────

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden bg-corporate-navy-dark text-white pt-32 pb-24"
    >
      {/* Full-screen background image */}
      <Image
        src="/images/home/realistic/hero-data-center.jpg"
        alt="Enterprise data center infrastructure"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Dark navy overlay for text readability (ITHPL) */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-corporate-navy-dark/90 via-corporate-navy-dark/80 to-corporate-navy-dark/95"
        aria-hidden="true"
      />

      {/* Subtle orange corporate glow accent */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(249,115,22,0.14),transparent_40%)]"
        aria-hidden="true"
      />

      {/* Content Container - centered ITHPL layout */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">

          {/* Corporate Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-corporate-gold/30 bg-corporate-navy/60 px-6 py-2.5 backdrop-blur-xl shadow-lg"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-corporate-gold">
              Enterprise Technology Solutions
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl leading-[1.1] text-white"
          >
            Enterprise-Grade Technology Solutions
            <br className="hidden md:block" />
            <span className="text-gradient-orange inline-block mt-4">
              Engineered for Mission-Critical Scale
            </span>
          </motion.h1>

          {/* Executive Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-2xl text-lg leading-[1.75] text-white/75 font-normal"
          >
            Synova architects and deploys mission-critical cloud infrastructure, autonomous AI pipelines, and zero-trust security meshes for the world&apos;s most demanding enterprises. 99.999% SLA uptime. Sub-5ms inference. ISO 27001 & SOC 2 Type II certified.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link
              href="/contact"
              className="btn-corporate btn-corporate-primary group h-14 px-8 text-sm"
            >
              Request Enterprise Architecture Audit
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/services"
              className="btn-corporate btn-corporate-outline h-14 px-8 text-sm"
            >
              View Reference Blueprint
            </Link>
          </motion.div>

          {/* Live Counters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 border-t border-white/10 pt-8"
          >
            <div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">99.999%</span>
                <ArrowRight className="h-4 w-4 text-corporate-gold -rotate-45" />
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-white/50 font-semibold">SLA Guarantee</div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">250+</span>
                <Layers className="h-4 w-4 text-corporate-gold" />
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-white/50 font-semibold">Global Deployments</div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">&lt;10ms</span>
                <Zap className="h-4 w-4 text-corporate-gold" />
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-white/50 font-semibold">Inference Latency</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
