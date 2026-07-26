const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'images');

const assets = [
  // Services
  {
    folder: 'services',
    file: 'service-cloud-native.svg',
    title: 'CLOUD NATIVE KUBERNETES MESH',
    sub: 'Multi-Cloud EKS/AKS Envoy Service Topology',
    c1: '#38bdf8', c2: '#818cf8'
  },
  {
    folder: 'services',
    file: 'service-enterprise-ai.svg',
    title: 'ENTERPRISE RAG & LLM INFERENCE',
    sub: 'Vector Database & Autonomous Agent Workflow',
    c1: '#fbbf24', c2: '#f59e0b'
  },
  {
    folder: 'services',
    file: 'service-cybersecurity.svg',
    title: 'ZERO TRUST SECURITY SHIELD',
    sub: 'Quantum-Safe Encryption & HSM Key Vault',
    c1: '#f43f5e', c2: '#fb7185'
  },
  {
    folder: 'services',
    file: 'service-custom-software.svg',
    title: 'DISTRIBUTED MICROSERVICES ARCHITECTURE',
    sub: 'High-Throughput gRPC & Event Sourcing',
    c1: '#a855f7', c2: '#c084fc'
  },
  {
    folder: 'services',
    file: 'service-data-engineering.svg',
    title: 'REAL-TIME KAFKA STREAM PROCESSING',
    sub: '1,000,000 Events/Sec Data Mesh',
    c1: '#10b981', c2: '#34d399'
  },
  {
    folder: 'services',
    file: 'service-devops-cicd.svg',
    title: 'GITOPS AUTOMATED CI/CD PIPELINE',
    sub: 'Kubeflow & Terraform Infrastructure as Code',
    c1: '#06b6d4', c2: '#22d3ee'
  },
  {
    folder: 'services',
    file: 'service-iot-edge.svg',
    title: 'INDUSTRIAL IOT EDGE GATEWAY',
    sub: 'Sub-10ms Sensor Telemetry Mesh',
    c1: '#ec4899', c2: '#f472b6'
  },

  // Industries
  {
    folder: 'industries',
    file: 'industry-banking-fintech.svg',
    title: 'CORE BANKING & FINTECH API ENGINE',
    sub: '100k TPS ISO 20022 Payment Gateway',
    c1: '#f59e0b', c2: '#fbbf24'
  },
  {
    folder: 'industries',
    file: 'industry-healthcare-medtech.svg',
    title: 'HIPAA FHIR HEALTHCARE PLATFORM',
    sub: 'Medical Imaging AI & Diagnostic Workflows',
    c1: '#06b6d4', c2: '#38bdf8'
  },
  {
    folder: 'industries',
    file: 'industry-retail-ecommerce.svg',
    title: 'HEADLESS COMPOSABLE COMMERCE',
    sub: 'Omnichannel Storefront & GraphQL Mesh',
    c1: '#ec4899', c2: '#a855f7'
  },
  {
    folder: 'industries',
    file: 'industry-smart-manufacturing.svg',
    title: 'SMART FACTORY INDUSTRY 4.0',
    sub: 'Predictive Robotics & Digital Twin',
    c1: '#f97316', c2: '#fb923c'
  },
  {
    folder: 'industries',
    file: 'industry-logistics-supplychain.svg',
    title: 'GLOBAL SUPPLY CHAIN VISIBILITY',
    sub: 'Real-Time Fleet Routing & Telemetry',
    c1: '#3b82f6', c2: '#60a5fa'
  },
  {
    folder: 'industries',
    file: 'industry-energy-utilities.svg',
    title: 'SMART POWER GRID TELEMETRY',
    sub: 'Time-Series Analytics & Grid Load Control',
    c1: '#10b981', c2: '#34d399'
  },
  {
    folder: 'industries',
    file: 'industry-telecom-5g.svg',
    title: '5G TELECOM OPENRAN SLICING',
    sub: 'Low-Latency Network Core Topology',
    c1: '#8b5cf6', c2: '#a78bfa'
  },
  {
    folder: 'industries',
    file: 'industry-insurance-insurtech.svg',
    title: 'AUTOMATED AI CLAIMS PROCESSING',
    sub: 'Instant Underwriting & Fraud Engine',
    c1: '#14b8a6', c2: '#2dd4bf'
  },

  // Case Studies
  {
    folder: 'case-studies',
    file: 'case-study-fintech-arch.svg',
    title: '100k TPS EVENT SOURCING BLUEPRINT',
    sub: 'FinTech Core Banking Architecture',
    c1: '#f59e0b', c2: '#ef4444'
  },
  {
    folder: 'case-studies',
    file: 'case-study-health-arch.svg',
    title: 'HIPAA VECTOR DATA PIPELINE',
    sub: 'Clinical Telehealth Data Mesh',
    c1: '#06b6d4', c2: '#3b82f6'
  },
  {
    folder: 'case-studies',
    file: 'case-study-logistics-arch.svg',
    title: 'EDGE SENSOR TO KAFKA TOPOLOGY',
    sub: 'Autonomous Supply Chain Architecture',
    c1: '#3b82f6', c2: '#10b981'
  },
  {
    folder: 'case-studies',
    file: 'case-study-retail-arch.svg',
    title: 'GRAPHQL FEDERATED SCHEMA MESH',
    sub: 'Composable Retail Blueprint',
    c1: '#ec4899', c2: '#8b5cf6'
  },
  {
    folder: 'case-studies',
    file: 'case-study-energy-arch.svg',
    title: 'TIME-SERIES IOT TELEMETRY PIPELINE',
    sub: 'Smart Power Grid Blueprint',
    c1: '#10b981', c2: '#06b6d4'
  },

  // About
  {
    folder: 'about',
    file: 'company-timeline-vector.svg',
    title: '15-YEAR INNOVATION TIMELINE',
    sub: 'Growth from Core Microservices to Global AI Mesh',
    c1: '#8b5cf6', c2: '#ec4899'
  },
  {
    folder: 'about',
    file: 'core-values-illustration.svg',
    title: 'ENGINEERING EXCELLENCE & TRUST',
    sub: 'Integrity, Scalability, and Client Partnership',
    c1: '#3b82f6', c2: '#06b6d4'
  },
  {
    folder: 'about',
    file: 'global-presence-map.svg',
    title: 'GLOBAL DELIVERY CENTERS MESH',
    sub: '14 Regions Worldwide SLA Delivery',
    c1: '#10b981', c2: '#f59e0b'
  }
];

