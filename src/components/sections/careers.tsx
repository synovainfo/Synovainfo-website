'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Briefcase, ArrowRight, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { appEvents } from '@/lib/events'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { positions, type Position } from '@/data/careers'

function TypeBadge({ type }: { type: Position['type'] }) {
  const styles: Record<Position['type'], string> = {
    remote: 'bg-corporate-gold/10 text-corporate-gold-dark',
    hybrid: 'bg-corporate-navy/10 text-corporate-navy dark:text-corporate-gold',
    onsite: 'bg-corporate-navy-dark/10 text-corporate-navy-dark',
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
      appEvents.emit('prefill-inquiry', { type: 'career', position: positionTitle })
    }
  }

  return (
    <SectionWrapper id="careers" className="bg-white dark:bg-corporate-navy-dark p-0 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-corporate-navy-dark via-corporate-navy-dark/85 to-transparent" />
          
          <div className="absolute inset-0 p-8 lg:p-16 flex flex-col justify-end lg:justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-corporate-gold/10 text-corporate-gold w-fit backdrop-blur-md border border-corporate-gold/30">
              <span className="section-label">
                Careers at Synova
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Engineer <br />
              <span className="text-gradient-orange">
                What&apos;s Next.
              </span>
            </h2>
            
            <p className="text-lg text-slate-300 max-w-md leading-relaxed">
              We don&apos;t hire employees. We recruit elite technical architects, designers, and systems engineers to build the infrastructure of tomorrow&apos;s Fortune 500.
            </p>
          </div>
        </div>

        {/* Right: Scrollable Accordion */}
        <div className="flex flex-col h-full bg-[#F8F9FA] dark:bg-corporate-navy p-8 lg:p-16 lg:overflow-y-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-corporate-navy-dark/60">
            <h3 className="text-xl font-bold text-corporate-navy dark:text-white">
              Open Architecture Roles
            </h3>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
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
                      ? "bg-white dark:bg-corporate-navy-dark/60 border-corporate-gold/40 shadow-lg shadow-corporate-gold/10" 
                      : "bg-white dark:bg-corporate-navy-dark/40 border-slate-200 dark:border-corporate-navy-dark/60 hover:border-corporate-gold/40 cursor-pointer"
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
                        isOpen ? "text-corporate-gold-dark dark:text-corporate-gold" : "text-corporate-navy dark:text-white"
                      )}>
                        {position.title}
                      </h4>
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-corporate-gold" /> {position.department}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-corporate-gold" /> {position.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block">
                        <TypeBadge type={position.type} />
                      </div>
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center transition-transform duration-300",
                        isOpen ? "bg-corporate-gold/10 text-corporate-gold rotate-180" : "bg-white dark:bg-corporate-navy-dark/60 text-slate-400 dark:text-slate-300"
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
                        <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-corporate-navy-dark/60">
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                            {position.description}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleApplyClick(position.title)
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-corporate-gold px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-corporate-gold-dark shadow-lg shadow-corporate-gold/25 hover:scale-[1.02] active:scale-95"
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
