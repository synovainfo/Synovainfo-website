import type { LucideIcon } from 'lucide-react'
import {
  Factory,
  HeartPulse,
  ShoppingBag,
  Truck,
  Warehouse,
  GraduationCap,
  Landmark,
  Building2,
  TrendingUp,
  ShieldCheck,
  Car,
  FlaskConical,
  Radio,
} from 'lucide-react'

export interface Industry {
  id: string
  name: string
  description: string
  capabilities: string[]
  icon: LucideIcon
}

export const industries: Industry[] = [
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description:
      'Smart manufacturing solutions integrating IoT, AI-driven quality control, and real-time production monitoring to optimise every stage of the production lifecycle.',
    capabilities: ['Smart Factory Automation', 'Predictive Maintenance', 'Quality Management'],
    icon: Factory,
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description:
      'Digital health platforms, compliant patient data management, and clinical workflow automation that improve patient outcomes while reducing operational burdens.',
    capabilities: ['EHR/EMR Systems', 'Telemedicine Platforms', 'Compliance & HIPAA'],
    icon: HeartPulse,
  },
  {
    id: 'retail',
    name: 'Retail',
    description:
      'Omnichannel retail technology unifying online and in-store experiences through intelligent inventory management, personalised engagement, and frictionless checkout.',
    capabilities: ['Omnichannel Platforms', 'Inventory Intelligence', 'Customer Analytics'],
    icon: ShoppingBag,
  },
  {
    id: 'logistics',
    name: 'Logistics',
    description:
      'End-to-end logistics orchestration with route optimisation, real-time fleet tracking, and multi-modal transportation management for faster, cost-efficient delivery.',
    capabilities: ['Route Optimisation', 'Real-Time Tracking', 'Fleet Management'],
    icon: Truck,
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    description:
      'Intelligent warehouse management systems with automated picking, robotic integration, and real-time inventory visibility across distributed fulfilment centres.',
    capabilities: ['WMS Automation', 'Robotic Integration', 'Inventory Visibility'],
    icon: Warehouse,
  },
  {
    id: 'education',
    name: 'Education',
    description:
      'Modern learning management platforms, virtual classrooms, and adaptive learning technologies that engage students and streamline institutional administration.',
    capabilities: ['LMS Platforms', 'Virtual Classrooms', 'Administration Automation'],
    icon: GraduationCap,
  },
  {
    id: 'government',
    name: 'Government',
    description:
      'Secure, scalable digital governance solutions including citizen portals, e-governance workflows, and compliant data management for public sector transformation.',
    capabilities: ['E-Governance Portals', 'Citizen Services', 'Compliance & Security'],
    icon: Landmark,
  },
  {
    id: 'construction',
    name: 'Construction',
    description:
      'Construction technology covering project lifecycle management, BIM integration, workforce tracking, and safety compliance for complex building and infrastructure projects.',
    capabilities: ['Project Lifecycle Mgmt', 'BIM Integration', 'Safety Compliance'],
    icon: Building2,
  },
  {
    id: 'finance',
    name: 'Finance',
    description:
      'Enterprise fintech solutions spanning payment processing, risk analytics, regulatory reporting, and digital banking platforms built for security and scale.',
    capabilities: ['Digital Banking', 'Risk & Fraud Analytics', 'Regulatory Reporting'],
    icon: TrendingUp,
  },
  {
    id: 'insurance',
    name: 'Insurance',
    description:
      'Insurtech platforms for policy administration, claims automation, underwriting analytics, and customer engagement — driving efficiency across the insurance value chain.',
    capabilities: ['Claims Automation', 'Policy Administration', 'Underwriting Analytics'],
    icon: ShieldCheck,
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description:
      'Connected vehicle solutions, supply chain optimisation, and manufacturing execution systems tailored for the evolving automotive and electric vehicle landscape.',
    capabilities: ['Connected Vehicles', 'Supply Chain Optimisation', 'MES Integration'],
    icon: Car,
  },
  {
    id: 'pharmaceutical',
    name: 'Pharmaceutical',
    description:
      'Comprehensive digital solutions for drug discovery, clinical trial management, regulatory compliance, and serialisation across the pharmaceutical value chain.',
    capabilities: ['Clinical Trial Management', 'Regulatory Compliance', 'Serialisation & Tracking'],
    icon: FlaskConical,
  },
  {
    id: 'telecom',
    name: 'Telecom',
    description:
      'Next-generation telecom solutions including network automation, OSS/BSS transformation, customer experience platforms, and 5G-ready infrastructure management.',
    capabilities: ['Network Automation', 'OSS/BSS Transformation', 'Customer Experience'],
    icon: Radio,
  },
]
