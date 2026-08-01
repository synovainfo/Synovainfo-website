import { prisma } from '@/lib/prisma'
import { TestimonialsClient } from './testimonials-client'

import { testimonials as defaultTestimonials } from '@/data/testimonials'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

export async function Testimonials() {
  let testimonials: Awaited<ReturnType<typeof prisma.testimonial.findMany>> = []
  let section: Awaited<ReturnType<typeof prisma.homepageSection.findFirst>> = null

  try {
    ;[testimonials, section] = await Promise.all([
      prisma.testimonial.findMany({
        where: { status: true },
        orderBy: { order: 'asc' },
      }),
      prisma.homepageSection.findFirst({
        where: { sectionType: 'testimonials', isVisible: true },
      }),
    ])
  } catch (error) {
    console.error('Testimonials: database fallback engaged:', error)
  }

  const badge = (section?.content as Record<string, string> | null)?.badge ?? 'Client Testimonials'
  const title = section?.title ?? 'Trusted by Enterprise Leaders'
  const subtitle =
    (section?.content as Record<string, string> | null)?.subtitle ??
    'Hear from the technology leaders who partner with us to drive their digital transformation initiatives.'

  const mapped = testimonials.length > 0
    ? testimonials.map((t, i) => {
        const imageIndex = (i % 3) + 1
        return {
          id: t.id,
          quote: t.quote,
          name: t.author,
          title: t.title ?? '',
          company: t.company ?? '',
          initials: getInitials(t.author),
          imageUrl: t.imageUrl ?? `/images/home/executive-${imageIndex}.png`,
        }
      })
    : defaultTestimonials.map((t, i) => {
        const imageIndex = (i % 3) + 1
        return {
          ...t,
          imageUrl: `/images/home/executive-${imageIndex}.png`,
        }
      })

  return (
    <TestimonialsClient
      testimonials={mapped}
      badge={badge}
      title={title}
      subtitle={subtitle}
    />
  )
}
