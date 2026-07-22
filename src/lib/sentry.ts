import * as Sentry from "@sentry/nextjs";

export function initSentry() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      debug: process.env.NODE_ENV === "development",
      environment: process.env.NODE_ENV || "development",
      enabled:
        process.env.NODE_ENV === "production" || !!process.env.SENTRY_DSN,
    });
  }
}

export function captureError(
  error: Error,
  context?: Record<string, unknown>
) {
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  }
  console.error("[Error]", error.message, context || "");
}

// React Error Boundary wrapper
export { ErrorBoundary as SentryErrorBoundary } from "@sentry/nextjs";
