import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ContactForm } from './contact-form'
import { V2Hero } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const metadata: Metadata = {
  title: 'Contact Synova Infotech',
  description: 'Contact Synova Infotech to discuss enterprise software, cloud, AI, data, cybersecurity, and digital transformation initiatives.',
}

export default async function ContactPage() {
  const [services, contactSetting] = await Promise.all([
    prisma.service.findMany({ where: { status: true }, select: { id: true, title: true }, orderBy: { createdAt: 'asc' } }),
    prisma.setting.findUnique({ where: { key: 'contact' } }),
  ])

  const contactInfo = contactSetting?.value ? (JSON.parse(contactSetting.value) as Record<string, string>) : null

  return (
    <>
      <V2Hero content={v2Pages.contact} />
      <ContactForm services={services} contactInfo={contactInfo} />
    </>
  )
}
