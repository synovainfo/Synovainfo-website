export interface Stat {
  id: string
  value: number | string
  suffix: string
  prefix?: string
  label: string
}

/**
 * Honest, capability-based statistics.
 * No fabricated numbers — these are verifiable statements about how we work.
 * The same data seeds the `Statistic` table and is admin-editable.
 */
export const stats: Stat[] = [
  {
    id: 'delivery',
    value: 'Enterprise-grade',
    suffix: '',
    label: 'Delivery Model',
  },
  {
    id: 'talent',
    value: 'Global',
    suffix: '',
    label: 'Engineering Talent',
  },
  {
    id: 'security',
    value: 'Security-first',
    suffix: '',
    label: 'Development Approach',
  },
  {
    id: 'partnership',
    value: 'Long-term',
    suffix: '',
    label: 'Client Partnerships',
  },
]
