// =============================================================================
// Typed JSON-LD Schema Generators
// Schema.org compliant structured data generators
// =============================================================================

// ---------------------------------------------------------------------------
// Base types
// ---------------------------------------------------------------------------

export type Thing = Record<string, unknown>;

// ---------------------------------------------------------------------------
// Organization
// ---------------------------------------------------------------------------

export interface OrganizationInput {
  name: string;
  url: string;
  logo?: string;
  legalName?: string;
  description?: string;
  foundingDate?: string;
  identifier?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    contactType: string;
    telephone?: string;
    email?: string;
    url?: string;
  };
  sameAs?: string[];
}

export function organizationSchema(input: OrganizationInput): Thing {
  const baseUrl = input.url;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: input.name,
    url: baseUrl,
    ...(input.legalName && { legalName: input.legalName }),
    ...(input.description && { description: input.description }),
    ...(input.logo && { logo: input.logo }),
    ...(input.foundingDate && { foundingDate: input.foundingDate }),
    ...(input.identifier && { identifier: input.identifier }),
    ...(input.address && {
      address: {
        "@type": "PostalAddress",
        ...input.address,
      },
    }),
    ...(input.contactPoint && {
      contactPoint: {
        "@type": "ContactPoint",
        ...input.contactPoint,
      },
    }),
    ...(input.sameAs && input.sameAs.length > 0 && { sameAs: input.sameAs }),
  };
}

// ---------------------------------------------------------------------------
// WebSite
// ---------------------------------------------------------------------------

export interface WebSiteInput {
  name: string;
  url: string;
  description?: string;
  searchAction?: {
    target: string;
    queryInput: string;
  };
}

export function websiteSchema(input: WebSiteInput): Thing {
  const baseUrl = input.url;
  const result: Thing = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: input.name,
    inLanguage: "en-US",
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
  };

  if (input.description) {
    result.description = input.description;
  }

  if (input.searchAction) {
    result.potentialAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: input.searchAction.target,
      },
      "query-input": input.searchAction.queryInput,
    };
  }

  return result;
}

// ---------------------------------------------------------------------------
// WebPage
// ---------------------------------------------------------------------------

export interface WebPageInput {
  name: string;
  description?: string;
  url: string;
  breadcrumb?: Thing[];
}

export function webPageSchema(input: WebPageInput): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.breadcrumb && {
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: input.breadcrumb,
      },
    }),
  };
}

// ---------------------------------------------------------------------------
// Article
// ---------------------------------------------------------------------------

export interface ArticleInput {
  headline: string;
  description?: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
    image?: string;
  };
  publisher: {
    name: string;
    logo?: string;
  };
}

export function articleSchema(input: ArticleInput): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    ...(input.description && { description: input.description }),
    ...(input.image && { image: input.image }),
    ...(input.datePublished && { datePublished: input.datePublished }),
    ...(input.dateModified && { dateModified: input.dateModified }),
    author: {
      "@type": "Person",
      name: input.author.name,
      ...(input.author.url && { url: input.author.url }),
      ...(input.author.image && { image: input.author.image }),
    },
    publisher: {
      "@type": "Organization",
      name: input.publisher.name,
      ...(input.publisher.logo && {
        logo: {
          "@type": "ImageObject",
          url: input.publisher.logo,
        },
      }),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
  };
}

// ---------------------------------------------------------------------------
// FAQPage
// ---------------------------------------------------------------------------

export interface FAQPageInput {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export function faqPageSchema(input: FAQPageInput): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: input.questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------

export interface BreadcrumbItem {
  position: number;
  name: string;
  item: string;
}

export function breadcrumbListSchema(items: BreadcrumbItem[]): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  };
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export interface ServiceInput {
  name: string;
  description?: string;
  url: string;
  providerName: string;
  providerUrl: string;
  serviceType?: string[];
  areaServed?: string;
  image?: string;
  category?: string;
}

export function serviceSchema(input: ServiceInput): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${input.url}#service`,
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.image && { image: input.image }),
    ...(input.category && { category: input.category }),
    provider: {
      "@type": "Organization",
      name: input.providerName,
      url: input.providerUrl,
    },
    ...(input.serviceType && { serviceType: input.serviceType }),
    ...(input.areaServed && { areaServed: input.areaServed }),
  };
}

// ---------------------------------------------------------------------------
// JobPosting
// ---------------------------------------------------------------------------

export interface JobPostingInput {
  title: string;
  description: string;
  url: string;
  datePosted: string;
  validThrough?: string;
  employmentType?: string;
  hiringOrganization: {
    name: string;
    sameAs?: string;
    logo?: string;
  };
  jobLocation?: {
    addressLocality: string;
    addressRegion?: string;
    addressCountry: string;
  };
  baseSalary?: {
    currency: string;
    minValue: number;
    maxValue: number;
    unitText: string;
  };
  department?: string;
}

