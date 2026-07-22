'use client'

import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  id?: string
  children: ReactNode
  className?: string
  dark?: boolean
}

export function SectionWrapper({ id, children, className, dark }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'py-20 md:py-32',
        dark ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)]',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </motion.section>
  )
}
