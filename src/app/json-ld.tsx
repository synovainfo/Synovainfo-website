import { prisma } from "@/lib/prisma";
import {
  buildGraph,
  type OrganizationInput,
  type WebSiteInput,
  type LocalBusinessInput,
} from "@/lib/json-ld";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://synovainfotech.com";

// =============================================================================
// Defaults when DB settings are not available
// =============================================================================

const DEFAULT_ORGANIZATION: OrganizationInput = {
  name: "Synova Infotech Private Limited",
  url: BASE_URL,
  legalName: "Synova Infotech Private Limited",
  description:
    "Enterprise software development company based in Pune, India. Delivering custom software, cloud solutions, AI/ML, cybersecurity, and digital transformation services.",
  foundingDate: "2026",
  identifier: "U62099PN2026PTC257266",
  address: {
    streetAddress: "Fl-24, Trish Manor, Kondhwa",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    postalCode: "411048",
    addressCountry: "IN",
  },
  contactPoint: {
    contactType: "sales",
    url: BASE_URL,
  },
};

const DEFAULT_WEBSITE: WebSiteInput = {
  name: "Synova Infotech",
  url: BASE_URL,
  description: "Enterprise software development company in Pune, India",
};

const DEFAULT_LOCAL_BUSINESS: LocalBusinessInput = {
  name: "Synova Infotech Private Limited",
  description:
    "Enterprise software development company in Pune delivering custom software, cloud solutions, AI/ML, cybersecurity, and digital transformation services.",
  url: BASE_URL,
  telephone: "",
  address: {
    streetAddress: "Fl-24, Trish Manor, Kondhwa",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    postalCode: "411048",
    addressCountry: "IN",
  },
  geo: {
    latitude: 18.4598,
    longitude: 73.8926,
  },
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  priceRange: "₹₹",
  areaServed: [
    { type: "City", name: "Pune" },
    { type: "Country", name: "India" },
  ],
};

// =============================================================================
// Helpers
// =============================================================================

interface OrgSettings {
  name?: string;
  legalName?: string;
  description?: string;
  foundingDate?: string;
  identifier?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    contactType?: string;
    telephone?: string;
    email?: string;
    url?: string;
  };
  sameAs?: string[];
  logo?: string;
  telephone?: string;
  geo?: { latitude?: number; longitude?: number };
  openingHours?: { days?: string[]; opens?: string; closes?: string };
  priceRange?: string;
  areaServed?: Array<{ type?: string; name?: string }>;
  [key: string]: unknown;
}

function mergeOrg(
  defaults: OrganizationInput,
  overrides: Partial<OrgSettings>,
): OrganizationInput {
  return {
    ...defaults,
    ...overrides,
    name: overrides.name || defaults.name,
    legalName: overrides.legalName || defaults.legalName,
    description: overrides.description || defaults.description,
    foundingDate: overrides.foundingDate || defaults.foundingDate,
    identifier: overrides.identifier || defaults.identifier,
    address: overrides.address
      ? { ...defaults.address!, ...overrides.address }
      : defaults.address,
    contactPoint: overrides.contactPoint
      ? { ...defaults.contactPoint!, ...overrides.contactPoint }
      : defaults.contactPoint,
    sameAs: overrides.sameAs || defaults.sameAs,
    logo: overrides.logo || defaults.logo,
  };
}

function mergeLocalBusiness(
  defaults: LocalBusinessInput,
  overrides: Partial<OrgSettings>,
): LocalBusinessInput {
  const merged: LocalBusinessInput = {
    ...defaults,
    name: overrides.name || defaults.name,
    description: overrides.description || defaults.description,
    telephone: overrides.telephone || defaults.telephone,
    priceRange: overrides.priceRange || defaults.priceRange,
    address: overrides.address
      ? { ...defaults.address, ...overrides.address }
      : defaults.address,
    geo: overrides.geo
      ? {
          latitude: overrides.geo.latitude ?? defaults.geo!.latitude,
          longitude: overrides.geo.longitude ?? defaults.geo!.longitude,
        }
      : defaults.geo,
    openingHours: overrides.openingHours
      ? {
          days: overrides.openingHours.days || defaults.openingHours!.days,
          opens: overrides.openingHours.opens || defaults.openingHours!.opens,
          closes: overrides.openingHours.closes || defaults.openingHours!.closes,
        }
      : defaults.openingHours,
    areaServed: overrides.areaServed
      ? overrides.areaServed.map((a) => ({
          type: a.type || "City",
          name: a.name || "",
        }))
      : defaults.areaServed,
  };
  return merged;
}

// =============================================================================
// Component
// =============================================================================

export default async function JsonLd() {
  let orgInput = DEFAULT_ORGANIZATION;
  let websiteInput = DEFAULT_WEBSITE;
  let localBusinessInput = DEFAULT_LOCAL_BUSINESS;

  try {
    // Try to load organization settings from DB
    const orgSetting = await prisma.setting.findUnique({
      where: { key: "organization" },
    });

    if (orgSetting?.value) {
      const parsed = JSON.parse(orgSetting.value) as OrgSettings;
      orgInput = mergeOrg(DEFAULT_ORGANIZATION, parsed);
      websiteInput = {
        ...DEFAULT_WEBSITE,
        name: parsed.name
          ? parsed.name.replace(" Private Limited", "")
          : DEFAULT_WEBSITE.name,
        description: parsed.description || DEFAULT_WEBSITE.description,
      };
      localBusinessInput = mergeLocalBusiness(DEFAULT_LOCAL_BUSINESS, parsed);
    }

    // Try to load contact settings for additional info
    const contactSetting = await prisma.setting.findUnique({
      where: { key: "contact" },
    });

    if (contactSetting?.value) {
      const contact = JSON.parse(contactSetting.value) as Record<string, unknown>;
      if (contact.phone && typeof contact.phone === "string") {
        orgInput.contactPoint = {
          ...orgInput.contactPoint!,
          telephone: contact.phone,
        };
        localBusinessInput.telephone = contact.phone;
      }
      if (contact.email && typeof contact.email === "string") {
        orgInput.contactPoint = {
          ...orgInput.contactPoint!,
          email: contact.email,
        };
      }
    }
  } catch {
    // If DB fetch fails, fall back to defaults (already set)
  }

  // Fetch active services for the Service schema
  let serviceTypes: string[] = [];
  try {
    const services = await prisma.service.findMany({
      where: { status: true, deletedAt: null },
      select: { title: true },
      orderBy: { createdAt: "asc" },
    });
    serviceTypes = services.map((s) => s.title);
  } catch {
    // Fall back to defaults
    serviceTypes = [];
  }

  const graph = buildGraph({
    organization: orgInput,
    website: websiteInput,
    localBusiness: localBusinessInput,
  });

  if (serviceTypes.length > 0) {
    (graph["@graph"] as Record<string, unknown>[]).push({
      "@type": "Service",
      "@id": `${BASE_URL}/#service`,
      provider: {
        "@id": `${BASE_URL}/#organization`,
      },
      name: "Enterprise Software Development Services",
      description:
        "End-to-end software development including custom applications, cloud migration, AI/ML solutions, cybersecurity, and digital transformation.",
      serviceType: serviceTypes,
      areaServed: "India",
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph),
      }}
    />
  );
}
