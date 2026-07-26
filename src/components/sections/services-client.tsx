'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, Cpu, ShieldCheck, Zap, Layers, Sparkles, Activity } from 'lucide-react'
import Link from 'next/link'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import type { Service } from '@/data/services'
interface ServicesClientProps {
  initialServices: Service[]
}

const KEYNOTE_SERVICES = [
  {
    id: 'custom-software',
    title: 'Custom Core Software Engineering',
    tagline: 'High-Throughput Microservices & Event-Driven Platforms',
    description: 'We design, build, and operate resilient enterprise software platforms from ground-up domain modeling to multi-region Kubernetes deployment.',
    svgAsset: '/images/home/realistic/microservices-topology.jpg',
    benefits: [
      'Sub-5ms internal microservice latency via gRPC & Redis',
      'Apache Kafka CDC pipeline for zero data-loss replication',
      'Automated SAST/DAST security compliance pipelines',
    ],
    outcomes: {
      roi: '3.2x ROI in 18 Months',
      velocity: '+40% Release Cadence',
      uptime: '99.999% Availability',
    },
    techPills: ['Java', 'Spring Boot', 'React', 'Kafka', 'Kubernetes', 'PostgreSQL'],
  },
  {
    id: 'agentic-ai',
    title: 'Autonomous Agentic AI & RAG Infrastructure',
    tagline: 'Enterprise LLM Pipelines with Zero Data Leakage',
    description: 'Deploy fine-tuned enterprise models, vector database indices, and autonomous agent networks securely behind your private VPC.',
    svgAsset: '/images/home/realistic/ai-pipeline.jpg',
    benefits: [
      'Private vector DB RAG indexing (Pinecone / Qdrant)',
      'Sub-10ms GPU streaming inference via vLLM clusters',
      'Enterprise PII redaction and automated guardrails',
    ],
    outcomes: {
      roi: '4x Task Automation Velocity',
      velocity: '-80% Manual Screening',
      uptime: 'Zero PII Leakage SLA',
    },
    techPills: ['Python', 'vLLM', 'TensorFlow', 'Pinecone', 'LangChain', 'Docker'],
  },
  {
    id: 'workflow-engine',
    title: 'Enterprise Workflow & Governance Engine',
    tagline: 'Automated Multi-Stage Requisition & Decision Pipelines',
    description: 'Eliminate operational bottlenecks with drag-and-drop workflow approval orchestration, automated SLA escalation, and audit logging.',
    svgAsset: '/images/home/realistic/workflow-engine.jpg',
    benefits: [
      'Multi-tier conditional approval routing with 1-tap mobile actions',
      'Real-time SLA breach monitoring and automated escalation',
      '100% timestamped audit-ready evidence logs',
    ],
    outcomes: {
      roi: '80% Faster Cycle Times',
      velocity: 'Zero Lost Approvals',
      uptime: '100% Audit Compliance',
    },
    techPills: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'ELK Stack'],
  },
  {
    id: 'cybersecurity',
    title: 'Zero-Trust Cybersecurity & Compliance',
    tagline: 'Hardware Security Module Key Vaults & Continuous Audit',
    description: 'Protect enterprise digital assets with end-to-end mTLS encryption, automated vulnerability management, and ISO 27001 / SOC 2 governance.',
    svgAsset: '/images/home/realistic/cybersecurity-shield.jpg',
    benefits: [
      'Hardware Security Module (HSM) key vault integration',
      'Continuous SAST/DAST container vulnerability scanning',
      'Real-time SIEM event aggregation and automated incident response',
    ],
    outcomes: {
      roi: '100% Audit Readiness',
      velocity: 'Zero Security Breaches',
      uptime: 'ISO 27001 & SOC 2 Certified',
    },
    techPills: ['Vault', 'OpenTelemetry', 'Kubernetes', 'OAuth2/OIDC', 'AWS KMS'],
  },
]

