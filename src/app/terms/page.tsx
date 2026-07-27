import type { Metadata } from 'next'
import { V2PageFrame } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const metadata: Metadata = {
  title: 'Terms of Service | Synova Infotech',
  description: 'Synova Infotech website terms covering acceptable use, professional services boundaries, intellectual property, and liability.',
}

export default function TermsPage() {
  return (
    <V2PageFrame content={v2Pages.terms}>
      <section className="v2-section v2-light">
        <div className="v2-shell v2-editorial">
          <div>
            <p className="v2-eyebrow">Terms Framework</p>
            <h2>Clear rules create better professional engagement.</h2>
          </div>
          <div className="v2-editorial-panel">
            <span>Use of Site</span>
            <p>Website content is provided for business evaluation. Formal project scope, confidentiality, commercial terms, and deliverables are governed by signed agreements.</p>
          </div>
        </div>
      </section>
    </V2PageFrame>
  )
}
