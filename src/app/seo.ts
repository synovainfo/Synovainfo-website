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
  metadataBase: new URL("https://synovainfotech.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "en-US": "/",
      "en-GB": "/",
      "en-SG": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Synova Infotech | Enterprise Architecture & Digital Engineering",
    description:
      "Mission-critical platforms engineered for Fortune 500 scale. Multi-cloud infrastructure, agentic AI pipelines, and zero-trust security architectures with 99.999% SLA guarantees.",
    url: "https://synovainfotech.com",
    siteName: "Synova Infotech",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Synova Infotech Enterprise Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Synova Infotech | Enterprise Architecture & Digital Engineering",
    description:
      "Mission-critical platforms engineered for Fortune 500 scale. Multi-cloud infrastructure, agentic AI, and zero-trust security with 99.999% SLA guarantees.",
    images: ["/og-image.png"],
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
