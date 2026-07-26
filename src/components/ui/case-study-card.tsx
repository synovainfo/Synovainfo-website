'use client'

import { useState, useRef, type PointerEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CaseStudy } from '@/data/case-studies'
import { ArchDiagram } from './arch-diagram'
import { CaseStudyModal } from './case-study-modal'

interface CaseStudyCardProps {
  study: CaseStudy
  index?: number
}

export function CaseStudyCard({ study, index = 0 }: CaseStudyCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.setProperty('--rotate-x', `${y * -8}deg`)
    cardRef.current.style.setProperty('--rotate-y', `${x * 8}deg`)
  }

  const handlePointerLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.setProperty('--rotate-x', '0deg')
    cardRef.current.style.setProperty('--rotate-y', '0deg')
  }

  const cardContent = (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`View case study: ${study.title}`}
      onClick={() => setModalOpen(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setModalOpen(true)
        }
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--glass-border)]',
        'bg-[var(--glass-bg)] shadow-sm backdrop-blur-xl',
        'transition-shadow duration-300',
        'hover:shadow-xl hover:border-[var(--color-accent-blue)]/20',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
      )}
      style={{
        transform: prefersReducedMotion
          ? 'none'
          : 'perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
        transition: 'transform 0.15s ease-out',
      }}
    >
      {/* Gradient overlay on hover */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500',
          'bg-gradient-to-br from-[var(--color-accent-blue)]/[0.03] to-[var(--color-accent-cyan)]/[0.03]',
          'group-hover:opacity-100',
        )}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col sm:flex-row">
        {/* Architecture diagram area */}
        <div className="flex items-center justify-center border-b border-[var(--color-border)] p-6 sm:w-2/5 sm:border-b-0 sm:border-r">
          <div className="h-40 w-full sm:h-48">
            <ArchDiagram type={study.architecture} />
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-1 flex-col p-6">
          {/* Industry tag */}
          <motion.span
            className="mb-3 inline-flex w-fit rounded-full bg-[var(--color-accent-blue)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent-blue)]"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
          >
            {study.industry}
          </motion.span>

          {/* Title */}
          <h3 className="mb-2 font-heading text-lg font-bold text-[var(--color-text)] leading-snug">
            {study.title}
          </h3>

          {/* Overview */}
          <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-2">
            {study.overview}
          </p>

          {/* Technologies */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {study.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-md bg-[var(--color-surface-tertiary)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)]"
              >
                {tech}
              </span>
            ))}
            {study.technologies.length > 5 && (
              <span className="inline-flex items-center rounded-md bg-[var(--color-surface-tertiary)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)]">
                +{study.technologies.length - 5}
              </span>
            )}
          </div>

          {/* Key results */}
          <div className="mt-auto grid grid-cols-3 gap-3 rounded-xl bg-[var(--color-surface-secondary)] p-3">
            {study.results.map((result) => (
              <div key={result.metric} className="text-center">
                <div className="font-heading text-lg font-bold text-[var(--color-accent-emerald)]">
                  {result.value}
                </div>
                <div className="text-[10px] leading-tight text-[var(--color-text-tertiary)]">
                  {result.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CaseModalRenderer study={study} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )

  if (prefersReducedMotion) {
    return cardContent
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
    >
      {cardContent}
    </motion.div>
  )
}

/* Separate wrapper to avoid recreating modal on every render */
function CaseModalRenderer({
  study,
  open,
  onOpenChange,
}: {
  study: CaseStudy
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return <CaseStudyModal study={study} open={open} onOpenChange={onOpenChange} />
}
