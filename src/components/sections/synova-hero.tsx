import { SynovaHeroClient, type SynovaHeroContent } from './synova-hero-client'

const heroContent: SynovaHeroContent = {
  eyebrow: 'ENTERPRISE ARCHITECTURE & CLOUD TRANSFORMATION',
  headline: 'ARCHITECTING NEXT-GENERATION DIGITAL PARADIGMS',
  description:
    'Synova empowers global enterprises to unlock synergistic value and achieve unprecedented operational agility. We orchestrate secure, scalable, and mission-critical technological ecosystems designed to dominate market complexities and accelerate digital transformation.',
  ctaLabel: 'Explore Capabilities',
  ctaHref: '/services',
  cardTag: '[ 2026 ]',
  cardHeadlinePrefix: 'Securing',
  cardHeadlineAccent: 'Global',
  cardHeadlineSuffix: 'Operations',
  cardDescription: 'Delivering 99.999% uptime for enterprise clients worldwide.',
}

export function SynovaHero() {
  return <SynovaHeroClient content={heroContent} />
}
