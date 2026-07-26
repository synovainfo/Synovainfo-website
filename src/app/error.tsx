'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { ChevronRight } from 'lucide-react'

/* ── Props ──────────────────────────────────────────────────────── */

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/* ── Error Boundary ──────────────────────────────────────────────── */

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  /* Log the error for debugging */
  useEffect(() => {
    console.error('Unhandled error:', error)
  }, [error])

  return (
    <>
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
          <span className="font-medium text-[var(--color-text)]" aria-current="page">
            Error
          </span>
        </div>
      </nav>

      {/* ── Error Content ── */}
      <main
        className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center"
        role="alert"
        aria-live="assertive"
      >
        {/* Decorative elements */}
        <div className="relative mb-8" aria-hidden="true">
          <div className="flex items-center gap-4">
            {/* Left triangle */}
            <svg
              className="h-16 w-16 text-[var(--color-accent-red)]/20 md:h-20 md:w-20"
              viewBox="0 0 80 80"
              fill="none"
              aria-hidden="true"
            >
              <polygon
                points="40,8 72,68 8,68"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-[var(--color-accent-red)]/20"
              />
            </svg>

            {/* Error symbol */}
            <span className="text-[120px] font-bold leading-none tracking-tight text-[var(--color-text)] md:text-[160px]">
              !
            </span>

            {/* Right triangle (inverted) */}
            <svg
              className="h-16 w-16 text-[var(--color-accent-blue)]/20 md:h-20 md:w-20"
              viewBox="0 0 80 80"
              fill="none"
              aria-hidden="true"
            >
              <polygon
                points="8,12 72,12 40,68"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-[var(--color-accent-blue)]/20"
              />
            </svg>
          </div>

          {/* Subtle glow beneath */}
          <div
            className="absolute -bottom-8 left-1/2 h-20 w-3/4 -translate-x-1/2 rounded-full opacity-[0.04] blur-3xl"
            style={{ backgroundColor: 'var(--color-accent-red)' }}
          />
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl">
          Something Went Wrong
        </h1>

        {/* Description */}
        <p className="mb-8 max-w-md text-base leading-relaxed text-[var(--color-text-secondary)]">
          An unexpected error occurred. Please try again, or head back to the
          homepage. If the problem persists, contact our support team.
        </p>

        {/* Error digest for reference */}
        {error.digest && (
          <p className="mb-8 text-xs text-[var(--color-text-tertiary)]">
            Reference: <code className="font-mono text-[var(--color-text-secondary)]">{error.digest}</code>
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--color-accent-blue)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--color-accent-blue)]/20 transition-all duration-300 hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
            aria-label="Try again to load the page"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] px-7 py-3.5 text-sm font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-accent-blue)]/30 hover:bg-[var(--color-accent-blue)]/[0.04] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
          >
            Go Home
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] px-7 py-3.5 text-sm font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-accent-blue)]/30 hover:bg-[var(--color-accent-blue)]/[0.04] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
          >
            Contact Support
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-[var(--color-text-tertiary)]">
          Error &middot; Synova Infotech Private Limited
        </p>
      </main>
    </>
  )
}
