import type { LucideIcon } from 'lucide-react'
import {
  Code2,
  Sliders,
  Package,
  Truck,
  FileCheck,
  Users,
  Smartphone,
  ClipboardCheck,
  Shield,
  FileSearch,
  UserPlus,
  ShoppingCart,
  QrCode,
  Monitor,
  UserCheck,
  Eye,
  Wrench,
} from 'lucide-react'

export interface Service {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  icon: LucideIcon
  category: 'development' | 'management' | 'solutions' | 'support'
  technologies: string[]
  industries: string[]
  benefits: string[]
  businessOutcomes: string[]
}

export const services: Service[] = [
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    shortDescription:
      'End-to-end bespoke software engineering tailored to your enterprise workflows and scalability goals.',
    fullDescription:
      'We architect and build custom enterprise software that maps precisely to your business processes — not the other way around. From discovery and domain modelling through CI/CD deployment and beyond, our full-stack engineers deliver secure, high-performance applications using modern frameworks, microservices architecture, and cloud-native infrastructure. Every solution is designed for horizontal scalability, audit compliance, and long-term maintainability.',
    icon: Code2,
    category: 'development',
    technologies: ['Java', 'Spring Boot', 'React', 'Node.js', 'Python', 'Kubernetes', 'PostgreSQL'],
    industries: ['Manufacturing', 'Healthcare', 'Logistics', 'Finance', 'Retail'],
    benefits: [
      'Tailored to your exact business processes — no workflow compromises',
      'Enterprise-grade security baked in from day one',
      'Cloud-native architecture that scales horizontally on demand',
    ],
    businessOutcomes: [
      '40% faster operational throughput within 6 months',
      '60% reduction in manual data entry and processing errors',
      '3× ROI within 18 months of deployment',
    ],
  },
  {
    id: 'software-customization',
    title: 'Software Customization',
    shortDescription:
      'Extend and tailor existing enterprise platforms to eliminate workflow gaps without rip-and-replace.',
    fullDescription:
      'Rather than forcing your team to adapt to off-the-shelf software limitations, we customise existing platforms — ERP, CRM, HRMS, or proprietary systems — to match your operational reality. Our approach includes plugin development, API integration, UI/UX overhauls, workflow automation, and legacy module enhancement. We extend the life and value of your current software investments while minimising business disruption.',
    icon: Sliders,
    category: 'development',
    technologies: ['Java', 'Python', 'REST APIs', 'GraphQL', 'Docker', 'Jenkins'],
    industries: ['Manufacturing', 'Healthcare', 'Finance', 'Government', 'Education'],
    benefits: [
      'Preserve existing software investments — no costly replacements',
      'Minimal downtime during customisation and rollout',
      'Seamless integration with your existing data pipelines',
    ],
    businessOutcomes: [
      '70% faster time-to-value vs. building from scratch',
      '50% reduction in workaround processes and manual patches',
      'Extended platform lifecycle by 3–5 years',
    ],
  },
  {
    id: 'asset-management',
    title: 'Asset Management Solutions',
    shortDescription:
      'Comprehensive digital asset lifecycle management from procurement through decommissioning.',
    fullDescription:
      'Our asset management platform gives enterprises real-time visibility into every physical and digital asset across the organisation. We implement automated tracking, depreciation calculation, maintenance scheduling, audit trails, and compliance reporting — all within a unified dashboard. RFID and barcode integration enable instant inventory reconciliation, while predictive analytics flag maintenance needs before they become critical failures.',
    icon: Package,
    category: 'solutions',
    technologies: ['React', 'Node.js', 'MongoDB', 'RFID APIs', 'Power BI', 'AWS'],
    industries: ['Manufacturing', 'IT Services', 'Healthcare', 'Energy', 'Telecom'],
    benefits: [
      'Single source of truth for all asset data across locations',
      'Automated depreciation and compliance reporting',
      'Predictive maintenance alerts reduce unplanned downtime',
    ],
    businessOutcomes: [
      '35% reduction in asset downtime through predictive maintenance',
      '25% lower total cost of ownership over asset lifecycle',
      '100% audit-ready compliance reporting at any time',
    ],
  },
  {
    id: 'logistics-management',
    title: 'Logistics Management',
    shortDescription:
      'End-to-end logistics orchestration with real-time tracking, route optimization, and warehouse automation.',
    fullDescription:
      'We deliver a unified logistics management ecosystem that connects warehouse operations, fleet management, last-mile delivery, and supply chain analytics into a single pane of glass. Real-time GPS tracking, dynamic route optimisation, load balancing, and automated dispatch ensure every shipment reaches its destination faster and at lower cost. Our platform integrates with major 3PL providers and supports multi-modal transportation planning.',
    icon: Truck,
    category: 'solutions',
    technologies: ['Node.js', 'React', 'PostgreSQL', 'Google Maps API', 'Redis', 'Docker'],
    industries: ['Logistics', 'E-Commerce', 'Manufacturing', 'Retail', 'Automotive'],
    benefits: [
      'Real-time visibility across the entire supply chain',
      'AI-powered route optimisation reduces fuel and time costs',
      'Seamless integration with existing ERP and WMS systems',
    ],
    businessOutcomes: [
      '30% reduction in fuel and fleet operational costs',
      '50% faster last-mile delivery through smart dispatching',
      '99.5% on-time delivery rate with automated SLA monitoring',
    ],
  },
  {
    id: 'software-licensing',
    title: 'Software Licensing',
    shortDescription:
      'Enterprise license lifecycle management ensuring compliance, optimization, and cost control.',
    fullDescription:
      'Our software licensing solutions help enterprises manage the complete lifecycle of software entitlements — from procurement and deployment to renewal and retirement. We provide centralised license repository management, usage metering, compliance gap analysis, vendor entitlement reconciliation, and renewal forecasting. Our analytics engine identifies under-utilised licenses for reallocation and over-deployment risks before audit windows.',
    icon: FileCheck,
    category: 'management',
    technologies: ['Python', 'React', 'PostgreSQL', 'PowerShell', 'Tableau'],
    industries: ['IT Services', 'Finance', 'Healthcare', 'Education', 'Government'],
    benefits: [
      'Eliminate license compliance risk and audit exposure',
      'Optimise license spend through usage analytics',
      'Automated renewal tracking eliminates grace-period lapses',
    ],
    businessOutcomes: [
      '40% reduction in software licensing overspend',
      'Zero audit non-compliance incidents across managed estate',
      '30% improvement in license utilisation rates',
    ],
  },
  {
    id: 'vendor-management',
    title: 'Vendor Management',
    shortDescription:
      'Strategic vendor lifecycle management with performance tracking, contract governance, and risk scoring.',
    fullDescription:
      'Our vendor management platform transforms chaotic supplier relationships into a strategic advantage. We centralise vendor onboarding, contract management, SLA tracking, performance scorecards, and risk profiling into a single system. Automated workflows handle vendor assessments, compliance documentation, invoice reconciliation, and periodic review cycles. Built-in analytics provide spend aggregation, vendor concentration heatmaps, and negotiation intelligence.',
    icon: Users,
    category: 'management',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Power BI', 'DocuSign API'],
    industries: ['Manufacturing', 'Retail', 'Healthcare', 'Government', 'Energy'],
    benefits: [
      'Centralised vendor data eliminates silos and duplication',
      'Automated SLA monitoring with real-time breach alerts',
      'Data-driven negotiation backed by spend analytics',
    ],
    businessOutcomes: [
      '25% reduction in vendor-related operational overhead',
      '20% improvement in vendor SLA compliance rates',
      '15% cost savings through strategic spend consolidation',
    ],
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    shortDescription:
      'Cross-platform and native mobile applications engineered for performance, security, and user delight.',
    fullDescription:
      'We design and develop enterprise-grade mobile applications for iOS and Android — both native and cross-platform — that extend your business capabilities to wherever your teams and customers are. Our mobile solutions include offline-first architecture, biometric authentication, push notification ecosystems, real-time synchronisation, and deep analytics instrumentation. Every app is built with accessibility standards and performance optimisation as non-negotiable requirements.',
    icon: Smartphone,
    category: 'development',
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'GraphQL'],
    industries: ['Healthcare', 'E-Commerce', 'Logistics', 'Finance', 'Education'],
    benefits: [
      'Offline-first architecture ensures productivity without connectivity',
      'Biometric and SSO authentication for enterprise-grade security',
      'Push notification engine for real-time user engagement',
    ],
    businessOutcomes: [
      '3× increase in mobile employee productivity with field apps',
      '60% faster customer response times through mobile enablement',
      '4.8+ average app store rating across delivered applications',
    ],
  },
  {
    id: 'workflow-approval',
    title: 'Workflow Approval',
    shortDescription:
      'Configurable approval orchestration engine that automates multi-stage business decisions.',
    fullDescription:
      'Our workflow approval engine eliminates bottlenecks in your business processes by automating multi-tier approval chains — purchase orders, leave requests, expense reports, contract sign-offs, and compliance checkpoints. The platform features drag-and-drop workflow designer, conditional routing, escalation rules, SLA timers, and full audit logging. Approvers receive notifications across email, mobile push, and in-app channels with one-tap approve/reject actions.',
    icon: ClipboardCheck,
    category: 'management',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'ELK Stack'],
    industries: ['Manufacturing', 'Healthcare', 'Finance', 'Government', 'IT Services'],
    benefits: [
      'Visual workflow designer — no coding required to build approval chains',
      'Automatic escalation on SLA breach keeps processes moving',
      'Complete audit trail for every approval decision',
    ],
    businessOutcomes: [
      '80% faster approval cycle times across all business processes',
      'Zero lost approvals through automated escalation and reminders',
      '100% audit-ready approval history with timestamped evidence',
    ],
  },
  {
    id: 'quality-management',
    title: 'Quality Management',
    shortDescription:
      'Integrated QMS platform for ISO-compliant quality planning, control, assurance, and improvement.',
    fullDescription:
      'Our quality management system digitises and automates your entire quality framework — document control, non-conformance tracking, CAPA management, internal audits, supplier quality, and customer feedback loops. The platform is pre-configured for ISO 9001, ISO 13485, and IATF 16949 compliance but fully customisable to your industry standards. Real-time dashboards give quality managers instant visibility into defect trends, audit findings, and quality KPIs.',
    icon: Shield,
    category: 'management',
    technologies: ['React', 'Python', 'PostgreSQL', 'Tableau', 'Docker', 'S3'],
    industries: ['Manufacturing', 'Healthcare', 'Pharma', 'Automotive', 'Food Processing'],
    benefits: [
      'Pre-built compliance templates for ISO and industry standards',
      'Real-time quality KPI dashboards for management reviews',
      'Closed-loop CAPA management with root cause analysis tools',
    ],
    businessOutcomes: [
      '50% reduction in non-conformance incidents within first year',
      '40% faster audit preparation with centralised document control',
      '35% improvement in first-pass yield through data-driven quality',
    ],
  },
  {
    id: 'hr-resume-screening',
    title: 'HR Resume Screening',
    shortDescription:
      'AI-powered resume parsing and candidate matching that accelerates hiring decisions.',
    fullDescription:
      'Our intelligent resume screening platform leverages natural language processing and machine learning to parse thousands of resumes in minutes, extract key candidate attributes, and match them against job descriptions with precision scoring. The system learns from recruiter feedback to continuously improve matching accuracy. Integration with major ATS platforms ensures seamless workflow embedding, while bias-detection algorithms promote fair hiring practices.',
    icon: FileSearch,
    category: 'management',
    technologies: ['Python', 'TensorFlow', 'Node.js', 'React', 'PostgreSQL', 'Elasticsearch'],
    industries: ['IT Services', 'Finance', 'Healthcare', 'Manufacturing', 'Staffing'],
    benefits: [
      'AI-powered parsing handles 30+ resume formats with 98% accuracy',
      'Bias detection algorithms promote equitable candidate evaluation',
      'Seamless two-way sync with major ATS platforms',
    ],
    businessOutcomes: [
      '80% reduction in manual resume screening effort',
      '3× faster time-to-shortlist for critical positions',
      '40% improvement in quality-of-hire through precision matching',
    ],
  },
  {
    id: 'smart-onboarding',
    title: 'Smart Onboarding',
    shortDescription:
      'Automated employee onboarding platform that delivers consistent, engaging new-hire experiences.',
    fullDescription:
      'Our smart onboarding solution transforms the new-hire experience from paperwork chaos to a structured, engaging journey. Pre-boarding document collection, role-based learning paths, equipment provisioning workflows, buddy assignments, and milestone-based check-ins are all orchestrated through a single platform. Managers gain real-time visibility into onboarding progress, while new employees receive a personalised portal that guides their first 90 days.',
    icon: UserPlus,
    category: 'solutions',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'SendGrid API', 'Slack API', 'Docker'],
    industries: ['IT Services', 'Finance', 'Healthcare', 'Manufacturing', 'Retail'],
    benefits: [
      'Pre-boarding automation eliminates day-one paperwork bottlenecks',
      'Role-based learning paths accelerate time-to-productivity',
      'Real-time onboarding dashboard for HR and managers',
    ],
    businessOutcomes: [
      '50% reduction in new-hire administrative overhead',
      '30% faster employee time-to-productivity',
      '85% improvement in new-hire satisfaction scores',
    ],
  },
  {
    id: 'smart-procurement',
    title: 'Smart Procurement',
    shortDescription:
      'AI-driven procurement platform automating source-to-contract and purchase-to-pay workflows.',
    fullDescription:
      'Our smart procurement platform digitises and optimises the entire procurement lifecycle — from requisition and sourcing through contract management and payment. AI-powered spend classification, supplier recommendation engines, automated PO matching with invoices (three-way matching), and contract compliance monitoring ensure every procurement decision is data-backed and policy-compliant. Built-in analytics provide category management insights and savings opportunity identification.',
    icon: ShoppingCart,
    category: 'solutions',
    technologies: ['React', 'Python', 'Node.js', 'PostgreSQL', 'Redis', 'Tableau'],
    industries: ['Manufacturing', 'Retail', 'Healthcare', 'Energy', 'Government'],
    benefits: [
      'Three-way matching automation eliminates invoice discrepancies',
      'AI-powered spend classification for actionable procurement insights',
      'Policy-based approval workflows enforce compliance automatically',
    ],
    businessOutcomes: [
      '35% reduction in procurement processing costs',
      '20% improvement in contract compliance rates',
      '40% faster purchase-to-pay cycle time',
    ],
  },
  {
    id: 'qr-label-solutions',
    title: 'QR Label Solutions',
    shortDescription:
      'Enterprise QR label generation, tracking, and scanning ecosystem for inventory and traceability.',
    fullDescription:
      'We provide a complete QR/barcode label management ecosystem covering design, generation, batch printing, and scan-based tracking across the supply chain. Each label carries encoded product, batch, and location data that feeds directly into your inventory, quality, and logistics systems. Real-time scan analytics provide visibility into product movement, shelf-life monitoring, counterfeit detection, and recall readiness.',
    icon: QrCode,
    category: 'solutions',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Zebra API', 'AWS Lambda', 'Docker'],
    industries: ['Manufacturing', 'Logistics', 'Pharma', 'Retail', 'Food & Beverage'],
    benefits: [
      'Batch and serialisation support for full traceability',
      'Real-time scan analytics with geolocation tracking',
      'Integration with existing ERP, WMS, and QMS platforms',
    ],
    businessOutcomes: [
      '100% product traceability from manufacture to point-of-sale',
      '75% faster recall response with instant batch location data',
      'Zero manual data entry errors in inventory tracking',
    ],
  },
  {
    id: 'it-asset-management',
    title: 'IT Asset Management',
    shortDescription:
      'Hardware and software asset lifecycle management with compliance tracking and cost optimization.',
    fullDescription:
      'Our ITAM solution provides comprehensive visibility into your technology estate — desktops, servers, network equipment, cloud resources, and software licenses. Automated discovery agents inventory all connected assets, while lifecycle tracking covers procurement, provisioning, moves, changes, and retirement. Software license reconciliation prevents over-deployment, and hardware warranty/support tracking ensures timely renewals. Integrated CMDB provides the foundation for ITSM processes.',
    icon: Monitor,
    category: 'management',
    technologies: ['React', 'Python', 'PostgreSQL', 'PowerShell', 'SNMP', 'Docker'],
    industries: ['IT Services', 'Finance', 'Healthcare', 'Education', 'Government'],
    benefits: [
      'Automated asset discovery eliminates manual inventory efforts',
      'Integrated CMDB powers incident and change management',
      'Software license reconciliation prevents compliance exposure',
    ],
    businessOutcomes: [
      '45% reduction in IT asset-spend leakage',
      'Zero software license audit penalties',
      '30% faster incident resolution with accurate asset data',
    ],
  },
  {
    id: 'recruitment-management',
    title: 'Recruitment Management',
    shortDescription:
      'End-to-end recruitment orchestration platform connecting talent acquisition from sourcing to offer.',
    fullDescription:
      'Our recruitment management platform streamlines the entire talent acquisition lifecycle — job requisition, multi-channel sourcing, applicant tracking, interview scheduling, offer management, and onboarding handoff. AI-powered candidate ranking, automated interview workflow coordination, and collaborative feedback tools help hiring teams move faster without sacrificing quality. Built-in analytics provide source-of-hire attribution, pipeline health metrics, and diversity tracking.',
    icon: UserCheck,
    category: 'management',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Elasticsearch', 'Redis', 'Docker'],
    industries: ['IT Services', 'Finance', 'Healthcare', 'Manufacturing', 'Retail'],
    benefits: [
      'Multi-channel sourcing with unified candidate profile view',
      'AI-powered candidate ranking reduces screening effort',
      'Collaborative feedback tools streamline hiring decisions',
    ],
    businessOutcomes: [
      '50% faster time-to-fill across all open positions',
      '40% reduction in cost-per-hire through sourcing optimisation',
      '90% recruiter satisfaction with streamlined workflow',
    ],
  },
  {
    id: 'vr-development',
    title: 'VR Development',
    shortDescription:
      'Immersive virtual reality experiences for enterprise training, simulation, and product visualisation.',
    fullDescription:
      'We develop immersive VR applications that transform how enterprises train employees, simulate environments, and visualise products. From photorealistic training simulations for manufacturing floor operations to interactive architectural walkthroughs and safety scenario rehearsals, our VR solutions reduce risk, accelerate learning, and eliminate the need for physical prototypes. We deliver across major VR platforms including Meta Quest, HTC Vive, and PICO headsets.',
    icon: Eye,
    category: 'development',
    technologies: ['Unity', 'Unreal Engine', 'C#', 'Blender', 'WebXR', 'Three.js'],
    industries: ['Manufacturing', 'Healthcare', 'Education', 'Real Estate', 'Automotive'],
    benefits: [
      'Photorealistic environments for high-fidelity simulations',
      'Cross-platform deployment across all major VR headsets',
      'Real-time performance optimisation for smooth 90fps experiences',
    ],
    businessOutcomes: [
      '60% faster skill acquisition compared to traditional training',
      '90% reduction in training-related physical resource costs',
      'Zero workplace safety incidents during VR-based hazard training',
    ],
  },
  {
    id: 'support-maintenance',
    title: 'Support & Maintenance',
    shortDescription:
      'Proactive application support and managed maintenance with SLA-backed reliability guarantees.',
    fullDescription:
      'Our support and maintenance services keep your business applications running at peak performance around the clock. We provide multi-tiered support — L1 helpdesk, L2 technical support, and L3 engineering — with defined SLAs for response and resolution times. Our proactive monitoring infrastructure detects anomalies before they become incidents, while our maintenance cadence covers security patching, performance tuning, database optimization, and version upgrades.',
    icon: Wrench,
    category: 'support',
    technologies: ['Docker', 'Kubernetes', 'Prometheus', 'Grafana', 'ELK Stack', 'PagerDuty'],
    industries: ['Manufacturing', 'Finance', 'Healthcare', 'IT Services', 'Government'],
    benefits: [
      '24/7 proactive monitoring with automated incident response',
      'Multi-tier support structure ensures appropriate escalation',
      'Regular security patching and performance optimisation included',
    ],
    businessOutcomes: [
      '99.9% application uptime with SLA-backed guarantees',
      '60% faster mean-time-to-resolution for critical incidents',
      '40% reduction in unplanned downtime through proactive maintenance',
    ],
  },
]

export const serviceCategories: { value: Service['category'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All Services' },
  { value: 'development', label: 'Development' },
  { value: 'management', label: 'Management' },
  { value: 'solutions', label: 'Solutions' },
  { value: 'support', label: 'Support' },
]
