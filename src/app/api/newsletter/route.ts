import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

const newsletterRateLimit = rateLimit({ interval: 60_000, max: 10 });

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await newsletterRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: rateLimitResult.headers }
      );
    }

    const body = await request.json()
    const { email } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400, headers: rateLimitResult.headers }
      )
    }

    const existing = await prisma.subscriber.findUnique({
      where: { email },
    })

    if (existing?.status === 'active') {
      return NextResponse.json(
        { error: 'This email is already subscribed.' },
        { status: 409, headers: rateLimitResult.headers }
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

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully.' },
      { status: 201, headers: rateLimitResult.headers }
    )
  } catch {
    return NextResponse.json(
      { error: 'Subscription failed. Please try again later.' },
      { status: 500 }
    )
  }
}
