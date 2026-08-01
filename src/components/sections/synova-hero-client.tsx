'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useHlsVideo } from '@/hooks/use-hls-video'

const HLS_STREAM_URL =
  'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8'

export interface SynovaHeroContent {
  eyebrow: string
  headline: string
  description: string
  ctaLabel: string
  ctaHref: string
  cardTag: string
  cardHeadlinePrefix: string
  cardHeadlineAccent: string
  cardHeadlineSuffix: string
  cardDescription: string
}

export interface SynovaHeroClientProps {
  content: SynovaHeroContent
}

/**
 * Client-side hero renderer: HLS video background, layered gradients,
 * vertical grid lines, SVG glow, and the liquid-glass trust card.
 *
 * Navigation is intentionally NOT rendered here — the global Header in the
 * root layout owns site navigation.
 */
export function SynovaHeroClient({ content }: SynovaHeroClientProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  useHlsVideo(videoRef, HLS_STREAM_URL)

  return (
    <section
      aria-label="Synova hero"
      className="relative w-full min-h-screen bg-abyss text-white overflow-hidden select-none"
    >
      {/* Liquid glass card styling — mask-composite border cannot be expressed in Tailwind */}
      <style>{`
        .synova-liquid-glass-card {
          position: relative;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.01);
          background-blend-mode: luminosity;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
          border-radius: 16px;
        }

        .synova-liquid-glass-card::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1.4px;
          border-radius: 16px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.2) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>

      {/* Background video (HLS stream at 60% opacity) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Left-to-right readability gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to right, #070b0a 0%, rgba(7, 11, 10, 0.85) 35%, rgba(7, 11, 10, 0.4) 65%, transparent 100%)',
        }}
      />

      {/* Bottom-up readability gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to top, #070b0a 0%, rgba(7, 11, 10, 0.6) 50%, transparent 100%)',
        }}
      />

      {/* Vertical grid lines (desktop only) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block pointer-events-none z-10"
      >
        <div className="absolute top-0 bottom-0 left-[25%] w-px bg-white/10" />
        <div className="absolute top-0 bottom-0 left-[50%] w-px bg-white/10" />
        <div className="absolute top-0 bottom-0 left-[75%] w-px bg-white/10" />
      </div>

      {/* Central glow (SVG ellipse, 25px Gaussian blur, 25% opacity) */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl pointer-events-none z-10 overflow-hidden opacity-25"
      >
        <svg
          viewBox="0 0 1000 400"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <defs>
            <filter
              id="synova-hero-glow-blur"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="25" />
            </filter>
          </defs>
          <ellipse
            cx="500"
            cy="60"
            rx="450"
            ry="140"
            fill="#F97316"
            filter="url(#synova-hero-glow-blur)"
          />
        </svg>
      </div>

      {/* Hero content — padded to clear the fixed global header */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col justify-center items-start min-h-screen">
        {/* Liquid glass trust card (200x200, shifted 50px upwards) */}
        <div className="transform translate-y-[-50px] mb-2">
          <div className="synova-liquid-glass-card p-5 flex flex-col justify-between">
            <span className="text-[14px] font-mono text-white/60">
              {content.cardTag}
            </span>

            <p className="text-[18px] font-normal text-white leading-snug">
              {content.cardHeadlinePrefix}{' '}
              <span className="font-serif-display italic text-[20px]">
                {content.cardHeadlineAccent}
              </span>{' '}
              {content.cardHeadlineSuffix}
            </p>

            <p className="text-[11px] text-white/50 leading-relaxed">
              {content.cardDescription}
            </p>
          </div>
        </div>

        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p className="font-heading font-bold text-[11px] uppercase tracking-widest text-corporate-gold mb-4">
            {content.eyebrow}
          </p>

          {/* Main headline */}
          <h1 className="font-sans font-extrabold uppercase tracking-tight text-[40px] sm:text-[56px] md:text-[72px] leading-[1.05] text-white mb-6">
            {content.headline}
            <span className="text-corporate-gold">.</span>
          </h1>

          {/* Description */}
          <p className="font-sans text-[14px] text-white/70 max-w-[512px] leading-relaxed mb-10">
            {content.description}
          </p>

          {/* Primary CTA */}
          <Link
            href={content.ctaHref}
            aria-label={content.ctaLabel}
            className="inline-flex items-center gap-3 bg-corporate-gold text-white rounded-full uppercase font-bold text-sm tracking-wider px-8 py-4 transition-transform duration-300 hover:scale-105 shadow-lg shadow-corporate-gold/20 group"
          >
            <span>{content.ctaLabel}</span>
            <ArrowRight
              aria-hidden="true"
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
