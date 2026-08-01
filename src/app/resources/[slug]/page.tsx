import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  Download,
  Calendar,
  FileText,
  BookOpen,
  Video,
  FileSpreadsheet,
  File,
  ArrowLeft,
} from 'lucide-react'

/* ── Types ─────────────────────────────────────────────────────── */

interface ResourceDetail {
  id: string
  title: string
  slug: string
  description: string | null
  type: string | null
  fileUrl: string | null
  coverImage: string | null
  category: string | null
  tags: unknown
  downloadCount: number
  status: boolean
  createdAt: Date
  updatedAt: Date
}

interface RelatedResource {
  id: string
  title: string
  slug: string
  description: string | null
  type: string | null
  fileUrl: string | null
  coverImage: string | null
  downloadCount: number
  createdAt: Date
}

/* ── File type helpers ─────────────────────────────────────────── */

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

/* ── Format helpers ────────────────────────────────────────────── */

function formatCategoryLabel(cat: string): string {
  return cat
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const TYPE_COLORS: Record<string, string> = {
  WHITEPAPER: 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]',
  GUIDE: 'bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)]',
  EBOOK: 'bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple)]',
  DATASHEET: 'bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]',
  CASE_STUDY: 'bg-[var(--color-accent-amber)]/10 text-[var(--color-accent-amber)]',
}

function getTypeColor(type: string | null): string {
  return TYPE_COLORS[(type ?? '').toUpperCase()] ?? 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]'
}

/* ── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const resource = await prisma.resource.findUnique({
    where: { slug, status: true },
    select: { title: true, description: true, type: true, category: true },
  })

  if (!resource) return {}

  return {
    title: `${resource.title} | Resources | Synova Infotech`,
    description:
      resource.description?.slice(0, 160) ??
      `Download this ${resource.type?.toLowerCase() ?? 'resource'} from Synova Infotech.`,
    openGraph: {
      title: `${resource.title} — Synova Infotech Resources`,
      description: resource.description?.slice(0, 200) ?? '',
      type: 'article',
    },
  }
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const resource = (await prisma.resource.findUnique({
    where: { slug, status: true },
  })) as ResourceDetail | null

  if (!resource) {
    notFound()
  }

  // Related resources (same category, exclude current)
  const relatedResources: RelatedResource[] = resource.category
    ? ((await prisma.resource.findMany({
        where: {
          status: true,
          category: resource.category,
          id: { not: resource.id },
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          type: true,
          fileUrl: true,
          coverImage: true,
          downloadCount: true,
          createdAt: true,
        },
      })) as RelatedResource[])
    : []

  /* ── JSON-LD Schema ── */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: resource.title,
    description: resource.description ?? '',
    datePublished: resource.createdAt.toISOString(),
    dateModified: resource.updatedAt.toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'Synova Infotech Private Limited',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://synovainfo.com'}/resources/${resource.slug}`,
    },
  }

  const FileIcon = getFileIcon(resource.type)

  return (
    <>
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Breadcrumb ── */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-accent-blue)]"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" aria-hidden="true" />
          <Link
            href="/resources"
            className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-accent-blue)]"
          >
            Resources
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" aria-hidden="true" />
          <span className="truncate font-medium text-[var(--color-text)]" aria-current="page">
            {resource.title}
          </span>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-surface-secondary)] via-transparent to-[var(--color-accent-blue)]/[0.02] py-12 md:py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[var(--color-accent-blue)] opacity-[0.04] blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[var(--color-accent-cyan)] opacity-[0.03] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5 lg:items-center">
            {/* Left: Text Content */}
            <div className="lg:col-span-3">
              {/* Badges Row */}
              <div className="mb-6 flex flex-wrap items-center gap-3">
                {resource.type && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider',
                      getTypeColor(resource.type),
                    )}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    {formatCategoryLabel(resource.type)}
                  </span>
                )}
                {resource.category && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                      getFileColor(resource.type),
                    )}
                  >
                    {formatCategoryLabel(resource.category)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(resource.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Title */}
              <h1 className="mb-6 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
                {resource.title}
              </h1>

              {/* Description */}
              {resource.description && (
                <p className="mb-8 text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
                  {resource.description}
                </p>
              )}

              {/* Download Button */}
              {resource.fileUrl && (
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={resource.fileUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-blue)] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[var(--color-accent-blue)]/20 transition-all duration-300 hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
                    aria-label={`Download ${resource.title}`}
                  >
                    <Download className="h-5 w-5" />
                    Download Resource
                  </a>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-tertiary)]">
                    {resource.type && (
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded px-2 py-1 font-medium',
                          getFileColor(resource.type),
                        )}
                      >
                        <FileIcon className="h-4 w-4" />
                        {resource.type}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Download className="h-4 w-4" />
                      {resource.downloadCount.toLocaleString()} download{resource.downloadCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Cover Image */}
            {resource.coverImage && (
              <div className="lg:col-span-2">
                <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
                  <Image
                    src={resource.coverImage}
                    alt={`Cover image for ${resource.title}`}
                    width={600}
                    height={450}
                    className="h-auto w-full object-cover"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ── Full Description ── */}
        {resource.description && (
          <section className="mb-12">
            <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)]">
              About This Resource
            </h2>
            <div className="text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
              {resource.description.split('\n').map((paragraph, i) =>
                paragraph.trim() ? (
                  <p key={i} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ) : null,
              )}
            </div>
          </section>
        )}

        {/* ── Download Card ── */}
        {resource.fileUrl && (
          <section className="mb-16 rounded-xl border border-[var(--glass-border)] bg-gradient-to-br from-[var(--color-accent-blue)]/[0.03] to-[var(--color-accent-cyan)]/[0.03] p-8 md:p-10">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="mb-2 font-heading text-xl font-bold text-[var(--color-text)]">
                  Download Resource
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Get your free copy of this {resource.type?.toLowerCase() ?? 'resource'}.
                </p>
              </div>
              <a
                href={resource.fileUrl}
                download
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--color-accent-blue)] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[var(--color-accent-blue)]/20 transition-all duration-300 hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
                aria-label={`Download ${resource.title}`}
              >
                <Download className="h-5 w-5" />
                Download Now
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[var(--color-border)] pt-6">
              {resource.type && (
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <FileText className="h-4 w-4" />
                  <span>
                    Format: <strong className="text-[var(--color-text)]">{resource.type}</strong>
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Download className="h-4 w-4" />
                <span>
                  <strong className="text-[var(--color-text)]">{resource.downloadCount.toLocaleString()}</strong>{' '}
                  downloads
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Calendar className="h-4 w-4" />
                <span>
                  Published{' '}
                  {new Date(resource.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ── Back to Resources ── */}
        <div className="mb-16">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent-blue)] transition-colors hover:text-[var(--color-accent-blue)]/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Resources
          </Link>
        </div>

        {/* ── Related Resources ── */}
        {relatedResources.length > 0 && (
          <section>
            <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight text-[var(--color-text)]">
              Related Resources
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedResources.map((item) => {
                const Icon = getFileIcon(item.type)
                return (
                  <Link
                    key={item.id}
                    href={`/resources/${item.slug}`}
                    className={cn(
                      'group rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-xl',
                      'transition-all duration-300 hover:border-[var(--color-accent-blue)]/30 hover:shadow-lg',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
                    )}
                  >
                    {/* Cover image */}
                    {item.coverImage && (
                      <div className="relative mb-4 overflow-hidden rounded-lg">
                        <Image
                          src={item.coverImage}
                          alt={`Cover image for ${item.title}`}
                          width={400}
                          height={250}
                          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Type icon badge */}
                    <div
                      className={cn(
                        'mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg',
                        getFileColor(item.type),
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 font-heading text-sm font-semibold text-[var(--color-text)] transition-colors duration-200 group-hover:text-[var(--color-accent-blue)]">
                      {item.title}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                        {item.description}
                      </p>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
