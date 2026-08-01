import { prisma } from '@/lib/prisma'
import { InsightsClient } from './insights-client'

export async function Insights() {
  let mappedBlogs: Array<{
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    featuredImage: string | null
    createdAt: string
    authorName: string
    authorImage: string | null
  }> = []

  try {
    const blogs = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        author: { select: { name: true, image: true } },
      },
    })

    mappedBlogs = blogs.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      content: b.content || '',
      featuredImage: b.featuredImage,
      createdAt: b.createdAt.toISOString(),
      authorName: b.author?.name || 'Synova Team',
      authorImage: b.author?.image ?? null,
    }))
  } catch (error) {
    console.error('Insights: database fallback engaged:', error)
  }

  return <InsightsClient initialBlogs={mappedBlogs} />
}
