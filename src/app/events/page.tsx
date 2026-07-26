import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Calendar,
  Video,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Executive Roundtables, Webinars & Events | Synova Infotech',
  description:
    'Join Synova’s upcoming executive technical roundtables, cloud architecture webinars, and global industry conference sessions.',
}

interface EventItem {
  id: string
  title: string
  type: 'Webinar' | 'Roundtable' | 'Conference Session'
  date: string
  time: string
  location: string
  description: string
  speakers: string[]
  registrationOpen: boolean
}

const EVENTS: EventItem[] = [
  {
    id: 'cloud-resilience-2026',
    title: 'Architecting Multi-Cloud Resiliency & Zero-Trust Grid Topologies',
    type: 'Webinar',
    date: 'August 18, 2026',
    time: '11:00 AM EST / 8:00 AM PST',
    location: 'Virtual Keynote Stream',
    description:
      'Join our Principal Cloud Architects as they demonstrate live multi-region Kubernetes failover and zero-downtime secrets rotation under synthetic high-load conditions.',
    speakers: ['Dr. Aris Thorne (Chief Architect)', 'Elena Rostova (DevOps Lead)'],
    registrationOpen: true,
  },
  {
    id: 'fintech-ai-roundtable',
    title: 'Private Executive Roundtable: Domain-Isolated LLMs in Banking',
    type: 'Roundtable',
    date: 'September 10, 2026',
    time: '2:00 PM EST',
    location: 'Exclusive Virtual Session (Invitation Only)',
    description:
      'An off-the-record discussion with CTOs and CISOs covering data privacy boundaries, vector retrieval scaling, and SOC 2 compliance for generative AI in financial services.',
    speakers: ['Marcus Vance (VP Security)', 'Sarah Chen (Head of AI Engineering)'],
    registrationOpen: true,
  },
  {
    id: 'global-devops-summit',
    title: 'Keynote: Scaling FinOps & Infrastructure Policy-as-Code',
    type: 'Conference Session',
    date: 'October 24, 2026',
    time: '9:30 AM CET',
    location: 'Enterprise Tech Summit, Zurich',
    description:
      'A deep-dive presentation on automated cost-governance engines preventing multi-cloud spend waste across high-throughput distributed microservices.',
    speakers: ['Arjun Patel (Head of Cloud Practice)'],
    registrationOpen: false,
  },
]

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-16">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-blue)]/20 bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-blue)]">
            <Calendar className="h-3.5 w-3.5" />
            Executive Knowledge Sharing
          </span>
          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl md:text-6xl">
            Executive Roundtables & Technical Sessions
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            Connect with industry thought leaders, cloud architects, and security pioneers in our interactive technical sessions and webinars.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {EVENTS.map((event) => (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-[var(--color-accent-blue)]/40 md:p-10"
              >
                <div className="grid gap-6 md:grid-cols-12 md:items-center">
                  <div className="md:col-span-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded bg-[var(--color-accent-blue)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-accent-blue)]">
                        {event.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)] font-mono">
                        <Calendar className="h-3.5 w-3.5" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)] font-mono">
                        <Clock className="h-3.5 w-3.5" />
                        {event.time}
                      </span>
                    </div>

                    <h2 className="mt-4 font-heading text-2xl font-bold text-[var(--color-text)]">
                      {event.title}
                    </h2>
                    <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                      {event.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                      <MapPin className="h-3.5 w-3.5 text-[var(--color-accent-blue)]" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-4 md:col-span-4 md:items-end">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] block">
                        Featured Speakers
                      </span>
                      {event.speakers.map((sp, i) => (
                        <span key={i} className="text-xs font-medium text-[var(--color-text)] block mt-0.5">
                          {sp}
                        </span>
                      ))}
                    </div>

                    <div className="w-full md:w-auto">
                      {event.registrationOpen ? (
                        <Link
                          href={`/contact?event=${encodeURIComponent(event.title)}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent-blue)] px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-blue-600 md:w-auto"
                        >
                          Reserve Executive Seat
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : (
                        <span className="inline-block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-2 text-xs text-[var(--color-text-tertiary)]">
                          Registration Closed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
