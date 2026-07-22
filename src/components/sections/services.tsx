'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { ServiceCard } from '@/components/ui/service-card'
import { services, serviceCategories } from '@/data/services'

export function Services() {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return services
    return services.filter((s) => s.category === activeCategory)
  }, [activeCategory])

  return (
    <SectionWrapper id="services">
      <SectionHeader
        badge="What We Do"
        title="Enterprise Services"
        subtitle="Seventeen specialized capabilities engineered to transform your business — from custom software and mobile apps to AI-driven procurement and immersive VR training."
        alignment="center"
      />

      {/* Filter Tabs */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {serviceCategories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              activeCategory === cat.value
                ? 'bg-[var(--color-accent-blue)] text-white shadow-md'
                : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] hover:text-[var(--color-text)]',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Service Cards Grid */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <ServiceCard service={service} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filteredServices.length === 0 && (
        <p className="py-16 text-center text-[var(--color-text-tertiary)]">
          No services found in this category.
        </p>
      )}
    </SectionWrapper>
  )
}
