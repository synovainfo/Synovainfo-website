'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Server, Cloud, Database, Lock, Layers, Sparkles } from 'lucide-react'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { resolveIcon } from '@/lib/resolve-icon'

import type { Technology } from '@/data/technologies'

interface TechnologiesClientProps {
  initialTechnologies: Technology[]
}

const DOMAIN_NODES = [
  {
    id: 'cloud-native',
    name: 'Multi-Cloud & Orchestration',
    icon: Cloud,
    color: 'text-corporate-gold',
    borderColor: 'border-corporate-gold',
    techs: ['AWS EKS / Fargate', 'Azure AKS Mesh', 'GCP GKE Engine', 'Kubernetes', 'Istio Service Mesh', 'Terraform GitOps'],
    spec: 'Sub-5ms multi-region anycast routing',
  },
  {
    id: 'ai-data',
    name: 'Agentic AI & Data Streaming',
    icon: Cpu,
    color: 'text-corporate-gold',
    borderColor: 'border-corporate-gold',
    techs: ['Python vLLM Engine', 'Apache Kafka CDC', 'Pinecone Vector DB', 'TensorFlow Cluster', 'PyTorch Inference'],
    spec: 'Sub-10ms GPU inference with PII redaction',
  },
  {
    id: 'enterprise-backend',
    name: 'High-Velocity Microservices',
    icon: Server,
    color: 'text-corporate-gold',
    borderColor: 'border-corporate-gold',
    techs: ['Java 21 Spring Boot', 'Node.js Enterprise', 'Go micro-services', 'gRPC / GraphQL', 'Redis In-Memory Cache'],
    spec: 'Event-driven architecture with zero data loss',
  },
  {
    id: 'zero-trust',
    name: 'Security & Key Vaults',
    icon: Database,
    color: 'text-corporate-gold',
    borderColor: 'border-corporate-gold',
    techs: ['HashiCorp Vault', 'AWS KMS HSM', 'OpenTelemetry SIEM', 'OAuth2 / OIDC Auth', 'mTLS TLS 1.3 Strict'],
    spec: 'ISO 27001 & SOC 2 Type II audit compliance',
  },
]

export function TechnologiesClient({ initialTechnologies }: TechnologiesClientProps) {
  const [activeNodeId, setActiveNodeId] = useState(DOMAIN_NODES[0].id)
  const currentNode = DOMAIN_NODES.find((n) => n.id === activeNodeId) || DOMAIN_NODES[0]

  return (
    <SectionWrapper id="technologies" className="bg-[var(--color-surface)] text-black py-24">
      <SectionHeader
        badge="Enterprise Technology Stack"
        title="Certified Architecture & Production Toolchain"
        subtitle="Battle-tested across 250+ enterprise deployments with measurable performance outcomes"
        alignment="center"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-12 items-center max-w-6xl mx-auto">
        {/* Left Interactive Node SVG Display */}
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4 md:p-6 shadow-xl overflow-hidden">
            <img
              src="/images/home/realistic/enterprise-cloud.jpg"
              alt="Synova Enterprise Cloud Mesh Diagram"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right Domain Node Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-corporate-gold)] mb-2">
            Select Tech Domain Cluster
          </div>

          <div className="space-y-3">
            {DOMAIN_NODES.map((node) => {
              const Icon = node.icon
              const isActive = node.id === activeNodeId
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNodeId(node.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'border-[var(--color-corporate-gold)] bg-[var(--color-corporate-gold)]/10 shadow-lg shadow-[var(--color-corporate-gold)]/10'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:bg-[var(--color-corporate-gold)]/5 hover:border-[var(--color-corporate-gold)]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2.5">
                      <Icon className={`h-5 w-5 ${node.color}`} />
                      {node.name}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-1 font-light">{node.spec}</div>
                </button>
              )
            })}
          </div>

          {/* Active Domain Tech Pills Card */}
          <div className="mt-6 rounded-2xl border border-white/15 bg-zinc-900 p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Verified Production Stack
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentNode.techs.map((t) => (
                <span
                  key={t}
                  className="rounded-lg bg-white/[0.05] border border-white/10 px-3 py-1 text-xs font-mono text-zinc-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack — Icon grid with filter bar */}
      <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h3 className="text-2xl font-bold text-black mb-2">Enterprise Technology Stack</h3>
            <p className="text-[var(--color-text-secondary)]">Battle-tested across 250+ enterprise deployments.</p>
          </div>
          <div className="flex gap-2">
            {['All', 'Cloud', 'AI/ML', 'Backend', 'Security'].map((filter) => (
              <button
                key={filter}
                className="px-3.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-tertiary)] hover:bg-[var(--color-corporate-gold)]/20 hover:text-[var(--color-corporate-navy)] transition-all"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {initialTechnologies.map((tech, idx) => {
            const Icon = resolveIcon(tech.icon)
            return (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                className="bg-[var(--color-surface-secondary)] border border-[var(--color-border-light)] hover:border-[var(--color-corporate-gold)]/40 p-5 rounded-xl flex flex-col items-center text-center gap-3 transition-all group hover:-translate-y-0.5"
              >
                {Icon && (
                  <div className="bg-[var(--color-corporate-navy)]/10 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-[var(--color-corporate-gold)]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[var(--color-text)] group-hover:text-[var(--color-corporate-navy)]" />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text)] group-hover:text-[var(--color-corporate-navy)] transition-colors">{tech.name}</h4>
                  <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-relaxed">{tech.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}

