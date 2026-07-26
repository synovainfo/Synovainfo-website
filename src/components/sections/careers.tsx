'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Briefcase, ArrowRight, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { positions, type Position } from '@/data/careers'

function TypeBadge({ type }: { type: Position['type'] }) {
  const styles: Record<Position['type'], string> = {
    remote: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    hybrid: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    onsite: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  }

  return (
    <span
      className={cn(
        'inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider',
        styles[type],
      )}
    >
      {type}
    </span>
  )
}

export function Careers() {
  const [openId, setOpenId] = useState<string | null>(positions[0]?.id || null)

  const handleApplyClick = (positionTitle: string) => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
      window.dispatchEvent(
        new CustomEvent('prefill-inquiry', {
          detail: { type: 'career', position: positionTitle },
        }),
      )
    }
  }

  return (
    <SectionWrapper id="careers" className="bg-white dark:bg-[#050914] p-0 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-auto lg:h-[90vh]">
        
        {/* Left: Sticky Image & Intro */}
        <div className="relative h-[50vh] lg:h-full w-full">
          <Image
            src="/images/home/enterprise-office.png"
            alt="Synova Enterprise Engineering Team"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#050914] via-[#050914]/80 to-transparent" />
          
          <div className="absolute inset-0 p-8 lg:p-16 flex flex-col justify-end lg:justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-500/10 text-blue-400 w-fit backdrop-blur-md border border-blue-500/20">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Careers at Synova
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Engineer <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                What&apos;s Next.
              </span>
            </h2>
            
            <p className="text-lg text-slate-300 max-w-md leading-relaxed">
              We don&apos;t hire employees. We recruit elite technical architects, designers, and systems engineers to build the infrastructure of tomorrow&apos;s Fortune 500.
            </p>
          </div>
        </div>

        {/* Right: Scrollable Accordion */}
        <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0A0F1A] p-8 lg:p-16 lg:overflow-y-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Open Architecture Roles
            </h3>
            <span className="text-sm font-semibold text-slate-500">
              {positions.length} Positions
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {positions.map((position) => {
              const isOpen = openId === position.id

              return (
                <div
                  key={position.id}
                  className={cn(
                    "rounded-2xl border transition-all duration-300 overflow-hidden",
                    isOpen 
                      ? "bg-white dark:bg-[#111827] border-blue-500/30 shadow-lg" 
                      : "bg-transparent border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer"
                  )}
                >
                  {/* Accordion Header */}
                  <div 
                    className="p-6 flex items-center justify-between"
                    onClick={() => setOpenId(isOpen ? null : position.id)}
                  >
                    <div>
                      <h4 className={cn(
                        "text-lg font-bold mb-2 transition-colors",
                        isOpen ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"
                      )}>
                        {position.title}
                      </h4>
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {position.department}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {position.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block">
                        <TypeBadge type={position.type} />
                      </div>
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center transition-transform duration-300",
                        isOpen ? "bg-blue-500/10 text-blue-500 rotate-180" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      )}>
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  {/* Accordion Body */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                            {position.description}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleApplyClick(position.title)
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-6 py-3 text-sm font-bold text-white dark:text-slate-900 transition-transform hover:scale-105 active:scale-95"
                          >
                            Apply for Role <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </SectionWrapper>
  )
}
