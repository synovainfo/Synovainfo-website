import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Newspaper,
  Download,
  Mail,
  Calendar,
  ArrowRight,
  FileText,
  Building,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Press Room & Media Kit | Synova Infotech',
  description:
    'Official news, press releases, leadership contacts, executive bios, and high-resolution brand asset packages for media and analysts.',
}

interface Release {
  date: string
  title: string
  category: string
  summary: string
  link: string
}

const PRESS_RELEASES: Release[] = [
  {
    date: 'Q2 2026',
    title: 'Synova Infotech Achieves ISO 27001 Certification & Expands Cloud Infrastructure Practice',
    category: 'Corporate Announcement',
    summary: 'Synova completes rigorous third-party security audit confirming Zero-Trust operational compliance across global delivery centers.',
    link: '#',
  },
  {
    date: 'Q1 2026',
    title: 'Synova Unveils Enterprise AI Infrastructure Blueprint for Financial Services',
    category: 'Product & Architecture',
    summary: 'Introducing domain-isolated vector retrieval systems enabling secure LLM adoption for Fortune 500 financial institutions.',
    link: '#',
  },
  {
    date: 'Q4 2025',
    title: 'Synova Recognized as Top High-Growth Enterprise Solution Provider',
    category: 'Industry Award',
    summary: 'Acknowledged for outstanding engineering precision and 99.999% SLA commitment delivery across enterprise digital transformations.',
    link: '#',
  },
]

export default function PressPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-16">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-blue)]/20 bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-blue)]">
            <Newspaper className="h-3.5 w-3.5" />
            Media & Newsroom
          </span>
          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl md:text-6xl">
            Press Room & Brand Assets
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            Access official announcements, executive biographies, research publications, and downloadable brand identity kits.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Press Releases Column */}
            <div className="lg:col-span-8">
              <h2 className="font-heading text-2xl font-bold text-[var(--color-text)]">
                Latest Announcements & Press Releases
              </h2>
              <div className="mt-8 space-y-6">
                {PRESS_RELEASES.map((pr, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-md backdrop-blur-xl transition-all hover:border-[var(--color-accent-blue)]/40"
                  >
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Calendar className="h-3.5 w-3.5" />
                        {pr.date}
                      </span>
                      <span>·</span>
                      <span className="rounded bg-[var(--color-surface-secondary)] px-2 py-0.5 font-medium text-[var(--color-accent-blue)]">
                        {pr.category}
                      </span>
                    </div>
                    <h3 className="mt-3 font-heading text-lg font-bold text-[var(--color-text)]">
                      {pr.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                      {pr.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Contact & Downloads Sidebar */}
            <div className="space-y-8 lg:col-span-4">
              {/* Media Kit Box */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg">
                <div className="flex items-center gap-3 text-[var(--color-accent-blue)]">
                  <Download className="h-5 w-5" />
                  <h3 className="font-heading text-lg font-bold text-[var(--color-text)]">
                    Media Kit Assets
                  </h3>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  Download official high-resolution vector logos, executive headshots, product screenshots, and brand identity guidelines.
                </p>
                <div className="mt-6 space-y-2">
                  <a
                    href="#"
                    className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-3 text-xs font-medium text-[var(--color-text)] transition-all hover:border-[var(--color-accent-blue)]"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[var(--color-accent-blue)]" />
                      Brand Assets (.ZIP - 24MB)
                    </span>
                    <Download className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-3 text-xs font-medium text-[var(--color-text)] transition-all hover:border-[var(--color-accent-blue)]"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[var(--color-accent-blue)]" />
                      Corporate Fact Sheet (.PDF)
                    </span>
                    <Download className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Press Contact Box */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg">
                <div className="flex items-center gap-3 text-[var(--color-accent-blue)]">
                  <Mail className="h-5 w-5" />
                  <h3 className="font-heading text-lg font-bold text-[var(--color-text)]">
                    Media Inquiry Contact
                  </h3>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  For press inquiries, analyst briefings, or interview requests with our leadership team:
                </p>
                <div className="mt-4 space-y-1 text-xs text-[var(--color-text)] font-medium">
                  <p>Global Communications Team</p>
                  <p className="text-[var(--color-accent-blue)]">press@synovainfotech.com</p>
                  <p className="text-[var(--color-text-tertiary)]">Response SLA: Within 4 business hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
