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
  title: 'Orchestrating Digital Paradigms',
  subtitle:
    'We are a consortium of strategic visionaries and enterprise architects dedicated to orchestrating digital transformations that drive sustainable growth, mitigate systemic risk, and redefine industry paradigms.',
  whoWeAre:
    'Synova Infotech is a premier enterprise technology consultancy specializing in massive-scale digital transformation, custom ecosystem development, and AI-driven capability realization. Founded by industry veterans with deep expertise in global architecture, our team brings together decades of collective experience delivering mission-critical outcomes across Fortune 500 environments.',
  vision:
    'To be the definitive strategic technology partner for global enterprises — orchestrating synergistic solutions that unlock shareholder value and create measurable, sustainable market dominance.',
  mission:
    'Empower organizations with enterprise-grade software paradigms that combine cutting-edge agility with uncompromising architectural governance, enabling them to achieve operational excellence and hyper-scalability.',
  incorporated: '30 June 2026',
  headquarters: 'Pune, India',
  directors: 'Amir Khaja Baig · Tazeen Shahnawaz Shaikh · Sachin Nikam',
}

export async function About() {
  let section: Awaited<ReturnType<typeof prisma.homepageSection.findFirst>> = null

  try {
    section = await prisma.homepageSection.findFirst({
      where: { sectionType: 'about', isVisible: true },
    })
  } catch (error) {
    console.error('About: database fallback engaged:', error)
  }

  const content: AboutContent = section?.content
    ? { ...DEFAULT_CONTENT, ...(section.content as Record<string, unknown>) }
    : DEFAULT_CONTENT

  return <AboutClient content={content} />
}
