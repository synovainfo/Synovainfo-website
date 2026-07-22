'use client'

import { useState, useEffect, Component, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { CtaButton } from '@/components/ui/cta-button'

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

// ── Dynamic Three.js scene (code-split) ─────────────────────────

const HeroParticles = dynamic(
  () => import('@/components/three/hero-particles'),
  {
    ssr: false,
    loading: () => null,
  },
)

// ── Background layers ───────────────────────────────────────────

/** Soft gradient orbs — always visible, acts as Three.js fallback */
function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Top-left blue orb */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-transparent blur-3xl" />
      {/* Bottom-right cyan orb */}
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[var(--color-accent-cyan)]/8 to-transparent blur-3xl" />
      {/* Center subtle glow */}
      <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[var(--color-accent-blue)]/5 via-transparent to-transparent blur-3xl" />
    </div>
  )
}

/** Animated technology grid background */
function TechGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Static grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '60px 60px',
        }}
      />
      {/* Pulsing grid overlay */}
      <div
        className="tech-grid-pulse absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(37, 99, 235, 0.6) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(37, 99, 235, 0.6) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}

/** Floating geometric shapes with slow CSS animation */
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Rotated square (diamond) — top-left */}
      <div
        className="floating-shape absolute left-[12%] top-[22%] h-16 w-16 rotate-45 border border-[var(--color-accent-blue)]/30 opacity-30 md:h-20 md:w-20"
        style={{ animationDelay: '0s' }}
      />

      {/* Circle — top-right */}
      <div
        className="floating-shape absolute right-[18%] top-[30%] h-12 w-12 rounded-full border-2 border-[var(--color-accent-cyan)]/20 opacity-25 md:h-16 md:w-16"
        style={{ animationDelay: '-2s' }}
      />

      {/* Diamond — bottom-left */}
      <div
        className="floating-shape absolute bottom-[28%] left-[28%] h-10 w-10 rotate-45 border border-[var(--color-accent-purple)]/20 opacity-20 md:h-14 md:w-14"
        style={{ animationDelay: '-4s' }}
      />

      {/* Small filled circle — bottom-right */}
      <div
        className="floating-shape absolute bottom-[35%] right-[12%] h-8 w-8 rounded-full bg-gradient-to-br from-[var(--color-accent-blue)]/20 to-transparent opacity-30 md:h-12 md:w-12"
        style={{ animationDelay: '-1s' }}
      />

      {/* Large ring — far right-center */}
      <div
        className="floating-shape absolute left-[65%] top-[15%] h-24 w-24 rounded-full border border-[var(--color-accent-emerald)]/10 opacity-20 md:h-32 md:w-32"
        style={{ animationDelay: '-3s' }}
      />

      {/* Tiny hexagon indicator — scattered */}
      <div
        className="floating-shape absolute left-[45%] top-[70%] h-6 w-6 rotate-12 border border-[var(--color-accent-blue)]/25 opacity-20"
        style={{ animationDelay: '-5s' }}
      />
    </div>
  )
}

// ── Entrance animation variants ─────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemFadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

// ── Main hero export ────────────────────────────────────────────

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(id)
  }, [])

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-primary)]"
    >
      {/* ── Background layers ── */}
      <GradientOrbs />
      <TechGrid />
      <FloatingShapes />

      {/* ── Three.js particle layer (client-only, error-bounded) ── */}
      {mounted && (
        <ThreeErrorBoundary fallback={null}>
          <div className="absolute inset-0 z-[1]" aria-hidden="true">
            <HeroParticles />
          </div>
        </ThreeErrorBoundary>
      )}

      {/* ── Content layer ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={mounted ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {/* Badge */}
          <motion.div variants={itemFadeUp} className="mb-6">
            <span className="inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[var(--color-text-tertiary)]">
              Pune-based IT Consultancy
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemFadeUp}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Enterprise Technology.{' '}
            <span className="text-[var(--color-accent-blue)]">Delivered.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemFadeUp}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg"
          >
            Synova Infotech delivers enterprise-grade software solutions that
            transform operations, accelerate growth, and build digital
            transformation.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemFadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <CtaButton href="#contact" variant="primary">
              Start Your Digital Transformation
            </CtaButton>
            <CtaButton href="#services" variant="secondary">
              Explore Our Services
            </CtaButton>
          </motion.div>

          {/* Trust indicators */}
          <motion.p
            variants={itemFadeUp}
            className="mt-12 text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]"
          >
            Trusted by enterprises across 6 industries
          </motion.p>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-tertiary)]">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4 text-[var(--color-text-tertiary)]" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
