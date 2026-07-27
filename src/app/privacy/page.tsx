import type { Metadata } from 'next'
import { V2PageFrame } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const metadata: Metadata = {
  title: 'Privacy Policy | Synova Infotech',
  description: 'Synova Infotech privacy policy for responsible collection, use, retention, and protection of personal information.',
}

export default function PrivacyPage() {
  return (
    <V2PageFrame content={v2Pages.privacy}>
      <section className="v2-section v2-light">
        <div className="v2-shell v2-editorial">
          <div>
            <p className="v2-eyebrow">Privacy Controls</p>
            <h2>Data protection is treated as an operating control.</h2>
          </div>
          <div className="v2-editorial-panel">
            <span>Policy Summary</span>
            <p>We collect only necessary business information, protect it through access controls, and use it to respond to inquiries, operate services, and meet legal obligations.</p>
          </div>
        </div>
      </section>
    </V2PageFrame>
  )
}
