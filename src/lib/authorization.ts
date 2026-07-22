// =============================================================================
// Authorization middleware and helpers for Next.js App Router API routes
// Uses getToken (edge-safe) instead of getServerSession
// =============================================================================

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { hasPermission } from "@/lib/permissions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Standard Next.js App Router API route handler.
 * The second generic allows callers to specify their params type.
 */
export type ApiHandler<T = { [key: string]: string | string[] | undefined }> = (
  request: NextRequest,
  context: { params: Promise<T> },
) => Promise<NextResponse>;

/**
 * Result of a permission check — either an error Response or null (authorized).
 */
type GuardResult = NextResponse | null;

// ---------------------------------------------------------------------------
// Guard: requirePermission
// ---------------------------------------------------------------------------

/**
 * Create a guard middleware that checks a specific permission.
 *
 * Usage in API routes:
 * ```
 * const guard = requirePermission("pages:create");
 * const guardResult = await guard(request);
 * if (guardResult) return guardResult;
 * ```
 *
 * Returns 401 if no valid token; 403 if token lacks the required permission.
 */
export function requirePermission(permission: string) {
  return async (request: NextRequest): Promise<GuardResult> => {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    if (!hasPermission(token.role ?? "", permission)) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "You do not have permission to perform this action",
          requiredPermission: permission,
        },
        { status: 403 },
      );
    }

    return null;
  };
}

// ---------------------------------------------------------------------------
// Guard: requireAuth
// ---------------------------------------------------------------------------

/**
 * Guard that only checks authentication (any authenticated user).
 * Use for routes where any logged-in user is acceptable.
 *
 * Returns 401 if no valid token; null (authorized) otherwise.
 */
export async function requireAuth(
  request: NextRequest,
): Promise<GuardResult> {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Authentication required" },
      { status: 401 },
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Wrapper: withPermission
// ---------------------------------------------------------------------------

/**
 * Higher-order wrapper that guards an API route handler with a permission check.
 * If the check fails, the handler is never invoked — a 401/403 is returned.
 *
 * Usage:
 * ```
 * export const GET = withPermission(
 *   async (request, { params }) => { ... },
 *   "pages:read",
 * );
 * ```
 */
export function withPermission<T extends { [key: string]: string | string[] | undefined }>(
  handler: ApiHandler<T>,
  permission: string,
): ApiHandler<T> {
  const guard = requirePermission(permission);

  return async (request: NextRequest, context: { params: Promise<T> }) => {
    const guardResult = await guard(request);
    if (guardResult) return guardResult;
    return handler(request, context);
  };
}

// ---------------------------------------------------------------------------
// Wrapper: withAuth
// ---------------------------------------------------------------------------

/**
 * Higher-order wrapper that guards an API route with authentication only.
 * Use when the route needs a logged-in user but no specific permission.
 *
 * Usage:
 * ```
 * export const GET = withAuth(async (request, { params }) => { ... });
 * ```
 */
export function withAuth<T extends { [key: string]: string | string[] | undefined }>(
  handler: ApiHandler<T>,
): ApiHandler<T> {
  return async (request: NextRequest, context: { params: Promise<T> }) => {
    const authResult = await requireAuth(request);
    if (authResult) return authResult;
    return handler(request, context);
  };
}

// ---------------------------------------------------------------------------
// Helper: extract token with role inside a route handler
// ---------------------------------------------------------------------------

/**
 * Safely extract the authenticated user's role from the request token.
 * Returns null if no valid token is present.
 */
export async function getUserRole(
  request: NextRequest,
): Promise<string | null> {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  return token?.role ?? null;
}
