import type { ReactNode } from 'react'

export interface SolutionItem {
  id: string
  title: string
  subtitle: string
  badge: string
  iconName: string
  overview: string
  businessProblems: string[]
  architectureHighlights: string[]
  quantifiedImpact: string
  photo?: {
    src: string
    alt: string
  }
}

export const SOLUTIONS: SolutionItem[] = [
  {
    id: 'cloud-modernization',
    title: 'Enterprise Cloud Modernization & Hybrid Grid',
    subtitle: 'Scale legacy architectures into resilient, multi-cloud microservices grids',
    badge: 'Infrastructure Architecture',
    iconName: 'Cloud',
    overview:
      'We re-architect monolithic legacy cores into cloud-native microservices architectures, leveraging automated Kubernetes orchestration, zero-downtime CI/CD pipelines, and multi-region failover topology.',
    businessProblems: [
      'High maintenance costs and vendor lock-in from monolithic architectures',
      'Unpredictable cloud spend and sub-optimal workload placement',
      'Brittle deployment pipelines causing service interruptions during peak traffic',
    ],
    architectureHighlights: [
      'Multi-region Kubernetes deployment with automated pod autoscaling',
      'Infrastructure as Code (Terraform & Pulumi) with policy-as-code enforcement',
      'FinOps cost governance engines reducing infrastructure waste by up to 34%',
    ],
    quantifiedImpact: '99.999% SLA Uptime & 40% Operational Cost Reduction',
    photo: {
      src: '/images/solutions/coding-workspace.webp',
      alt: 'Engineering team building high-throughput data streaming pipelines in a modern workspace',
    },
  },
  {
    id: 'data-engineering',
    title: 'High-Throughput Data Platform & Telemetry Engine',
    subtitle: 'Streamline real-time analytics and petabyte-scale data pipelines',
    badge: 'Data Intelligence',
    iconName: 'Database',
    overview:
      'Engineered for Fortune 500 data volumes, our data solutions unite Apache Kafka, Snowflake, and Spark into unified real-time event streaming architectures with sub-second latency.',
    businessProblems: [
      'Siloed transactional databases preventing real-time business decision-making',
      'Slow batch ETL processes delaying executive dashboards and regulatory reporting',
      'Lack of unified data governance and automated data quality validation',
    ],
    architectureHighlights: [
      'Event-driven streaming bus supporting 500k+ events/sec',
      'Automated data lineage and zero-trust column-level encryption',
      'Real-time anomaly detection pipelines integrated with enterprise SIEM',
    ],
    quantifiedImpact: '<100ms Query Latency across 50TB+ Datasets',
    photo: {
      src: '/images/solutions/coding-workspace.webp',
      alt: 'Engineering team building high-throughput data streaming pipelines in a modern workspace',
    },
  },
  {
    id: 'ai-ml-infrastructure',
    title: 'Enterprise AI Infrastructure & LLM Orchestration',
    subtitle: 'Deploy secure, domain-specific AI agents and vector retrieval pipelines',
    badge: 'Cognitive Computing',
    iconName: 'Cpu',
    overview:
      'Construct enterprise RAG (Retrieval-Augmented Generation) systems and custom model pipelines with strict data privacy boundaries, ensuring enterprise IP is never exposed to public LLM models.',
    businessProblems: [
      'Security risks when exposing sensitive IP to public generative AI APIs',
      'Hallucination and inaccuracy in un-grounded internal search systems',
      'High latency and compute overhead when running large language models in-house',
    ],
    architectureHighlights: [
      'Isolated VPC vector database clusters (pgvector, Qdrant)',
      'Fine-tuned open-weights models (Llama 3, Mistral) deployed on dedicated GPUs',
      'Role-based semantic access control filtering retrieval contexts dynamically',
    ],
    quantifiedImpact: '3.8x Faster Enterprise Workflow Automation',
    photo: {
      src: '/images/solutions/ai-tech.webp',
      alt: 'Enterprise AI infrastructure with GPU-accelerated machine learning compute clusters',
    },
  },
  {
    id: 'zero-trust-security',
    title: 'Zero-Trust Cyber Defense & Compliance Shield',
    subtitle: 'Embed security into continuous deployment pipelines and identity perimeters',
    badge: 'Security Engineering',
    iconName: 'ShieldCheck',
    overview:
      'Deploy identity-first perimeter defense, continuous vulnerability posture management, and automated SOC 2 / ISO 27001 audit logging across all hybrid cloud environments.',
    businessProblems: [
      'Expanding attack surfaces caused by rapid multi-cloud adoption',
      'Manual, time-consuming compliance audits consuming engineering bandwidth',
      'Lateral movement vulnerabilities in flat legacy networks',
    ],
    architectureHighlights: [
      'Microsegmentation and mutual TLS (mTLS) enforcement across all services',
      'Automated Secrets Management with Vault and hardware security modules (HSM)',
      'Real-time automated compliance drift tracking and auto-remediation triggers',
    ],
    quantifiedImpact: '100% Audit Readiness & 0 Unsanctioned Data Transfers',
    photo: {
      src: '/images/solutions/cyber-security.webp',
      alt: 'Security operations center monitoring zero-trust cyber defense systems',
    },
  },
]
