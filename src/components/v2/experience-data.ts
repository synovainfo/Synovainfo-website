export interface V2PageContent {
  eyebrow: string
  title: string
  summary: string
  primaryCta?: string
  primaryHref?: string
  secondaryCta?: string
  secondaryHref?: string
}

export const v2Pages = {
  home: {
    eyebrow: "Synova Enterprise Systems Studio",
    title: "Digital infrastructure for companies that cannot afford fragile technology.",
    summary:
      "Synova designs, builds, secures, and operates business-critical software platforms across cloud, data, AI, automation, and customer experience.",
    primaryCta: "Request architecture audit",
    primaryHref: "/contact",
    secondaryCta: "Explore services",
    secondaryHref: "/services",
  },
  about: {
    eyebrow: "Operating Philosophy",
    title: "A senior engineering partner for durable enterprise transformation.",
    summary:
      "We combine architecture discipline, product thinking, security governance, and pragmatic delivery to create systems that executives can trust and teams can evolve.",
  },
  services: {
    eyebrow: "Service Portfolio",
    title: "From strategic architecture to managed operations.",
    summary:
      "Each service is structured as a business capability: discovery, solution architecture, delivery governance, observability, security, and measurable adoption.",
  },
  solutions: {
    eyebrow: "Solution Blueprints",
    title: "Reusable enterprise patterns adapted to your operating model.",
    summary:
      "We convert recurring business problems into secure reference architectures for workflow modernization, AI enablement, cloud migration, and digital operations.",
  },
  technologies: {
    eyebrow: "Technology Ecosystem",
    title: "A composable stack for resilient, governed, high-performance systems.",
    summary:
      "Synova evaluates technology through maintainability, security posture, integration cost, operational maturity, and long-term talent availability.",
  },
  industries: {
    eyebrow: "Industry Systems",
    title: "Domain-aware platforms for regulated and operationally complex sectors.",
    summary:
      "We map industry constraints into architecture decisions: compliance, latency, data quality, auditability, uptime, and field operations.",
  },
  caseStudies: {
    eyebrow: "Implementation Stories",
    title: "Premium editorial narratives for strategy, architecture, delivery, and outcome.",
    summary:
      "Case studies are structured to help executives understand the problem, decision model, technical design, delivery risk, and business impact.",
  },
  portfolio: {
    eyebrow: "Selected Work",
    title: "A portfolio of engineered business systems, not isolated screens.",
    summary:
      "Explore how product surfaces, integrations, governance, and operating workflows come together into cohesive enterprise platforms.",
  },
  insights: {
    eyebrow: "Executive Intelligence",
    title: "Analysis for leaders making technology investment decisions.",
    summary:
      "Thought leadership on modernization, AI adoption, data platforms, cyber resilience, and the economics of enterprise software delivery.",
  },
  blog: {
    eyebrow: "Engineering Journal",
    title: "Practical writing for enterprise technology teams.",
    summary:
      "Architecture notes, implementation guidance, operating patterns, and decision frameworks from Synova practitioners.",
  },
  careers: {
    eyebrow: "Careers",
    title: "Build systems where engineering judgment matters.",
    summary:
      "Join a team that values architecture, craft, security, documentation, and calm delivery under real enterprise constraints.",
  },
  contact: {
    eyebrow: "Start a Conversation",
    title: "Bring us a complex business system. We will map the path forward.",
    summary:
      "Use the consultation request to share context, constraints, timeline, and goals. A senior Synova consultant will review the fit.",
  },
  faq: {
    eyebrow: "Buying Clarity",
    title: "Answers for executives, product owners, and technology leaders.",
    summary:
      "Understand how Synova scopes engagements, protects systems, handles delivery governance, and supports platforms after launch.",
  },
  privacy: {
    eyebrow: "Governance",
    title: "Privacy practices built around responsible data handling.",
    summary:
      "Synova treats privacy as a delivery requirement, including minimization, access control, retention, and secure operational handling.",
  },
  terms: {
    eyebrow: "Commercial Terms",
    title: "Clear operating expectations for professional technology engagements.",
    summary:
      "These terms define acceptable use, intellectual property, confidentiality, service constraints, and liability boundaries.",
  },
  search: {
    eyebrow: "Search",
    title: "Find capabilities, industries, roles, and insights across Synova.",
    summary:
      "Search the public knowledge surface for services, sectors, pages, careers, FAQs, and published content.",
  },
  sitemap: {
    eyebrow: "Site Index",
    title: "A structured map of Synova's public experience.",
    summary:
      "Navigate core pages, service narratives, industry views, resources, legal pages, and conversion paths.",
  },
  notFound: {
    eyebrow: "404",
    title: "This route does not exist in the current Synova system map.",
    summary:
      "Use the navigation paths below to return to the main architecture, services, or contact surfaces.",
  },
  error: {
    eyebrow: "500",
    title: "The application encountered an unexpected fault.",
    summary:
      "The public experience is still available through the primary routes while the fault is investigated.",
  },
} satisfies Record<string, V2PageContent>

export const v2Services = [
  {
    name: "Enterprise Software",
    impact: "Replace brittle workflows with secure, maintainable operating platforms.",
    architecture: ["Domain modeling", "API gateway", "Role-based workflows", "Observability"],
  },
  {
    name: "Cloud & DevOps",
    impact: "Modernize infrastructure with reproducible environments and governed delivery.",
    architecture: ["IaC", "CI/CD", "Container platforms", "Release governance"],
  },
  {
    name: "AI & Data Systems",
    impact: "Operationalize AI where it improves decisions, automation, and productivity.",
    architecture: ["Data contracts", "Model governance", "Human review", "Audit trails"],
  },
  {
    name: "Cybersecurity",
    impact: "Reduce risk through secure-by-design architecture and continuous controls.",
    architecture: ["Threat modeling", "RBAC", "Secure SDLC", "Incident readiness"],
  },
]

export const v2Industries = [
  "Manufacturing",
  "Healthcare",
  "Finance",
  "Retail",
  "Logistics",
  "Education",
  "Government",
  "Telecom",
]

export const v2Process = [
  "Executive discovery",
  "Architecture blueprint",
  "Delivery system",
  "Security validation",
  "Production release",
  "Managed evolution",
]

export const v2TechnologyNodes = [
  "Experience",
  "API",
  "Data",
  "AI",
  "Cloud",
  "Security",
  "Observability",
  "Governance",
]
