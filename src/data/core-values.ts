export interface CoreValue {
  id: string
  icon: string
  title: string
  description: string
}

/**
 * Seed data for the `CoreValue` table.
 * `icon` stores the LucideIcon component name (resolved via src/lib/resolve-icon.ts).
 * Admin-editable via the admin panel; these values are also used as the
 * static fallback when the database is unavailable.
 */
export const coreValues: CoreValue[] = [
  {
    id: 'innovation',
    icon: 'Lightbulb',
    title: 'Innovation',
    description:
      "Pioneering solutions that anticipate tomorrow's challenges and unlock new possibilities for enterprise growth.",
  },
  {
    id: 'excellence',
    icon: 'Award',
    title: 'Excellence',
    description:
      'Uncompromising quality in every line of code, every architecture decision, and every client interaction.',
  },
  {
    id: 'partnership',
    icon: 'Handshake',
    title: 'Partnership',
    description:
      'Deep collaboration that transforms vendor relationships into strategic alliances built on trust and shared success.',
  },
  {
    id: 'integrity',
    icon: 'ShieldCheck',
    title: 'Integrity',
    description:
      'Transparent communication, ethical practices, and unwavering commitment to client confidentiality.',
  },
]
