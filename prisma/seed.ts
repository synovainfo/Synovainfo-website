// =============================================================================
// Synova Infotech — Database Seed Script
// Imports all data from src/data/*.ts and populates the Prisma database.
// Idempotent — safe to run multiple times (uses upsert everywhere).
// =============================================================================

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import type * as runtime from "@prisma/client/runtime/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { seedConfig } from "./seed-config";

// ── Data imports ────────────────────────────────────────────────────────────
import { services } from "../src/data/services";
import { industries } from "../src/data/industries";
import { technologies } from "../src/data/technologies";
import { stats } from "../src/data/stats";
import { testimonials } from "../src/data/testimonials";
import { positions, culturePillars, benefits as careerBenefits } from "../src/data/careers";
import { advantages } from "../src/data/advantages";
import { processStages } from "../src/data/process";
import { caseStudies } from "../src/data/case-studies";
import { certifications } from "../src/data/certifications";
import { partners } from "../src/data/partners";
import { coreValues } from "../src/data/core-values";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// =============================================================================
// HELPERS
// =============================================================================

/** Extract the icon name string from a LucideIcon component or a raw string. */
function resolveIcon(icon: unknown): string | null {
  if (typeof icon === "string") return icon;
  if (icon !== null && icon !== undefined) {
    const c = icon as { name?: string; displayName?: string; $$typeof?: symbol };
    // React elements have $$typeof symbol — extract name or return null
    if (typeof c.$$typeof !== "undefined") {
      return c.displayName || c.name || null;
    }
    return c.displayName || c.name || null;
  }
  return null;
}

/** Convert value to JSON-safe plain object for Prisma Json fields. */
function toJsonSafe<T>(data: T): runtime.InputJsonValue {
  return JSON.parse(JSON.stringify(data)) as runtime.InputJsonValue;
}

/** Deep-sanitize an object tree, replacing LucideIcon components (React elements)
 *  with their string name so the data can be serialized to Prisma Json fields. */
function sanitizeForJson<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map(sanitizeForJson) as unknown as T;
  }
  if (data !== null && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === "icon" && value !== null && typeof value === "object") {
        const iconName = resolveIcon(value);
        sanitized[key] = iconName ?? null;
      } else if (value !== null && typeof value === "object") {
        sanitized[key] = sanitizeForJson(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized as unknown as T;
  }
  return data;
}

// =============================================================================
// MAIN
// =============================================================================

