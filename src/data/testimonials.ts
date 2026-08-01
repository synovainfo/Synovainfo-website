export interface Testimonial {
  id: string
  quote: string
  name: string
  title: string
  company: string
  initials: string
  /** Optional per-testimonial image. Falls back to the rotating avatars when absent. */
  imageUrl?: string
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      "Synova's team brought architectural rigor that transformed our approach to digital transformation. Their deep understanding of manufacturing domain constraints and ability to translate complex requirements into scalable microservices architecture was exceptional.",
    name: 'Rajesh Kumar',
    title: 'CTO',
    company: 'Manufacturing Company',
    initials: 'RK',
  },
  {
    id: 't2',
    quote:
      'The quality of their engineering and attention to security standards exceeded our expectations. Every deliverable passed our compliance review on the first pass — a rare achievement with external partners.',
    name: 'Priya Sharma',
    title: 'VP Engineering',
    company: 'Financial Services',
    initials: 'PS',
  },
  {
    id: 't3',
    quote:
      "A true technology partner — they didn't just build what we asked, they solved what we needed. Their team identified edge cases we hadn't considered and proposed elegant solutions that saved us months of rework.",
    name: 'Amit Patel',
    title: 'Director of IT',
    company: 'Healthcare Organization',
    initials: 'AP',
  },
  {
    id: 't4',
    quote:
      'Their enterprise methodology and agile delivery made our complex migration seamless. Four legacy systems consolidated into one unified platform — delivered on time and under budget without a single downtime incident.',
    name: 'Meera Desai',
    title: 'CIO',
    company: 'Retail Enterprise',
    initials: 'MD',
  },
  {
    id: 't5',
    quote:
      'Outstanding technical expertise combined with genuine business understanding. They took the time to learn our logistics workflows before writing a single line of code — and it showed in every decision they made.',
    name: 'Vikram Singh',
    title: 'COO',
    company: 'Logistics Company',
    initials: 'VS',
  },
  {
    id: 't6',
    quote:
      'Synova delivered a solution that scaled beyond our initial requirements without architectural changes. When our user base grew 4× faster than projected, the platform handled it without a hitch. That is engineering foresight.',
    name: 'Shweta Joshi',
    title: 'Head of Digital',
    company: 'Insurance Company',
    initials: 'SJ',
  },
]
