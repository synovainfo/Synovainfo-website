// =============================================================================
// Synova Infotech — Seed Configuration
// =============================================================================

export const seedConfig = {
  admin: {
    email: "admin@synovainfo.com",
    password: process.env.SEED_ADMIN_PASSWORD || "Admin@Synova2026!",
    name: "Super Admin",
  },
  site: {
    name: "Synova Infotech",
    url: "https://synovainfo.com",
    description: "Enterprise IT Consulting & Digital Transformation",
  },
} as const;
