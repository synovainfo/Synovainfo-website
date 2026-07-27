'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  MapPin,
  Briefcase,
  Banknote,
  Wifi,
  Search,
  X,
  Building2,
  Users,
  TrendingUp,
  HeartHandshake,
  Lightbulb,
  Sparkles,
} from 'lucide-react'
import type { CareerType } from '@/generated/prisma/enums'

/* ── Types ─────────────────────────────────────────────────────── */

interface CareerItem {
  id: string
  title: string
  slug: string
  department: string | null
  location: string | null
  type: CareerType
  salaryMin: number | null
  salaryMax: number | null
}

interface CareersListProps {
  careers: CareerItem[]
  departments: string[]
  locations: string[]
}

/* ── Helpers ────────────────────────────────────────────────────── */

function formatSalary(min: number | null, max: number | null): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n)

  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  if (max) return `Up to ${fmt(max)}`
  return ''
}

function formatType(type: CareerType): string {
  const map: Record<string, string> = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
    REMOTE: 'Remote',
  }
  return map[type] ?? type
}

const typeStyles: Record<string, string> = {
  FULL_TIME: 'bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)]',
  PART_TIME: 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]',
  CONTRACT: 'bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple)]',
  REMOTE: 'bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]',
}

const departmentColors: Record<string, string> = {
  Engineering: 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]',
  Design: 'bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple)]',
  Marketing: 'bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)]',
  Sales: 'bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]',
  Operations: 'bg-amber-500/10 text-amber-500',
  HR: 'bg-pink-500/10 text-pink-500',
  Finance: 'bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)]',
}

function getDepartmentColor(dept: string | null): string {
  if (!dept) return 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]'
  return departmentColors[dept] ?? 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]'
}

/* ── Why Join Us Data ────────────────────────────────────────── */

const WHY_JOIN = [
  {
    icon: Users,
    title: 'Collaborative Culture',
    description:
      'Work alongside passionate professionals who challenge and inspire you to grow every day.',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description:
      'Continuous learning opportunities, mentorship programs, and clear career progression paths.',
  },
  {
    icon: HeartHandshake,
    title: 'Work-Life Balance',
    description:
      'Flexible schedules, remote options, and a supportive environment that respects your personal time.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description:
      'Access to enterprise-grade tools, scalable technologies, and the autonomy to drive measurable technical impact.',
  },
  {
    icon: Sparkles,
    title: 'Great Benefits',
    description:
      'Competitive compensation, health coverage, retirement plans, and wellness programs.',
  },
  {
    icon: Building2,
    title: 'Global Impact',
    description:
      'Work on enterprise projects that transform businesses and industries worldwide.',
  },
]

/* ── Component ─────────────────────────────────────────────────── */

