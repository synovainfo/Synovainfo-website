'use client'

import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface MappedClient {
  id: string
  name: string
  logo: string | null
  websiteUrl: string | null
}

interface ClientsClientProps {
  clients: MappedClient[]
  badge: string
  title: string
  subtitle: string
}

export function ClientsClient({
  clients,
  badge,
  title,
  subtitle,
}: ClientsClientProps) {
  
  if (clients.length === 0) return null

  // Pre-defined metrics/descriptions for the hover state to make it look premium
  const hoverStates = [
    { metric: '+45%', desc: 'Cloud Efficiency' },
    { metric: 'Zero', desc: 'Downtime Migration' },
    { metric: '10x', desc: 'Deployment Velocity' },
    { metric: '99.99%', desc: 'SLA Achievement' },
    { metric: '<50ms', desc: 'Global Latency' },
    { metric: '100%', desc: 'Compliance Rate' },
  ]

  return (
    <SectionWrapper id="clients" className="bg-[#0A0F1A] text-white overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <SectionHeader
        badge={badge}
        title={title}
        subtitle={subtitle}
        alignment="center"
      />

      <div className="mt-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {clients.map((client, i) => {
            const hoverState = hoverStates[i % hoverStates.length]
            
            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative h-40 md:h-48 rounded-3xl bg-[#111827] border border-slate-800 overflow-hidden cursor-pointer"
              >
                {/* Default State: Logo */}
                <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-500 group-hover:-translate-y-full">
                  {client.logo ? (
                    <Image
                      src={client.logo}
                      alt={`${client.name} logo`}
                      width={150}
                      height={50}
                      className="max-h-12 w-auto object-contain opacity-50 grayscale transition-opacity duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  ) : (
                    <span className="text-lg font-bold text-slate-500 text-center tracking-wider">
                      {client.name}
                    </span>
                  )}
                </div>

                {/* Hover State: Metric Reveal */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-600 to-cyan-500 translate-y-full transition-transform duration-500 group-hover:translate-y-0">
                  <span className="text-3xl font-extrabold text-white tracking-tighter">
                    {hoverState.metric}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100 mt-2 text-center">
                    {hoverState.desc}
                  </span>
                  <span className="text-xs font-medium text-white/70 mt-4 border-t border-white/20 pt-2 w-full text-center">
                    {client.name}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
