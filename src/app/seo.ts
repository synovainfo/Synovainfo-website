import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Synova Infotech | Enterprise Software Development Company Pune",
    template: "%s | Synova Infotech",
  },
  description:
    "Synova Infotech Private Limited — Pune-based enterprise software development company delivering custom software, cloud solutions, AI/ML, cybersecurity, and digital transformation services.",
  keywords: [
    "enterprise software development",
    "digital transformation",
    "IT consultancy Pune",
    "Synova Infotech",
    "custom software solutions",
    "cloud solutions",
    "AI/ML services",
    "cybersecurity services",
    "software development company Pune",
  ],
  authors: [{ name: "Synova Infotech Private Limited" }],
  creator: "Synova Infotech Private Limited",
  publisher: "Synova Infotech Private Limited",
  metadataBase: new URL("https://synovainfotech.com"),
  openGraph: {
    title: "Synova Infotech | Enterprise Software Development Company",
    description:
      "Enterprise-grade software solutions that transform operations, accelerate growth, and build digital transformation.",
    url: "https://synovainfotech.com",
    siteName: "Synova Infotech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Synova Infotech | Enterprise Software Development",
    description:
      "Enterprise-grade software solutions that transform operations, accelerate growth, and build digital transformation.",
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
