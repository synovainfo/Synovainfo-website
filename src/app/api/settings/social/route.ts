import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface OrgSettings {
  sameAs?: string[]
  contactPoint?: {
    email?: string
    telephone?: string
  }
}

export async function GET() {
  try {
    const orgSetting = await prisma.setting.findUnique({
      where: { key: 'organization' },
    })

    if (!orgSetting?.value) {
      return NextResponse.json({
        socialLinks: [],
        contactInfo: {},
      })
    }

    const org = JSON.parse(orgSetting.value) as OrgSettings

    return NextResponse.json({
      socialLinks: (org.sameAs as string[]) ?? [],
      contactInfo: {
        email: (org.contactPoint?.email as string) ?? '',
        phone: (org.contactPoint?.telephone as string) ?? '',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    )
  }
}
