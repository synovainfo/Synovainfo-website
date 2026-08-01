import Image from 'next/image'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Case Studies page imagery — assets live in /public/images/         */
/*  case-studies. SVGs use intrinsic width/height; the dashboard       */
/*  photo uses next/image `fill` inside an aspect-ratio container.     */
/*  Styling follows the page tokens (accent blue / glass surfaces).    */
/*  Captions derive from industry data and asset filenames only —      */
/*  no fabricated names, quotes, or statistics.                        */
/* ------------------------------------------------------------------ */

/* ── Hero visual (LCP → priority) ─────────────────────────────────── */

export function CaseStudiesHeroVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-accent-blue)]/10">
      <Image
        src="/images/case-studies/case-studies-hero.svg"
        alt="Enterprise case study outcomes overview illustration"
        width={900}
        height={500}
        priority
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="h-auto w-full"
      />
    </div>
  )
}

/* ── Architecture blueprints — mapped to industries in the data ───── */

const ARCH_DIAGRAMS: Record<string, string> = {
  energy: '/images/case-studies/case-study-energy-arch.svg',
  fintech: '/images/case-studies/case-study-fintech-arch.svg',
  health: '/images/case-studies/case-study-health-arch.svg',
  logistics: '/images/case-studies/case-study-logistics-arch.svg',
  retail: '/images/case-studies/case-study-retail-arch.svg',
}

const GENERIC_ARCH = '/images/case-studies/case-study-architecture.svg'

function archDiagramFor(industry: string): string | undefined {
  return ARCH_DIAGRAMS[industry.toLowerCase()]
}

export function ArchitectureShowcase({ industries }: { industries: string[] }) {
  const specific = industries
    .map((industry) => ({
      industry,
      src: archDiagramFor(industry),
    }))
    .filter(
      (entry): entry is { industry: string; src: string } => entry.src !== undefined,
    )

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
            Blueprints
          </span>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
            Architecture in Action
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)] md:text-xl">
            Reference architectures engineered for the industries we serve.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {specific.map(({ industry, src }) => (
            <figure
              key={industry}
              className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <Image
                src={src}
                alt={`${industry} industry architecture blueprint`}
                width={600}
                height={400}
                loading="lazy"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="h-auto w-full"
              />
              <figcaption className="border-t border-[var(--color-border)] px-5 py-4 text-sm font-medium text-[var(--color-text-secondary)]">
                {industry} industry architecture blueprint
              </figcaption>
            </figure>
          ))}

          <figure
            className={cn(
              'overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]',
              specific.length > 0
                ? 'sm:col-span-2 lg:col-span-3'
                : 'mx-auto w-full max-w-4xl',
            )}
          >
            <Image
              src={GENERIC_ARCH}
              alt="Enterprise reference architecture blueprint"
              width={800}
              height={500}
              loading="lazy"
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="h-auto w-full"
            />
            <figcaption className="border-t border-[var(--color-border)] px-5 py-4 text-sm font-medium text-[var(--color-text-secondary)]">
              Enterprise reference architecture blueprint
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

/* ── Results / metrics band ───────────────────────────────────────── */

export function ResultsChartBand() {
  return (
    <section className="bg-[var(--color-surface-secondary)] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
            Outcomes
          </span>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
            Results at a Glance
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)] md:text-xl">
            The impact visual behind our enterprise engagements.
          </p>
        </div>

        <figure className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-accent-blue)]/10">
          <Image
            src="/images/case-studies/case-study-results-chart.svg"
            alt="Case study results and metrics chart"
            width={600}
            height={400}
            loading="lazy"
            sizes="100vw"
            className="h-auto w-full"
          />
          <figcaption className="border-t border-[var(--color-border)] px-5 py-4 text-sm font-medium text-[var(--color-text-secondary)]">
            Case study results chart
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

/* ── Product showcase — dashboard screenshot ──────────────────────── */

export function DashboardShowcase() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
            Platform Showcase
          </span>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
            Enterprise Platforms in Production
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)] md:text-xl">
            A look inside the products we design, build, and scale.
          </p>
        </div>

        <figure className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-accent-blue)]/10">
          <div className="relative aspect-video">
            <Image
              src="/images/case-studies/case-study-dashboard.webp"
              alt="Enterprise analytics dashboard built by Synova"
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 72rem, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="border-t border-[var(--color-border)] px-5 py-4 text-sm font-medium text-[var(--color-text-secondary)]">
            Enterprise platform dashboard — product showcase
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
