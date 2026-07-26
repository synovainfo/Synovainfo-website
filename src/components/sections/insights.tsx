import { prisma } from '@/lib/prisma'
import { InsightsClient } from './insights-client'

export async function Insights() {
  const blogs = await prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: {
      author: { select: { name: true, image: true } }
    }
  })

  // Map Prisma data to plain objects
  const mappedBlogs = blogs.map(b => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    content: b.content || '',
    featuredImage: b.featuredImage,
    createdAt: b.createdAt.toISOString(),
    authorName: b.author?.name || 'Synova Team',
    authorImage: b.author?.image
  }))

  return <InsightsClient initialBlogs={mappedBlogs} />
}
