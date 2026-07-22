"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

// ─── Helpers ───────────────────────────────────────────────────────

const LABEL_OVERRIDES: Record<string, string> = {
  "admin": "Dashboard",
  "audit-logs": "Audit Logs",
  "media": "Media Library",
};

function segmentToLabel(segment: string): string {
  if (LABEL_OVERRIDES[segment]) return LABEL_OVERRIDES[segment];
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ─── Breadcrumb ────────────────────────────────────────────────────

interface BreadcrumbProps {
  /** Override segments instead of deriving from pathname */
  segments?: { label: string; href: string }[];
  /** Hide on mobile (default: true) */
  hideOnMobile?: boolean;
  /** Custom home label (default: "Dashboard") */
  homeLabel?: string;
}

export function Breadcrumb({
  segments: customSegments,
  hideOnMobile = true,
  homeLabel = "Dashboard",
}: BreadcrumbProps) {
  const pathname = usePathname();

  // Generate segments from pathname
  const segments = customSegments ?? (() => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      return { label: segmentToLabel(part), href };
    });
  })();

  if (segments.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "mb-4",
        hideOnMobile && "hidden md:block",
      )}
    >
      <ol className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
        {/* Home */}
        <li>
          <Link
            href="/admin"
            className="flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
            aria-label="Go to dashboard"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only md:not-sr-only">{homeLabel}</span>
          </Link>
        </li>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          return (
            <li key={segment.href} className="flex items-center gap-1">
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-600"
                aria-hidden="true"
              />
              {isLast ? (
                <span
                  className="rounded px-1 py-0.5 font-medium text-[var(--color-text)] dark:text-white"
                  aria-current="page"
                >
                  {segment.label}
                </span>
              ) : (
                <Link
                  href={segment.href}
                  className="rounded px-1 py-0.5 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  {segment.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
