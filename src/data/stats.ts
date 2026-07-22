export interface Stat {
  id: string
  value: number
  suffix: string
  prefix?: string
  label: string
}

export const stats: Stat[] = [
  {
    id: 'projects',
    value: 200,
    suffix: '+',
    label: 'Projects Delivered',
  },
  {
    id: 'clients',
    value: 50,
    suffix: '+',
    label: 'Enterprise Clients',
  },
  {
    id: 'countries',
    value: 6,
    suffix: '',
    label: 'Countries',
  },
  {
    id: 'experience',
    value: 25,
    suffix: '+',
    label: 'Years Combined Experience',
  },
  {
    id: 'retention',
    value: 98,
    suffix: '%',
    label: 'Client Retention',
  },
  {
    id: 'support',
    value: 5000,
    suffix: '+',
    label: 'Support Hours',
  },
]