export function jobPostingSchema(input: JobPostingInput): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: input.title,
    description: input.description,
    datePosted: input.datePosted,
    ...(input.validThrough && { validThrough: input.validThrough }),
    ...(input.employmentType && { employmentType: input.employmentType }),
    hiringOrganization: {
      "@type": "Organization",
      name: input.hiringOrganization.name,
      ...(input.hiringOrganization.sameAs && {
        sameAs: input.hiringOrganization.sameAs,
      }),
      ...(input.hiringOrganization.logo && {
        logo: input.hiringOrganization.logo,
      }),
    },
    ...(input.jobLocation && {
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          ...input.jobLocation,
        },
      },
    }),
    ...(input.baseSalary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: input.baseSalary.currency,
        value: {
          "@type": "QuantitativeValue",
          minValue: input.baseSalary.minValue,
          maxValue: input.baseSalary.maxValue,
          unitText: input.baseSalary.unitText,
        },
      },
    }),
    ...(input.department && { department: input.department }),
  };
}

// ---------------------------------------------------------------------------
// LocalBusiness
// ---------------------------------------------------------------------------

export interface LocalBusinessInput {
  name: string;
  description: string;
  url: string;
  telephone?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: {
    days: string[];
    opens: string;
    closes: string;
  };
  priceRange?: string;
  areaServed?: Array<{ type: string; name: string }>;
  images?: string[];
}

export function localBusinessSchema(input: LocalBusinessInput): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${input.url}/#localbusiness`,
    parentOrganization: {
      "@id": `${input.url}/#organization`,
    },
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.telephone && { telephone: input.telephone }),
    ...(input.priceRange && { priceRange: input.priceRange }),
    address: {
      "@type": "PostalAddress",
      ...input.address,
    },
    ...(input.geo && {
      geo: {
        "@type": "GeoCoordinates",
        ...input.geo,
      },
    }),
    ...(input.openingHours && {
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: input.openingHours.days,
        opens: input.openingHours.opens,
        closes: input.openingHours.closes,
      },
    }),
    ...(input.areaServed &&
      input.areaServed.length > 0 && {
        areaServed: input.areaServed.map((a) => ({
          "@type": a.type,
          name: a.name,
        })),
      }),
    ...(input.images &&
      input.images.length > 0 && {
        image: input.images,
      }),
  };
}

// ---------------------------------------------------------------------------
// Graph builder — combine multiple schemas into @graph
// ---------------------------------------------------------------------------

export interface GraphInput {
  organization?: OrganizationInput;
  website?: WebSiteInput;
  localBusiness?: LocalBusinessInput;
  webPage?: WebPageInput;
  article?: ArticleInput;
  faqPage?: FAQPageInput;
  breadcrumb?: BreadcrumbItem[];
  service?: ServiceInput;
  jobPosting?: JobPostingInput;
}

/**
 * Build a complete @graph array from multiple schema inputs.
 * Each schema is generated with its own @context and @type, then
 * merged into a single @graph structure.
 */
export function buildGraph(input: GraphInput): Thing {
  const graph: Thing[] = [];

  if (input.organization) {
    const org = organizationSchema(input.organization);
    const { "@context": _ctx, ...rest } = org;
    graph.push(rest);
  }

  if (input.website) {
    const site = websiteSchema(input.website);
    const { "@context": _ctx, ...rest } = site;
    graph.push(rest);
  }

  if (input.localBusiness) {
    const biz = localBusinessSchema(input.localBusiness);
    const { "@context": _ctx, ...rest } = biz;
    graph.push(rest);
  }

  if (input.webPage) {
    const page = webPageSchema(input.webPage);
    const { "@context": _ctx, ...rest } = page;
    graph.push(rest);
  }

  if (input.article) {
    const art = articleSchema(input.article);
    const { "@context": _ctx, ...rest } = art;
    graph.push(rest);
  }

  if (input.faqPage) {
    const faq = faqPageSchema(input.faqPage);
    const { "@context": _ctx, ...rest } = faq;
    graph.push(rest);
  }

  if (input.breadcrumb && input.breadcrumb.length > 0) {
    const bc = breadcrumbListSchema(input.breadcrumb);
    const { "@context": _ctx, ...rest } = bc;
    graph.push(rest);
  }

  if (input.service) {
    const svc = serviceSchema(input.service);
    const { "@context": _ctx, ...rest } = svc;
    graph.push(rest);
  }

  if (input.jobPosting) {
    const job = jobPostingSchema(input.jobPosting);
    const { "@context": _ctx, ...rest } = job;
    graph.push(rest);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
