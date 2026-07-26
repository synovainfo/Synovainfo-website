import { prisma } from '@/lib/prisma'
import { sanitizeHtml } from '@/lib/xss'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BlogPostDetailClient } from './blog-post-detail-client'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      featuredImage: true,
      publishedAt: true,
      viewCount: true,
      seoTitle: true,
      seoDescription: true,
      seoKeywords: true,
      canonicalUrl: true,
      ogImage: true,
      category: {
        select: { id: true, name: true, slug: true },
      },
      author: {
        select: { id: true, name: true, image: true },
      },
      tags: {
        select: {
          tag: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
    },
  })

  if (!post) return null

  // Increment view count (fire-and-forget)
  prisma.blogPost
    .update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {
      /* silently fail view count update */
    })

  return {
    ...post,
    tags: post.tags.map((t) => t.tag),
  }
}

async function getRelatedPosts(
  categoryId: string,
  currentPostId: string,
  limit = 3,
): Promise<
  {
    id: string
    title: string
    slug: string
    excerpt: string | null
    featuredImage: string | null
    publishedAt: Date | null
  }[]
> {
  const posts = await prisma.blogPost.findMany({
    where: {
      categoryId,
      id: { not: currentPostId },
      status: 'PUBLISHED',
      deletedAt: null,
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      publishedAt: true,
    },
  })
  return posts
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Post Not Found — Synova Infotech' }
  }

  return {
    title: post.seoTitle ?? `${post.title} — Synova Infotech Blog`,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    keywords: post.seoKeywords ?? undefined,
    alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined,
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt ?? undefined,
      images: post.ogImage ?? post.featuredImage ? [{ url: post.ogImage ?? post.featuredImage! }] : undefined,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt ?? undefined,
      images: post.ogImage ?? post.featuredImage ?? undefined,
    },
  }
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.category.id, post.id)

  // Sanitize content for safe rendering
  const safeContent = post.content ? sanitizeHtml(post.content) : ''

  return (
    <>
      {/* JSON-LD Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            image: post.featuredImage,
            datePublished: post.publishedAt?.toISOString(),
            dateModified: post.publishedAt?.toISOString(),
            author: {
              '@type': 'Person',
              name: post.author.name,
              image: post.author.image,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Synova Infotech Private Limited',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://synovainfotech.com'}/blog/${post.slug}`,
            },
          }),
        }}
      />

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
            <li className="text-[var(--color-text-secondary)] truncate max-w-[200px]" aria-current="page">
              {post.title}
            </li>
          </ol>
        </nav>
      </section>

      <BlogPostDetailClient
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: safeContent,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage,
          publishedAt: post.publishedAt,
          viewCount: post.viewCount,
          category: post.category,
          author: post.author,
          tags: post.tags,
        }}
        relatedPosts={relatedPosts}
      />
    </>
  )
}
