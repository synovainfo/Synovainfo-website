import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// CSRF Protection — Double-Submit Cookie Pattern
// ---------------------------------------------------------------------------

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";
const DEFAULT_EXPIRY_SECONDS = 86400; // 24 hours

/**
 * Generate a cryptographically secure CSRF token.
 */
export function generateCsrfToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Set the CSRF double-submit cookie on a response.
 * Call this on login or when a new CSRF token is needed.
 */
export function setCsrfCookie(response: NextResponse, expirySeconds = DEFAULT_EXPIRY_SECONDS): string {
  const token = generateCsrfToken();

  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: expirySeconds,
  });

  return token;
}

/**
 * Verify a CSRF token by comparing the cookie value with the request header value.
 * Both must be present, non-empty, and equal.
 */
export function verifyCsrfToken(request: NextRequest): boolean {
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  if (cookieToken.length !== headerToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    result |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
  }

  return result === 0;
}

/**
 * CSRF middleware for API routes.
 * Skips verification for GET, HEAD, and OPTIONS requests (safe methods).
 * Returns 403 with error message if verification fails.
 */
export function csrfMiddleware(
  request: NextRequest,
  options?: { expirySeconds?: number }
): NextResponse | null {
  // Safe methods — no CSRF check needed
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(request.method)) {
    return null;
  }

  // Verify CSRF token
  if (!verifyCsrfToken(request)) {
    return new NextResponse(
      JSON.stringify({
        error: "CSRF validation failed",
        message: "Invalid or missing CSRF token. Refresh the page and try again.",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Failed": "1",
        },
      }
    );
  }

  return null;
}
