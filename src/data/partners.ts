export interface Partner {
  id: string
  name: string
  website?: string
  description?: string
}

/**
 * Seed data for the `Partner` table.
 *
 * NOTE: Only partner NAMES are listed here — no partnership-tier claims.
 * Every record seeds with `isVerified: false` and is hidden from the public
 * site until an admin verifies the relationship in the admin panel.
 */
export const partners: Partner[] = [
  {
    id: 'aws',
    name: 'AWS',
    website: 'https://aws.amazon.com',
    description: 'Amazon Web Services cloud ecosystem',
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    website: 'https://azure.microsoft.com',
    description: 'Microsoft cloud platform',
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    website: 'https://cloud.google.com',
    description: 'Google Cloud Platform',
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    website: 'https://www.nvidia.com',
    description: 'NVIDIA AI computing platforms',
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    website: 'https://www.snowflake.com',
    description: 'Snowflake data cloud',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    website: 'https://www.salesforce.com',
    description: 'Salesforce customer platform',
  },
  {
    id: 'oracle',
    name: 'Oracle Cloud',
    website: 'https://www.oracle.com/cloud',
    description: 'Oracle Cloud Infrastructure',
  },
  {
    id: 'redhat',
    name: 'Red Hat OpenShift',
    website: 'https://www.redhat.com',
    description: 'Red Hat OpenShift container platform',
  },
]
