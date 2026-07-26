import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ShieldCheck,
  Zap,
  Users,
  Check,
  ArrowRight,
  HelpCircle,
  BarChart,
  Clock,
  Briefcase,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Enterprise Engagement & Pricing Models | Synova Infotech',
  description:
    'Transparent, enterprise-grade engagement models: Dedicated Engineering Squads, Fixed-Price Outcome Delivery, and Strategic Technology Advisory with strict SLAs.',
}

interface Model {
  name: string
  tagline: string
  bestFor: string
  structure: string
  sla: string
  features: string[]
  recommended?: boolean
}

const MODELS: Model[] = [
  {
    name: 'Dedicated Engineering Squads',
    tagline: 'Scale your engineering capacity with dedicated, cross-functional squads',
    bestFor: 'Long-term product expansion, complex cloud migration, and continuous platform innovation.',
    structure: 'Monthly squad subscription based on team composition (Architects, Staff Engineers, QA, DevOps).',
    sla: 'Guaranteed 99.5% sprint commitment delivery & dedicated technical account lead.',
    features: [
      '100% dedicated staff integrated directly into your Slack/Jira workflows',
      'Flexible squad scaling with 30-day notice period',
      'Complete IP assignment and continuous code commit governance',
      'Daily standups, bi-weekly sprint demos, and executive quarterly reviews',
    ],
    recommended: true,
  },
  {
    name: 'Fixed-Price Outcome Delivery',
    tagline: 'Scope-locked, milestone-driven execution for defined enterprise initiatives',
    bestFor: 'Greenfield system creation, architecture modernizations, and compliance audits with strict deadlines.',
    structure: 'Fixed contract price broken into verifiable milestone acceptance criteria.',
    sla: 'On-time milestone guarantee backed by financial SLA credits.',
    features: [
      'Comprehensive discovery & architecture specification phase before contract lock',
      'Zero cost overruns for agreed-upon requirement specifications',
      'Milestone sign-off gates tied to automated test suite pass criteria',
      '30-day post-delivery warranty and knowledge transfer training',
    ],
  },
  {
    name: 'Strategic Technology Advisory',
    tagline: 'Fractional CTO, Enterprise Architecture review, and Security audit retainer',
    bestFor: 'Executive teams requiring principal architectural governance and security oversight.',
    structure: 'Monthly advisory retainer with guaranteed response SLAs and executive hours.',
    sla: '4-hour critical incident advisory SLA & priority architect access.',
    features: [
      'Architecture review board (ARB) participation and technology roadmap validation',
      'Vendor risk assessment and RFP evaluation support',
      'SOC 2 / ISO 27001 readiness review and compliance posture tracking',
      'Direct access to Principal Architects and Security Advisory leads',
    ],
  },
]

const FAQS = [
  {
    q: 'How does Synova ensure IP ownership and data protection during engagements?',
    a: 'All intellectual property, source code, and design assets created during the engagement belong 100% to your organization from day one. All engineers operate under strict NDAs, zero-trust endpoint security, and secure SOC 2 compliant development environments.',
  },
  {
    q: 'What is the onboarding timeline for a Dedicated Engineering Squad?',
    a: 'Typical onboarding takes 10–14 business days from contract execution. This includes security clearance, VPN setup, repository access, and alignment on sprint cadences.',
  },
  {
    q: 'Can we transition from Fixed-Price Delivery to a Dedicated Squad?',
    a: 'Yes. Many enterprise clients begin with a Fixed-Price discovery or proof-of-concept phase, then transition the team into a Dedicated Engineering Squad for continuous platform scaling.',
  },
]

export default function EngagementModelsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-16">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-blue)]/20 bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-blue)]">
            <Briefcase className="h-3.5 w-3.5" />
            Flexible Enterprise Partnership Structures
          </span>
          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl md:text-6xl">
            Predictable, Transparent Engagement Models
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            Designed for enterprise procurement standards: clear SLAs, total IP security, transparent cost governance, and zero hidden friction.
          </p>
        </div>
      </section>

      {/* Models Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {MODELS.map((model, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col justify-between rounded-2xl border ${
                  model.recommended
                    ? 'border-[var(--color-accent-blue)] bg-[var(--glass-bg)] shadow-2xl ring-1 ring-[var(--color-accent-blue)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg'
                } p-8 backdrop-blur-xl transition-all duration-300 hover:shadow-xl`}
              >
                {model.recommended && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent-blue)] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                    Most Popular Enterprise Choice
                  </span>
                )}

                <div>
                  <h3 className="font-heading text-2xl font-bold text-[var(--color-text)]">
                    {model.name}
                  </h3>
                  <p className="mt-2 text-xs font-medium text-[var(--color-text-tertiary)]">
                    {model.tagline}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-text-secondary)]">
                    <div>
                      <span className="font-semibold text-[var(--color-text)]">Best For: </span>
                      {model.bestFor}
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--color-text)]">Structure: </span>
                      {model.structure}
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--color-text)]">SLA Commitment: </span>
                      <span className="text-[var(--color-accent-blue)] font-semibold">{model.sla}</span>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {model.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-blue)]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-[var(--color-border)] pt-6">
                  <Link
                    href={`/contact?model=${encodeURIComponent(model.name)}`}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                      model.recommended
                        ? 'bg-[var(--color-accent-blue)] text-white shadow-md hover:bg-blue-600'
                        : 'border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text)] hover:border-[var(--color-text-secondary)]'
                    }`}
                  >
                    Discuss Model Customization
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-12">
            <h2 className="font-heading text-2xl font-bold text-[var(--color-text)] md:text-3xl text-center">
              Frequently Asked Engagement Questions
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6">
                  <h4 className="font-heading text-sm font-bold text-[var(--color-text)]">
                    {faq.q}
                  </h4>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
