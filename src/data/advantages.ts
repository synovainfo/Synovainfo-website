export interface Advantage {
  id: string
  title: string
  description: string
  icon: string // lucide icon name
}

export const advantages: Advantage[] = [
  {
    id: 'experienced',
    title: 'Experienced Team',
    description:
      'Our team brings decades of collective experience across Fortune 500 environments, delivering solutions with architectural rigor.',
    icon: 'Users',
  },
  {
    id: 'scalable',
    title: 'Scalable Architecture',
    description:
      'Built for growth — our solutions scale seamlessly from startup to enterprise without architectural rewrites.',
    icon: 'Layers',
  },
  {
    id: 'security',
    title: 'Security-First',
    description:
      'Every solution is designed with security as a foundational principle, not an afterthought.',
    icon: 'Shield',
  },
  {
    id: 'performance',
    title: 'Performance-Driven',
    description:
      'Optimized for speed, efficiency, and reliability at enterprise scale.',
    icon: 'Zap',
  },
  {
    id: 'support',
    title: '24/7 Support',
    description:
      'Round-the-clock support to ensure your critical systems never skip a beat.',
    icon: 'Headphones',
  },
  {
    id: 'cloud',
    title: 'Cloud Ready',
    description:
      'Cloud-native architectures leveraging AWS, Azure, and GCP for maximum flexibility.',
    icon: 'Cloud',
  },
  {
    id: 'ai-ready',
    title: 'AI Ready',
    description:
      'Integrating machine learning and AI capabilities to future-proof your operations.',
    icon: 'Brain',
  },
  {
    id: 'tech-stack',
    title: 'Modern Tech Stack',
    description:
      'Cutting-edge technologies and frameworks that ensure longevity and maintainability.',
    icon: 'Code2',
  },
]
