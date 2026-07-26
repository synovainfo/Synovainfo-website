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
    <SectionWrapper id="testimonials" className="bg-[#050914] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* Left: Images */}
        <div className="relative h-[60vh] lg:h-[80vh] w-full rounded-3xl overflow-hidden order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              {current.imageUrl ? (
                <Image
                  src={current.imageUrl}
                  alt={current.name}
                  fill
                  className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-6xl text-slate-600 font-bold">
                  {current.initials}
                </div>
              )}
              {/* Cinematic Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-transparent to-transparent opacity-80" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col justify-center order-1 lg:order-2 h-full lg:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md w-fit">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              {badge}
            </span>
          </div>

          <div className="relative mb-12">
            <Quote className="absolute -top-12 -left-8 w-24 h-24 text-white/5" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <h3 className="text-3xl md:text-5xl font-bold leading-[1.2] tracking-tight mb-8">
                  &ldquo;{current.quote}&rdquo;
                </h3>
                
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-blue-500" />
                  <div>
                    <div className="text-lg font-bold">{current.name}</div>
                    <div className="text-sm font-semibold text-blue-400 uppercase tracking-wide">
                      {current.title} — {current.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mt-auto">
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-all hover:bg-white/5"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
                className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-all hover:bg-white/5"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    idx === currentIndex ? "w-8 bg-blue-500" : "w-2 bg-white/20 hover:bg-white/50"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </SectionWrapper>
  )
}
