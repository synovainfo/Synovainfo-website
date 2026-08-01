'use client';

import { cn } from '@/lib/utils';

/* ── Skeleton Base ────────────────────────────────────────────── */

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Base skeleton component with an animated shimmer effect.
 * Respects `prefers-reduced-motion` (static grey placeholder when reduced).
 */
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-md bg-[var(--color-surface-tertiary)]',
        className,
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

/* ── Convenience Variants ─────────────────────────────────────── */

interface SkeletonTextProps {
  className?: string;
  /** Number of text lines (default: 3) */
  lines?: number;
  /** Width of the last line to create a jagged effect (default: 60) */
  lastLineWidth?: number;
}

/**
 * Skeleton placeholder for text blocks.
 * Renders multiple shimmer lines with the last line shorter for a natural look.
 */
export function SkeletonText({
  className,
  lines = 3,
  lastLineWidth = 60,
}: SkeletonTextProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => {
        const isLast = i === lines - 1;
        return (
          <Skeleton
            key={i}
            className="h-4"
            style={
              isLast ? { width: `${lastLineWidth}%` } : undefined
            }
          />
        );
      })}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
}

/**
 * Skeleton placeholder for a card layout (image area + text lines).
 */
export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn('flex flex-col gap-3 rounded-xl border border-[var(--color-border-light)] p-4', className)}
      aria-hidden="true"
    >
      <SkeletonImage />
      <SkeletonText lines={2} lastLineWidth={50} />
    </div>
  );
}

interface SkeletonImageProps {
  className?: string;
}

/**
 * Skeleton placeholder for an image or media area.
 */
export function SkeletonImage({ className }: SkeletonImageProps) {
  return (
    <Skeleton
      className={cn('aspect-video w-full rounded-lg', className)}
    />
  );
}
