import type { Metadata } from 'next'
import Link from 'next/link'
import { V2Hero, V2Cta } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const metadata: Metadata = {
  title: 'Sitemap | Synova Infotech',
  description: 'Human-readable sitemap for Synova Infotech public website pages and enterprise technology content.',
}

const links = [
  ['Home', '/'], ['About', '/about'], ['Services', '/services'], ['Solutions', '/solutions'],
  ['Technologies', '/technologies'], ['Industries', '/industries'], ['Case Studies', '/case-studies'],
  ['Portfolio', '/portfolio'], ['Insights', '/insights'], ['Blog', '/blog'], ['Careers', '/careers'],
  ['Contact', '/contact'], ['FAQ', '/faq'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Search', '/search'],
]

export default function SitemapPage() {
  return (
    <>
      <V2Hero content={v2Pages.sitemap} />
      <section className="v2-section v2-light">
        <div className="v2-shell v2-service-stories">
          {links.map(([label, href], index) => (
            <Link className="v2-service-story" href={href} key={href}>
              <span className="v2-story-index">{String(index + 1).padStart(2, '0')}</span>
              <strong>{label}</strong>
              <span>{href}</span>
            </Link>
          ))}
        </div>
      </section>
      <V2Cta />
    </>
  )
}
