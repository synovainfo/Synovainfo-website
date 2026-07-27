import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Cloud,
  Database,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
  Server,
  BarChart3,
  Lock,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Enterprise Solutions Blueprint | Synova Infotech',
  description:
    'Explore Synova’s enterprise solutions: Cloud Modernization, High-Performance Data Engineering, AI/ML Infrastructure, and Zero-Trust Security Blueprints.',
}

interface SolutionItem {
  id: string
  title: string
  subtitle: string
  badge: string
  iconName: string
  overview: string
  businessProblems: string[]
  architectureHighlights: string[]
  quantifiedImpact: string
}

const SOLUTIONS: SolutionItem[] = [
  {
    id: 'cloud-modernization',
    title: 'Enterprise Cloud Modernization & Hybrid Grid',
    subtitle: 'Scale legacy architectures into resilient, multi-cloud microservices grids',
    badge: 'Infrastructure Architecture',
    iconName: 'Cloud',
    overview:
      'We re-architect monolithic legacy cores into cloud-native microservices architectures, leveraging automated Kubernetes orchestration, zero-downtime CI/CD pipelines, and multi-region failover topology.',
    businessProblems: [
      'High maintenance costs and vendor lock-in from monolithic architectures',
      'Unpredictable cloud spend and sub-optimal workload placement',
      'Brittle deployment pipelines causing service interruptions during peak traffic',
    ],
    architectureHighlights: [
      'Multi-region Kubernetes deployment with automated pod autoscaling',
      'Infrastructure as Code (Terraform & Pulumi) with policy-as-code enforcement',
      'FinOps cost governance engines reducing infrastructure waste by up to 34%',
    ],
    quantifiedImpact: '99.999% SLA Uptime & 40% Operational Cost Reduction',
  },
  {
    id: 'data-engineering',
    title: 'High-Throughput Data Platform & Telemetry Engine',
    subtitle: 'Streamline real-time analytics and petabyte-scale data pipelines',
    badge: 'Data Intelligence',
    iconName: 'Database',
    overview:
      'Engineered for Fortune 500 data volumes, our data solutions unite Apache Kafka, Snowflake, and Spark into unified real-time event streaming architectures with sub-second latency.',
    businessProblems: [
      'Siloed transactional databases preventing real-time business decision-making',
      'Slow batch ETL processes delaying executive dashboards and regulatory reporting',
      'Lack of unified data governance and automated data quality validation',
    ],
    architectureHighlights: [
      'Event-driven streaming bus supporting 500k+ events/sec',
      'Automated data lineage and zero-trust column-level encryption',
      'Real-time anomaly detection pipelines integrated with enterprise SIEM',
    ],
    quantifiedImpact: '<100ms Query Latency across 50TB+ Datasets',
  },
  {
    id: 'ai-ml-infrastructure',
    title: 'Enterprise AI Infrastructure & LLM Orchestration',
    subtitle: 'Deploy secure, domain-specific AI agents and vector retrieval pipelines',
    badge: 'Cognitive Computing',
    iconName: 'Cpu',
    overview:
      'Construct enterprise RAG (Retrieval-Augmented Generation) systems and custom model pipelines with strict data privacy boundaries, ensuring enterprise IP is never exposed to public LLM models.',
    businessProblems: [
      'Security risks when exposing sensitive IP to public generative AI APIs',
      'Hallucination and inaccuracy in un-grounded internal search systems',
      'High latency and compute overhead when running large language models in-house',
    ],
    architectureHighlights: [
      'Isolated VPC vector database clusters (pgvector, Qdrant)',
      'Fine-tuned open-weights models (Llama 3, Mistral) deployed on dedicated GPUs',
      'Role-based semantic access control filtering retrieval contexts dynamically',
    ],
    quantifiedImpact: '3.8x Faster Enterprise Workflow Automation',
  },
  {
    id: 'zero-trust-security',
    title: 'Zero-Trust Cyber Defense & Compliance Shield',
    subtitle: 'Embed security into continuous deployment pipelines and identity perimeters',
    badge: 'Security Engineering',
    iconName: 'ShieldCheck',
    overview:
      'Deploy identity-first perimeter defense, continuous vulnerability posture management, and automated SOC 2 / ISO 27001 audit logging across all hybrid cloud environments.',
    businessProblems: [
      'Expanding attack surfaces caused by rapid multi-cloud adoption',
      'Manual, time-consuming compliance audits consuming engineering bandwidth',
      'Lateral movement vulnerabilities in flat legacy networks',
    ],
    architectureHighlights: [
      'Microsegmentation and mutual TLS (mTLS) enforcement across all services',
      'Automated Secrets Management with Vault and hardware security modules (HSM)',
      'Real-time automated compliance drift tracking and auto-remediation triggers',
    ],
    quantifiedImpact: '100% Audit Readiness & 0 Unsanctioned Data Transfers',
  },
]

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-blue)]/20 bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-blue)]">
              <Sparkles className="h-3.5 w-3.5" />
              Enterprise Blueprint Matrix
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl md:text-6xl">
              Solutions Purpose-Built for High-Scale Enterprise Systems
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              From multi-cloud infrastructure resilience to zero-trust compliance frameworks, Synova engineers resilient technology foundations for global market leaders.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-blue)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Schedule Executive Briefing
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/engagement-models"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--color-text)] transition-all hover:border-[var(--color-text-secondary)]"
              >
                Explore Engagement Models
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {SOLUTIONS.map((solution, idx) => (
              <div
                key={solution.id}
                id={solution.id}
                className="group relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[var(--color-accent-blue)]/40 md:p-12"
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-7">
                    <span className="inline-block rounded-md bg-[var(--color-surface-secondary)] px-3 py-1 text-xs font-medium text-[var(--color-accent-blue)]">
                      {solution.badge}
                    </span>
                    <h2 className="mt-4 font-heading text-2xl font-bold text-[var(--color-text)] md:text-3xl">
                      {solution.title}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-[var(--color-text-tertiary)]">
                      {solution.subtitle}
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
                      {solution.overview}
                    </p>

                    {/* Problems Solved */}
                    <div className="mt-6">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                        Business Friction Addressed
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {solution.businessProblems.map((problem, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-blue)]" />
                            <span>{problem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-6 lg:col-span-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Architecture Blueprint Highlights
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {solution.architectureHighlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-[var(--color-text)]">
                          <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-accent-blue)]" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                      <span className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider block">
                        Verified Metric Benchmark
                      </span>
                      <p className="mt-1 font-heading text-base font-bold text-[var(--color-accent-blue)]">
                        {solution.quantifiedImpact}
                      </p>
                    </div>

                    <div className="mt-6">
                      <Link
                        href={`/contact?solution=${solution.id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] py-2.5 text-xs font-semibold text-[var(--color-text)] transition-all hover:bg-[var(--color-accent-blue)] hover:text-white hover:border-transparent"
                      >
                        Request Architecture Blueprint
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
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
