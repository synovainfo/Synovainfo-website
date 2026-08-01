'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

/**
 * Full-width "global presence" visual band.
 * Renders the network-map graphic on a fixed navy panel so the overlay
 * text stays readable in both light and dark themes.
 */
export function GlobalPresencePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-20"
    >
      <div className="relative min-h-[340px] overflow-hidden rounded-2xl bg-[var(--color-primary-dark)] shadow-lg sm:min-h-[360px] lg:min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src="/images/industries/industry-global-map-nodes.svg"
            alt="Global delivery network map showing connected regional offices and client locations"
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1280px"
            className="object-cover object-center opacity-90"
          />
        </div>

        {/* Left-edge scrim so overlay text stays legible over the map */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--color-primary-dark)]/95 via-[var(--color-primary-dark)]/45 to-transparent"
          aria-hidden
        />

        <div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center p-6 md:p-12">
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-cyan)]" aria-hidden />
            Global Delivery Network
          </span>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white md:text-3xl">
            Connected Expertise, Everywhere You Operate
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 md:text-base">
            A distributed delivery model uniting regional teams, industry
            specialists, and enterprise clients across time zones and markets.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
