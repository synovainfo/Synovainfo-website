import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const MAX_RESULTS = 20

interface SearchResult {
  type: 'service' | 'industry' | 'blog' | 'page' | 'career' | 'faq'
  id: string
  title: string
  description: string
  url: string
  relevance?: number
}

async function searchServices(query: string): Promise<SearchResult[]> {
  const services = await prisma.service.findMany({
    where: {
      status: true,
      deletedAt: null,
      OR: [
        { title: { contains: query } },
        { shortDescription: { contains: query } },
        { fullDescription: { contains: query } },
      ],
    },
    select: {
      id: true,
      title: true,
      shortDescription: true,
      slug: true,
    },
    take: MAX_RESULTS,
  })

  return services.map((s) => ({
    type: 'service' as const,
    id: s.id,
    title: s.title,
    description: s.shortDescription ?? '',
    url: `/services/${s.slug}`,
  }))
}

async function searchIndustries(query: string): Promise<SearchResult[]> {
  const industries = await prisma.industry.findMany({
    where: {
      status: true,
      deletedAt: null,
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
    },
    take: MAX_RESULTS,
  })

  return industries.map((ind) => ({
    type: 'industry' as const,
    id: ind.id,
    title: ind.name,
    description: ind.description ?? '',
    url: `/industries/${ind.slug}`,
  }))
}

async function searchBlogPosts(query: string): Promise<SearchResult[]> {
  const posts = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED',
      deletedAt: null,
      OR: [
        { title: { contains: query } },
        { content: { contains: query } },
        { excerpt: { contains: query } },
      ],
    },
    select: {
      id: true,
      title: true,
      excerpt: true,
      slug: true,
    },
    take: MAX_RESULTS,
    orderBy: { publishedAt: 'desc' },
  })

  return posts.map((post) => ({
    type: 'blog' as const,
    id: post.id,
    title: post.title,
    description: post.excerpt ?? '',
    url: `/blog/${post.slug}`,
  }))
}

async function searchPages(query: string): Promise<SearchResult[]> {
  const pages = await prisma.page.findMany({
    where: {
      status: 'PUBLISHED',
      deletedAt: null,
      slug: { not: 'home' },
      OR: [
        { title: { contains: query } },
        { excerpt: { contains: query } },
      ],
    },
    select: {
      id: true,
      title: true,
      excerpt: true,
      slug: true,
    },
    take: MAX_RESULTS,
  })

  return pages.map((page) => ({
    type: 'page' as const,
    id: page.id,
    title: page.title,
    description: page.excerpt ?? '',
    url: `/${page.slug}`,
  }))
}

async function searchCareers(query: string): Promise<SearchResult[]> {
  const careers = await prisma.career.findMany({
    where: {
      status: true,
      deletedAt: null,
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
    },
    take: MAX_RESULTS,
  })

  return careers.map((career) => ({
    type: 'career' as const,
    id: career.id,
    title: career.title,
    description: career.description ?? '',
    url: `/careers/${career.slug}`,
  }))
}

async function searchFAQs(query: string): Promise<SearchResult[]> {
  const faqs = await prisma.fAQ.findMany({
    where: {
      status: true,
      OR: [
        { question: { contains: query } },
        { answer: { contains: query } },
      ],
    },
    select: {
      id: true,
      question: true,
      answer: true,
    },
    take: MAX_RESULTS,
    orderBy: { order: 'asc' },
  })

  return faqs.map((faq) => ({
    type: 'faq' as const,
    id: faq.id,
    title: faq.question,
    description: faq.answer,
    url: '/faq',
  }))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { q } = body

    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return NextResponse.json({ results: [], total: 0 })
    }

    const query = q.trim()

    const [services, industries, blogPosts, pages, careers, faqs] = await Promise.all([
      searchServices(query),
      searchIndustries(query),
      searchBlogPosts(query),
      searchPages(query),
      searchCareers(query),
      searchFAQs(query),
    ])

    const results = [
      ...services,
      ...industries,
      ...blogPosts,
      ...pages,
      ...careers,
      ...faqs,
    ].slice(0, MAX_RESULTS)

    return NextResponse.json({
      results,
      total: results.length,
      query,
    })
  } catch {
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    )
  }
}
