export interface ProcessStage {
  id: string
  title: string
  shortDesc: string
  fullDesc: string
  icon: string
  deliverables: string[]
  duration: string
}

export const processStages: ProcessStage[] = [
  {
    id: 'discovery',
    title: 'Discovery',
    shortDesc: 'Understanding your business needs',
    fullDesc:
      'We begin every engagement with deep discovery — stakeholder interviews, domain workshops, and competitive analysis to map your business landscape. Our team identifies pain points, opportunities, and constraints before any solution is proposed, ensuring absolute alignment between your objectives and our execution strategy.',
    icon: 'Search',
    deliverables: ['Requirements Document', 'Stakeholder Map', 'Feasibility Report'],
    duration: '2 weeks',
  },
  {
    id: 'analysis',
    title: 'Analysis',
    shortDesc: 'Mapping processes and identifying gaps',
    fullDesc:
      'Armed with discovery insights, we perform rigorous business process mapping, technical environment assessment, and gap analysis. Every workflow, integration point, and data dependency is documented and analysed to surface optimisation opportunities and define the precise scope of transformation.',
    icon: 'BarChart3',
    deliverables: ['Process Maps', 'Technical Assessment', 'Gap Analysis Report'],
    duration: '2 weeks',
  },
  {
    id: 'architecture',
    title: 'Architecture',
    shortDesc: 'Designing the technical foundation',
    fullDesc:
      'Our architects translate requirements into a robust, scalable system design. We evaluate technology trade-offs, define microservice boundaries, design data models, and plan for security, observability, and scalability from day one. The result is a blueprint that minimises technical debt and maximises long-term agility.',
    icon: 'Building2',
    deliverables: ['System Architecture', 'Technology Stack', 'Scalability Plan'],
    duration: '3 weeks',
  },
  {
    id: 'design',
    title: 'Design',
    shortDesc: 'Crafting the user experience',
    fullDesc:
      'Design is where function meets form. Through UX research, wireframing, and iterative prototyping, we validate every interaction before a single line of production code is written. Our design system ensures visual consistency, accessibility compliance, and a cohesive brand experience across every touchpoint.',
    icon: 'Palette',
    deliverables: ['UX Research Report', 'Interactive Prototypes', 'Design System'],
    duration: '3 weeks',
  },
  {
    id: 'development',
    title: 'Development',
    shortDesc: 'Building with agile precision',
    fullDesc:
      'We execute through disciplined Agile sprints with continuous integration and delivery. Every feature is developed against acceptance criteria, peer-reviewed through structured code reviews, and automatically tested. Our CI/CD pipelines ensure that working software reaches staging environments multiple times per week with zero regression.',
    icon: 'Code2',
    deliverables: ['Sprint Backlog', 'Code Reviews', 'CI/CD Pipeline'],
    duration: '8–16 weeks',
  },
  {
    id: 'testing',
    title: 'Testing',
    shortDesc: 'Ensuring quality at every layer',
    fullDesc:
      'Quality is not a phase — it is engineered into every deliverable. Our testing pyramid spans unit tests, integration tests, end-to-end automation, performance benchmarks, and security penetration testing. User acceptance testing validates that every feature meets real-world expectations before production deployment.',
    icon: 'ShieldCheck',
    deliverables: ['Test Strategy', 'QA Automation Suite', 'UAT Sign-off'],
    duration: '3 weeks',
  },
  {
    id: 'deployment',
    title: 'Deployment',
    shortDesc: 'Rolling out with confidence',
    fullDesc:
      'Production deployment follows a meticulously documented runbook with phased rollout, automated canary analysis, and instant rollback capabilities. We monitor every metric in real-time, validate end-to-end functionality, and ensure zero-downtime migration for existing systems. A formal go-live checklist guarantees nothing is overlooked.',
    icon: 'Rocket',
    deliverables: ['Deployment Runbook', 'Monitoring Setup', 'Rollback Procedures'],
    duration: '1 week',
  },
  {
    id: 'support',
    title: 'Support',
    shortDesc: 'Optimising and maintaining momentum',
    fullDesc:
      'Our commitment extends well beyond launch. We provide 24/7 proactive monitoring, structured incident response with defined SLAs, performance optimisation, and regular security patching. Quarterly business reviews ensure the platform evolves with your business needs through continuous enhancement and version upgrades.',
    icon: 'Headphones',
    deliverables: ['SLA Agreement', 'Incident Response Plan', 'Quarterly Reviews'],
    duration: 'Ongoing',
  },
]
