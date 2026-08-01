import Image from 'next/image'

/* ------------------------------------------------------------------ */
/*  About page imagery — all assets live in /public/images/about.      */
/*  Photos use next/image `fill` inside aspect-ratio containers;       */
/*  SVGs use intrinsic width/height. Captions derive from asset        */
/*  filenames only — no fabricated names, quotes, or statistics.       */
/*  Styling follows the About page tokens (accent blue / emerald).     */
/* ------------------------------------------------------------------ */

/* ── Hero visual (LCP → priority) ─────────────────────────────────── */

export function HeroVisual() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-accent-blue)]/10">
      <Image
        src="/images/about/about-hero.png"
        alt="Synova team collaborating in a modern enterprise office"
        width={1373}
        height={429}
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="h-auto w-full object-cover"
      />
    </div>
  )
}

/* ── Headquarters photo (Who We Are section) ──────────────────────── */

export function HqPhoto() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[var(--color-border)]">
      <Image
        src="/images/about/about-headquarters.webp"
        alt="Synova corporate headquarters"
        fill
        loading="lazy"
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="object-cover"
      />
    </div>
  )
}

/* ── Mission illustration (Mission card) ──────────────────────────── */

export function MissionVisual() {
  return (
    <Image
      src="/images/about/mission-illustration.svg"
      alt="Illustration of Synova's mission to empower organizations with enterprise technology"
      width={500}
      height={400}
      loading="lazy"
      sizes="(min-width: 1024px) 25vw, 100vw"
      className="h-auto w-full"
    />
  )
}

/* ── Inside Synova — office + team photo split band ───────────────── */

export function TeamOfficeBand() {
  return (
    <section className="bg-[var(--color-surface-secondary)] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
            Inside Synova
          </span>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
            Where Enterprise Technology Comes to Life
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/about/office-interior.webp"
                alt="Modern Synova office interior with collaborative workspaces"
                fill
                loading="lazy"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-[var(--color-border)] px-5 py-4 text-sm font-medium text-[var(--color-text-secondary)]">
              Modern workspaces built for collaboration
            </figcaption>
          </figure>

          <figure className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/about/tech-team.webp"
                alt="Synova technology team collaborating on enterprise software"
                fill
                loading="lazy"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-[var(--color-border)] px-5 py-4 text-sm font-medium text-[var(--color-text-secondary)]">
              Engineering teams shipping enterprise solutions
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

/* ── Our Journey — timeline illustrations ─────────────────────────── */

export function JourneySection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
            Our Journey
          </span>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
            Milestones That Shaped Us
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)] md:text-xl">
            From our founding vision to the enterprise platform we are today — a timeline of deliberate growth.
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-3xl overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <Image
            src="/images/about/company-timeline-vector.svg"
            alt="Synova enterprise innovation timeline illustration"
            width={600}
            height={400}
            loading="lazy"
            sizes="(min-width: 1024px) 48rem, 100vw"
            className="h-auto w-full"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <Image
            src="/images/about/timeline-illustration.svg"
            alt="Illustration of Synova journey milestones — founding, growth, expansion, and innovation"
            width={800}
            height={300}
            loading="lazy"
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  )
}

/* ── Leadership — 4 portrait cards (role captions only, no names) ─── */

const LEADERSHIP = [
  { src: '/images/about/leadership/ceo-marcus.webp', role: 'Chief Executive Officer' },
  { src: '/images/about/leadership/cto-priya.webp', role: 'Chief Technology Officer' },
  { src: '/images/about/leadership/cro-viktor.webp', role: 'Chief Revenue Officer' },
  { src: '/images/about/leadership/ciso-amara.webp', role: 'Chief Information Security Officer' },
] as const

export function LeadershipSection() {
  return (
    <section className="bg-[var(--color-surface-secondary)] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
            Our Leadership
          </span>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
            Experienced Leadership, Enterprise Focus
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)] md:text-xl">
            The executive team steering Synova&apos;s strategy, engineering, growth, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERSHIP.map(({ src, role }) => (
            <figure
              key={src}
              className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={src}
                  alt={`Portrait of the ${role}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="border-t border-[var(--color-border)] px-4 py-4 text-center">
                <p className="text-sm font-semibold text-[var(--color-text)]">{role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Global Presence + Corporate Sustainability ───────────────────── */

export function GlobalReachSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-[var(--color-accent-blue)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-blue)]">
            Global Presence
          </span>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
            Delivering Globally, Committed Responsibly
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <Image
              src="/images/about/global-presence-map.svg"
              alt="Illustration of Synova global delivery network"
              width={600}
              height={400}
              loading="lazy"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full"
            />
            <figcaption className="border-t border-[var(--color-border)] px-5 py-4 text-sm font-medium text-[var(--color-text-secondary)]">
              A worldwide delivery mesh serving enterprises across regions
            </figcaption>
          </figure>

          <figure className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <Image
              src="/images/about/corporate-sustainability-badge.svg"
              alt="Synova corporate sustainability badge"
              width={600}
              height={400}
              loading="lazy"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full"
            />
            <figcaption className="border-t border-[var(--color-border)] px-5 py-4 text-sm font-medium text-[var(--color-text-secondary)]">
              Corporate sustainability — part of our commitment to responsible enterprise technology
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

/* ── Core Values illustrations (dark band) ────────────────────────── */

export function ValuesVisuals() {
  return (
    <div className="mx-auto mb-12 grid max-w-4xl gap-6 sm:grid-cols-2 md:mb-16">
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <Image
          src="/images/about/core-values-illustration.svg"
          alt="Illustration of Synova core values — integrity, scalability, and client partnership"
          width={600}
          height={400}
          loading="lazy"
          sizes="(min-width: 640px) 50vw, 100vw"
          className="h-auto w-full"
        />
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <Image
          src="/images/about/values-illustration.svg"
          alt="Illustration of core values including integrity, innovation, and teamwork"
          width={500}
          height={400}
          loading="lazy"
          sizes="(min-width: 640px) 50vw, 100vw"
          className="h-auto w-full"
        />
      </div>
    </div>
  )
}
