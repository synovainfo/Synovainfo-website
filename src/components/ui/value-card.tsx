'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface ValueCardProps {
  icon: React.ReactNode
  title: string
  description: string
  index?: number
}

export function ValueCard({ icon, title, description, index = 0 }: ValueCardProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div className="group rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-xl transition-colors duration-300 hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]">
          {icon}
        </div>
        <h3 className="mb-2 font-heading text-xl font-semibold text-[var(--color-text)]">
          {title}
        </h3>
        <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group cursor-default rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-xl transition-colors duration-300 hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg"
    >
      <motion.div
        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(37, 99, 235, 0.2)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        {icon}
      </motion.div>
      <h3 className="mb-2 font-heading text-xl font-semibold text-[var(--color-text)]">
        {title}
      </h3>
      <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
        {description}
      </p>
    </motion.div>
  )
}