async function main(): Promise<void> {
  console.log("🌱  Starting seed …\n");

  // ── 1. Admin user ─────────────────────────────────────────────────────────
  console.log("── Users ────────────────────────────────────────────────");
  const hashedPassword = await bcrypt.hash(seedConfig.admin.password, 12);
  const admin = await prisma.user.upsert({
    where: { email: seedConfig.admin.email },
    update: { name: seedConfig.admin.name },
    create: {
      name: seedConfig.admin.name,
      email: seedConfig.admin.email,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  console.log(`  ✓ Admin user: ${admin.email} (${admin.role})`);

  // ── 2. Roles ──────────────────────────────────────────────────────────────
  console.log("\n── Roles ────────────────────────────────────────────────");
  const roleNames = ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"] as const;
  const createdRoles: Record<string, string> = {};
  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} role with predefined permissions` },
    });
    createdRoles[name] = role.id;
    console.log(`  ✓ Role: ${name}`);
  }

  // ── 3. Permissions ────────────────────────────────────────────────────────
  console.log("\n── Permissions ──────────────────────────────────────────");
  const resources = [
    "pages", "services", "industries", "technologies", "blog", "media",
    "users", "settings", "contacts", "leads", "newsletter", "forms",
    "menus", "faq", "careers", "resources", "downloads", "redirects",
    "backups", "audit",
  ] as const;
  const allActions = ["create", "read", "update", "delete", "publish"] as const;
  const editorActions = ["create", "read", "update"] as const;
  const viewerActions = ["read"] as const;

  const roleActions: Record<string, readonly string[]> = {
    SUPER_ADMIN: allActions,
    ADMIN: allActions,
    EDITOR: editorActions,
    VIEWER: viewerActions,
  };

  let permCount = 0;
  for (const [roleName, roleId] of Object.entries(createdRoles)) {
    const baseActions = roleActions[roleName] ?? viewerActions;
    for (const resource of resources) {
      // ADMIN can do everything except on "users" (read-only)
      const actions =
        roleName === "ADMIN" && resource === "users"
          ? (["read"] as const)
          : baseActions;
      for (const action of actions) {
        const existing = await prisma.permission.findFirst({
          where: { action, resource, roleId },
        });
        if (!existing) {
          await prisma.permission.create({
            data: { action, resource, roleId },
          });
          permCount++;
        }
      }
    }
  }
  console.log(`  ✓ ${permCount} permissions created`);

  // ── 4. Technologies ───────────────────────────────────────────────────────
  console.log("\n── Technologies ─────────────────────────────────────────");
  const techSlugToId: Record<string, string> = {};
  const techNameToSlug: Record<string, string> = {};
  for (const tech of technologies) {
    const iconName = resolveIcon(tech.icon);
    const t = await prisma.technology.upsert({
      where: { slug: tech.id },
      update: {
        name: tech.name,
        category: tech.category,
        description: tech.description,
        icon: iconName,
      },
      create: {
        slug: tech.id,
        name: tech.name,
        category: tech.category,
        description: tech.description,
        icon: iconName,
        status: true,
      },
    });
    techSlugToId[tech.id] = t.id;
    techNameToSlug[tech.name] = tech.id;
    console.log(`  ✓ Technology: ${tech.name}`);
  }

  // ── 5. Industries ─────────────────────────────────────────────────────────
  console.log("\n── Industries ───────────────────────────────────────────");
  const industrySlugToId: Record<string, string> = {};
  const industryNameToSlug: Record<string, string> = {};
  for (const ind of industries) {
    const iconName = resolveIcon(ind.icon);
    const i = await prisma.industry.upsert({
      where: { slug: ind.id },
      update: {
        name: ind.name,
        description: ind.description,
        icon: iconName,
        capabilities: ind.capabilities,
      },
      create: {
        slug: ind.id,
        name: ind.name,
        description: ind.description,
        icon: iconName,
        capabilities: ind.capabilities,
        status: true,
      },
    });
    industrySlugToId[ind.id] = i.id;
    industryNameToSlug[ind.name] = ind.id;
    console.log(`  ✓ Industry: ${ind.name}`);
  }

  // ── 6. Services + junction links ──────────────────────────────────────────
  console.log("\n── Services ─────────────────────────────────────────────");
  for (const svc of services) {
    const iconName = resolveIcon(svc.icon);
    await prisma.service.upsert({
      where: { slug: svc.id },
      update: {
        title: svc.title,
        shortDescription: svc.shortDescription,
        fullDescription: svc.fullDescription,
        icon: iconName,
        category: svc.category,
        benefits: svc.benefits,
        businessOutcomes: svc.businessOutcomes,
        status: true,
      },
      create: {
        slug: svc.id,
        title: svc.title,
        shortDescription: svc.shortDescription,
        fullDescription: svc.fullDescription,
        icon: iconName,
        category: svc.category,
        benefits: svc.benefits,
        businessOutcomes: svc.businessOutcomes,
        status: true,
      },
    });

    // Fetch the service to get its PK id
    const serviceRecord = await prisma.service.findUnique({
      where: { slug: svc.id },
    });
    if (!serviceRecord) {
      console.error(`  ✗ Service not found after upsert: ${svc.id}`);
      continue;
    }

    // Link technologies (by display name → slug → id)
    for (const techName of svc.technologies) {
      const techSlug = techNameToSlug[techName];
      if (!techSlug) {
        console.warn(`  ⚠  Unknown technology "${techName}" for service "${svc.id}" — skipping`);
        continue;
      }
      const techId = techSlugToId[techSlug];
      if (!techId) continue;

      const existing = await prisma.serviceTechnology.findFirst({
        where: { serviceId: serviceRecord.id, technologyId: techId },
      });
      if (!existing) {
        await prisma.serviceTechnology.create({
          data: { serviceId: serviceRecord.id, technologyId: techId },
        });
      }
    }

    // Link industries (by display name → slug → id)
    for (const indName of svc.industries) {
      const indSlug = industryNameToSlug[indName];
      if (!indSlug) {
        console.warn(`  ⚠  Unknown industry "${indName}" for service "${svc.id}" — skipping`);
        continue;
      }
      const indId = industrySlugToId[indSlug];
      if (!indId) continue;

      const existing = await prisma.serviceIndustry.findFirst({
        where: { serviceId: serviceRecord.id, industryId: indId },
      });
      if (!existing) {
        await prisma.serviceIndustry.create({
          data: { serviceId: serviceRecord.id, industryId: indId },
        });
      }
    }

    console.log(`  ✓ Service: ${svc.title}`);
  }

  // ── 7. Statistics ─────────────────────────────────────────────────────────
  console.log("\n── Statistics ───────────────────────────────────────────");
  for (let idx = 0; idx < stats.length; idx++) {
    const stat = stats[idx];
    await prisma.statistic.upsert({
      where: { id: stat.id },
      update: {
        label: stat.label,
        value: String(stat.value),
        prefix: stat.prefix ?? null,
        suffix: stat.suffix === "" ? null : stat.suffix,
        order: idx,
      },
      create: {
        id: stat.id,
        label: stat.label,
        value: String(stat.value),
        prefix: stat.prefix ?? null,
        suffix: stat.suffix === "" ? null : stat.suffix,
        order: idx,
        isVisible: true,
      },
    });
    console.log(`  ✓ Statistic: ${stat.label}`);
  }

  // ── 8. Testimonials ───────────────────────────────────────────────────────
  console.log("\n── Testimonials ─────────────────────────────────────────");
  for (let idx = 0; idx < testimonials.length; idx++) {
    const t = testimonials[idx];
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {
        quote: t.quote,
        author: t.name,
        title: t.title,
        company: t.company,
        imageUrl: t.imageUrl ?? null,
        order: idx,
      },
      create: {
        id: t.id,
        quote: t.quote,
        author: t.name,
        title: t.title,
        company: t.company,
        imageUrl: t.imageUrl ?? null,
        status: true,
        order: idx,
      },
    });
    console.log(`  ✓ Testimonial: ${t.name}`);
  }

  // ── 8b. Partners ──────────────────────────────────────────────────────────
  // Seeded as UNVERIFIED — hidden from the public site until an admin verifies
  // each relationship in the admin panel (only isVerified + status=true show).
  console.log("\n── Partners ─────────────────────────────────────────────");
  for (let idx = 0; idx < partners.length; idx++) {
    const p = partners[idx];
    await prisma.partner.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        website: p.website ?? null,
        description: p.description ?? null,
        order: idx,
      },
      create: {
        id: p.id,
        name: p.name,
        website: p.website ?? null,
        description: p.description ?? null,
        order: idx,
        status: true,
        isVerified: false,
      },
    });
    console.log(`  ✓ Partner: ${p.name} (unverified)`);
  }

  // ── 8c. Certifications ────────────────────────────────────────────────────
  // Seeded from the certifications data file as UNVERIFIED — an admin must
  // verify each certification before it is displayed.
  console.log("\n── Certifications ───────────────────────────────────────");
  for (let idx = 0; idx < certifications.length; idx++) {
    const cert = certifications[idx];
    const iconName = resolveIcon(cert.icon);
    await prisma.certification.upsert({
      where: { id: cert.id },
      update: {
        name: cert.name,
        description: cert.description,
        icon: iconName,
        order: idx,
      },
      create: {
        id: cert.id,
        name: cert.name,
        description: cert.description,
        icon: iconName,
        order: idx,
        status: true,
        isVerified: false,
      },
    });
    console.log(`  ✓ Certification: ${cert.name} (unverified)`);
  }

  // ── 8d. Core Values ───────────────────────────────────────────────────────
  console.log("\n── Core Values ──────────────────────────────────────────");
  for (let idx = 0; idx < coreValues.length; idx++) {
    const v = coreValues[idx];
    await prisma.coreValue.upsert({
      where: { id: v.id },
      update: {
        title: v.title,
        description: v.description,
        icon: resolveIcon(v.icon),
        order: idx,
      },
      create: {
        id: v.id,
        title: v.title,
        description: v.description,
        icon: resolveIcon(v.icon),
        order: idx,
        status: true,
      },
    });
    console.log(`  ✓ Core Value: ${v.title}`);
  }

  // ── 9. Careers ────────────────────────────────────────────────────────────
  console.log("\n── Careers ──────────────────────────────────────────────");
  const careerTypeMap: Record<string, "FULL_TIME" | "PART_TIME" | "CONTRACT" | "REMOTE"> = {
    remote: "REMOTE",
    hybrid: "FULL_TIME",
    onsite: "FULL_TIME",
  };
  for (const pos of positions) {
    const careerType = careerTypeMap[pos.type] ?? "FULL_TIME";
    await prisma.career.upsert({
      where: { slug: pos.id },
      update: {
        title: pos.title,
        department: pos.department,
        location: pos.location,
        type: careerType,
        description: pos.description,
        status: true,
      },
      create: {
        slug: pos.id,
        title: pos.title,
        department: pos.department,
        location: pos.location,
        type: careerType,
        description: pos.description,
        status: true,
      },
    });
    console.log(`  ✓ Career: ${pos.title}`);
  }

  // ── 10. Homepage sections ─────────────────────────────────────────────────
  console.log("\n── Homepage Sections ────────────────────────────────────");

  // 10a. Advantages (why-synova)
  await prisma.homepageSection.upsert({
    where: { id: "why-synova" },
    update: {
      title: "Why Synova",
      content: toJsonSafe(advantages),
      order: 0,
    },
    create: {
      id: "why-synova",
      sectionType: "why-synova",
      title: "Why Synova",
      content: toJsonSafe(advantages),
      order: 0,
      isVisible: true,
    },
  });
  console.log("  ✓ Section: Why Synova");

  // 10b. Process
  await prisma.homepageSection.upsert({
    where: { id: "process" },
    update: {
      title: "Our Process",
      content: toJsonSafe(processStages),
      order: 1,
    },
    create: {
      id: "process",
      sectionType: "process",
      title: "Our Process",
      content: toJsonSafe(processStages),
      order: 1,
      isVisible: true,
    },
  });
  console.log("  ✓ Section: Our Process");

  // 10c. Culture pillars
  await prisma.homepageSection.upsert({
    where: { id: "culture" },
    update: {
      title: "Culture",
      content: toJsonSafe(sanitizeForJson(culturePillars)),
      order: 2,
    },
    create: {
      id: "culture",
      sectionType: "culture",
      title: "Culture",
      content: toJsonSafe(sanitizeForJson(culturePillars)),
      order: 2,
      isVisible: true,
    },
  });
  console.log("  ✓ Section: Culture");

  // 10d. Career benefits
  await prisma.homepageSection.upsert({
    where: { id: "career-benefits" },
    update: {
      title: "Benefits",
      content: toJsonSafe(sanitizeForJson(careerBenefits)),
      order: 3,
    },
    create: {
      id: "career-benefits",
      sectionType: "career-benefits",
      title: "Benefits",
      content: toJsonSafe(sanitizeForJson(careerBenefits)),
      order: 3,
      isVisible: true,
    },
  });
  console.log("  ✓ Section: Career Benefits");

  // ── 11. Case studies (as Pages) ──────────────────────────────────────────
  console.log("\n── Case Studies (Pages) ─────────────────────────────────");
  for (const cs of caseStudies) {
    const existingPage = await prisma.page.findUnique({
      where: { slug: cs.id },
    });
    if (!existingPage) {
      await prisma.page.create({
        data: {
          title: cs.title,
          slug: cs.id,
          content: toJsonSafe(cs),
          excerpt: cs.overview,
          status: "PUBLISHED",
          template: "case-study",
          publishedAt: new Date(),
          authorId: admin.id,
        },
      });
      console.log(`  ✓ Case study: ${cs.title}`);
    } else {
      await prisma.page.update({
        where: { slug: cs.id },
        data: {
          title: cs.title,
          content: toJsonSafe(cs),
          excerpt: cs.overview,
          status: "PUBLISHED",
          template: "case-study",
          publishedAt: new Date(),
          authorId: admin.id,
        },
      });
      console.log(`  ✓ Case study (updated): ${cs.title}`);
    }
  }

  // ── 12. Settings ──────────────────────────────────────────────────────────
  console.log("\n── Settings ─────────────────────────────────────────────");

  // 12a. Certifications
  await prisma.setting.upsert({
    where: { key: "certifications" },
    update: { value: JSON.stringify(sanitizeForJson(certifications)) },
    create: {
      key: "certifications",
      value: JSON.stringify(sanitizeForJson(certifications)),
      type: "json",
      description: "Site certifications and accreditations",
    },
  });
  console.log("  ✓ Setting: certifications");

  // 12b. Default site settings
  const defaultSettings: { key: string; value: string; type: string; description: string }[] = [
    {
      key: "site_name",
      value: JSON.stringify(seedConfig.site.name),
      type: "string",
      description: "Site name",
    },
    {
      key: "site_description",
      value: JSON.stringify(seedConfig.site.description),
      type: "string",
      description: "Site description",
    },
    {
      key: "site_url",
      value: JSON.stringify(seedConfig.site.url),
      type: "string",
      description: "Site URL",
    },
    {
      key: "contact_email",
      value: JSON.stringify("contact@synovainfo.com"),
      type: "string",
      description: "Primary contact email",
    },
    {
      key: "contact_phone",
      value: JSON.stringify("+1 (555) 123-4567"),
      type: "string",
      description: "Primary contact phone",
    },
    {
      key: "default_seo_title",
      value: JSON.stringify("Synova Infotech — Enterprise IT Consulting & Digital Transformation"),
      type: "string",
      description: "Default SEO meta title",
    },
    {
      key: "default_seo_description",
      value: JSON.stringify(
        "Synova Infotech delivers enterprise-grade digital transformation, custom software development, and IT consulting services."
      ),
      type: "string",
      description: "Default SEO meta description",
    },
    {
      key: "advantages",
      value: JSON.stringify(advantages),
      type: "json",
      description: "Homepage advantages/why-synova data",
    },
    {
      key: "process_stages",
      value: JSON.stringify(processStages),
      type: "json",
      description: "Development process stages",
    },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, type: s.type },
      create: s,
    });
  }
  console.log(`  ✓ ${defaultSettings.length} default settings`);

  // ── Done ─────────────────────────────────────────────────────────────────
  console.log("\n✅  Seed completed successfully!");
}

main()
  .catch((e: unknown) => {
    console.error("\n❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
