import { prisma } from '@/lib/prisma'
import { ContactClient } from './contact-client'

export async function Contact() {
  const [settings, section] = await Promise.all([
    prisma.setting.findMany({
      where: {
        key: {
          in: ['contact_email', 'contact_phone', 'site_name', 'site_description'],
        },
      },
    }),
    prisma.homepageSection.findFirst({
      where: { sectionType: 'contact', isVisible: true },
    }),
  ])

  const settingsMap = new Map(settings.map((s) => [s.key, s.value]))

  const email = settingsMap.get('contact_email') ?? 'info@synovainfotech.com'
  const phone = settingsMap.get('contact_phone') ?? '+91 98765 43210'
  const siteName = settingsMap.get('site_name') ?? 'Synova Infotech'

  const badge = (section?.content as Record<string, string> | null)?.badge ?? 'Get in Touch'
  const title = section?.title ?? 'Start Your Digital Transformation Journey'
  const subtitle =
    (section?.content as Record<string, string> | null)?.subtitle ??
    "Ready to transform your business with technology? Reach out and let's start a conversation about your next project."

  const content = section?.content as Record<string, string> | null

  return (
    <ContactClient
      email={email}
      phone={phone}
      badge={badge}
      title={title}
      subtitle={subtitle}
      address={content?.address}
    />
  )
}
