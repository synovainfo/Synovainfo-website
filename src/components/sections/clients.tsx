import { prisma } from '@/lib/prisma'
import { ClientsClient } from './clients-client'

export async function Clients() {
  let clients: Awaited<ReturnType<typeof prisma.client.findMany>> = []
  let section: Awaited<ReturnType<typeof prisma.homepageSection.findFirst>> = null

  try {
    ;[clients, section] = await Promise.all([
      prisma.client.findMany({
        where: { status: true },
        orderBy: { order: 'asc' },
      }),
      prisma.homepageSection.findFirst({
        where: { sectionType: 'clients', isVisible: true },
      }),
    ])
  } catch (error) {
    console.error('Clients: database fallback engaged:', error)
  }

  if (clients.length === 0) return null

  const badge = (section?.content as Record<string, string> | null)?.badge ?? 'Trusted By'
  const title = section?.title ?? 'Enterprise Clients'
  const subtitle =
    (section?.content as Record<string, string> | null)?.subtitle ??
    'We are proud to partner with leading enterprises across industries.'

  const mappedClients = clients.map((c) => ({
    id: c.id,
    name: c.name,
    logo: c.logo,
    websiteUrl: c.websiteUrl,
  }))

  return (
    <ClientsClient
      clients={mappedClients}
      badge={badge}
      title={title}
      subtitle={subtitle}
    />
  )
}
