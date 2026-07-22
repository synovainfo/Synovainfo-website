import type { LucideIcon } from 'lucide-react'
import {
  Lightbulb,
  TrendingUp,
  Users,
  Target,
  Globe,
  Clock,
  BookOpen,
  Heart,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Position {
  id: string
  title: string
  department: string
  location: string
  type: 'remote' | 'hybrid' | 'onsite'
  description: string
}

export interface CulturePillar {
  icon: LucideIcon
  title: string
  description: string
}

export interface Benefit {
  icon: LucideIcon
  title: string
  description: string
}

/* ------------------------------------------------------------------ */
/*  Culture Pillars                                                    */
/* ------------------------------------------------------------------ */

export const culturePillars: CulturePillar[] = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'We challenge conventions and encourage experimentation. Every team member has the autonomy to explore new ideas, technologies, and approaches that push the boundaries of enterprise IT.',
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    description:
      'Your career trajectory matters here. Through mentorship programs, certification sponsorships, and hands-on exposure to cutting-edge projects, we invest in your professional evolution.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description:
      'Great solutions emerge from diverse minds working together. Our cross-functional squads break silos and foster knowledge sharing across engineering, design, and strategy domains.',
  },
  {
    icon: Target,
    title: 'Impact',
    description:
      'Every role at Synova drives measurable outcomes. We align individual contributions to business goals, ensuring your work translates directly into client success and organizational growth.',
  },
]

/* ------------------------------------------------------------------ */
/*  Benefits                                                           */
/* ------------------------------------------------------------------ */

export const benefits: Benefit[] = [
  {
    icon: Globe,
    title: 'Remote-First',
    description:
      'Work from wherever you do your best. Our distributed infrastructure ensures seamless collaboration across time zones.',
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    description:
      'Own your schedule. We trust you to deliver results without rigid 9-to-5 constraints — manage your time around peak productivity.',
  },
  {
    icon: BookOpen,
    title: 'Learning Budget',
    description:
      'Annual allowance for courses, conferences, certifications, and books. Stay ahead of the curve with sponsored continuous education.',
  },
  {
    icon: Heart,
    title: 'Health Coverage',
    description:
      'Comprehensive medical, dental, and wellness benefits for you and your family. Your well-being is the foundation of our success.',
  },
]

/* ------------------------------------------------------------------ */
/*  Open Positions                                                     */
/* ------------------------------------------------------------------ */

export const positions: Position[] = [
  {
    id: 'sse',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Pune / Remote',
    type: 'remote',
    description:
      'Design and build scalable microservices, RESTful APIs, and cloud-native applications using TypeScript, Node.js, and modern frameworks. Mentor junior engineers and drive architectural decisions across client engagements.',
  },
  {
    id: 'cloud-architect',
    title: 'Cloud Architect',
    department: 'Infrastructure',
    location: 'Pune / Remote',
    type: 'remote',
    description:
      'Architect multi-cloud solutions on AWS, Azure, and GCP. Define infrastructure-as-code strategies, optimize cost and performance, and lead migration initiatives for enterprise clients transitioning to the cloud.',
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Pune',
    type: 'hybrid',
    description:
      'Create intuitive, accessible, and visually compelling interfaces for enterprise applications. Own the end-to-end design process from user research and wireframes to high-fidelity prototypes and developer handoff.',
  },
  {
    id: 'project-manager',
    title: 'Project Manager',
    department: 'Delivery',
    location: 'Pune',
    type: 'hybrid',
    description:
      'Lead cross-functional teams through the full software delivery lifecycle. Manage stakeholder expectations, mitigate risks, and ensure on-time, within-budget delivery using Agile and Scrum methodologies.',
  },
  {
    id: 'business-analyst',
    title: 'Business Analyst',
    department: 'Strategy',
    location: 'Pune',
    type: 'onsite',
    description:
      'Bridge the gap between business needs and technical solutions. Elicit requirements, document processes, and collaborate with engineering teams to translate stakeholder goals into actionable specifications.',
  },
  {
    id: 'qa-engineer',
    title: 'QA Engineer',
    department: 'Engineering',
    location: 'Pune / Remote',
    type: 'remote',
    description:
      'Build and maintain automated test suites, perform manual regression testing, and champion quality across the development lifecycle. Drive test-driven development practices and continuous integration pipelines.',
  },
]
