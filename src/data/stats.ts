export interface Stat {
  id: string
  value: number
  suffix: string
  prefix?: string
  label: string
}

export const stats: Stat[] = [
  {
    id: 'deployments',
    value: 250,
    suffix: '+',
    label: 'Enterprise Deployments',
  },
  {
    id: 'clients',
    value: 85,
    suffix: '+',
    label: 'Fortune 500 & Enterprise Clients',
  },
  {
    id: 'uptime',
    value: 99.999,
    suffix: '%',
    label: 'Contractual SLA Guarantee',
  },
  {
    id: 'engineers',
    value: 1200,
    suffix: '+',
    label: 'Global Engineering Team',
  },
  {
    id: 'inference',
    value: 5,
    suffix: 'ms',
    prefix: '<',
    label: 'Edge Inference Latency',
  },
  {
    id: 'certifications',
    value: 12,
    suffix: '',
    label: 'Enterprise Compliance Certifications',
  },
]
