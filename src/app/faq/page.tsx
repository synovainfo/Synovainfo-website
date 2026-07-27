import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { FAQList } from './faq-list'
import { V2Hero, V2Cta } from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const metadata: Metadata = {
  title: 'FAQ | Synova Infotech',
  description: 'Answers to common questions about Synova Infotech services, delivery governance, security, support, and engagement models.',
}

export default async function FAQPage() {
  const [faqs, categories] = await Promise.all([
    prisma.fAQ.findMany({ where: { status: true }, include: { category: true }, orderBy: { order: 'asc' } }),
    prisma.fAQCategory.findMany({ where: { faqs: { some: { status: true } } }, orderBy: { order: 'asc' } }),
  ])

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <V2Hero content={v2Pages.faq} />
      <FAQList faqs={faqs} categories={categories} />
      <V2Cta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  )
}
