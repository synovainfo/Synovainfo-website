'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import type { Testimonial } from '@/data/testimonials'

interface TestimonialsClientProps {
  testimonials: (Testimonial & { imageUrl?: string })[]
  badge: string
  title: string
  subtitle: string
}

export function TestimonialsClient({
  testimonials,
  badge,
  title,
  subtitle,
}: TestimonialsClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance
  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  if (testimonials.length === 0) return null

  const current = testimonials[currentIndex]

  return (
    <SectionWrapper id="testimonials" className="bg-surface-secondary">
      {/* Section header */}
      <div className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-corporate-gold">
          {badge}
        </span>
        <h2 className="mt-4 text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-corporate-navy">
          {title}
        </h2>
        <p className="mt-5 text-base md:text-lg text-slate-600 leading-relaxed">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-center">
        {/* Left: Circular photo */}
        <div className="flex justify-center lg:justify-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="relative h-44 w-44 md:h-56 md:w-56 lg:h-64 lg:w-64 rounded-full overflow-hidden bg-slate-100 shadow-lg"
            >
              {current.imageUrl ? (
                <Image
                  src={current.imageUrl}
                  alt={current.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 256px, 320px"
                  quality={90}
                />
              ) : (
                <div className="w-full h-full bg-corporate-navy flex items-center justify-center text-4xl md:text-5xl font-bold text-white">
                  {current.initials}
                </div>
              )}
              {/* Orange accent ring */}
              <div className="absolute inset-0 rounded-full ring-4 ring-corporate-gold/20 ring-offset-4 ring-offset-surface-secondary pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Quote card */}
        <div className="relative">
          <Quote className="absolute -top-5 -left-3 md:-left-5 w-10 h-10 md:w-12 md:h-12 text-corporate-gold/25" aria-hidden="true" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-white border border-slate-200 shadow-md rounded-2xl p-8 md:p-10"
            >
              <p className="text-lg md:text-xl leading-relaxed text-slate-600">
                &ldquo;{current.quote}&rdquo;
              </p>

              <div className="mt-8 border-l-4 border-corporate-gold pl-4">
                <div className="text-lg font-bold text-corporate-navy">{current.name}</div>
                <div className="text-sm font-semibold text-corporate-gold uppercase tracking-wide">
                  {current.title} — {current.company}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-12 md:mt-14">
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
            aria-label="Previous testimonial"
            className="h-12 w-12 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-corporate-navy hover:border-corporate-gold hover:bg-corporate-gold/5 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
            aria-label="Next testimonial"
            className="h-12 w-12 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-corporate-navy hover:border-corporate-gold hover:bg-corporate-gold/5 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                idx === currentIndex ? "w-8 bg-corporate-gold" : "w-2 bg-slate-300 hover:bg-corporate-gold/60"
              )}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
