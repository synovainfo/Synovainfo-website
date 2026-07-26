import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Compass,
  FileText,
  Briefcase,
  Building2,
  BookOpen,
  ShieldCheck,
  Globe,
  Layers,
  ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'HTML Sitemap | Synova Infotech',
  description:
    'Complete human-readable page directory and structural sitemap of the Synova Infotech digital experience.',
}

interface SitemapSection {
  title: string
  icon: string
  links: Array<{
    name: string
    href: string
    description: string
  }>
}

const SITEMAP_SECTIONS: SitemapSection[] = [
  {
    title: 'Core Platform & Architecture',
    icon: 'Compass',
    links: [
      { name: 'Home', href: '/', description: 'Flagship digital experience & executive summary' },
      { name: 'About Us', href: '/about', description: 'Company history, mission, leadership, and core values' },
      { name: 'Solutions Blueprint', href: '/solutions', description: 'Enterprise solution architectures and frameworks' },
      { name: 'Technology Stack', href: '/technologies', description: 'Production technology stack index and component specs' },
    ],
  },
  {
    title: 'Services & Practice Areas',
    icon: 'Layers',
    links: [
      { name: 'Services Directory', href: '/services', description: 'Overview of engineering and architecture practices' },
      { name: 'Cloud Native Engineering', href: '/services/cloud-native', description: 'Kubernetes, AWS/Azure, serverless, microservices' },
      { name: 'Data Engineering & AI', href: '/services/data-ai', description: 'Petabyte data pipelines, vector databases, RAG' },
      { name: 'Cybersecurity & Zero Trust', href: '/services/security', description: 'SOC 2, ISO 27001, identity & network security' },
    ],
  },
  {
    title: 'Industries & Case Studies',
    icon: 'Briefcase',
    links: [
      { name: 'Industries Overview', href: '/industries', description: 'Sector-specific solutions and regulatory alignment' },
      { name: 'Financial Services', href: '/industries/financial-services', description: 'Banking, fintech, and trading infrastructure' },
      { name: 'Healthcare & Life Sciences', href: '/industries/healthcare', description: 'HIPAA compliant telemetry & clinical AI' },
      { name: 'Case Studies Directory', href: '/case-studies', description: 'Quantified client outcomes and success stories' },
    ],
  },
  {
    title: 'Partnerships & Engagement',
    icon: 'Building2',
    links: [
      { name: 'Engagement Models', href: '/engagement-models', description: 'Pricing structures, SLAs, dedicated squad models' },
      { name: 'Technology Alliances', href: '/partners', description: 'AWS, Azure, GCP, and Snowflake partner ecosystem' },
      { name: 'Press Room', href: '/press', description: 'Press releases, media contact, downloadable brand kit' },
      { name: 'Events & Webinars', href: '/events', description: 'Executive roundtables and technical keynotes' },
    ],
  },
  {
    title: 'Insights, Resources & Careers',
    icon: 'BookOpen',
    links: [
      { name: 'Insights & Blog', href: '/blog', description: 'Technical articles, engineering insights, and whitepapers' },
      { name: 'Whitepaper Downloads', href: '/resources', description: 'Architecture blueprints and downloadable PDFs' },
      { name: 'Careers & Portal', href: '/careers', description: 'Open engineering positions and culture' },
      { name: 'FAQ', href: '/faq', description: 'Frequently asked questions regarding engagement & security' },
    ],
  },
  {
    title: 'Contact, Legal & Compliance',
    icon: 'ShieldCheck',
    links: [
      { name: 'Contact Us', href: '/contact', description: 'Schedule executive briefings and inquiries' },
      { name: 'Privacy Policy', href: '/privacy', description: 'Data privacy disclosures, GDPR/CCPA rights' },
      { name: 'Terms of Service', href: '/terms', description: 'Terms of use and operational governance' },
      { name: 'Search Directory', href: '/search', description: 'Site-wide search directory' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-16">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-blue)]/20 bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-blue)]">
            <Compass className="h-3.5 w-3.5" />
            Digital Navigation Index
          </span>
          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl md:text-6xl">
            HTML Site Directory
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            A comprehensive, structured index of all pages, practices, solutions, and regulatory resources across Synova Infotech.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SITEMAP_SECTIONS.map((sec, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-md"
              >
                <h2 className="font-heading text-lg font-bold text-[var(--color-text)] pb-3 border-b border-[var(--color-border)]">
                  {sec.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {sec.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        className="group flex flex-col rounded-lg p-2 transition-colors hover:bg-[var(--color-surface-secondary)]"
                      >
                        <span className="flex items-center justify-between text-xs font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent-blue)]">
                          {link.name}
                          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                        <span className="mt-0.5 text-[11px] leading-normal text-[var(--color-text-tertiary)]">
                          {link.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
