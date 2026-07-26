'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileText, Video, FileSpreadsheet, File } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Types ────────────────────────────────────────────────────── */

interface DownloadItem {
  id: string
  title: string
  fileType: string | null
  fileSize: number | null
  fileUrl: string | null
  description: string | null
  category: string | null
  icon: string | null
  isFeatured: boolean
  downloadCount: number
}

interface ResourcesListProps {
  downloads: DownloadItem[]
  categories: string[]
}

/* ── File type helpers ────────────────────────────────────────── */

const FILE_ICONS: Record<string, typeof FileText> = {
  PDF: FileText,
  MP4: Video,
  WEBM: Video,
  MOV: Video,
  DOC: FileText,
  DOCX: FileText,
  XLS: FileSpreadsheet,
  XLSX: FileSpreadsheet,
  PPT: File,
  PPTX: File,
  CSV: FileSpreadsheet,
}

const FILE_COLORS: Record<string, string> = {
  PDF: 'text-red-500 bg-red-500/10',
  MP4: 'text-purple-500 bg-purple-500/10',
  WEBM: 'text-purple-500 bg-purple-500/10',
  MOV: 'text-purple-500 bg-purple-500/10',
  DOC: 'text-blue-500 bg-blue-500/10',
  DOCX: 'text-blue-500 bg-blue-500/10',
  XLS: 'text-emerald-500 bg-emerald-500/10',
  XLSX: 'text-emerald-500 bg-emerald-500/10',
  PPT: 'text-orange-500 bg-orange-500/10',
  PPTX: 'text-orange-500 bg-orange-500/10',
}

function getFileIcon(fileType: string | null) {
  const key = (fileType ?? '').toUpperCase()
  return FILE_ICONS[key] ?? File
}

function getFileColor(fileType: string | null) {
  const key = (fileType ?? '').toUpperCase()
  return FILE_COLORS[key] ?? 'text-gray-500 bg-gray-500/10'
}

function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === undefined) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDownloadCount(count: number): string {
  if (count < 1000) return String(count)
  return `${(count / 1000).toFixed(1)}k`
}

function formatCategoryLabel(cat: string): string {
  return cat
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/* ── Component ────────────────────────────────────────────────── */

export function ResourcesList({ downloads, categories }: ResourcesListProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  /* ── Filtered ── */

  const filteredDownloads = useMemo(() => {
    if (activeCategory === 'all') return downloads
    return downloads.filter((d) => d.category === activeCategory)
  }, [activeCategory, downloads])

  const featured = useMemo(
    () => filteredDownloads.find((d) => d.isFeatured) ?? null,
    [filteredDownloads],
  )

  const regular = useMemo(
    () => filteredDownloads.filter((d) => d.id !== featured?.id),
    [filteredDownloads, featured],
  )

  const hasResults = filteredDownloads.length > 0

  /* ── Render ── */

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Category Tabs ── */}
        <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Resource categories">
          <button
            role="tab"
            aria-selected={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              activeCategory === 'all'
                ? 'bg-[var(--color-accent-blue)] text-white shadow-md'
                : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] hover:text-[var(--color-text)]',
            )}
          >
            All Resources
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                activeCategory === cat
                  ? 'bg-[var(--color-accent-blue)] text-white shadow-md'
                  : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] hover:text-[var(--color-text)]',
              )}
            >
              {formatCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {hasResults ? (
          <>
            {/* ── Featured Resource ── */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-accent-blue)]/[0.03] to-[var(--color-accent-cyan)]/[0.03]"
                    aria-hidden
                  />

                  <div className="relative">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className="mb-2 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent-blue)]">
                          Featured Resource
                        </span>
                        <h3 className="font-heading text-xl font-semibold text-[var(--color-text)] md:text-2xl">
                          {featured.title}
                        </h3>
                      </div>
                      <div
                        className={cn(
                          'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                          getFileColor(featured.fileType),
                        )}
                      >
                        {(() => {
                          const Icon = getFileIcon(featured.fileType)
                          return <Icon className="h-6 w-6" />
                        })()}
                      </div>
                    </div>

                    {featured.description && (
                      <p className="mb-6 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
                        {featured.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href={featured.fileUrl ?? '#'}
                        download
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-blue)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-accent-blue)]/20 transition-all duration-300 hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
                        {featured.fileType && (
                          <span
                            className={cn('rounded px-1.5 py-0.5 font-medium', getFileColor(featured.fileType))}
                          >
                            {featured.fileType}
                          </span>
                        )}
                        {featured.fileSize !== null && featured.fileSize !== undefined && (
                          <span>{formatFileSize(featured.fileSize)}</span>
                        )}
                        <span>{formatDownloadCount(featured.downloadCount)} downloads</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Resource Grid ── */}
            {regular.length > 0 && (
              <motion.div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {regular.map((item, index) => {
                    const Icon = getFileIcon(item.fileType)
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.04 }}
                        className="group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg"
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            'mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg',
                            getFileColor(item.fileType),
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Title */}
                        <h3 className="mb-2 font-heading text-base font-semibold text-[var(--color-text)]">
                          {item.title}
                        </h3>

                        {/* Description */}
                        {item.description && (
                          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                            {item.description}
                          </p>
                        )}

                        {/* Meta + Download */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                            {item.fileType && (
                              <span
                                className={cn('rounded px-1.5 py-0.5 font-medium', getFileColor(item.fileType))}
                              >
                                {item.fileType}
                              </span>
                            )}
                            {item.fileSize !== null && item.fileSize !== undefined && (
                              <span>{formatFileSize(item.fileSize)}</span>
                            )}
                            <span>{formatDownloadCount(item.downloadCount)}</span>
                          </div>
                          <a
                            href={item.fileUrl ?? '#'}
                            download
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-accent-blue)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
                            aria-label={`Download ${item.title}`}
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <p className="text-[var(--color-text-tertiary)]">
              No resources found in this category. Try selecting a different filter.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
