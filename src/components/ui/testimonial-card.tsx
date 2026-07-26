'use client'

import { useCallback, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Testimonial } from '@/data/testimonials'

interface TestimonialCardProps {
  testimonial: Testimonial
  index?: number
}

export function TestimonialCard({ testimonial, index = 0 }: TestimonialCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY
      setRotateX(-(mouseY / rect.height) * 6)
      setRotateY((mouseX / rect.width) * 6)
    },
    [prefersReducedMotion],
  )

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }, [])

  const cardContent = (
    <div
      ref={cardRef}
      role="article"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative rounded-2xl border border-[var(--glass-border)]',
        'bg-[var(--glass-bg)] p-8 shadow-sm backdrop-blur-xl',
        'transition-colors duration-300',
        'hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg',
        'flex h-full flex-col',
        'will-change-transform',
      )}
      style={
        prefersReducedMotion || !isHovered
          ? {}
          : {
              transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: 'transform 0.1s ease-out',
            }
      }
    >
      {/* Gradient overlay on hover */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300',
          'bg-gradient-to-br from-[var(--color-accent-blue)]/[0.03] to-[var(--color-accent-cyan)]/[0.03]',
          'group-hover:opacity-100',
        )}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Large quotation mark */}
        <div className="mb-4 text-[var(--color-accent-blue)]/15" aria-hidden="true">
          <svg
            width="48"
            height="40"
            viewBox="0 0 48 40"
            fill="currentColor"
            className="h-10 w-12"
          >
            <path d="M13.2 0C9.6 0 6.4 1.2 3.6 3.6S0 9.2 0 14c0 3.2.8 6 2.4 8.4s3.6 4 6 5.2c-.4 1.6-1.2 3.2-2.4 4.8s-2.4 2.8-4 4c2-.4 4-.8 6-1.2s4-1.2 6-2.4c2.4-1.6 4.4-3.6 6-6s2.4-5.2 2.4-8 0-5.2-1.2-7.6S28 4.4 25.6 2.8 21.6 0 18 0h-4.8zM42.4 0c-3.6 0-6.8 1.2-9.6 3.6s-4.8 5.6-4.8 10.4c0 3.2.8 6 2.4 8.4s3.6 4 6 5.2c-.4 1.6-1.2 3.2-2.4 4.8s-2.4 2.8-4 4c2-.4 4-.8 6-1.2s4-1.2 6-2.4c2.4-1.6 4.4-3.6 6-6s2.4-5.2 2.4-8 0-5.2-1.2-7.6S57.2 4.4 54.8 2.8 51.2 0 47.6 0h-5.2z" />
          </svg>
        </div>

        {/* Quote text */}
        <blockquote className="mb-6 flex-1">
          <p className="text-base leading-relaxed text-[var(--color-text-secondary)] md:text-[15px]">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </blockquote>

        {/* Author info */}
        <div className="mt-auto flex items-center gap-4 border-t border-[var(--color-border-light)] pt-5">
          {/* SVG initials avatar */}
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
              'bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-cyan)]',
              'text-xs font-bold tracking-wide text-white',
            )}
            aria-hidden="true"
          >
            {testimonial.initials}
          </div>

          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-semibold text-[var(--color-text)]">
              {testimonial.name}
            </p>
            <p className="truncate text-xs text-[var(--color-text-tertiary)]">
              {testimonial.title}, {testimonial.company}
            </p>
          </div>
        </div>
      </div>
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
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      {cardContent}
    </motion.div>
  )
}
