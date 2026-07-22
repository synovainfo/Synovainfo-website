'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  badge?: string
  title: string
  subtitle?: string
  alignment?: 'center' | 'left'
  dark?: boolean
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  alignment = 'center',
  dark,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 md:mb-16', alignment === 'center' && 'text-center')}>
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]"
          style={{ marginBottom: '1rem' }}
        >
          {badge}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={cn(
          'mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl',
          dark ? 'text-white' : 'text-[var(--color-text)]',
        )}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={cn(
            'max-w-2xl text-lg md:text-xl',
            alignment === 'center' && 'mx-auto',
            dark ? 'text-gray-300' : 'text-[var(--color-text-secondary)]',
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
