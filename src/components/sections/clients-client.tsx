'use client'

import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/layout/section-wrapper'
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

  return (
    <SectionWrapper id="clients" className="bg-surface-secondary">
      {/* Section header: ITHPL orange uppercase label */}
      <div className="mb-12 text-center md:mb-16">
        {badge && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label inline-block"
            style={{ marginBottom: '1rem' }}
          >
            {badge}
          </motion.span>
        )}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)] md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <div className="mx-auto mt-16 max-w-6xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {clients.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group flex h-40 items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-corporate-gold/50 hover:text-corporate-gold hover:shadow-md md:h-48"
            >
              {client.logo ? (
                <Image
                  src={client.logo}
                  alt={`${client.name} logo`}
                  width={150}
                  height={50}
                  className="max-h-12 w-auto object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                />
              ) : (
                <span className="text-lg font-bold tracking-wider text-slate-400 transition-colors duration-300 group-hover:text-corporate-navy">
                  {client.name}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
