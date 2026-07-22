import type { NextConfig } from "next";

let nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: "C:\\Users\\Dinesh Nikam\\Desktop\\mirai\\synova",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  serverExternalPackages: ["bcryptjs"],
};

// Bundle analyzer - only when ANALYZE=true
if (process.env.ANALYZE === "true") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const withBundleAnalyzer = require("@next/bundle-analyzer").default({
    enabled: true,
  });
  nextConfig = withBundleAnalyzer(nextConfig);
}

// Sentry configuration
const { withSentryConfig } = require("@sentry/nextjs");

const sentryConfig = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  // disableLogger is deprecated - use webpack.treeshake.removeDebugLogging instead
  // automaticVercelMonitors is deprecated - use webpack.automaticVercelMonitors instead
};

module.exports = withSentryConfig(nextConfig, sentryConfig);
