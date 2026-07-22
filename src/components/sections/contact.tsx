'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { MapPin, Mail, Phone, Clock, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { ContactForm } from '@/components/ui/contact-form'

/* ──────────────────────────────────────────────────────────────────── */
/*  Contact Info Data                                                   */
/* ──────────────────────────────────────────────────────────────────── */

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    label: 'Office Address',
    lines: [
      'Fl-24, Trish Manor, Kondhwa Kd,',
      'nr Kausar Baug, Pune,',
      'Maharashtra 411048, India',
    ],
    href: 'https://maps.google.com/?q=Trish+Manor+Kondhwa+Pune',
  },
  {
    icon: Mail,
    label: 'Email Us',
    lines: ['info@synovainfotech.com'],
    href: 'mailto:info@synovainfotech.com',
  },
  {
    icon: Phone,
    label: 'Call Us',
    lines: ['+91 98765 43210'],
    href: 'tel:+919876543210',
  },
  {
    icon: Clock,
    label: 'Business Hours',
    lines: [
      'Monday – Friday: 9:00 AM – 6:00 PM',
      'Saturday: 10:00 AM – 2:00 PM',
      'Sunday: Closed',
    ],
    href: null as string | null,
  },
]

/* ──────────────────────────────────────────────────────────────────── */
/*  Animated SVG — Location / Communication Hub                         */
/* ──────────────────────────────────────────────────────────────────── */

function ContactIllustration({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  const pulseAnim = prefersReducedMotion
    ? {}
    : {
        animate: {
          scale: [1, 1.08, 1],
          opacity: [0.15, 0.3, 0.15],
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        },
      }

  const ringAnim = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { scale: 0.6, opacity: 0 },
          whileInView: { scale: 1, opacity: 1 },
          viewport: { once: true },
          transition: { duration: 1.2, delay, ease: 'easeOut' as const },
        }

  return (
    <motion.svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        {/* Glow gradients */}
        <radialGradient id="locBgGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="var(--color-accent-blue)" stopOpacity="0.08" />
          <stop offset="60%" stopColor="var(--color-accent-cyan)" stopOpacity="0.04" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="locPinGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent-blue)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-accent-blue)" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="locGradBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-blue)" />
          <stop offset="100%" stopColor="var(--color-accent-cyan)" />
        </linearGradient>

        <linearGradient id="locGradEmerald" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-emerald)" />
          <stop offset="100%" stopColor="var(--color-accent-cyan)" />
        </linearGradient>

        {/* Grid pattern */}
        <pattern id="locGrid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path
            d="M 30 0 L 0 0 0 30"
            fill="none"
            stroke="var(--color-accent-blue)"
            strokeOpacity="0.04"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="400" height="320" rx="16" fill="url(#locBgGlow)" />
      <rect x="0" y="0" width="400" height="320" rx="16" fill="url(#locGrid)" />

      {/* ── Signal rings emanating from pin ── */}
      <g transform="translate(200, 140)">
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={`ring-${i}`}
            cx={0}
            cy={0}
            r={30 + i * 28}
            stroke="var(--color-accent-blue)"
            strokeOpacity={0.12 - i * 0.025}
            strokeWidth={1.5}
            fill="none"
            {...ringAnim(i * 0.15)}
          />
        ))}

        {/* ── Pulse at pin location ── */}
        <motion.circle cx={0} cy={0} r={18} fill="url(#locPinGlow)" {...pulseAnim} />

        {/* ── Map Pin ── */}
        <motion.g
          initial={prefersReducedMotion ? undefined : { scale: 0, opacity: 0 }}
          whileInView={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
        >
          {/* Pin shadow */}
          <ellipse cx={0} cy={18} rx={8} ry={3} fill="var(--color-accent-blue)" fillOpacity={0.15} />
          {/* Pin body */}
          <path
            d="M0 0C-7 0 -12 5 -12 12C-12 20 0 34 0 34C0 34 12 20 12 12C12 5 7 0 0 0Z"
            fill="url(#locGradBlue)"
          />
          {/* Inner circle */}
          <circle cx={0} cy={12} r={4} fill="white" fillOpacity={0.9} />
        </motion.g>
      </g>

      {/* ── Satellite dots (representing global reach) ── */}
      {[
        { x: 60, y: 60, delay: 0.6 },
        { x: 340, y: 50, delay: 0.7 },
        { x: 310, y: 270, delay: 0.8 },
        { x: 90, y: 260, delay: 0.9 },
        { x: 50, y: 170, delay: 1.0 },
        { x: 350, y: 180, delay: 1.1 },
      ].map((dot, i) => (
        <motion.g
          key={`dot-${i}`}
          initial={prefersReducedMotion ? undefined : { scale: 0, opacity: 0 }}
          whileInView={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: dot.delay, duration: 0.4, ease: 'backOut' as const }}
        >
          <circle cx={dot.x} cy={dot.y} r={4} fill="url(#locGradEmerald)" fillOpacity={0.8} />
          <circle cx={dot.x} cy={dot.y} r={8} fill="var(--color-accent-emerald)" fillOpacity={0.1} />
        </motion.g>
      ))}

      {/* ── Dashed connecting lines to satellite dots ── */}
      {!prefersReducedMotion &&
        [
          'M200 140 Q130 100 60 60',
          'M200 140 Q270 90 340 50',
          'M200 140 Q260 210 310 270',
          'M200 140 Q140 210 90 260',
          'M200 140 Q110 155 50 170',
          'M200 140 Q280 165 350 180',
        ].map((d, i) => (
          <motion.path
            key={`line-${i}`}
            d={d}
            stroke="var(--color-accent-blue)"
            strokeOpacity={0.1}
            strokeWidth={1}
            strokeDasharray="3 5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 + i * 0.1, ease: 'easeInOut' }}
          />
        ))}

      {/* ── "Pune, India" label ── */}
      <motion.text
        x={200}
        y={240}
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize={13}
        fontWeight={600}
        fontFamily="var(--font-sans)"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 5 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        Pune, India
      </motion.text>

      {/* ── "Global Reach" subtitle ── */}
      <motion.text
        x={200}
        y={258}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize={11}
        fontFamily="var(--font-sans)"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 5 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.85, duration: 0.5 }}
      >
        Enterprise IT Solutions
      </motion.text>
    </motion.svg>
  )
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Contact Info Card                                                   */
/* ──────────────────────────────────────────────────────────────────── */

