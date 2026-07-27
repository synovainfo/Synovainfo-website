'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { V2Hero } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

interface SearchResult {
  type: 'service' | 'industry' | 'blog' | 'page' | 'career' | 'faq'
  id: string
  title: string
  description: string
  url: string
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
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: searchQuery }),
      })
      if (!response.ok) throw new Error('Search failed')
      const data = (await response.json()) as { results?: SearchResult[] }
      setResults(data.results ?? [])
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateQuery = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => void performSearch(value), 300)
  }

  return (
    <>
      <V2Hero content={v2Pages.search} />
      <section className="v2-section v2-light">
        <div className="v2-shell">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-tertiary)]" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Search services, industries, FAQs, careers, and insights"
              className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] py-5 pl-14 pr-14 text-lg text-[var(--color-text)] outline-none focus:border-[var(--color-corporate-gold)]"
              aria-label="Search Synova"
            />
            {query && (
              <button className="absolute right-5 top-1/2 -translate-y-1/2" onClick={() => updateQuery('')} aria-label="Clear search" type="button">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="v2-service-stories" aria-live="polite">
            {isLoading && <p className="v2-service-story">Searching the Synova knowledge surface...</p>}
            {!isLoading && hasSearched && results.length === 0 && <p className="v2-service-story">No matching public result was found. Try a broader capability or industry term.</p>}
            {!isLoading && results.map((result, index) => (
              <Link className="v2-service-story" href={result.url} key={`${result.type}-${result.id}`}>
                <span className="v2-story-index">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <strong>{result.title}</strong>
                  <small className="block uppercase tracking-[.16em] text-[var(--color-corporate-gold)]">{result.type}</small>
                </span>
                <span>{result.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
