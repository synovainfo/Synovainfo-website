'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { TechBadge } from '@/components/ui/tech-badge'
import { technologies, categoryMeta, type Technology } from '@/data/technologies'

/* ── Category display order ──────────────────────────────────────── */

const categoryOrder = ['frontend', 'backend', 'database', 'cloud', 'ai'] as const

/* ── Category header ────────────────────────────────────────────── */

function CategoryHeader({
  category,
  index,
}: {
  category: Technology['category']
  index: number
}) {
  const meta = categoryMeta[category]
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, x: -12 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      className="mb-4"
    >
      <h3 className="font-heading text-lg font-semibold text-[var(--color-text)]">
        {meta.label}
      </h3>
      <p className="mt-0.5 text-sm text-[var(--color-text-tertiary)]">
        {meta.description}
      </p>
    </motion.div>
  )
}

/* ── Divider line between categories ────────────────────────────── */

function CategoryDivider({ index }: { index: number }) {
  if (index === 0) return null
  return (
    <motion.hr
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="my-8 border-t border-[var(--glass-border)] md:my-10"
    />
  )
}

/* ── Main section ───────────────────────────────────────────────── */

export function Technologies() {
  const grouped = useMemo(() => {
    const map = new Map<Technology['category'], Technology[]>()
    for (const t of technologies) {
      const list = map.get(t.category) ?? []
      list.push(t)
      map.set(t.category, list)
    }
    return map
  }, [])

  const categoryCount = useMemo(
    () => categoryOrder.reduce((sum, cat) => sum + (grouped.get(cat)?.length ?? 0), 0),
    [grouped],
  )

  return (
    <SectionWrapper
      id="technologies"
      className="bg-[var(--color-surface)]"
    >
      <SectionHeader
        badge="Our Technology Stack"
        title="Enterprise-Grade Technology Expertise"
        subtitle={`A carefully curated ecosystem of ${categoryCount}+ modern technologies across ${categoryOrder.length} domains — enabling us to deliver robust, scalable, and future-ready solutions.`}
        alignment="center"
      />

      {categoryOrder.map((cat, idx) => {
        const items = grouped.get(cat) ?? []
        if (items.length === 0) return null

        return (
          <div key={cat}>
            <CategoryDivider index={idx} />
            <CategoryHeader category={cat} index={idx} />

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
              {items.map((tech, i) => (
                <TechBadge
                  key={tech.id}
                  tech={tech}
                  index={i + idx * 10}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* Bottom note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 text-center text-xs text-[var(--color-text-tertiary)]"
      >
        Our technology stack evolves continuously to match enterprise demands.
      </motion.p>
    </SectionWrapper>
  )
}
