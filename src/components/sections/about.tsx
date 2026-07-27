import { prisma } from '@/lib/prisma'
import { AboutClient } from './about-client'

interface AboutContent {
  whoWeAre?: string
  vision?: string
  mission?: string
  incorporated?: string
  headquarters?: string
  directors?: string
  badge?: string
  title?: string
  subtitle?: string
}

const DEFAULT_CONTENT: AboutContent = {
  badge: 'About Synova Infotech',
  title: 'Engineering Enterprise Technology',
  subtitle:
    'We are a team of architects, engineers, and problem-solvers dedicated to building technology that powers business transformation.',
  whoWeAre:
    'Synova Infotech is a Pune-based enterprise technology company specializing in digital transformation, custom software development, and AI-driven solutions. Founded by industry professionals with deep expertise in enterprise architecture, our team brings together decades of collective experience across Fortune 500 environments.',
  vision:
    'To be the most trusted technology partner for enterprises seeking digital transformation — delivering solutions that create measurable business impact.',
  mission:
    'Empower organizations with enterprise-grade software solutions that combine scalable technology with robust architecture, enabling them to achieve measurable operational excellence and sustainable growth.',
  incorporated: '30 June 2026',
  headquarters: 'Pune, India',
  directors: 'Amir Khaja Baig · Tazeen Shahnawaz Shaikh',
}

export async function About() {
  const section = await prisma.homepageSection.findFirst({
    where: { sectionType: 'about', isVisible: true },
  })

  const content: AboutContent = section?.content
    ? { ...DEFAULT_CONTENT, ...(section.content as Record<string, unknown>) }
    : DEFAULT_CONTENT

  return <AboutClient content={content} />
}
