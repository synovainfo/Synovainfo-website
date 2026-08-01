import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Synova Infotech | Enterprise Architecture & Digital Engineering",
    template: "%s | Synova Infotech",
  },
  description:
    "Synova Infotech architects mission-critical cloud platforms, autonomous AI systems, and zero-trust security meshes for Fortune 500 enterprises. 99.999% SLA uptime. ISO 27001 & SOC 2 Type II certified.",
  keywords: [
    "enterprise architecture",
    "digital engineering",
    "multi-cloud infrastructure",
    "zero trust security",
    "agentic AI",
    "Fortune 500 technology partner",
    "digital transformation consulting",
    "enterprise microservices",
    "Synova Infotech Pune",
    "enterprise software architecture",
  ],
  authors: [{ name: "Synova Infotech Private Limited" }],
  creator: "Synova Infotech Private Limited",
  publisher: "Synova Infotech Private Limited",
  metadataBase: new URL("https://synovainfo.com"),
  openGraph: {
    title: "Synova Infotech | Enterprise Architecture & Digital Engineering",
    description:
      "Mission-critical platforms engineered for Fortune 500 scale. Multi-cloud infrastructure, agentic AI pipelines, and zero-trust security architectures with 99.999% SLA guarantees.",
    url: "https://synovainfo.com",
    siteName: "Synova Infotech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Synova Infotech | Enterprise Architecture & Digital Engineering",
    description:
      "Mission-critical platforms engineered for Fortune 500 scale. Multi-cloud infrastructure, agentic AI, and zero-trust security with 99.999% SLA guarantees.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};
