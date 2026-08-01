export interface Advantage {
  id: string
  title: string
  description: string
  icon: string // lucide icon name
}

export const advantages: Advantage[] = [
  {
    id: 'experienced',
    title: 'Fortune 500 Engineering Pedigree',
    description:
      'Our senior architects bring decades of collective experience delivering high-availability systems for global enterprises. We enforce strict architectural governance, SOLID principles, and zero-downtime deployment pipelines.',
    icon: 'Users',
  },
  {
    id: 'scalable',
    title: 'Frictionless Hyper-Scalability',
    description:
      'Engineered for unprecedented hyper-growth. Our multi-cloud solutions leverage Kubernetes, event-driven microservices, and auto-scaling infrastructure to seamlessly orchestrate workloads at a massive global scale.',
    icon: 'Layers',
  },
  {
    id: 'security',
    title: 'Zero-Trust Security Paradigms',
    description:
      'Security is foundational, never an afterthought. We implement stringent RBAC, End-to-End encryption, proactive threat modeling, and maintain ecosystems strictly compliant with SOC2, ISO 27001, and HIPAA mandates.',
    icon: 'Shield',
  },
  {
    id: 'performance',
    title: 'Mission-Critical Reliability',
    description:
      'We guarantee 99.999% uptime and sub-millisecond latency. Our CI/CD pipelines enforce rigorous automated E2E testing, chaotic load simulations, and preemptive performance observability via Datadog.',
    icon: 'Zap',
  },
  {
    id: 'support',
    title: '24/7 Enterprise SLAs',
    description:
      'Uncompromising round-the-clock infrastructure governance and rapid incident response. Our dedicated SRE teams ensure absolute business continuity and instantaneous disaster recovery for your critical operations.',
    icon: 'Headphones',
  },
  {
    id: 'cloud',
    title: 'Infrastructure as Code (IaC)',
    description:
      'We eradicate configuration drift and manual provisioning vulnerabilities. Our infrastructure is entirely declarative, leveraging Terraform to orchestrate immutable environments across AWS, Azure, and Google Cloud.',
    icon: 'Cloud',
  },
  {
    id: 'ai-ready',
    title: 'Operationalized AI Synergies',
    description:
      'We transcend AI hype to deliver measurable ROI. We seamlessly integrate predictive modeling, LLMs, and computer vision directly into your core business logic with secure, private, and auditable model deployments.',
    icon: 'Brain',
  },
  {
    id: 'tech-stack',
    title: 'Future-Proof Tech Ecosystem',
    description:
      'We utilize heavily vetted, strictly typed languages (TypeScript, Go, Rust) and proven frameworks (Next.js, Spring Boot) to ensure long-term ecosystem maintainability, uncompromising security, and accelerated developer velocity.',
    icon: 'Code2',
  },
]
