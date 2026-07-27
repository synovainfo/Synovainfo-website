import type { Metadata } from 'next'
import { V2PageFrame, V2ProcessRail, V2TechnologyTopology } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const metadata: Metadata = {
  title: 'About Synova Infotech | Enterprise Technology Partner',
  description: 'Learn how Synova Infotech combines architecture, security, product thinking, and delivery governance for enterprise technology transformation.',
}

export default function AboutPage() {
  return (
    <V2PageFrame content={v2Pages.about}>
      <section className="v2-section v2-light">
        <div className="v2-shell v2-editorial">
          <div>
            <p className="v2-eyebrow">Company System</p>
            <h2>Small enough for accountability. Serious enough for enterprise constraints.</h2>
          </div>
          <div className="v2-editorial-panel">
            <span>How We Work</span>
            <p>Synova operates through senior discovery, architecture review, delivery governance, secure implementation, and post-launch stewardship.</p>
          </div>
        </div>
      </section>
      <V2ProcessRail />
      <V2TechnologyTopology />
    </V2PageFrame>
  )
}
