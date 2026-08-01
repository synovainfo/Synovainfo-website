import { prisma } from '@/lib/prisma'
import { CoreValuesClient, type CoreValueItem } from './core-values-client'

// Fallback content used only when the database is unavailable or empty.
// Admins manage the canonical list via the CoreValue model.
const FALLBACK_VALUES: CoreValueItem[] = [
  {
    id: 'innovation',
    title: 'Innovation',
    description:
      "Pioneering solutions that anticipate tomorrow's challenges and unlock new possibilities for enterprise growth.",
    icon: 'lightbulb',
  },
  {
    id: 'excellence',
    title: 'Excellence',
    description:
      'Uncompromising quality in every line of code, every architecture decision, and every client interaction.',
    icon: 'award',
  },
  {
    id: 'partnership',
    title: 'Partnership',
    description:
      'Deep collaboration that transforms vendor relationships into strategic alliances built on trust and shared success.',
    icon: 'handshake',
  },
  {
    id: 'integrity',
    title: 'Integrity',
    description:
      'Transparent communication, ethical practices, and unwavering commitment to client confidentiality.',
    icon: 'shield-check',
  },
]

export async function CoreValues() {
  let values: CoreValueItem[] = FALLBACK_VALUES

  try {
    const dbValues = await prisma.coreValue.findMany({
      where: { status: true },
      orderBy: { order: 'asc' },
      select: { id: true, title: true, description: true, icon: true },
    })

    if (dbValues.length > 0) {
      values = dbValues
    }
  } catch (error) {
    console.error('CoreValues: database fallback engaged:', error)
  }

  return <CoreValuesClient values={values} />
}
