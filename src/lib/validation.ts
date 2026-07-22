import { z } from "zod";

// ---------------------------------------------------------------------------
// Reusable Zod validation schemas
// ---------------------------------------------------------------------------

/** Validates a standard email address */
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .max(254, "Email must be at most 254 characters")
  .transform((v) => v.toLowerCase().trim());

/** Validates a URL-safe slug (lowercase letters, digits, hyphens) */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
  .min(1, "Slug is required")
  .max(200, "Slug must be at most 200 characters");

/** Validates a phone number (7–15 digits, optional + and -/space separators) */
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s-]{7,15}$/, "Invalid phone number format");

/** Validates a fully qualified URL */
export const urlSchema = z
  .string()
  .url("Invalid URL")
  .max(2048, "URL must be at most 2048 characters");

/** Validates a 6-character hex color code (e.g. #FF00AA) */
export const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color code (must be #RRGGBB)");

/** Validates a strong password (8–128 characters) */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");

/** Validates a MongoDB-style ObjectId (24 hex characters) */
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// ---------------------------------------------------------------------------
// Sanitization helpers
// ---------------------------------------------------------------------------

const HTML_TAG_RE = /<[^>]*>/g;

/**
 * Strip all HTML tags from a string.
 * Preserves text content but removes all markup.
 */
export function stripHtml(input: string): string {
  return input.replace(HTML_TAG_RE, "");
}

/**
 * Truncate a string to a maximum length, appending "..." if truncated.
 * Operates on grapheme clusters (via spread) to handle multi-byte characters.
 */
export function truncate(input: string, maxLength: number): string {
  const chars = [...input];
  if (chars.length <= maxLength) return input;
  return chars.slice(0, maxLength).join("") + "...";
}

/**
 * Convert a string to a URL-safe slug.
 * Lowercases, trims, replaces spaces with hyphens, and removes non-alphanumeric chars.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