export function ServicesClient({ initialServices }: ServicesClientProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const currentService = KEYNOTE_SERVICES[activeIdx]

  return (
    <SectionWrapper id="services" className="bg-[var(--color-primary)] text-white py-24">
      <SectionHeader
        badge="Enterprise Capabilities"
        title="Mission-Critical Solutions"
        subtitle="Architected for Fortune 500 enterprises requiring security, scalability, and measurable ROI"
        alignment="center"
      />

      {/* Corporate Tab Bar */}
      <div className="flex flex-wrap justify-center gap-3 my-10 max-w-4xl mx-auto">
        {KEYNOTE_SERVICES.map((s, idx) => {
          const isActive = idx === activeIdx
          return (
            <button
              key={s.id}
              onClick={() => setActiveIdx(idx)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${isActive
                  ? 'bg-gradient-to-r from-corporate-gold to-amber-500 text-corporate-navy shadow-lg shadow-corporate-gold/25 scale-105'
                  : 'bg-white/[0.05] text-zinc-400 hover:bg-white/10 hover:text-white border border-[var(--color-corporate-gold)]/30'
                }`}
            >
              {s.title}
            </button>
          )
        })}
      </div>

      {/* Corporate Panel */}
      <div className="max-w-6xl mx-auto rounded-3xl border border-[var(--color-corporate-gold)]/30 bg-[var(--color-surface)]/90 backdrop-blur-2xl p-6 md:p-12 shadow-2xl overflow-hidden text-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentService.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          >
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                <Sparkles className="h-4 w-4" /> {currentService.tagline}
              </span>
              <h3 className="text-3xl font-extrabold md:text-4xl text-white leading-tight">
                {currentService.title}
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed font-light">
                {currentService.description}
              </p>

              {/* Quantified Business Outcomes */}
              <div className="grid grid-cols-3 gap-3 border-y border-white/10 py-4 text-center my-6">
                <div>
                  <div className="text-lg font-extrabold text-blue-400">{currentService.outcomes.roi}</div>
                  <div className="text-[10px] text-zinc-400 uppercase font-medium mt-0.5">Financial ROI</div>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-cyan-400">{currentService.outcomes.velocity}</div>
                  <div className="text-[10px] text-zinc-400 uppercase font-medium mt-0.5">Velocity Boost</div>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-emerald-400">{currentService.outcomes.uptime}</div>
                  <div className="text-[10px] text-zinc-400 uppercase font-medium mt-0.5">SLA Target</div>
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-2.5">
                {currentService.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Tech Pills */}
              <div className="flex flex-wrap gap-2 pt-4">
                {currentService.techPills.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg bg-white/[0.05] border border-white/10 px-3 py-1 text-xs font-mono text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Request Technical Blueprint <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Large Custom SVG Visualizer */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 p-2 shadow-2xl">
                <img
                  src={currentService.svgAsset}
                  alt={currentService.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Comprehensive Service Matrix — Data table layout */}
      <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-2">Service Architecture Matrix</h3>
          <p className="text-zinc-400">Complete portfolio of enterprise-grade engineering capabilities.</p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left text-xs font-bold uppercase tracking-widest text-zinc-500 p-5">Service Domain</th>
                <th className="text-left text-xs font-bold uppercase tracking-widest text-zinc-500 p-5">Delivery Model</th>
                <th className="text-left text-xs font-bold uppercase tracking-widest text-zinc-500 p-5">Compliance</th>
                <th className="text-right text-xs font-bold uppercase tracking-widest text-zinc-500 p-5">Avg. ROI</th>
              </tr>
            </thead>
            <tbody>
              {initialServices.map((service, idx) => {
                const Icon = service.icon
                return (
                  <motion.tr
                    key={service.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => window.location.href = `/services/${service.id}`}
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors shrink-0">
                          <Icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-white">{service.title}</span>
                          <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{service.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-xs text-zinc-400">Agile / Scrum</span>
                    </td>
                    <td className="p-5">
                      <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">ISO 27001</span>
                    </td>
                    <td className="p-5 text-right">
                      <span className="text-sm font-bold text-white">3.2x</span>
                      <span className="text-[10px] text-zinc-500 ml-1">avg</span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </SectionWrapper>
  )
}

