'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Link as LinkIcon,
  Check,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

interface PostData {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: Date | null
  viewCount: number
  category: { id: string; name: string; slug: string }
  author: { id: string; name: string; image: string | null }
  tags: { id: string; name: string; slug: string }[]
}

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: Date | null
}

interface BlogPostDetailClientProps {
  post: PostData
  relatedPosts: RelatedPost[]
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

function formatDate(date: Date | string | null): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatReadTime(content: string): string {
  const words = content.split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

export function BlogPostDetailClient({ post, relatedPosts }: BlogPostDetailClientProps) {
  const [linkCopied, setLinkCopied] = useState(false)

  const postUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `/blog/${post.slug}`

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(postUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = postUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }, [postUrl])

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`
  const linkedinShareUrl = `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`

  const readTime = formatReadTime(post.content)

  return (
    <section className="bg-[var(--color-surface)] pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* ── Sidebar (Author + Share) ── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
              {/* Back link */}
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-blue)] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>

              {/* Author card */}
              <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 backdrop-blur-xl">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                  Written by
                </h3>
                <div className="flex items-center gap-3">
                  {post.author.image ? (
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-blue)]/10 text-sm font-semibold text-[var(--color-accent-blue)]">
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {post.author.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                  Share
                </h3>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={twitterShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-blue)]/10 hover:border-[var(--color-accent-blue)]/20 transition-all"
                    aria-label="Share on Twitter"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Tweet
                  </a>
                  <a
                    href={linkedinShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-blue)]/10 hover:border-[var(--color-accent-blue)]/20 transition-all"
                    aria-label="Share on LinkedIn"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-blue)]/10 hover:border-[var(--color-accent-blue)]/20 transition-all"
                    aria-label="Copy link"
                  >
                    {linkCopied ? (
                      <Check className="h-4 w-4 text-[var(--color-accent-emerald)]" />
                    ) : (
                      <LinkIcon className="h-4 w-4" />
                    )}
                    {linkCopied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="lg:col-span-3">
            <article>
              {/* Header */}
              <motion.div
                initial="hidden"
                animate="visible"
                custom={0}
                variants={fadeUp}
              >
                {/* Category badge */}
                <Link
                  href={`/blog?category=${post.category.slug}`}
                  className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/20 transition-colors"
                >
                  {post.category.name}
                </Link>

                <h1 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="mb-6 text-lg leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta */}
                <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-tertiary)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {readTime}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    {post.viewCount.toLocaleString()} views
                  </span>
                </div>
              </motion.div>

              {/* Featured image */}
              {post.featuredImage && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  variants={fadeUp}
                  className="mb-10 overflow-hidden rounded-2xl"
                >
                  <Image
                    src={post.featuredImage}
                    alt=""
                    width={1200}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              )}

              {/* Content */}
              <motion.div
                initial="hidden"
                animate="visible"
                custom={2}
                variants={fadeUp}
              >
                <div
                  className="prose prose-zinc max-w-none dark:prose-invert
                    prose-headings:text-[var(--color-text)]
                    prose-p:text-[var(--color-text-secondary)] prose-p:leading-relaxed
                    prose-a:text-[var(--color-accent-blue)] prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-[var(--color-text)]
                    prose-code:rounded-md prose-code:bg-[var(--color-surface-tertiary)] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm
                    prose-pre:rounded-xl prose-pre:bg-[var(--color-surface-tertiary)] prose-pre:border prose-pre:border-[var(--color-border)]
                    prose-img:rounded-xl
                    prose-blockquote:border-l-[var(--color-accent-blue)] prose-blockquote:text-[var(--color-text-secondary)]
                    prose-li:text-[var(--color-text-secondary)]
                  "
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </motion.div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  custom={3}
                  variants={fadeUp}
                  className="mt-10 border-t border-[var(--color-border)] pt-8"
                >
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/blog?search=${tag.name}`}
                        className="inline-flex items-center rounded-lg bg-[var(--color-surface-tertiary)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-blue)]/10 hover:text-[var(--color-accent-blue)] transition-colors"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </article>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={4}
                variants={fadeUp}
                className="mt-16 border-t border-[var(--color-border)] pt-16"
              >
                <h2 className="mb-8 text-2xl font-bold text-[var(--color-text)] md:text-3xl">
                  Related Articles
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/blog/${rp.slug}`}
                      className={cn(
                        'group rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-xl',
                        'transition-all duration-300 hover:shadow-lg hover:border-[var(--color-accent-blue)]/20',
                      )}
                    >
                      <h3 className="mb-2 font-heading text-base font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent-blue)] transition-colors">
                        {rp.title}
                      </h3>
                      {rp.excerpt && (
                        <p className="mb-3 text-sm text-[var(--color-text-secondary)] line-clamp-2">
                          {rp.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-accent-blue)]">
                        Read More
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
