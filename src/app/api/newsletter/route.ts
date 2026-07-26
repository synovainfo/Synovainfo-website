import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const existing = await prisma.subscriber.findUnique({
      where: { email },
    })

    if (existing?.status === 'active') {
      return NextResponse.json(
        { error: 'This email is already subscribed.' },
        { status: 409 }
      )
    }

    await prisma.subscriber.upsert({
      where: { email },
      update: { status: 'active', unsubscribedAt: null },
      create: {
        email,
        status: 'active',
        source: 'footer',
      },
    })

    return NextResponse.json({ success: true, message: 'Subscribed successfully.' })
  } catch {
    return NextResponse.json(
      { error: 'Subscription failed. Please try again later.' },
      { status: 500 }
    )
  }
}
