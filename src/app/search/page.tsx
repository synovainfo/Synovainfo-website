'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText, Code2, Building2, Newspaper, Briefcase, HelpCircle, ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchResult {
  type: 'service' | 'industry' | 'blog' | 'page' | 'career' | 'faq'
  id: string
  title: string
  description: string
  url: string
}

const typeConfig = {
  service: { label: 'Service', icon: Code2, color: 'text-[var(--color-accent-blue)]' },
  industry: { label: 'Industry', icon: Building2, color: 'text-[var(--color-accent-emerald)]' },
  blog: { label: 'Insight', icon: Newspaper, color: 'text-[var(--color-accent-purple)]' },
  page: { label: 'Page', icon: FileText, color: 'text-[var(--color-accent-cyan)]' },
  career: { label: 'Career', icon: Briefcase, color: 'text-[var(--color-accent-orange)]' },
  faq: { label: 'FAQ', icon: HelpCircle, color: 'text-[var(--color-accent-pink)]' },
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="rounded bg-[var(--color-accent-blue)]/20 px-0.5 text-[var(--color-accent-blue)]">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: searchQuery }),
      })

      if (!res.ok) throw new Error('Search failed')

      const data = await res.json()
      setResults(data.results ?? [])
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInputChange = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      performSearch(value)
    }, 300)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setHasSearched(false)
    inputRef.current?.focus()
  }

  const groupedResults = results.reduce<Record<string, SearchResult[]>>((acc, result) => {
    if (!acc[result.type]) acc[result.type] = []
    acc[result.type].push(result)
    return acc
  }, {})

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-[var(--color-text)] md:text-5xl lg:text-6xl">
            Search
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-secondary)]">
            Find services, industries, insights, and resources across Synova Infotech.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Search for services, industries, insights..."
              className={cn(
                'w-full rounded-2xl border bg-[var(--color-surface)] py-4 pl-12 pr-12',
                'text-base text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]',
                'outline-none transition-all duration-200',
                'border-[var(--color-border)] focus:border-[var(--color-accent-blue)]/50 focus:shadow-lg focus:shadow-[var(--color-accent-blue)]/10'
              )}
              aria-label="Search"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text)]"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent-blue)] border-t-transparent" />
            </motion.div>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 text-center"
            >
              <Search className="mx-auto h-12 w-12 text-[var(--color-text-tertiary)]" />
              <h2 className="mt-4 font-heading text-xl font-semibold text-[var(--color-text)]">
                No results found
              </h2>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                Try adjusting your search terms or browse our{' '}
                <Link href="/services" className="text-[var(--color-accent-blue)] underline-offset-2 hover:underline">
                  services
                </Link>{' '}
                or{' '}
                <Link href="/industries" className="text-[var(--color-accent-blue)] underline-offset-2 hover:underline">
                  industries
                </Link>
                .
              </p>
            </motion.div>
          )}

          {!isLoading && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {Object.entries(groupedResults).map(([type, typeResults]) => {
                const config = typeConfig[type as keyof typeof typeConfig]
                if (!config) return null
                const Icon = config.icon

                return (
                  <div key={type}>
                    <div className="mb-4 flex items-center gap-2">
                      <Icon className={cn('h-5 w-5', config.color)} />
                      <h2 className="font-heading text-lg font-semibold text-[var(--color-text)]">
                        {config.label}
                      </h2>
                      <span className="text-sm text-[var(--color-text-tertiary)]">
                        ({typeResults.length})
                      </span>
                    </div>
                    <div className="space-y-3">
                      {typeResults.map((result) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          href={result.url}
                          className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all duration-200 hover:border-[var(--color-accent-blue)]/30 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent-blue)] transition-colors">
                                {highlightMatch(result.title, query)}
                              </h3>
                              {result.description && (
                                <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
                                  {highlightMatch(result.description, query)}
                                </p>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-text-tertiary)] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[var(--color-accent-blue)]" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
