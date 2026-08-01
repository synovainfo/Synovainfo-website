export interface Technology {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'ai'
  description: string
  icon: string | null
}

export const technologies: Technology[] = [
  // ── Frontend ──────────────────────────────────────────────────
  {
    id: 'react',
    name: 'React',
    category: 'frontend',
    description: 'Component-based UI library',
    icon: 'Code2',
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'frontend',
    description: 'Platform for web applications',
    icon: 'Component',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frontend',
    description: 'Full-stack React framework',
    icon: 'Globe',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    category: 'frontend',
    description: 'Cross-platform UI toolkit',
    icon: 'Smartphone',
  },
  {
    id: 'vuejs',
    name: 'Vue.js',
    category: 'frontend',
    description: 'Progressive JavaScript framework',
    icon: 'Eye',
  },

  // ── Backend ───────────────────────────────────────────────────
  {
    id: 'java',
    name: 'Java',
    category: 'backend',
    description: 'Enterprise-grade runtime',
    icon: 'Coffee',
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    category: 'backend',
    description: 'Microservices framework',
    icon: 'Leaf',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'backend',
    description: 'General-purpose programming',
    icon: 'Terminal',
  },
  {
    id: 'dotnet',
    name: '.NET',
    category: 'backend',
    description: 'Cross-platform framework',
    icon: 'Monitor',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'backend',
    description: 'Server-side JavaScript',
    icon: 'Server',
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'backend',
    description: 'Web scripting language',
    icon: 'FileCode',
  },
  {
    id: 'go',
    name: 'Go',
    category: 'backend',
    description: 'Systems programming language',
    icon: 'Play',
  },

  // ── Database ──────────────────────────────────────────────────
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'database',
    description: 'Advanced relational database',
    icon: 'Database',
  },
  {
    id: 'oracle',
    name: 'Oracle',
    category: 'database',
    description: 'Enterprise database',
    icon: 'Database',
  },
  {
    id: 'sql-server',
    name: 'SQL Server',
    category: 'database',
    description: 'Microsoft RDBMS',
    icon: 'Database',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'database',
    description: 'NoSQL document store',
    icon: 'Database',
  },
  {
    id: 'redis',
    name: 'Redis',
    category: 'database',
    description: 'In-memory data store',
    icon: 'Database',
  },

  // ── Cloud & DevOps ────────────────────────────────────────────
  {
    id: 'aws',
    name: 'AWS',
    category: 'cloud',
    description: 'Amazon Web Services',
    icon: 'Cloud',
  },
  {
    id: 'azure',
    name: 'Azure',
    category: 'cloud',
    description: 'Microsoft cloud platform',
    icon: 'Cloud',
  },
  {
    id: 'gcp',
    name: 'GCP',
    category: 'cloud',
    description: 'Google Cloud Platform',
    icon: 'Cloud',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'cloud',
    description: 'Container platform',
    icon: 'Container',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'cloud',
    description: 'Container orchestration',
    icon: 'Ship',
  },
  {
    id: 'kafka',
    name: 'Kafka',
    category: 'cloud',
    description: 'Event streaming platform',
    icon: 'MessageCircle',
  },

  // ── AI & Emerging Tech ────────────────────────────────────────
  {
    id: 'ai',
    name: 'AI',
    category: 'ai',
    description: 'Artificial Intelligence',
    icon: 'Brain',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    category: 'ai',
    description: 'LLM & generative AI',
    icon: 'Sparkles',
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    category: 'ai',
    description: 'ML framework',
    icon: 'Activity',
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    category: 'ai',
    description: 'Image & video intelligence',
    icon: 'ScanLine',
  },
  {
    id: 'iot',
    name: 'IoT',
    category: 'ai',
    description: 'Internet of Things',
    icon: 'Wifi',
  },
  {
    id: 'qr',
    name: 'QR',
    category: 'ai',
    description: 'QR & barcode solutions',
    icon: 'Scan',
  },
]

export const categoryMeta: Record<
  Technology['category'],
  { label: string; description: string }
> = {
  frontend: {
    label: 'Frontend',
    description: 'Modern UI frameworks and libraries',
  },
  backend: {
    label: 'Backend',
    description: 'Server-side languages and frameworks',
  },
  database: {
    label: 'Database',
    description: 'Relational and NoSQL data stores',
  },
  cloud: {
    label: 'Cloud & DevOps',
    description: 'Infrastructure, containers, and orchestration',
  },
  ai: {
    label: 'AI & Emerging Tech',
    description: 'Artificial intelligence and emerging technologies',
  },
}
