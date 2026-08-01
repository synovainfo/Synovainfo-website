import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const section = await prisma.homepageSection.findFirst({
      where: { sectionType: 'technical-whitepaper' }
    });
    
    if (!section || !section.content) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(section.content);
  } catch (error) {
    console.error('Failed to fetch whitepaper content', error);
    return NextResponse.json([], { status: 500 });
  }
}
