import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createChildLogger } from "@/lib/logger";
import type { RedirectType as PrismaRedirectType } from "@/generated/prisma/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Redirect {
  id: string;
  source: string;
  target: string;
  type: 301 | 302;
  wildcard: boolean;
  active: boolean;
  createdAt: Date;
  hitCount: number;
}

export interface CreateRedirectInput {
  source: string;
  target: string;
  type?: 301 | 302;
  wildcard?: boolean;
}

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const createRedirectSchema = z.object({
  source: z
    .string()
    .min(1, "Source path is required")
    .max(500, "Source path must be at most 500 characters")
    .startsWith("/", "Source path must start with /"),
  target: z
    .string()
    .min(1, "Target path is required")
    .max(500, "Target path must be at most 500 characters")
    .startsWith("/", "Target path must start with /"),
  type: z.union([z.literal(301), z.literal(302)]).default(301),
  wildcard: z.boolean().default(false),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const logger = createChildLogger("redirect");

/** Map Prisma RedirectType enum (PERMANENT_301 / TEMPORARY_302) to numeric type. */
function toNumericType(type: PrismaRedirectType): 301 | 302 {
  return type === "PERMANENT_301" ? 301 : 302;
}

/** Map numeric type back to Prisma enum. */
function toPrismaType(type: 301 | 302): PrismaRedirectType {
  return type === 301 ? "PERMANENT_301" : "TEMPORARY_302";
}

/** Convert a Prisma redirect row to the public Redirect shape. */
function toRedirect(row: {
  id: string;
  source: string;
  target: string;
  type: PrismaRedirectType;
  isWildcard: boolean;
  status: boolean;
  createdAt: Date;
  hitCount: number;
}): Redirect {
  return {
    id: row.id,
    source: row.source,
    target: row.target,
    type: toNumericType(row.type),
    wildcard: row.isWildcard,
    active: row.status,
    createdAt: row.createdAt,
    hitCount: row.hitCount,
  };
}

/**
 * Convert a wildcard source pattern into a RegExp.
 * E.g. `/old-blog/*` → `/old-blog/(.+)`
 */
function wildcardToRegex(source: string): RegExp {
  const escaped = source.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  const pattern = escaped.replace(/\*/g, "(.+)");
  return new RegExp(`^${pattern}$`);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Resolve a wildcard pattern against an actual path.
 * Returns the target with `*` replaced by the captured segment(s), or null if
 * the path does not match.
 *
 * @example
 *   resolveWildcard("/old-blog/*", "/old-blog/hello-world") // → "/blog/hello-world"
 */
export function resolveWildcard(source: string, target: string, path: string): string | null {
  const regex = wildcardToRegex(source);
  const match = path.match(regex);
  if (!match) return null;

  // Replace each `*` in the target with the corresponding captured group
  let result = target;
  const captures = match.slice(1);
  let idx = 0;
  result = result.replace(/\*/g, () => captures[idx++] ?? "");
  return result;
}

/**
 * Look up a redirect by source path. Supports wildcard matching:
 *   1. Exact source match first.
 *   2. Then checks all active wildcard patterns.
 *
 * Returns the matched redirect's target and HTTP status type, or null if no
 * redirect applies.
 */
export async function getRedirect(
  source: string,
): Promise<{ target: string; type: number } | null> {
  try {
    // 1. Exact match
    const exact = await prisma.redirect.findUnique({
      where: { source },
    });

    if (exact && exact.status) {
      logger.debug({ source, target: exact.target }, "redirect exact match");

      // Increment hit count asynchronously (fire-and-forget)
      incrementHitCount(exact.id);

      return { target: exact.target, type: toNumericType(exact.type) };
    }

    // 2. Wildcard match — load all active wildcard redirects
    const wildcards = await prisma.redirect.findMany({
      where: { isWildcard: true, status: true },
    });

    for (const wc of wildcards) {
      const resolved = resolveWildcard(wc.source, wc.target, source);
      if (resolved !== null) {
        logger.debug({ source, pattern: wc.source, target: resolved }, "redirect wildcard match");

        incrementHitCount(wc.id);

        return { target: resolved, type: toNumericType(wc.type) };
      }
    }

    return null;
  } catch (error) {
    logger.error({ err: error, source }, "getRedirect failed");
    return null;
  }
}

/**
 * List all active redirects, ordered by creation date descending.
 */
export async function getAllRedirects(): Promise<Redirect[]> {
  try {
    const rows = await prisma.redirect.findMany({
      where: { status: true },
      orderBy: { createdAt: "desc" },
    });

    return rows.map(toRedirect);
  } catch (error) {
    logger.error({ err: error }, "getAllRedirects failed");
    return [];
  }
}

/**
 * Create a new redirect. Validates input with Zod before inserting.
 *
 * @throws {z.ZodError} if input validation fails
 */
export async function createRedirect(data: CreateRedirectInput): Promise<Redirect> {
  const parsed = createRedirectSchema.parse(data);

  const row = await prisma.redirect.create({
    data: {
      source: parsed.source,
      target: parsed.target,
      type: toPrismaType(parsed.type),
      isWildcard: parsed.wildcard,
      status: true,
    },
  });

  logger.info({ id: row.id, source: row.source, target: row.target }, "redirect created");

  return toRedirect(row);
}

/**
 * Delete a redirect by id. Performs a hard delete.
 */
export async function deleteRedirect(id: string): Promise<void> {
  try {
    await prisma.redirect.delete({ where: { id } });
    logger.info({ id }, "redirect deleted");
  } catch (error) {
    logger.error({ err: error, id }, "deleteRedirect failed");
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Fire-and-forget increment of a redirect's hit count and last-hit timestamp.
 */
async function incrementHitCount(id: string): Promise<void> {
  try {
    await prisma.redirect.update({
      where: { id },
      data: {
        hitCount: { increment: 1 },
        lastHitAt: new Date(),
      },
    });
  } catch (error) {
    // Log but never let a hit-count update bubble up
    logger.warn({ err: error, id }, "incrementHitCount failed");
  }
}
