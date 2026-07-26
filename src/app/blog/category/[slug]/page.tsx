import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BlogListClient } from '../../blog-list-client'
import type { BlogPostSummary, CategorySummary, PaginationInfo } from '../../page'

export const dynamic = 'force-dynamic'

const POSTS_PER_PAGE = 10

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getCategory(slug: string) {
  const category = await prisma.blogCategory.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, description: true },
  })
  return category
}

async function getPosts(
  categoryId: string,
  page: number,
  search?: string,
): Promise<{ posts: BlogPostSummary[]; pagination: PaginationInfo }> {
  const where: Prisma.BlogPostWhereInput = {
    categoryId,
    status: 'PUBLISHED',
    deletedAt: null,
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
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

async function getAllCategories(): Promise<CategorySummary[]> {
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return { title: 'Category Not Found — Synova Infotech' }
  }

  return {
    title: `${category.name} — Blog | Synova Infotech`,
    description:
      category.description ?? `Browse all articles in the ${category.name} category.`,
    openGraph: {
      title: `${category.name} — Synova Infotech Blog`,
      description: category.description ?? `Articles filed under ${category.name}.`,
    },
  }
}

export default async function BlogCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const page = typeof sp.page === 'string' ? Math.max(1, parseInt(sp.page, 10) || 1) : 1
  const search = typeof sp.search === 'string' ? sp.search : undefined

  const category = await getCategory(slug)
  if (!category) {
    notFound()
  }

  const [{ posts, pagination }, categories] = await Promise.all([
    getPosts(category.id, page, search),
    getAllCategories(),
  ])

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
            <li>
              <Link href="/blog" className="hover:text-[var(--color-accent-blue)] transition-colors">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-text-secondary)]" aria-current="page">
              {category.name}
            </li>
          </ol>
        </nav>
      </section>

      <BlogListClient
        posts={posts}
        categories={categories}
        pagination={pagination}
        featuredPost={null}
        currentCategory={slug}
        currentSearch={search ?? null}
      />
    </>
  )
}
