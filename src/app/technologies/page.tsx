import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Code2,
  Server,
  Cloud,
  Database,
  Lock,
  Cpu,
  Workflow,
  Sparkles,
  ArrowRight,
  Check,
  Terminal,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Enterprise Technology Stack & Infrastructure Index | Synova Infotech',
  description:
    'Detailed index of Synova’s production technology stack: Next.js, React, Node.js, Python, PostgreSQL, Prisma, AWS, Kubernetes, Terraform, and Zero-Trust Security.',
}

interface TechCategory {
  category: string
  description: string
  icon: string
  stack: Array<{
    name: string
    role: string
    versionOrSpec: string
    enterpriseBenefit: string
  }>
}

const TECH_CATEGORIES: TechCategory[] = [
  {
    category: 'Frontend & User Experience',
    description: 'Modern, high-performance web applications built for speed, accessibility, and visual elegance.',
    icon: 'Code2',
    stack: [
      {
        name: 'Next.js App Router',
        role: 'Full-Stack Framework',
        versionOrSpec: 'v16.2+ (Server Components)',
        enterpriseBenefit: 'Zero-JS runtime footprint for static sections, instant SSR, dynamic streaming.',
      },
      {
        name: 'React 19',
        role: 'UI Library',
        versionOrSpec: 'v19.2+',
        enterpriseBenefit: 'Concurrent rendering mode, automatic asset loading, compiler optimization.',
      },
      {
        name: 'TypeScript',
        role: 'Type System',
        versionOrSpec: 'v5.x Strict Mode',
        enterpriseBenefit: 'End-to-end type safety preventing runtime null/undefined errors across APIs.',
      },
      {
        name: 'Framer Motion & GSAP',
        role: 'Motion Engine',
        versionOrSpec: 'v12.x hardware accelerated',
        enterpriseBenefit: 'GPU-accelerated 60fps micro-interactions with prefers-reduced-motion support.',
      },
    ],
  },
  {
    category: 'Backend & Microservices',
    description: 'Scalable, type-safe API gateways and transactional engines supporting mission-critical workloads.',
    icon: 'Server',
    stack: [
      {
        name: 'Node.js & TypeScript',
        role: 'Runtime Environment',
        versionOrSpec: 'v20+ LTS',
        enterpriseBenefit: 'Non-blocking I/O event loop optimized for high-concurrency microservices.',
      },
      {
        name: 'Python',
        role: 'AI / Data Engine',
        versionOrSpec: 'v3.11+ Async',
        enterpriseBenefit: 'Custom ML pipelines, vector embedding workflows, and automated ETL jobs.',
      },
      {
        name: 'Prisma ORM',
        role: 'Database Client',
        versionOrSpec: 'v7.8+ Strict Types',
        enterpriseBenefit: 'Type-safe SQL queries, automated migration tracking, soft-delete governance.',
      },
      {
        name: 'Auth.js (NextAuth)',
        role: 'Identity & Access',
        versionOrSpec: 'v5.0 Beta / OAuth2',
        enterpriseBenefit: 'RBAC identity adapter, CSRF protection, secure HTTP-only cookie sessions.',
      },
    ],
  },
  {
    category: 'Database & Event Streaming',
    description: 'Resilient relational data stores and real-time pub/sub event grids.',
    icon: 'Database',
    stack: [
      {
        name: 'PostgreSQL',
        role: 'Primary Database',
        versionOrSpec: 'v16 High-Availability',
        enterpriseBenefit: 'ACID compliance, JSONB document querying, column-level security policies.',
      },
      {
        name: 'Apache Kafka',
        role: 'Event Bus',
        versionOrSpec: 'Distributed Cluster',
        enterpriseBenefit: 'Sub-second event streaming across distributed microservices grids.',
      },
      {
        name: 'Redis',
        role: 'In-Memory Cache',
        versionOrSpec: 'v7 Cluster Engine',
        enterpriseBenefit: 'Sub-millisecond query caching and rate-limiting key-value store.',
      },
    ],
  },
  {
    category: 'Cloud Infrastructure & DevOps',
    description: 'Automated CI/CD pipelines, container orchestration, and multi-region cloud topology.',
    icon: 'Cloud',
    stack: [
      {
        name: 'AWS & GCP',
        role: 'Cloud Platforms',
        versionOrSpec: 'Multi-Region VPC',
        enterpriseBenefit: 'Elastic compute scaling, regional failover, 99.999% availability SLAs.',
      },
      {
        name: 'Kubernetes (EKS/GKE)',
        role: 'Orchestration',
        versionOrSpec: 'v1.29+ Managed',
        enterpriseBenefit: 'Automated pod autoscaling, rolling zero-downtime updates, self-healing nodes.',
      },
      {
        name: 'Terraform & Docker',
        role: 'Infrastructure as Code',
        versionOrSpec: 'Immutable Containerization',
        enterpriseBenefit: 'Reproducible staging and production environments with zero configuration drift.',
      },
    ],
  },
]

export default function TechnologiesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-16">
      {/* Header */}
      <section className="border-b border-[var(--color-border)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-blue)]/20 bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-blue)]">
              <Terminal className="h-3.5 w-3.5" />
              Production Architecture Stack
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl md:text-6xl">
              Battle-Tested Technology Stack
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              Every tool in our stack is selected for enterprise resilience, strict type-safety, maintainability, and zero-compromise security posture.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {TECH_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-lg md:p-10">
                <div className="mb-8 border-b border-[var(--color-border)] pb-6">
                  <h2 className="font-heading text-2xl font-bold text-[var(--color-text)] md:text-3xl">
                    {cat.category}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    {cat.description}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {cat.stack.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 shadow-sm transition-all hover:border-[var(--color-accent-blue)]/30 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-blue)]">
                          {item.role}
                        </span>
                        <span className="rounded bg-[var(--color-surface-secondary)] px-2 py-0.5 text-[10px] text-[var(--color-text-tertiary)] font-mono">
                          {item.versionOrSpec}
                        </span>
                      </div>
                      <h3 className="mt-3 font-heading text-lg font-bold text-[var(--color-text)]">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                        {item.enterpriseBenefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div className="mt-16 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 text-center backdrop-blur-xl md:p-12">
            <h3 className="font-heading text-2xl font-bold text-[var(--color-text)]">
              Need a Custom Tech Stack Audit or Migration Plan?
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Our principal architects evaluate your existing infrastructure, codebase, and security posture to map a seamless modernization roadmap.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-blue)] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-600"
              >
                Talk with a Principal Architect
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