function InfoCard({
  icon: Icon,
  label,
  lines,
  href,
  index,
  prefersReducedMotion,
}: {
  icon: typeof MapPin
  label: string
  lines: string[]
  href: string | null
  index: number
  prefersReducedMotion: boolean | null
}) {
  const content = (
    <div
      className={cn(
        'group relative rounded-xl border border-[var(--glass-border)]',
        'bg-[var(--glass-bg)] p-5 shadow-sm backdrop-blur-xl',
        'transition-all duration-300',
        'hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg',
        href && 'cursor-pointer',
      )}
    >
      {/* Hover gradient overlay */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300',
          'bg-gradient-to-br from-[var(--color-accent-blue)]/[0.04] to-[var(--color-accent-cyan)]/[0.04]',
          'group-hover:opacity-100',
        )}
        aria-hidden
      />

      <div className="relative z-10 flex items-start gap-4">
        {/* Icon */}
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
            'bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-[var(--color-accent-cyan)]/10',
            'text-[var(--color-accent-blue)] transition-colors duration-300',
            'group-hover:from-[var(--color-accent-blue)]/20 group-hover:to-[var(--color-accent-cyan)]/20',
            'group-hover:text-[var(--color-accent-cyan)]',
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            {label}
          </p>
          {lines.map((line, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed text-[var(--color-text)]"
            >
              {line}
            </p>
          ))}
        </div>

        {/* External link arrow */}
        {href && (
          <ArrowUpRight
            className={cn(
              'mt-1 h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]',
              'transition-all duration-300',
              'group-hover:text-[var(--color-accent-blue)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
            )}
          />
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
        whileHover={{ y: -2 }}
        className="block"
      >
        {content}
      </motion.a>
    )
  }

  if (prefersReducedMotion) return <div>{content}</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
    >
      {content}
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Contact Section                                                     */
/* ──────────────────────────────────────────────────────────────────── */

export function Contact() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <SectionWrapper id="contact" className="bg-[var(--color-surface-secondary)]">
      <SectionHeader
        badge="Get in Touch"
        title="Start Your Digital Transformation Journey"
        subtitle="Ready to transform your business with technology? Reach out and let's start a conversation about your next project."
        alignment="center"
      />

      <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
        {/* ─── Left Column: Form (3/5) ─── */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Form container with glass border */}
          <div
            className={cn(
              'rounded-2xl border border-[var(--glass-border)]',
              'bg-[var(--color-surface)] p-6 shadow-sm sm:p-8',
            )}
          >
            <ContactForm />
          </div>
        </motion.div>

        {/* ─── Right Column: Company Info + SVG (2/5) ─── */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* SVG Illustration */}
          <div className="mb-8 w-full">
            <ContactIllustration prefersReducedMotion={prefersReducedMotion} />
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            {CONTACT_DETAILS.map((detail, index) => (
              <InfoCard
                key={detail.label}
                icon={detail.icon}
                label={detail.label}
                lines={detail.lines}
                href={detail.href}
                index={index}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>

          {/* ── Bottom CTA ── */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 text-center text-xs text-[var(--color-text-tertiary)]"
          >
            We typically respond within 24 business hours.
          </motion.p>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
