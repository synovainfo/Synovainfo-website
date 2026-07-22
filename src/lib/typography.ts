/**
 * Synova Design System — Typography Scale
 *
 * Consistent type scale used across the application.
 * Maps to Tailwind utility classes for production consistency.
 *
 * h1: text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight
 * h2: text-4xl md:text-5xl font-bold tracking-tight
 * h3: text-2xl md:text-3xl font-semibold
 * h4: text-xl md:text-2xl font-semibold
 * body: text-base md:text-lg
 * bodySmall: text-sm md:text-base
 * caption: text-xs md:text-sm
 * overline: text-xs uppercase tracking-widest font-semibold
 * lead: text-lg md:text-xl
 */

export const typography = {
  /** Display heading — Hero sections, landing page titles */
  h1: 'text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight',
  /** Section heading — Major section titles */
  h2: 'text-4xl md:text-5xl font-bold tracking-tight',
  /** Subsection heading — Card titles, feature headings */
  h3: 'text-2xl md:text-3xl font-semibold',
  /** Minor heading — List item titles, modal titles */
  h4: 'text-xl md:text-2xl font-semibold',
  /** Default body text — Paragraphs, descriptions */
  body: 'text-base md:text-lg',
  /** Secondary body text — Metadata, details */
  bodySmall: 'text-sm md:text-base',
  /** Caption — Image captions, small labels */
  caption: 'text-xs md:text-sm',
  /** Overline — Section labels, eyebrow text */
  overline: 'text-xs uppercase tracking-widest font-semibold',
  /** Lead paragraph — Intro text, featured content */
  lead: 'text-lg md:text-xl',
} as const

/** Type for all available typography variants */
export type TypographyVariant = keyof typeof typography

/** Semantic font family classes */
export const fontFamily = {
  sans: 'font-sans',
  heading: 'font-heading',
  mono: 'font-mono',
} as const
