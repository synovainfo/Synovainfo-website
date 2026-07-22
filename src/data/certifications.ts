import {
  Award,
  Shield,
  BadgeCheck,
  Cloud,
  Monitor,
  Globe,
  ShieldCheck,
  FileCheck,
  type LucideIcon,
} from 'lucide-react'

export interface Certification {
  id: string
  name: string
  description: string
  icon: LucideIcon
}

export const certifications: Certification[] = [
  {
    id: 'iso9001',
    name: 'ISO 9001:2015',
    description: 'Quality Management System',
    icon: Award,
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    description: 'Information Security Management',
    icon: Shield,
  },
  {
    id: 'nmsdc',
    name: 'NMSDC Certified',
    description: 'Minority Business Enterprise',
    icon: BadgeCheck,
  },
  {
    id: 'aws',
    name: 'AWS Partner Network',
    description: 'Advanced Tier Services Partner',
    icon: Cloud,
  },
  {
    id: 'microsoft',
    name: 'Microsoft Partner',
    description: 'Gold Competency Partner',
    icon: Monitor,
  },
  {
    id: 'google',
    name: 'Google Cloud Partner',
    description: 'Cloud Services Partner',
    icon: Globe,
  },
  {
    id: 'owasp',
    name: 'OWASP Top 10 Compliant',
    description: 'Application Security Standards',
    icon: ShieldCheck,
  },
  {
    id: 'gdpr',
    name: 'GDPR Compliant',
    description: 'Data Protection & Privacy',
    icon: FileCheck,
  },
]
