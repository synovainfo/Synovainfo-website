'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Service } from '@/data/services'
import { ServiceModal } from './service-modal'

interface ServiceCardProps {
  service: Service
  index?: number
  /** Branded SVG icon chip (64×64) replacing the Lucide glyph. */
  svgIconAsset?: string
  /** Larger SVG illustration rendered as a full-bleed art band at the top of the card. */
  artAsset?: string
}

export function ServiceCard({ service, index = 0, svgIconAsset, artAsset }: ServiceCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const Icon = service.icon

  const cardContent = (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View details about ${service.title}`}
      onClick={() => setModalOpen(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setModalOpen(true)
        }
      }}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-xl border border-[var(--glass-border)]',
        'bg-[var(--glass-bg)] shadow-sm backdrop-blur-xl',
        'transition-all duration-300',
        'hover:border-[var(--color-accent-blue)]/30 hover:shadow-[0_24px_100px_rgba(59,130,246,0.14)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
      )}
      style={{
        boxShadow: '0 30px 90px rgba(59,130,246,0.12)',
      }}
    >
      {/* Subtle gradient overlay on hover */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300',
          'bg-gradient-to-br from-[var(--color-accent-blue)]/[0.03] to-[var(--color-accent-cyan)]/[0.03]',
          'group-hover:opacity-100',
        )}
        aria-hidden="true"
      />

      {/* Art band — curated SVG illustration */}
      {artAsset && (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--glass-border)] bg-gradient-to-br from-[var(--color-accent-blue)]/[0.07] via-[var(--color-surface-secondary)] to-[var(--color-accent-cyan)]/[0.07]">
          <Image
            src={artAsset}
            alt={`${service.title} illustration`}
            width={600}
            height={400}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="relative z-10 p-6">
        {/* Icon */}
        <motion.div
          className={cn(
            'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl',
            'bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-[var(--color-accent-cyan)]/10',
            'transition-colors duration-300',
            'group-hover:from-[var(--color-accent-blue)]/20 group-hover:to-[var(--color-accent-cyan)]/20',
          )}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.1, rotate: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {svgIconAsset ? (
            <Image
              src={svgIconAsset}
              alt={`${service.title} icon`}
              width={48}
              height={48}
              loading="lazy"
              className="h-12 w-12 object-contain"
            />
          ) : (
            <Icon className="h-6 w-6 text-[var(--color-accent-blue)] transition-colors duration-300 group-hover:text-[var(--color-accent-cyan)]" />
          )}
        </motion.div>

        {/* Title */}
        <h3 className="mb-2 font-heading text-lg font-semibold text-[var(--color-text)]">
          {service.title}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {service.shortDescription}
        </p>

        {/* Category tag */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider',
              categoryStyles[service.category],
            )}
          >
            {service.category}
          </span>
        </div>
      </div>

      <ServiceModal
        service={service}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )

  if (prefersReducedMotion) {
    return cardContent
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
    >
      {cardContent}
    </motion.div>
  )
}

const categoryStyles: Record<string, string> = {
  development: 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]',
  management: 'bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple)]',
  solutions: 'bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)]',
  support: 'bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]',
}
