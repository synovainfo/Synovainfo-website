"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────

export interface KpiCardProps {
  /** Lucide icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Label text (e.g. "Total Pages") */
  label: string;
  /** Current value to display */
  value: number;
  /** Accent color class for the top border and icon circle */
  accentClass?: string;
  /** Whether data is still loading */
  isLoading?: boolean;
  /** Trend direction (optional) */
  trend?: "up" | "down" | "neutral";
  /** Trend percentage (optional) */
  trendPercentage?: number;
}

// ─── Animated Counter Hook ───────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 800): number {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }

    startTime.current = null;

    const animate = (timestamp: number) => {
      if (startTime.current === null) {
        startTime.current = timestamp;
      }

      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [target, duration]);

  return count;
}

// ─── Trend Indicator ─────────────────────────────────────────────────

function TrendBadge({
  trend,
  percentage,
}: {
  trend: "up" | "down" | "neutral";
  percentage?: number;
}) {
  if (trend === "neutral" || percentage === undefined) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        <Minus className="h-3 w-3" aria-hidden="true" />
        —
      </span>
    );
  }

  const isUp = trend === "up";
  const colorClass = isUp
    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
    : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        colorClass,
      )}
    >
      {isUp ? (
        <TrendingUp className="h-3 w-3" aria-hidden="true" />
      ) : (
        <TrendingDown className="h-3 w-3" aria-hidden="true" />
      )}
      {percentage}%
    </span>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────

function KpiCardSkeleton() {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl border border-zinc-200 dark:border-white/5",
        "bg-white dark:bg-[#0A0F1A]/95",
        "p-5",
      )}
      aria-hidden="true"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 flex-1 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="mb-2 h-8 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────

/**
 * Glassmorphism KPI card with animated counter, trend indicator,
 * and accent colour top border.
 */
export function KpiCard({
  icon: Icon,
  label,
  value,
  accentClass = "border-blue-500",
  isLoading = false,
  trend,
  trendPercentage,
}: KpiCardProps) {
  const displayValue = useAnimatedCounter(value);

  if (isLoading) {
    return <KpiCardSkeleton />;
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border transition-all duration-300",
        "border-zinc-200/80 dark:border-white/5",
        "bg-white/80 backdrop-blur-xl dark:bg-[#0A0F1A]/95",
        "hover:-translate-y-0.5 hover:shadow-lg",
        "p-5",
      )}
    >
      {/* Accent top border */}
      <div
        className={cn(
          "absolute left-0 top-0 h-1 w-full rounded-t-xl",
          accentClass,
        )}
        aria-hidden="true"
      />

      {/* Header: icon + label */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            accentClass.replace("border-", "bg-").replace("500", "100") +
              " dark:" +
              accentClass.replace("border-", "bg-").replace("500", "900/20"),
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              accentClass.replace("border-", "text-"),
            )}
            aria-hidden="true"
          />
        </div>
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="mb-2">
        <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {displayValue.toLocaleString()}
        </span>
      </div>

      {/* Trend */}
      {trend && (
        <TrendBadge trend={trend} percentage={trendPercentage} />
      )}
    </div>
  );
}
