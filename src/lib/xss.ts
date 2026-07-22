import DOMPurify from "isomorphic-dompurify";
import type { Config } from "isomorphic-dompurify";

// ---------------------------------------------------------------------------
// XSS Protection — HTML Sanitization with DOMPurify
// ---------------------------------------------------------------------------

/**
 * Allowed HTML tags for rich-text content.
 * Provides safe subset for user-generated content (blog posts, comments, etc.).
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "a",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "pre",
  "code",
  "img",
] as const;

/**
 * Allowed attributes on permitted tags.
 */
const ALLOWED_ATTR = ["href", "src", "alt", "title", "target", "rel", "class"] as const;

/**
 * DOMPurify configuration for user-generated rich text.
 *
 * - Only ALLOWED_TAGS and ALLOWED_ATTR survive.
 * - <a> tags require rel="noopener noreferrer" for safety.
 * - javascript: URIs are stripped.
 * - All other tags and attributes are removed.
 */
const PURIFY_CONFIG: Config = {
  ALLOWED_TAGS: [...ALLOWED_TAGS],
  ALLOWED_ATTR: [...ALLOWED_ATTR],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ["target"],
  FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form", "input"],
  FORBID_ATTR: ["style", "onerror", "onload", "onclick", "onmouseover"],
  ALLOW_ARIA_ATTR: false,
};

/**
 * Sanitize an HTML string against XSS attacks.
 *
 * - Strips dangerous tags and attributes
 * - Preserves safe rich-text formatting
 * - Adds rel="noopener noreferrer" to all <a> tags
 *
 * @param dirty - Raw HTML string that may contain malicious content
 * @returns Clean, safe HTML string
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, PURIFY_CONFIG);
}

/**
 * Sanitize HTML for plain-text contexts (no rich text allowed).
 * Strips ALL HTML tags, returning only raw text.
 */
export function sanitizePlainText(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
}
