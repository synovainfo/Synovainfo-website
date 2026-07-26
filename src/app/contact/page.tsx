import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { ChevronRight } from 'lucide-react'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact Us | Synova Infotech',
  description:
    'Get in touch with Synova Infotech. Reach out for digital transformation, AI solutions, web development, and enterprise technology services.',
  openGraph: {
    title: 'Contact Us | Synova Infotech',
    description:
      'Get in touch with Synova Infotech for digital transformation, AI solutions, and enterprise technology services.',
    url: '/contact',
  },
}

export default async function ContactPage() {
  const [services, contactSetting] = await Promise.all([
    prisma.service.findMany({
      where: { status: true },
      select: { id: true, title: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.setting.findUnique({ where: { key: 'contact' } }),
  ])

  const contactInfo = contactSetting?.value
    ? (JSON.parse(contactSetting.value) as Record<string, string>)
    : null

  return (
    <>
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-accent-blue)]"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" aria-hidden="true" />
          <span className="font-medium text-[var(--color-text)]" aria-current="page">
            Contact
          </span>
        </div>
      </nav>

      <ContactForm services={services} contactInfo={contactInfo} />
    </>
  )
}
