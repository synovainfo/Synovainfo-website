import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────

interface PageHeaderProps {
  /** Page title (required) */
  title: string;
  /** Optional description / subtitle below the title */
  description?: string;
  /** Right-aligned action buttons or controls */
  actions?: ReactNode;
  /** Optional additional classes for the wrapper */
  className?: string;
}

// ─── PageHeader ────────────────────────────────────────────────────

/**
 * Renders a page header with title, optional description, and
 * a right-aligned actions slot.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Pages"
 *   description="Manage your website pages"
 *   actions={<Button>Create Page</Button>}
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
