'use client'

import { motion } from 'framer-motion'
import { FileText, ArrowRight, Clock, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeader } from '@/components/ui/section-header'

const INSIGHTS = [
  {
    id: 'agentic-ai-architecture',
    type: 'Whitepaper',
    category: 'Artificial Intelligence',
    title: 'Architecting Agentic AI Workflows in High-Compliance Enterprise Infrastructure',
    description: 'A technical blueprint on deploying LLMs, retrieval-augmented generation (RAG), and autonomous agent networks with zero data leakage. Discover how we built an inference pipeline capable of sub-50ms responses behind strict corporate firewalls.',
    date: 'July 2026',
    readTime: '12 min read',
    actionText: 'Download Whitepaper (PDF)',
    featured: true,
  },
  {
    id: 'cloud-native-resilience',
    type: 'Benchmark Report',
    category: 'Cloud Engineering',
    title: '2026 Enterprise Multi-Cloud Resilience & SLO Benchmark Report',
    description: 'Analysis of 150+ Fortune 500 Kubernetes clusters evaluating active-active failover, service mesh security, and disaster recovery SLA metrics.',
    date: 'June 2026',
    readTime: '15 min read',
    actionText: 'Download Report (PDF)',
    featured: false,
  },
  {
    id: 'legacy-core-modernization',
    type: 'Engineering Article',
    category: 'Digital Transformation',
    title: 'Strangler Fig Pattern: Zero-Downtime Migration for Core Financial Engines',
    description: 'Step-by-step case study on incrementally modernizing 20-year-old COBOL and Java monoliths using Kafka CDC pipelines.',
    date: 'May 2026',
    readTime: '8 min read',
    actionText: 'Read Architecture Article',
    featured: false,
  },
]

interface MappedBlog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featuredImage: string | null
  createdAt: string
  authorName: string
  authorImage: string | null
}

interface InsightsClientProps {
  initialBlogs: MappedBlog[]
}

export function InsightsClient({ initialBlogs }: InsightsClientProps) {
  const featuredInsight = INSIGHTS.find((i) => i.featured)
  const secondaryInsights = INSIGHTS.filter((i) => !i.featured)

  return (
    <SectionWrapper id="insights" className="bg-surface-secondary">
      <SectionHeader
        badge="Thought Leadership & Research"
        title="Enterprise Insights & Technical Intelligence"
        subtitle="Stay ahead with architectural whitepapers, industry benchmarks, and engineering insights authored by Synova principal architects."
        alignment="left"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-12">
        {/* Large Featured Article */}
        {featuredInsight && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 md:p-12 shadow-sm transition-all duration-500 hover:shadow-md"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
              <div className="h-12 w-12 rounded-full bg-corporate-gold flex items-center justify-center text-white">
                <ArrowUpRight className="h-6 w-6" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-corporate-gold/20 px-4 py-1.5 text-xs font-bold text-corporate-gold">
                  <FileText className="h-3.5 w-3.5" />
                  {featuredInsight.type}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  {featuredInsight.category}
                </span>
              </div>

              <h3 className="text-3xl md:text-5xl font-bold text-corporate-navy leading-[1.1] mb-6 group-hover:text-corporate-gold transition-colors duration-300">
                {featuredInsight.title}
              </h3>

              <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
                {featuredInsight.description}
              </p>
            </div>

            <div className="mt-16 flex items-center justify-between border-t border-slate-200 pt-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-500">{featuredInsight.date}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-sm text-slate-500 flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {featuredInsight.readTime}
                </span>
              </div>
              <Link
                href="/resources"
                className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-corporate-gold hover:text-corporate-gold-dark hover:underline"
              >
                {featuredInsight.actionText} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Stacked Secondary Articles */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {secondaryInsights.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex-1 flex flex-col justify-between rounded-xl bg-white border border-slate-200 p-8 shadow-sm transition-all duration-300 hover:border-corporate-gold/30 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center rounded-full bg-orange-50 border border-corporate-gold/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-corporate-gold">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {item.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-corporate-navy mb-3 group-hover:text-corporate-gold transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{item.date}</span>
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-corporate-gold hover:text-corporate-gold-dark hover:underline"
                >
                  Read <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Original Prisma Blog Posts */}
      {initialBlogs.length > 0 && (
        <div className="mt-32 max-w-7xl mx-auto">
          <div className="mb-12 border-t border-slate-200 pt-16">
            <h3 className="text-2xl font-bold text-corporate-navy mb-2">Latest Company News</h3>
            <p className="text-slate-600">Updates, announcements, and articles from our team.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialBlogs.map((blog, idx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-corporate-gold/30 transition-all shadow-sm hover:shadow-md"
              >
                {blog.featuredImage && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image src={blog.featuredImage} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs text-slate-500 mb-2">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h4 className="text-lg font-bold text-corporate-navy mb-3 group-hover:text-corporate-gold transition-colors line-clamp-2">
                    {blog.title}
                  </h4>
                  {blog.excerpt && (
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                        {blog.authorImage ? (
                          <Image src={blog.authorImage} alt={blog.authorName} fill className="object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500">{blog.authorName.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-700">{blog.authorName}</span>
                    </div>
                    <Link href={`/blog/${blog.slug}`} className="text-corporate-gold hover:text-corporate-gold-dark text-sm font-semibold flex items-center gap-1 transition-colors">
                      Read <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}
