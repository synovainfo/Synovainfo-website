import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Handshake,
  Cloud,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  Award,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Technology Alliances & Strategic Partners | Synova Infotech',
  description:
    'Synova partners with leading global technology innovators, cloud providers, and enterprise security platforms including AWS, Microsoft Azure, Google Cloud, and Snowflake.',
}

interface Alliance {
  category: string
  partners: Array<{
    name: string
    tier: string
    description: string
    specialization: string
  }>
}

const ALLIANCES: Alliance[] = [
  {
    category: 'Cloud Infrastructure & Platform Alliances',
    partners: [
      {
        name: 'Amazon Web Services (AWS)',
        tier: 'Advanced Consulting Partner',
        description: 'Deep expertise in EKS, Lambda serverless, Aurora PostgreSQL, and Well-Architected Framework reviews.',
        specialization: 'Cloud Migration & Containerization',
      },
      {
        name: 'Microsoft Azure',
        tier: 'Gold Cloud Solutions Partner',
        description: 'Certified enterprise modern workplace, Azure Kubernetes Service (AKS), and Entra ID security integrations.',
        specialization: 'Enterprise Hybrid Infrastructure',
      },
      {
        name: 'Google Cloud Platform (GCP)',
        tier: 'Premier Premier Partner',
        description: 'BigQuery real-time telemetry analytics, Vertex AI model orchestration, and Anthos multi-cloud management.',
        specialization: 'Data Engineering & AI/ML',
      },
    ],
  },
  {
    category: 'Enterprise Data & Security Integrations',
    partners: [
      {
        name: 'Snowflake Data Cloud',
        tier: 'Select Services Partner',
        description: 'Architecting zero-copy data sharing, secure data clean rooms, and high-performance analytical warehouses.',
        specialization: 'Petabyte-Scale Data Warehousing',
      },
      {
        name: 'HashiCorp',
        tier: 'Technology Ecosystem Partner',
        description: 'Infrastructure as Code deployment using Terraform Cloud and Vault Secrets Management across multi-tenant clusters.',
        specialization: 'DevOps & Secrets Governance',
      },
      {
        name: 'Datadog',
        tier: 'Observability Integration Partner',
        description: 'End-to-end distributed tracing, APM dashboarding, and automated incident correlation for 99.999% SLA uptime.',
        specialization: 'Full-Stack Observability',
      },
    ],
  },
]

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-16">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-blue)]/20 bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-blue)]">
            <Handshake className="h-3.5 w-3.5" />
            Global Ecosystem & Strategic Alliances
          </span>
          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl md:text-6xl">
            Technology Alliances Built for Scale
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            We collaborate closely with leading cloud hyperscalers, security platforms, and data innovators to deliver certified enterprise solutions.
          </p>
        </div>
      </section>

      {/* Alliance Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {ALLIANCES.map((alliance, idx) => (
              <div key={idx}>
                <h2 className="font-heading text-2xl font-bold text-[var(--color-text)] md:text-3xl">
                  {alliance.category}
                </h2>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  {alliance.partners.map((p, i) => (
                    <div
                      key={i}
                      className="group flex flex-col justify-between rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-[var(--color-accent-blue)]/40 hover:shadow-xl"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent-blue)]">
                            <Award className="h-3.5 w-3.5" />
                            {p.tier}
                          </span>
                        </div>
                        <h3 className="mt-4 font-heading text-xl font-bold text-[var(--color-text)]">
                          {p.name}
                        </h3>
                        <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                          {p.description}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] block">
                          Specialization Area
                        </span>
                        <span className="mt-1 text-xs font-medium text-[var(--color-text)] block">
                          {p.specialization}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Become a Partner Callout */}
          <div className="mt-20 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center md:p-12">
            <h3 className="font-heading text-2xl font-bold text-[var(--color-text)]">
              Interested in Strategic Alliance Partnership?
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--color-text-secondary)]">
              Connect with our Alliance Management team to explore joint enterprise solution development and integration.
            </p>
            <div className="mt-6">
              <Link
                href="/contact?intent=partner"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-blue)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600"
              >
                Contact Alliance Team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
