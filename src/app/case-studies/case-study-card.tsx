import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CaseStudyPageData } from './page'

interface CaseStudyCardProps {
  caseStudy: CaseStudyPageData
  /** Preview visual shown when the case study has no featured image. */
  fallbackImage: string | null
}

export function CaseStudyCard({ caseStudy, fallbackImage }: CaseStudyCardProps) {
  const content = caseStudy.content as Record<string, unknown> | null
  const industry = (content?.industry as string) ?? 'Technology'
  const technologies = (content?.technologies as string[]) ?? []
  const results = (content?.results as { metric: string; value: string }[]) ?? []

  return (
    <Link
      href={`/case-studies/${caseStudy.slug}`}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--glass-border)]',
        'bg-[var(--glass-bg)] shadow-sm backdrop-blur-xl',
        'transition-all duration-300',
        'hover:shadow-xl hover:border-[var(--color-accent-blue)]/20',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
      )}
    >
      {/* Featured image, preview visual, or gradient placeholder */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-[var(--color-accent-cyan)]/10">
        {caseStudy.featuredImage ? (
          <Image
            src={caseStudy.featuredImage}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : fallbackImage ? (
          <Image
            src={fallbackImage}
            alt={`${industry} case study preview`}
            width={600}
            height={400}
            loading="lazy"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="grid grid-cols-4 gap-1 p-6 opacity-20">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm bg-[var(--color-accent-blue)]/40"
                />
              ))}
            </div>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Industry badge */}
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-800 backdrop-blur-sm">
          {industry}
        </span>

        {/* View icon */}
        <div className="absolute top-3 right-3 rounded-full bg-white/90 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight className="h-4 w-4 text-zinc-800" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 font-heading text-lg font-bold text-[var(--color-text)] leading-snug group-hover:text-[var(--color-accent-blue)] transition-colors duration-200">
          {caseStudy.title}
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-2 flex-1">
          {caseStudy.excerpt}
        </p>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-md bg-[var(--color-surface-tertiary)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)]"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 4 && (
              <span className="inline-flex items-center rounded-md bg-[var(--color-surface-tertiary)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)]">
                +{technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Key results */}
        {results.length > 0 && (
          <div className="mt-auto grid grid-cols-3 gap-3 rounded-xl bg-[var(--color-surface-secondary)] p-3">
            {results.slice(0, 3).map((result) => (
              <div key={result.metric} className="text-center">
                <div className="font-heading text-base font-bold text-[var(--color-accent-emerald)]">
                  {result.value}
                </div>
                <div className="text-[10px] leading-tight text-[var(--color-text-tertiary)]">
                  {result.metric}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
