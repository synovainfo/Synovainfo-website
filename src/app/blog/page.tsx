import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import Link from 'next/link'
import type { Metadata } from 'next'
import { BlogListClient } from './blog-list-client'

export const dynamic = 'force-dynamic'

const POSTS_PER_PAGE = 10

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog — Synova Infotech',
    description:
      'Insights, tutorials, and thought leadership on enterprise technology, software engineering, AI, cloud computing, and digital transformation.',
    openGraph: {
      title: 'Blog — Synova Infotech',
      description:
        'Expert insights on enterprise technology, software engineering, and digital transformation.',
    },
  }
}

export interface BlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: Date | null
  viewCount: number
  category: {
    id: string
    name: string
    slug: string
  }
  author: {
    id: string
    name: string
    image: string | null
  }
}

export interface CategorySummary {
  id: string
  name: string
  slug: string
  _count: { posts: number }
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  total: number
}

async function getCategories(): Promise<CategorySummary[]> {
  const categories = await prisma.blogCategory.findMany({
    where: {
      posts: {
        some: { status: 'PUBLISHED', deletedAt: null },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { posts: true } },
    },
    orderBy: { name: 'asc' },
  })
  return categories
}

async function getPosts(
  page: number,
  categorySlug?: string,
  search?: string,
): Promise<{ posts: BlogPostSummary[]; pagination: PaginationInfo }> {
  const where: Prisma.BlogPostWhereInput = {
    status: 'PUBLISHED',
    deletedAt: null,
  }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
    ]
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        viewCount: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    }),
    prisma.blogPost.count({ where }),
  ])

  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / POSTS_PER_PAGE),
      total,
    },
  }
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BlogListPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = typeof sp.page === 'string' ? Math.max(1, parseInt(sp.page, 10) || 1) : 1
  const categorySlug = typeof sp.category === 'string' ? sp.category : undefined
  const search = typeof sp.search === 'string' ? sp.search : undefined

  const [{ posts, pagination }, categories] = await Promise.all([
    getPosts(page, categorySlug, search),
    getCategories(),
  ])

  // Featured post (first published, only on page 1 with no filters)
  let featuredPost: BlogPostSummary | null = null
  if (page === 1 && !categorySlug && !search && posts.length > 0) {
    featuredPost = posts[0]
  }

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-[var(--color-primary)] pt-28 pb-4 md:pt-36">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
            <li>
              <Link href="/" className="hover:text-[var(--color-accent-blue)] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-text-secondary)]" aria-current="page">
              Blog
            </li>
          </ol>
        </nav>
      </section>

      <BlogListClient
        posts={posts}
        categories={categories}
        pagination={pagination}
        featuredPost={featuredPost}
        currentCategory={categorySlug ?? null}
        currentSearch={search ?? null}
      />
    </>
  )
}
