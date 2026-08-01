'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { SectionWrapper } from '@/components/layout/section-wrapper'
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
    <SectionWrapper id="services" className="py-24" glow>
      {/* Section Header — ITHPL orange label + navy heading on light surface */}
      <div className="mb-12 text-center md:mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-label inline-block"
        >
          Enterprise Capabilities
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-4 mt-4 text-3xl font-bold tracking-tight text-corporate-navy md:text-4xl lg:text-5xl"
        >
          Mission-Critical Solutions
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg text-slate-600 md:text-xl"
        >
          Architected for Fortune 500 enterprises requiring security, scalability, and measurable ROI
        </motion.p>
      </div>

      {/* Corporate Tab Bar — orange active state */}
      <div className="flex flex-wrap justify-center gap-3 my-10 max-w-4xl mx-auto">
        {KEYNOTE_SERVICES.map((s, idx) => {
          const isActive = idx === activeIdx
          return (
            <button
              key={s.id}
              onClick={() => setActiveIdx(idx)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${isActive
                  ? 'bg-corporate-gold text-white shadow-lg shadow-corporate-gold/25 scale-105'
                  : 'border border-slate-200 bg-white text-slate-500 hover:text-corporate-navy hover:border-corporate-gold/40'
                }`}
            >
              {s.title}
            </button>
          )
        })}
      </div>

      {/* Corporate Panel — light card, image on right */}
      <div className="max-w-6xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 md:p-12 shadow-xl overflow-hidden transition-colors hover:border-corporate-gold/60">
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
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-corporate-gold">
                <Sparkles className="h-4 w-4" /> {currentService.tagline}
              </span>
              <h3 className="text-3xl font-extrabold md:text-4xl text-corporate-navy leading-tight">
                {currentService.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentService.description}
              </p>

              {/* Quantified Business Outcomes */}
              <div className="grid grid-cols-3 gap-3 border-y border-slate-200 py-4 text-center my-6">
                <div>
                  <div className="text-lg font-extrabold text-corporate-gold">{currentService.outcomes.roi}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium mt-0.5">Financial ROI</div>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-corporate-gold">{currentService.outcomes.velocity}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium mt-0.5">Velocity Boost</div>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-corporate-gold">{currentService.outcomes.uptime}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium mt-0.5">SLA Target</div>
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-2.5">
                {currentService.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-corporate-gold shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Tech Pills */}
              <div className="flex flex-wrap gap-2 pt-4">
                {currentService.techPills.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-mono text-corporate-navy"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-corporate-gold px-6 py-3 text-xs font-semibold text-white hover:bg-corporate-gold-dark transition-colors shadow-lg shadow-corporate-gold/25"
                >
                  Request Technical Blueprint <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Service Image — framed rounded card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 shadow-xl transition-shadow hover:ring-1 hover:ring-corporate-gold/40">
                <Image
                  src={currentService.svgAsset}
                  alt={currentService.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Comprehensive Service Matrix — Data table layout */}
      <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-corporate-navy mb-2">Service Architecture Matrix</h3>
          <p className="text-slate-600">Complete portfolio of enterprise-grade engineering capabilities.</p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b-2 border-corporate-gold-dark bg-corporate-gold text-white">
                <th className="text-left text-xs font-bold uppercase tracking-widest p-5">Service Domain</th>
                <th className="text-left text-xs font-bold uppercase tracking-widest p-5">Delivery Model</th>
                <th className="text-left text-xs font-bold uppercase tracking-widest p-5">Compliance</th>
                <th className="text-right text-xs font-bold uppercase tracking-widest p-5">Avg. ROI</th>
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
                    className="border-b border-slate-100 hover:bg-orange-50 transition-colors group cursor-pointer"
                    onClick={() => window.location.href = `/services/${service.id}`}
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-corporate-gold/10 w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-corporate-gold/20 transition-colors shrink-0">
                          <Icon className="w-5 h-5 text-corporate-gold" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-corporate-navy">{service.title}</span>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{service.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-xs text-slate-600">Agile / Scrum</span>
                    </td>
                    <td className="p-5">
                      <span className="inline-flex rounded-full bg-corporate-gold/10 px-2.5 py-0.5 text-[11px] font-semibold text-corporate-gold-dark">ISO 27001</span>
                    </td>
                    <td className="p-5 text-right">
                      <span className="text-sm font-bold text-corporate-navy">3.2x</span>
                      <span className="text-[10px] text-slate-500 ml-1">avg</span>
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
