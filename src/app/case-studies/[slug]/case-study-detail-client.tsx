'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, CheckCircle2, Target, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface RelatedStudy {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
}

interface CaseStudyDetailClientProps {
  title: string
  excerpt: string | null
  featuredImage: string | null
  industry: string
  challenge: string
  solution: string
  approach: string
  technologies: string[]
  results: { metric: string; value: string }[]
  timeline: string
  role: string
  content: Record<string, unknown>
  relatedStudies: RelatedStudy[]
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

export function CaseStudyDetailClient({
  title,
  excerpt,
  featuredImage,
  industry,
  challenge,
  solution,
  approach,
  technologies,
  results,
  timeline,
  role,
  content,
  relatedStudies,
}: CaseStudyDetailClientProps) {
  // Collect any additional content sections from JSON
  const extraSections = Object.entries(content).filter(
    ([key]) =>
      !['industry', 'challenge', 'solution', 'approach', 'technologies', 'results', 'timeline', 'role'].includes(key) &&
      typeof content[key] === 'string' &&
      String(content[key]).length > 0,
  ) as [string, string][]

  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-primary)] pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Main content */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="lg:col-span-3"
            >
              {/* Back link */}
              <Link
                href="/case-studies"
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-blue)] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Case Studies
              </Link>

              {/* Industry badge */}
              <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
                {industry}
              </span>

              <h1 className="mb-6 text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
                {title}
              </h1>

              {excerpt && (
                <p className="text-lg leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
                  {excerpt}
                </p>
              )}

              {/* Meta info */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[var(--color-text-tertiary)]">
                {timeline && (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {timeline}
                  </span>
                )}
                {role && (
                  <span className="inline-flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {role}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Summary card */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="lg:col-span-2"
            >
              <div className="sticky top-28 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-xl">
                {/* Key results */}
                {results.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                      Business Impact
                    </h3>
                    <div className="space-y-3">
                      {results.map((result) => (
                        <div
                          key={result.metric}
                          className="flex items-center justify-between rounded-xl bg-[var(--color-surface-secondary)] px-4 py-3"
                        >
                          <span className="text-sm text-[var(--color-text-secondary)]">
                            {result.metric}
                          </span>
                          <span className="font-heading text-lg font-bold text-[var(--color-accent-emerald)]">
                            {result.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                {technologies.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-lg bg-[var(--color-surface-tertiary)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline from meta */}
                {timeline && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                      Timeline
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{timeline}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detailed content */}
      <section className="bg-[var(--color-surface)] pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Challenge */}
            {challenge && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={0}
                variants={fadeUp}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
                    <Target className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-text)] md:text-3xl">
                    The Challenge
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
                  {challenge}
                </p>
              </motion.div>
            )}

            {/* Approach */}
            {approach && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={1}
                variants={fadeUp}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                    <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-text)] md:text-3xl">
                    Our Approach
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
                  {approach}
                </p>
              </motion.div>
            )}

            {/* Solution */}
            {solution && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={2}
                variants={fadeUp}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/20">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-text)] md:text-3xl">
                    The Solution
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
                  {solution}
                </p>
              </motion.div>
            )}

            {/* Extra content sections from JSON */}
            {extraSections.map(([key, value], index) => (
              <motion.div
                key={key}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={index + 3}
                variants={fadeUp}
              >
                <h2 className="mb-4 text-2xl font-bold text-[var(--color-text)] md:text-3xl capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
                <div
                  className="prose prose-zinc max-w-none dark:prose-invert prose-headings:text-[var(--color-text)] prose-p:text-[var(--color-text-secondary)]"
                  dangerouslySetInnerHTML={{ __html: value }}
                />
              </motion.div>
            ))}
          </div>

          {/* Related case studies */}
          {relatedStudies.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={5}
              variants={fadeUp}
              className="mt-20 border-t border-[var(--color-border)] pt-16"
            >
              <h2 className="mb-8 text-2xl font-bold text-[var(--color-text)] md:text-3xl">
                Related Case Studies
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedStudies.map((study) => (
                  <Link
                    key={study.id}
                    href={`/case-studies/${study.slug}`}
                    className={cn(
                      'group rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-xl',
                      'transition-all duration-300 hover:shadow-lg hover:border-[var(--color-accent-blue)]/20',
                    )}
                  >
                    <h3 className="mb-2 font-heading text-base font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent-blue)] transition-colors">
                      {study.title}
                    </h3>
                    {study.excerpt && (
                      <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                        {study.excerpt}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
