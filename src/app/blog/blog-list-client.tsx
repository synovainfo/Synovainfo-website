'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  X,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { BlogPostSummary, CategorySummary, PaginationInfo } from './page'

interface BlogListClientProps {
  posts: BlogPostSummary[]
  categories: CategorySummary[]
  pagination: PaginationInfo
  featuredPost: BlogPostSummary | null
  currentCategory: string | null
  currentSearch: string | null
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
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

function PostCard({ post, featured = false }: { post: BlogPostSummary; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--glass-border)]',
        'bg-[var(--glass-bg)] shadow-sm backdrop-blur-xl',
        'transition-all duration-300',
        'hover:shadow-xl hover:border-[var(--color-accent-blue)]/20',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
        featured ? 'md:flex-row' : '',
      )}
    >
      {/* Featured image */}
      <div
        className={cn(
          'relative overflow-hidden bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-[var(--color-accent-cyan)]/10',
          featured ? 'h-64 md:h-auto md:w-2/5' : 'h-48',
        )}
      >
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="grid grid-cols-4 gap-1 p-6 opacity-20">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm bg-[var(--color-accent-blue)]/40"
                />
              ))}
            </div>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className={cn('flex flex-1 flex-col p-6', featured && 'justify-center')}>
        {/* Category badge */}
        <span className="mb-3 inline-flex w-fit rounded-full bg-[var(--color-accent-blue)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent-blue)]">
          {post.category.name}
        </span>

        <h3
          className={cn(
            'mb-2 font-heading font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent-blue)] transition-colors',
            featured ? 'text-2xl md:text-3xl' : 'text-lg',
          )}
        >
          {post.title}
        </h3>

        {post.excerpt && (
          <p
            className={cn(
              'mb-4 text-[var(--color-text-secondary)] line-clamp-2',
              featured ? 'text-base md:text-lg' : 'text-sm',
            )}
          >
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto flex items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.viewCount} views
          </span>
        </div>

        {featured && (
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[var(--color-accent-blue)]">
            Read Article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </div>
    </Link>
  )
}

export function BlogListClient({
  posts,
  categories,
  pagination,
  featuredPost,
  currentCategory,
  currentSearch,
}: BlogListClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(currentSearch ?? '')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== (currentSearch ?? '')) {
        const params = new URLSearchParams(searchParams)
        if (searchQuery) {
          params.set('search', searchQuery)
        } else {
          params.delete('search')
        }
        params.delete('page')
        router.push(`/blog?${params.toString()}`)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery, router, searchParams, currentSearch])

  const remainingPosts = useMemo(() => {
    if (featuredPost) {
      return posts.filter((p) => p.id !== featuredPost.id)
    }
    return posts
  }, [posts, featuredPost])

  return (
    <section className="bg-[var(--color-surface)] pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* ── Main content ── */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-10">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl"
              >
                {currentCategory
                  ? categories.find((c) => c.slug === currentCategory)?.name ?? 'Blog'
                  : 'Blog'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-[var(--color-text-secondary)]"
              >
                {currentCategory
                  ? `Articles filed under ${categories.find((c) => c.slug === currentCategory)?.name ?? currentCategory}`
                  : 'Insights, tutorials, and thought leadership from our engineering team.'}
              </motion.p>
            </div>

            {/* Featured post */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-12"
              >
                <PostCard post={featuredPost} featured />
              </motion.div>
            )}

            {/* Post grid */}
            {remainingPosts.length === 0 && !featuredPost ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-[var(--color-surface-tertiary)] p-4">
                  <Search className="h-8 w-8 text-[var(--color-text-tertiary)]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--color-text)]">
                  No posts found
                </h3>
                <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
                  {currentSearch
                    ? 'Try a different search term.'
                    : 'Check back later for new articles.'}
                </p>
                {(currentSearch || currentCategory) && (
                  <Link
                    href="/blog"
                    className="rounded-xl bg-[var(--color-accent-blue)] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    View All Posts
                  </Link>
                )}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 md:grid-cols-2"
              >
                {remainingPosts.map((post) => (
                  <motion.div key={post.id} variants={cardVariants}>
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between border-t border-[var(--color-border)] pt-8">
                <span className="text-sm text-[var(--color-text-tertiary)]">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <div className="flex items-center gap-3">
                  {pagination.currentPage > 1 && (
                    <Link
                      href={`/blog?page=${pagination.currentPage - 1}${currentCategory ? `&category=${currentCategory}` : ''}${currentSearch ? `&search=${currentSearch}` : ''}`}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-all',
                        'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)]',
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Link>
                  )}
                  {pagination.currentPage < pagination.totalPages && (
                    <Link
                      href={`/blog?page=${pagination.currentPage + 1}${currentCategory ? `&category=${currentCategory}` : ''}${currentSearch ? `&search=${currentSearch}` : ''}`}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-all',
                        'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)]',
                      )}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
              {/* Search */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                  Search
                </h3>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    aria-label="Search articles"
                    className={cn(
                      'w-full rounded-xl border border-[var(--color-border)] py-2.5 pl-10 pr-10 text-sm',
                      'bg-[var(--color-surface-secondary)] text-[var(--color-text)]',
                      'placeholder:text-[var(--color-text-tertiary)]',
                      'focus:border-[var(--color-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-blue)]',
                    )}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                  Categories
                </h3>
                <nav className="space-y-1" aria-label="Blog categories">
                  <Link
                    href="/blog"
                    className={cn(
                      'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                      !currentCategory
                        ? 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] font-medium'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)]',
                    )}
                  >
                    <span>All Posts</span>
                    <span className="text-xs">{pagination.total}</span>
                  </Link>
                  {categories.map((cat) => {
                    const active = currentCategory === cat.slug
                    return (
                      <Link
                        key={cat.id}
                        href={active ? '/blog' : `/blog?category=${cat.slug}`}
                        className={cn(
                          'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                          active
                            ? 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] font-medium'
                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)]',
                        )}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs opacity-60">{cat._count.posts}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