function generateBespokeSvg(title, sub, c1, c2) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1d" />
      <stop offset="100%" stop-color="#040711" />
    </linearGradient>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>

  <rect width="600" height="400" rx="12" fill="url(#bgGrad)" />
  <rect x="20" y="20" width="560" height="360" rx="8" stroke="url(#primaryGrad)" stroke-width="1.5" stroke-dasharray="6 4" fill="none" opacity="0.6" />

  <!-- Diagram Outer Rings -->
  <circle cx="300" cy="180" r="95" stroke="${c1}" stroke-width="1" stroke-dasharray="4 4" opacity="0.4" />
  <circle cx="300" cy="180" r="70" stroke="${c2}" stroke-width="1.5" opacity="0.8" />
  
  <!-- Core Box -->
  <rect x="220" y="145" width="160" height="70" rx="10" fill="#0f172a" stroke="url(#primaryGrad)" stroke-width="2" />
  <text x="300" y="178" fill="#ffffff" font-family="Inter, sans-serif" font-size="13" font-weight="800" text-anchor="middle">SYNOVA</text>
  <text x="300" y="196" fill="${c1}" font-family="Inter, sans-serif" font-size="9" font-weight="600" text-anchor="middle">ENTERPRISE ENGINE</text>

  <!-- Orbital Nodes based on name -->
  <circle cx="180" cy="110" r="14" fill="${c1}" />
  <circle cx="420" cy="110" r="14" fill="${c2}" />
  <circle cx="180" cy="250" r="14" fill="${c2}" />
  <circle cx="420" cy="250" r="14" fill="${c1}" />

  <line x1="180" y1="110" x2="220" y2="145" stroke="${c1}" stroke-width="1.5" />
  <line x1="420" y1="110" x2="380" y2="145" stroke="${c2}" stroke-width="1.5" />
  <line x1="180" y1="250" x2="220" y2="215" stroke="${c2}" stroke-width="1.5" />
  <line x1="420" y1="250" x2="380" y2="215" stroke="${c1}" stroke-width="1.5" />

  <!-- Bottom Labels -->
  <rect x="40" y="300" width="520" height="55" rx="8" fill="#090e1a" stroke="url(#primaryGrad)" stroke-width="1" opacity="0.9" />
  <text x="300" y="325" fill="#ffffff" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">${title}</text>
  <text x="300" y="343" fill="${c1}" font-family="Inter, sans-serif" font-size="10" font-weight="500" text-anchor="middle">${sub}</text>
</svg>`;
}

assets.forEach(({ folder, file, title, sub, c1, c2 }) => {
  const filepath = path.join(baseDir, folder, file);
  fs.writeFileSync(filepath, generateBespokeSvg(title, sub, c1, c2));
  console.log(`Generated bespoke SVG: ${file}`);
});
