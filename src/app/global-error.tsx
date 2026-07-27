'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#08111f', color: 'white', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
          <section style={{ maxWidth: '760px' }} role="alert" aria-live="assertive">
            <p style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '.16em', fontWeight: 800 }}>500</p>
            <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 5rem)', lineHeight: 1, margin: '1rem 0' }}>The application encountered an unexpected fault.</h1>
            <p style={{ color: 'rgba(255,255,255,.72)', fontSize: '1.1rem', lineHeight: 1.7 }}>The event has been logged for review. You can retry the current route or return to the main Synova experience.</p>
            <button onClick={reset} style={{ marginTop: '2rem', padding: '.9rem 1.3rem', borderRadius: '999px', border: 0, background: '#d4af37', color: '#08111f', fontWeight: 800 }}>Try again</button>
          </section>
        </main>
      </body>
    </html>
  )
}
