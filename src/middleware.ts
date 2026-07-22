import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const requestId = uuidv4();
  const start = Date.now();

  // -----------------------------------------------------------------------
  // Auth protection — protect /admin/* routes (except login page)
  // -----------------------------------------------------------------------
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Clone response to add headers
  const response = NextResponse.next();

  // Add request ID header
  response.headers.set("X-Request-Id", requestId);

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), camera=(), microphone=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Content-Security-Policy (relaxed for development)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.sentry.io",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' blob: data: https: http:",
        "font-src 'self'",
        "connect-src 'self' https: http://localhost:*",
        "media-src 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; ")
    );
  }

  // Performance: report response time as header
  const duration = Date.now() - start;
  response.headers.set("X-Response-Time", `${duration}ms`);

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except static files, _next, and API auth
    "/((?!_next/static|_next/image|favicon.ico|images/|api/auth).*)",
  ],
};
