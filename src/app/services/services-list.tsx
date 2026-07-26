'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { resolveIcon } from '@/lib/resolve-icon'
import type { LucideIcon } from 'lucide-react'
import { ServiceCard } from '@/components/ui/service-card'

interface MappedService {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  icon: string
  category: 'development' | 'management' | 'solutions' | 'support'
  technologies: string[]
  industries: string[]
  benefits: string[]
  businessOutcomes: string[]
  businessProblems?: string[]
  solutionArchitecture?: string
  keyFeatures?: Array<{ title: string; description: string }>
  securityCompliance?: string[]
  faqs?: Array<{ question: string; answer: string }>
  relatedCaseStudies?: string[]
}

interface ServicesListProps {
  services: MappedService[]
  categories: string[]
}

export function ServicesList({ services, categories }: ServicesListProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return services
    return services.filter((s) => s.category === activeCategory)
  }, [activeCategory, services])

  const resolvedServices = useMemo(
    () =>
      filteredServices.map((s) => ({
        ...s,
        icon: resolveIcon(s.icon) as LucideIcon,
      })),
    [filteredServices],
  )

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filter Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {['all', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                activeCategory === cat
                  ? 'bg-[var(--color-accent-blue)] text-white shadow-md'
                  : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] hover:text-[var(--color-text)]',
              )}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Service Cards Grid */}
        <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" layout>
          <AnimatePresence mode="popLayout">
            {resolvedServices.map((service, index) => (
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
      </div>
    </section>
  )
}
