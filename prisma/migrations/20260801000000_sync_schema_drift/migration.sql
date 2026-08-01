-- Sync schema drift for current Prisma models and ensure soft-delete columns are present.

CREATE TABLE IF NOT EXISTS "certifications" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT,
    "description" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "core_values" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "core_values_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "partners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "budget" TEXT;
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "timeline" TEXT;

ALTER TABLE "statistics" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

CREATE INDEX IF NOT EXISTS "certifications_status_idx" ON "certifications"("status");
CREATE INDEX IF NOT EXISTS "certifications_isVerified_idx" ON "certifications"("isVerified");
CREATE INDEX IF NOT EXISTS "certifications_deletedAt_idx" ON "certifications"("deletedAt");

CREATE INDEX IF NOT EXISTS "core_values_status_idx" ON "core_values"("status");
CREATE INDEX IF NOT EXISTS "core_values_deletedAt_idx" ON "core_values"("deletedAt");

CREATE INDEX IF NOT EXISTS "partners_status_idx" ON "partners"("status");
CREATE INDEX IF NOT EXISTS "partners_isVerified_idx" ON "partners"("isVerified");
CREATE INDEX IF NOT EXISTS "partners_deletedAt_idx" ON "partners"("deletedAt");

CREATE INDEX IF NOT EXISTS "statistics_deletedAt_idx" ON "statistics"("deletedAt");
CREATE INDEX IF NOT EXISTS "statistics_isVisible_idx" ON "statistics"("isVisible");
CREATE INDEX IF NOT EXISTS "testimonials_deletedAt_idx" ON "testimonials"("deletedAt");
CREATE INDEX IF NOT EXISTS "testimonials_status_idx" ON "testimonials"("status");
