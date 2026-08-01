'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MappedIndustry {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  capabilities: string[]
}

/** Icon-art assets keyed by the stored Lucide icon name. */
const ICON_ASSETS: Record<string, string> = {
  Factory: '/images/industries/industry-icon-factory.svg',
  HeartPulse: '/images/industries/industry-icon-health.svg',
  FlaskConical: '/images/industries/industry-icon-health.svg',
  ShoppingBag: '/images/industries/industry-icon-retail.svg',
  Truck: '/images/industries/industry-icon-logistics.svg',
  Warehouse: '/images/industries/industry-icon-logistics.svg',
  Car: '/images/industries/industry-icon-logistics.svg',
  TrendingUp: '/images/industries/industry-icon-fintech.svg',
  Landmark: '/images/industries/industry-icon-fintech.svg',
  Building2: '/images/industries/industry-icon-fintech.svg',
  ShieldCheck: '/images/industries/industry-icon-fintech.svg',
  GraduationCap: '/images/industries/industry-icon-grid.svg',
  Radio: '/images/industries/industry-icon-grid.svg',
}

/** Sector artwork keyed by industry name. */
const SECTOR_ART: Record<string, string> = {
  Manufacturing: '/images/industries/industry-manufacturing.svg',
  Healthcare: '/images/industries/industry-healthcare.svg',
  Retail: '/images/industries/industry-retail.svg',
  Logistics: '/images/industries/industry-logistics.svg',
  Warehouse: '/images/industries/industry-logistics-supplychain.svg',
  Education: '/images/industries/industry-education.svg',
  Government: '/images/industries/industry-finance.svg',
  Construction: '/images/industries/industry-energy-utilities.svg',
  Finance: '/images/industries/industry-banking-fintech.svg',
  Insurance: '/images/industries/industry-insurance-insurtech.svg',
  Automotive: '/images/industries/industry-smart-manufacturing.svg',
  Pharmaceutical: '/images/industries/industry-healthcare-medtech.svg',
  Telecom: '/images/industries/industry-telecom-5g.svg',
}

const CARD_ART_SIZES =
  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'

function iconAssetFor(icon: string): string {
  return ICON_ASSETS[icon] ?? '/images/industries/industry-icon-grid.svg'
}

function sectorArtFor(name: string): string {
  return SECTOR_ART[name] ?? '/images/industries/industry-manufacturing.svg'
}

export function IndustryCard({
  industry,
  index,
}: {
  industry: MappedIndustry
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link
        href={`/industries/${industry.slug}`}
        className={cn(
          'group relative flex h-full flex-col rounded-xl border border-[var(--glass-border)]',
          'bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-xl',
          'transition-all duration-300',
          'hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
        )}
      >
        {/* Gradient overlay */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300',
            'bg-gradient-to-br from-[var(--color-accent-blue)]/[0.03] to-[var(--color-accent-cyan)]/[0.03]',
            'group-hover:opacity-100',
          )}
          aria-hidden
        />

        <div className="relative z-10 flex h-full flex-col gap-4">
          {/* Sector artwork */}
          <div className="relative -mx-6 -mt-6 aspect-[16/9] overflow-hidden rounded-t-xl">
            <Image
              src={sectorArtFor(industry.name)}
              alt={`${industry.name} sector illustration`}
              fill
              loading="lazy"
              sizes={CARD_ART_SIZES}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--glass-bg)]/60 via-transparent to-transparent"
              aria-hidden
            />
          </div>

          {/* Icon chip overlapping the artwork */}
          <motion.div
            className={cn(
              'relative z-10 -mt-6 ml-6 inline-flex h-12 w-12 items-center justify-center rounded-xl',
              'border border-[var(--glass-border)] bg-gradient-to-br from-[var(--color-accent-blue)]/15 to-[var(--color-accent-cyan)]/15',
              'shadow-sm backdrop-blur-md',
              'transition-colors duration-300',
              'group-hover:from-[var(--color-accent-blue)]/25 group-hover:to-[var(--color-accent-cyan)]/25',
            )}
            whileHover={{ scale: 1.1, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Image
              src={iconAssetFor(industry.icon)}
              alt={`${industry.name} industry icon`}
              width={24}
              height={24}
              className="h-6 w-6"
            />
          </motion.div>

          {/* Name */}
          <h3 className="font-heading text-lg font-semibold text-[var(--color-text)]">
            {industry.name}
          </h3>

          {/* Description */}
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {industry.description}
          </p>

          {/* Capability badges */}
          <div className="mt-auto flex flex-wrap gap-1.5">
            {industry.capabilities.slice(0, 3).map((cap) => (
              <span
                key={cap}
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium',
                  'bg-[var(--color-surface-secondary)] text-[var(--color-text-tertiary)]',
                  'transition-colors duration-200 group-hover:bg-[var(--color-accent-blue)]/10 group-hover:text-[var(--color-accent-blue)]',
                )}
              >
                {cap}
              </span>
            ))}
            {industry.capabilities.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-[var(--color-surface-secondary)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-text-tertiary)]">
                +{industry.capabilities.length - 3}
              </span>
            )}
          </div>

          {/* View detail arrow */}
          <div className="flex items-center gap-1 text-xs font-medium text-[var(--color-accent-blue)] opacity-0 transition-all duration-300 group-hover:opacity-100">
            View Details
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
