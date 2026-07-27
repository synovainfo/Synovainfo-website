import Link from 'next/link'
import { V2Hero } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export default function NotFound() {
  return (
    <>
      <V2Hero content={v2Pages.notFound} variant="compact" />
      <section className="v2-section v2-light">
        <div className="v2-shell v2-actions">
          <Link className="v2-button v2-button-primary" href="/">Return home</Link>
          <Link className="v2-button v2-button-secondary" href="/contact">Contact Synova</Link>
        </div>
      </section>
    </>
  )
}
