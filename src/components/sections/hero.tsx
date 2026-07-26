'use client'

import { useState, useEffect, Component, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Cpu,
  Layers,
  Sparkles,
  X,
  CheckCircle2,
  Lock,
  Cloud,
} from 'lucide-react'
import Link from 'next/link'

// ── Error boundary for Three.js Canvas ──────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ThreeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// ── Dynamic Three.js scene ──────────────────────────────────────

const HeroParticles = dynamic(
  () => import('@/components/three/hero-particles'),
  {
    ssr: false,
    loading: () => null,
  },
)

// ── Background Layers ────────────────────────────────────────────

function AuroraGradients() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="aurora-orb aurora-orb-1 opacity-60" />
      <div className="aurora-orb aurora-orb-2 opacity-50" />
      <div className="aurora-orb aurora-orb-3 opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-primary)]/80 to-[var(--color-primary)]" />
    </div>
  )
}

function TechGridMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '64px 64px',
        }}
      />
      <div
        className="tech-grid-pulse absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(37, 99, 235, 0.6) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(37, 99, 235, 0.6) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  )
}

function FloatingTechElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block" aria-hidden="true">
      {/* Node 1 */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[22%] left-[8%] flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
          <Cloud className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-white">Multi-Cloud Fabric</div>
          <div className="text-[10px] text-zinc-400">99.999% SLA Uptime</div>
        </div>
      </motion.div>

      {/* Node 2 */}
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[28%] right-[8%] flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
          <Cpu className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-white">Agentic AI Engines</div>
          <div className="text-[10px] text-zinc-400">Sub-10ms Inference</div>
        </div>
      </motion.div>

      {/* Node 3 */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[24%] left-[10%] flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-white">Zero Trust Security</div>
          <div className="text-[10px] text-zinc-400">ISO 27001 & SOC 2 Type II</div>
        </div>
      </motion.div>
    </div>
  )
}

// ── Interactive Architecture Preview Modal ───────────────────────

function ArchitectureModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-zinc-950 p-6 md:p-8 text-white shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2">
            <Layers className="h-4 w-4" /> Blueprint Reference Architecture
          </div>
          <h3 className="text-2xl font-bold md:text-3xl text-white">
            Synova Global Enterprise Mesh Stack
          </h3>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
            A resilient, zero-trust cloud architecture engineered for ultra-low latency, mission-critical compliance, and autonomous AI scale.
          </p>

          {/* Diagram Preview */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 font-semibold text-white mb-2">
                <Globe2 className="h-5 w-5 text-blue-400" /> 1. Edge & Multi-Cloud
              </div>
              <ul className="text-xs text-zinc-400 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Cloudflare Enterprise Edge WAN</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Multi-Region AWS & GCP Clusters</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Automated Anycast DDoS Mitigation</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 font-semibold text-white mb-2">
                <Cpu className="h-5 w-5 text-cyan-400" /> 2. Core Microservices
              </div>
              <ul className="text-xs text-zinc-400 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Event-Driven Kafka Streaming</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Sub-5ms Redis In-Memory Cache</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> GraphQL & gRPC API Gateway</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 font-semibold text-white mb-2">
                <Lock className="h-5 w-5 text-purple-400" /> 3. Security & Compliance
              </div>
              <ul className="text-xs text-zinc-400 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Hardware Security Module Key Vault</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Continuous Audit & RBAC Engine</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Real-time Automated SIEM Logging</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-zinc-400">
            <span>ISO 27001 Certified • SOC 2 Type II Compliant</span>
            <Link
              href="/contact"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Consult an Architect <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── Main Hero Component ──────────────────────────────────────────

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      id="hero"
      className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden bg-[#080E18] text-white pt-32 pb-24"
    >
      {/* Dynamic Backgrounds */}
      <AuroraGradients />
      <TechGridMesh />
      <FloatingTechElements />

      {/* Particle Canvas (Right 40%) */}
      {mounted && (
        <ThreeErrorBoundary fallback={null}>
          <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[45%] z-[1] opacity-70 lg:opacity-100 pointer-events-none" aria-hidden="true">
            {/* Fade edge mask for smooth integration */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#080E18] to-transparent z-10 hidden lg:block" />
            <HeroParticles />
          </div>
        </ThreeErrorBoundary>
      )}

      {/* Content Container - 60/40 Asymmetrical Layout */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Left Column (60%) */}
          <div className="w-full lg:w-[55%] text-left">
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
              <span className="bg-gradient-to-r from-corporate-gold via-blue-400 to-emerald-400 bg-clip-text text-transparent inline-block mt-4">
                Engineered for Mission-Critical Scale
              </span>
            </motion.h1>

            {/* Executive Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 max-w-2xl text-lg leading-[1.75] text-zinc-400 font-normal"
            >
              Synova architects and deploys mission-critical cloud infrastructure, autonomous AI pipelines, and zero-trust security meshes for the world&apos;s most demanding enterprises. 99.999% SLA uptime. Sub-5ms inference. ISO 27001 & SOC 2 Type II certified.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-start gap-5"
            >
              <Link
                href="/contact"
                className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-corporate-gold px-8 py-4 text-sm font-bold text-corporate-navy transition-all duration-300 hover:bg-corporate-gold/90 hover:scale-[1.02] shadow-xl"
              >
                Request Enterprise Architecture Audit
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-corporate-gold/40 bg-corporate-navy/20 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-corporate-navy/30 hover:border-corporate-gold/60"
              >
                <Sparkles className="h-4 w-4 text-corporate-gold" />
                View Reference Blueprint
              </button>
            </motion.div>

            {/* Live Counters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 flex flex-wrap gap-x-12 gap-y-8 border-t border-white/10 pt-8"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white tracking-tight">99.999%</span>
                  <ArrowRight className="h-4 w-4 text-emerald-400 -rotate-45" />
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-zinc-500 font-semibold">SLA Guarantee</div>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white tracking-tight">250+</span>
                  <Layers className="h-4 w-4 text-blue-400" />
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-zinc-500 font-semibold">Global Deployments</div>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white tracking-tight">&lt;10ms</span>
                  <Zap className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-zinc-500 font-semibold">Inference Latency</div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column (40%) - Space for 3D model */}
          <div className="w-full lg:w-[45%] h-[400px] lg:h-auto pointer-events-none" aria-hidden="true" />
          
        </div>
      </div>

      {/* Architecture Modal */}
      <ArchitectureModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}

