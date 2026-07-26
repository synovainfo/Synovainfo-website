import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceDetailLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function ServiceDetailLayout({
  children,
  params,
}: ServiceDetailLayoutProps) {
  const { slug } = await params

  // Fetch this service and all other services for the sidebar
  const [service, allServices] = await Promise.all([
    prisma.service.findUnique({
      where: { slug, status: true },
      select: { id: true, title: true, slug: true, category: true },
    }),
    prisma.service.findMany({
      where: { status: true },
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true, slug: true, category: true },
    }),
  ])

  if (!service) {
    notFound()
  }

  // Group services by category for sidebar
  const categories = [...new Set(allServices.map((s) => s.category ?? 'development'))]
  const grouped = categories.reduce<
    Record<string, Array<{ id: string; title: string; slug: string }>>
  >((acc, cat) => {
    acc[cat] = allServices
      .filter((s) => (s.category ?? 'development') === cat)
      .map((s) => ({ id: s.id, title: s.title, slug: s.slug }))
    return acc
  }, {})

  return (
    <div>
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-accent-blue)]"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" aria-hidden="true" />
          <Link
            href="/services"
            className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-accent-blue)]"
          >
            Services
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" aria-hidden="true" />
          <span className="font-medium text-[var(--color-text)]" aria-current="page">
            {service.title}
          </span>
        </div>
      </nav>

      {/* ── Content + Sidebar ── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                All Services
              </h3>
              <nav className="space-y-4">
                {Object.entries(grouped).map(([cat, svcs]) => (
                  <div key={cat}>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      {cat}
                    </h4>
                    <ul className="space-y-1">
                      {svcs.map((s) => (
                        <li key={s.id}>
                          <Link
                            href={`/services/${s.slug}`}
                            className={cn(
                              'block rounded-lg px-3 py-2 text-sm transition-colors duration-200',
                              s.slug === slug
                                ? 'bg-[var(--color-accent-blue)]/10 font-medium text-[var(--color-accent-blue)]'
                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)]',
                            )}
                          >
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  )
}
