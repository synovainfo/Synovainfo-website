'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'

/* ------------------------------------------------------------------ */
/*  Inline animated SVG — abstract digital transformation illustration  */
/* ------------------------------------------------------------------ */

function AboutIllustration() {
  const prefersReducedMotion = useReducedMotion()

  // SVG coordinates
  const nodes = useMemo(
    () => [
      { id: 1, cx: 130, cy: 110, r: 18, gradient: 'url(#gradBlue)' },
      { id: 2, cx: 470, cy: 85, r: 16, gradient: 'url(#gradPurple)' },
      { id: 3, cx: 300, cy: 230, r: 30, gradient: 'url(#gradEmerald)' },
      { id: 4, cx: 145, cy: 370, r: 17, gradient: 'url(#gradBlue)' },
      { id: 5, cx: 455, cy: 385, r: 15, gradient: 'url(#gradPurple)' },
    ],
    [],
  )

  // Centre node helper
  const center = nodes[2]

  // Edge definitions (from → to)
  const edges = useMemo(
    () => [
      { from: nodes[0], to: nodes[2], d: 'M130 110 Q200 160 300 230' },
      { from: nodes[1], to: nodes[2], d: 'M470 85 Q400 150 300 230' },
      { from: nodes[2], to: nodes[3], d: 'M300 230 Q220 300 145 370' },
      { from: nodes[2], to: nodes[4], d: 'M300 230 Q380 310 455 385' },
      { from: nodes[0], to: nodes[1], d: 'M130 110 Q300 30 470 85' },
      { from: nodes[3], to: nodes[4], d: 'M145 370 Q300 420 455 385' },
      { from: nodes[0], to: nodes[3], d: 'M130 110 L145 370' },
    ],
    [nodes],
  )

  // Small data-dot positions (midpoints of edges)
  const dataDots = useMemo(
    () => [
      { x: 215, y: 160 },
      { x: 385, y: 155 },
      { x: 220, y: 280 },
      { x: 380, y: 290 },
      { x: 300, y: 60 },
      { x: 300, y: 405 },
      { x: 138, y: 240 },
    ],
    [],
  )

  // ── shared path animation props ──
  const pathAnim = prefersReducedMotion
    ? {}
    : {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true },
        transition: { duration: 1.2, ease: 'easeInOut' as const },
      }

  // ── shared node entrance ──
  const nodeEnter = (i: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { scale: 0, opacity: 0 },
          whileInView: { scale: 1, opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.5, delay: 0.3 + i * 0.12, ease: 'backOut' as const },
        }

  return (
    <motion.svg
      viewBox="0 0 600 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* ─── defs ─── */}
      <defs>
        {/* Glows */}
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="var(--color-accent-blue)" stopOpacity="0.07" />
          <stop offset="60%" stopColor="var(--color-accent-cyan)" stopOpacity="0.03" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent-emerald)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-accent-emerald)" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent-blue)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-accent-blue)" stopOpacity="0" />
        </radialGradient>

        {/* Node fills */}
        <linearGradient id="gradBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-blue)" />
          <stop offset="100%" stopColor="var(--color-accent-cyan)" />
        </linearGradient>
        <linearGradient id="gradPurple" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-purple)" />
          <stop offset="100%" stopColor="var(--color-accent-blue)" />
        </linearGradient>
        <linearGradient id="gradEmerald" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-emerald)" />
          <stop offset="100%" stopColor="var(--color-accent-cyan)" />
        </linearGradient>

        {/* Grid pattern */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-accent-blue)" strokeOpacity="0.04" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* ─── Background ─── */}
      <rect x="0" y="0" width="600" height="500" rx="16" fill="url(#bgGlow)" />
      <rect x="0" y="0" width="600" height="500" rx="16" fill="url(#grid)" />

      {/* ─── Edges (animated drawing) ─── */}
      <g>
        {edges.map((edge, i) => (
          <motion.path
            key={`edge-${i}`}
            d={edge.d}
            stroke="var(--color-accent-blue)"
            strokeOpacity={0.25}
            strokeWidth={1.5}
            strokeLinecap="round"
            fill="none"
            {...pathAnim}
            transition={{
              duration: 1.2,
              delay: 0.1 * i,
              ease: 'easeInOut',
            }}
          />
        ))}
      </g>

      {/* ─── Data-flow dashes on main edges ─── */}
      {!prefersReducedMotion &&
        edges.slice(0, 4).map((edge, i) => (
          <motion.path
            key={`flow-${i}`}
            d={edge.d}
            stroke="var(--color-accent-cyan)"
            strokeOpacity={0.4}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="4 8"
            fill="none"
            initial={{ strokeDashoffset: 0 }}
            whileInView={{ strokeDashoffset: -100 }}
            viewport={{ once: true }}
            transition={{
              duration: 3,
              delay: 1.5 + i * 0.3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

      {/* ─── Node glows ─── */}
      {nodes.map((n, i) => (
        <motion.circle
          key={`glow-${i}`}
          cx={n.cx}
          cy={n.cy}
          r={n.r * 1.8}
          fill={i === 2 ? 'url(#hubGlow)' : 'url(#nodeGlow)'}
          {...nodeEnter(i)}
        />
      ))}

      {/* ─── Animated rings around centre node ─── */}
      {!prefersReducedMotion && (
        <>
          <motion.circle
            cx={center.cx}
            cy={center.cy}
            r={center.r + 12}
            stroke="var(--color-accent-emerald)"
            strokeOpacity={0.2}
            strokeWidth={1}
            fill="none"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.circle
            cx={center.cx}
            cy={center.cy}
            r={center.r + 22}
            stroke="var(--color-accent-cyan)"
            strokeOpacity={0.12}
            strokeWidth={0.8}
            fill="none"
            initial={{ scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.25, 0.12] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
        </>
      )}

      {/* ─── Static fallback rings when reduced motion ─── */}
      {prefersReducedMotion && (
        <>
          <circle cx={center.cx} cy={center.cy} r={center.r + 12} stroke="var(--color-accent-emerald)" strokeOpacity={0.15} strokeWidth={1} fill="none" />
          <circle cx={center.cx} cy={center.cy} r={center.r + 22} stroke="var(--color-accent-cyan)" strokeOpacity={0.1} strokeWidth={0.8} fill="none" />
        </>
      )}

      {/* ─── Data dots ─── */}
      {dataDots.map((dot, i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={dot.x}
          cy={dot.y}
          r={3}
          fill="var(--color-accent-cyan)"
          fillOpacity={0.6}
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: [0, 0.8, 0] as unknown as number }}
          viewport={{ once: true }}
          transition={{
            duration: 2,
            delay: 2 + i * 0.4,
            repeat: prefersReducedMotion ? 0 : Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ─── Nodes ─── */}
      {nodes.map((n, i) => (
        <motion.g key={`node-${i}`} {...nodeEnter(i)}>
          <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.gradient} />
          {/* Inner highlight */}
          <circle cx={n.cx - n.r * 0.25} cy={n.cy - n.r * 0.25} r={n.r * 0.35} fill="white" fillOpacity={0.25} />
        </motion.g>
      ))}

      {/* ─── Centre node pulse ─── */}
      {!prefersReducedMotion && (
        <motion.circle
          cx={center.cx}
          cy={center.cy}
          r={center.r * 0.35}
          fill="white"
          fillOpacity={0.5}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* ─── Decorative small dots (constellation) ─── */}
      {[
        { x: 70, y: 60 },
        { x: 530, y: 50 },
        { x: 520, y: 450 },
        { x: 80, y: 440 },
        { x: 300, y: 30 },
        { x: 300, y: 470 },
      ].map((p, i) => (
        <motion.circle
          key={`deco-${i}`}
          cx={p.x}
          cy={p.y}
          r={2.5}
          fill="var(--color-accent-purple)"
          fillOpacity={0.3}
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ delay: 2 + i * 0.15, duration: 0.6 }}
        />
      ))}
    </motion.svg>
  )
}

/* ------------------------------------------------------------------ */
/*  About Section                                                     */
/* ------------------------------------------------------------------ */

export function About() {
  return (
    <SectionWrapper
      id="about"
      className="bg-[var(--color-surface-secondary)]"
    >
      <SectionHeader
        badge="About Synova Infotech"
        title="Engineering Enterprise Technology"
        subtitle="We are a team of architects, engineers, and problem-solvers dedicated to building technology that powers business transformation."
        alignment="center"
      />

      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* ─── Left column: content ─── */}
        <div className="space-y-8">
          {/* Who We Are */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="mb-3 font-heading text-xl font-semibold text-[var(--color-text)]">
              Who We Are
            </h3>
            <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
              Synova Infotech is a Pune-based enterprise technology company specializing
              in digital transformation, custom software development, and AI-driven
              solutions. Founded by industry professionals with deep expertise in
              enterprise architecture, our team brings together decades of collective
              experience across Fortune 500 environments.
            </p>
          </motion.div>

          {/* Company details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 rounded-xl border border-[var(--border)] bg-[var(--color-surface)] p-5"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                Incorporated
              </span>
              <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                30 June 2026
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                Headquarters
              </span>
              <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                Pune, India
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                Directors
              </span>
              <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                Amir Khaja Baig &middot; Tazeen Shahnawaz Shaikh
              </p>
            </div>
          </motion.div>

          {/* Vision & Mission */}
          <div className="grid gap-6 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="mb-2 font-heading text-lg font-semibold text-[var(--color-text)]">
                Our Vision
              </h4>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                To be the most trusted technology partner for enterprises seeking
                digital transformation &mdash; delivering solutions that create
                measurable business impact.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="mb-2 font-heading text-lg font-semibold text-[var(--color-text)]">
                Our Mission
              </h4>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Empower organizations with enterprise-grade software solutions that
                combine cutting-edge technology with robust architecture, enabling
                them to achieve operational excellence and sustainable growth.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ─── Right column: SVG illustration ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-lg">
            <AboutIllustration />
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
