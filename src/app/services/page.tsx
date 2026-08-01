import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ServicesList } from './services-list'
import { ContactForm } from '@/components/ui/contact-form'
import { FAQSection } from '@/components/ui/faq-section'
import { ChevronRight } from 'lucide-react'

/* ── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findFirst({
    where: { slug: 'services', status: 'PUBLISHED', deletedAt: null },
    select: { title: true, excerpt: true },
  })

  return {
    title: page?.title ? `${page.title} | Synova Infotech` : 'Our Services | Synova Infotech',
    description:
      page?.excerpt ??
      'Explore Synova Infotech\'s enterprise services — custom software development, cloud solutions, AI/ML, cybersecurity, and digital transformation.',
  }
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function ServicesPage() {
  const [services, page] = await Promise.all([
    prisma.service.findMany({
      where: { status: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.page.findFirst({
      where: { slug: 'services', status: 'PUBLISHED', deletedAt: null },
    }),
  ])



  const mappedServices = services.map((s) => ({
    id: s.id,
    title: s.title,
    shortDescription: s.shortDescription ?? '',
    fullDescription: s.fullDescription ?? '',
    icon: s.icon ?? 'Code2',
    category: (s.category ?? 'development') as 'development' | 'management' | 'solutions' | 'support',
    technologies: [] as string[],
    industries: [] as string[],
    benefits: (s.benefits as string[]) ?? [],
    businessOutcomes: (s.businessOutcomes as string[]) ?? [],
  }))

  const categories = [...new Set(mappedServices.map((s) => s.category))] as string[]

  const badge = (page?.content as Record<string, string> | null)?.badge ?? 'What We Do'
  const title = page?.title ?? 'Enterprise Services'
  const subtitle =
    (page?.content as Record<string, string> | null)?.subtitle ??
    'Seventeen specialized capabilities engineered to transform your business — from custom software and mobile apps to AI-driven procurement and immersive VR training.'

  const SERVICE_FAQS = [
    {
      id: 'faq-1',
      question: 'How quickly can Synova begin an enterprise services engagement?',
      answer:
        'Most engagements begin with a structured discovery phase within 2–4 weeks. We prioritise rapid alignment on goals, governance, and delivery cadence so teams can move from planning to execution without delay.',
    },
    {
      id: 'faq-2',
      question: 'Can you integrate with our existing ERP, CRM, or legacy applications?',
      answer:
        'Yes. We design middleware, APIs, and adapter layers so new capabilities coexist with existing systems. Our approach preserves current investments while enabling modern digital transformation.',
    },
    {
      id: 'faq-3',
      question: 'What industries do you support with these services?',
      answer:
        'We work across manufacturing, healthcare, finance, retail, logistics, education, and technology services. Our teams bring compliance-aware delivery for regulated industries and complex enterprise environments.',
    },
    {
      id: 'faq-4',
      question: 'How do you ensure security and compliance across service engagements?',
      answer:
        'Security is embedded into every stage of delivery. We use secure-by-design practices, compliance assessments, OWASP controls, and continuous governance checks aligned to your regulatory requirements.',
    },
    {
      id: 'faq-5',
      question: 'What happens after launch—do you provide ongoing support?',
      answer:
        'Yes. We offer managed maintenance, continuous improvement, and support packages to keep your solution secure, performant, and evolving with your business.',
    },
  ]

  return (
    <>
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-accent-blue)]"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" aria-hidden="true" />
          <span className="font-medium text-[var(--color-text)]" aria-current="page">
            Services
          </span>
        </div>
      </nav>

      {/* ── Header ── */}
      <section className="bg-[var(--color-surface-secondary)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-flex rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
            {badge}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[var(--color-text)] md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
              {subtitle}
            </p>
          )}

          <div className="mx-auto mt-10 max-w-3xl grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 text-left shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-blue)]">What you get</p>
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                A strategic service catalogue with outcome-driven delivery, enterprise-grade security, and measurable ROI across every engagement.
              </p>
            </div>
            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 text-left shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-blue)]">How we work</p>
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                Discovery, rapid prototyping, secure implementation, and long-term support with executive alignment at every stage.
              </p>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-lg">
            <Image
              src="/images/services/services-hero.svg"
              alt="Synova enterprise services landscape — AI, cloud, data, DevOps, IoT, and cybersecurity capabilities"
              width={900}
              height={500}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* ── Services Grid with Filter ── */}
      <ServicesList services={mappedServices} categories={categories} />

      {/* ── Services CTA ── */}
      <section className="bg-[var(--color-accent-blue)]/5 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-xl sm:p-14">
            {/* Muted looping AI mesh backdrop */}
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              tabIndex={-1}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60 motion-reduce:hidden"
            >
              <source src="/images/services/video-ai-mesh.mp4" type="video/mp4" />
            </video>
            {/* Readability overlay — keeps text crisp over the animation */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-white/90 to-white/85"
            />
            <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-blue)]">Ready to transform</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text)] md:text-4xl">
                  Let&apos;s build a service strategy that scales with your enterprise.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
                  Schedule a discovery session and we&apos;ll map the right capabilities, timelines, and success metrics for your organisation.
                </p>
              </div>

              <a
                href="#services-contact"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent-blue)] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[var(--color-accent-blue)]/20 transition hover:shadow-[0_20px_60px_rgba(59,130,246,0.25)]"
              >
                Book a consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lead Capture + FAQ ── */}
      <section id="services-contact" className="bg-[var(--color-accent-blue)]/5 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-xl sm:p-14">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-blue)]">
                  Begin your enterprise transformation
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text)] md:text-4xl">
                  Share your challenge and let our team follow up with a tailored plan.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
                  Use this form to describe your business goals, timeline, and scope. We&apos;ll route the request to the best solution and delivery experts.
                </p>
              </div>

              <ContactForm className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm" />
            </div>

            <div className="space-y-8">
              <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-blue)]">Need a faster path?</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
                  Talk directly with our senior delivery team.
                </h3>
                <p className="mt-4 text-base leading-7 text-[var(--color-text-secondary)]">
                  For urgent digital transformation initiatives, request a consultative briefing and we&apos;ll prepare a tailored executive proposal.
                </p>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--color-accent-blue)] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-accent-blue)]/20 transition hover:bg-[var(--color-accent-blue-dark)]"
                >
                  Request executive briefing
                </Link>
              </div>

              <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-blue)]">What to expect</p>
                <ul className="mt-6 space-y-4 text-[var(--color-text-secondary)]">
                  <li className="flex gap-3 text-sm leading-7">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-accent-blue)]" />
                    Structured discovery, technical validation, and alignment on business outcomes.
                  </li>
                  <li className="flex gap-3 text-sm leading-7">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-accent-blue)]" />
                    Enterprise-ready delivery practices with risk management and governance built in.
                  </li>
                  <li className="flex gap-3 text-sm leading-7">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-accent-blue)]" />
                    A tailored roadmap for implementation, support, and measurable ROI.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={SERVICE_FAQS} />
    </>
  )
}
