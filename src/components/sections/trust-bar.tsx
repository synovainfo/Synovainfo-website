import { prisma } from '@/lib/prisma'
import {
  TrustBarClient,
  type TrustBarCertification,
  type TrustBarPartner,
} from './trust-bar-client'

// ── Trust Bar (Server Component) ─────────────────────────────────
// Partners and certifications are admin-editable via the database.
// Only verified, active records are shown. On any DB failure the
// section degrades gracefully to an empty, still-valid render.

export async function TrustBar() {
  let partners: TrustBarPartner[] = []
  let certifications: TrustBarCertification[] = []

  try {
    const [dbPartners, dbCertifications] = await Promise.all([
      prisma.partner.findMany({
        where: { status: true, isVerified: true },
        orderBy: { order: 'asc' },
        select: { id: true, name: true, description: true },
      }),
      prisma.certification.findMany({
        where: { status: true, isVerified: true },
        orderBy: { order: 'asc' },
        select: { id: true, name: true },
      }),
    ])

    partners = dbPartners.map((p) => ({ id: p.id, name: p.name, role: p.description }))
    certifications = dbCertifications
  } catch (error) {
    console.error('TrustBar: database fallback engaged:', error)
  }

  return <TrustBarClient partners={partners} certifications={certifications} />
}