export function CareersList({ careers, departments, locations }: CareersListProps) {
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [remoteOnly, setRemoteOnly] = useState(false)

  const filtered = useMemo(() => {
    return careers.filter((c) => {
      if (search) {
        const q = search.toLowerCase()
        const matchesSearch =
          c.title.toLowerCase().includes(q) ||
          (c.department ?? '').toLowerCase().includes(q) ||
          (c.location ?? '').toLowerCase().includes(q)
        if (!matchesSearch) return false
      }
      if (selectedDept !== 'all' && c.department !== selectedDept) return false
      if (selectedLocation !== 'all' && c.location !== selectedLocation) return false
      if (selectedType !== 'all' && c.type !== selectedType) return false
      if (remoteOnly && c.type !== 'REMOTE') return false
      return true
    })
  }, [careers, search, selectedDept, selectedLocation, selectedType, remoteOnly])

  const hasActiveFilters =
    search !== '' ||
    selectedDept !== 'all' ||
    selectedLocation !== 'all' ||
    selectedType !== 'all' ||
    remoteOnly

  const clearFilters = () => {
    setSearch('')
    setSelectedDept('all')
    setSelectedLocation('all')
    setSelectedType('all')
    setRemoteOnly(false)
  }

  return (
    <>
      {/* ── Why Join Us ── */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
              Why Join Synova?
            </span>
            <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
              Build the Future With Us
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)] md:text-xl">
              At Synova Infotech, we believe in empowering talent, fostering innovation, and creating
              an environment where great ideas thrive.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_JOIN.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-[var(--color-accent-cyan)]/10 transition-colors duration-300 group-hover:from-[var(--color-accent-blue)]/20 group-hover:to-[var(--color-accent-cyan)]/20">
                    <Icon className="h-6 w-6 text-[var(--color-accent-blue)]" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-[var(--color-text)]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Filters Section ── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl">
              Open Positions
            </h2>
            <p className="mt-2 text-[var(--color-text-secondary)]">
              {filtered.length} {filtered.length === 1 ? 'position' : 'positions'} found
            </p>
          </div>

          {/* Search & Filter Row */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search positions..."
                aria-label="Search positions"
                className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] backdrop-blur-xl transition-colors focus:border-[var(--color-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-blue)]"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              aria-label="Filter by department"
              className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] backdrop-blur-xl transition-colors focus:border-[var(--color-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-blue)]"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Filter by location"
              className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] backdrop-blur-xl transition-colors focus:border-[var(--color-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-blue)]"
            >
              <option value="all">All Locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by employment type"
              className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] backdrop-blur-xl transition-colors focus:border-[var(--color-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-blue)]"
            >
              <option value="all">All Types</option>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACT">Contract</option>
              <option value="REMOTE">Remote</option>
            </select>

            {/* Remote Toggle */}
            <button
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200',
                remoteOnly
                  ? 'border-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]'
                  : 'border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--color-text-secondary)] backdrop-blur-xl hover:text-[var(--color-text)]',
              )}
            >
              <Wifi className="h-4 w-4" />
              Remote Only
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text)]"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>

          {/* ── Career Cards Grid ── */}
          <motion.div className="grid gap-6 sm:grid-cols-2" layout>
            <AnimatePresence mode="popLayout">
              {filtered.map((career, index) => (
                <motion.div
                  key={career.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                >
                  <Link
                    href={`/careers/${career.slug}`}
                    className={cn(
                      'group relative block rounded-xl border border-[var(--glass-border)]',
                      'bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-xl',
                      'transition-all duration-300',
                      'hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
                    )}
                  >
                    {/* Hover gradient */}
                    <div
                      className={cn(
                        'pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300',
                        'bg-gradient-to-br from-[var(--color-accent-blue)]/[0.03] to-[var(--color-accent-cyan)]/[0.03]',
                        'group-hover:opacity-100',
                      )}
                      aria-hidden="true"
                    />

                    <div className="relative z-10">
                      {/* Title + Remote Badge */}
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="font-heading text-lg font-semibold text-[var(--color-text)] transition-colors duration-200 group-hover:text-[var(--color-accent-blue)]">
                          {career.title}
                        </h3>
                        {career.type === 'REMOTE' && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-accent-cyan)]/10 px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-accent-cyan)]">
                            <Wifi className="h-3 w-3" />
                            Remote
                          </span>
                        )}
                      </div>

                      {/* Meta row */}
                      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                        {career.department && (
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider',
                              getDepartmentColor(career.department),
                            )}
                          >
                            <Building2 className="mr-1 h-3 w-3" />
                            {career.department}
                          </span>
                        )}
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider',
                            typeStyles[career.type] ?? typeStyles.FULL_TIME,
                          )}
                        >
                          <Briefcase className="mr-1 h-3 w-3" />
                          {formatType(career.type)}
                        </span>
                        {career.location && (
                          <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                            <MapPin className="h-3.5 w-3.5" />
                            {career.location}
                          </span>
                        )}
                      </div>

                      {/* Salary */}
                      {(career.salaryMin || career.salaryMax) && (
                        <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent-emerald)]">
                          <Banknote className="h-4 w-4" />
                          {formatSalary(career.salaryMin, career.salaryMax)}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-dashed border-[var(--color-border)] py-20 text-center"
            >
              <Briefcase className="mx-auto mb-4 h-12 w-12 text-[var(--color-text-tertiary)]" />
              <p className="text-lg font-medium text-[var(--color-text)]">No positions found</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Try adjusting your filters or search terms.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center gap-1 rounded-xl bg-[var(--color-accent-blue)] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-md"
                >
                  Clear All Filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
