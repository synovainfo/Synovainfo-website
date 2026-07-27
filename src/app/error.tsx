'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { V2Hero } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Unhandled public route error:', error)
  }, [error])

  return (
    <>
      <V2Hero content={v2Pages.error} variant="compact" />
      <section className="v2-section v2-light" role="alert" aria-live="assertive">
        <div className="v2-shell v2-actions">
          <button className="v2-button v2-button-primary" type="button" onClick={reset}>Try again</button>
          <Link className="v2-button v2-button-secondary" href="/">Return home</Link>
          <Link className="v2-button v2-button-secondary" href="/contact">Contact Synova</Link>
        </div>
        {error.digest && <p className="v2-shell mt-6 text-sm text-[var(--color-text-secondary)]">Reference: {error.digest}</p>}
      </section>
    </>
  )
}
