"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { KpiCard } from "@/components/admin/kpi-card";
import { RecentActivity } from "@/app/admin/dashboard/recent-activity";
import { QuickActions } from "@/app/admin/dashboard/quick-actions";
import { cn } from "@/lib/utils";
import {
  FileText,
  Briefcase,
  Users,
  PenSquare,
  Image,
  ClipboardList,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import type { ContactItem, AuditLogItem } from "@/app/admin/dashboard/recent-activity";

// ─── Types ───────────────────────────────────────────────────────────

interface DashboardStats {
  totalPages: number;
  activeServices: number;
  newLeads: number;
  blogPosts: number;
  mediaFiles: number;
  formSubmissions: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentContacts: ContactItem[];
  recentAuditLogs: AuditLogItem[];
}

// ─── KPI Card Config ────────────────────────────────────────────────

interface KpiConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  key: keyof DashboardStats;
  accentClass: string;
}

const KPI_CARDS: KpiConfig[] = [
  {
    icon: FileText,
    label: "Total Pages",
    key: "totalPages",
    accentClass: "border-blue-500",
  },
  {
    icon: Briefcase,
    label: "Active Services",
    key: "activeServices",
    accentClass: "border-emerald-500",
  },
  {
    icon: Users,
    label: "New Leads (Month)",
    key: "newLeads",
    accentClass: "border-cyan-500",
  },
  {
    icon: PenSquare,
    label: "Blog Posts",
    key: "blogPosts",
    accentClass: "border-purple-500",
  },
  {
    icon: Image,
    label: "Media Files",
    key: "mediaFiles",
    accentClass: "border-amber-500",
  },
  {
    icon: ClipboardList,
    label: "Form Submissions",
    key: "formSubmissions",
    accentClass: "border-rose-500",
  },
];

// ─── Skeleton Grid ───────────────────────────────────────────────────

function KpiGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded-xl border",
            "border-zinc-200 dark:border-white/5",
            "bg-white dark:bg-[#0A0F1A]/95",
            "p-5",
          )}
          aria-hidden="true"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="mb-2 h-8 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-14 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}

// ─── Error State ─────────────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200/60 bg-red-50/50 p-12 text-center dark:border-red-900/30 dark:bg-red-900/10">
      <AlertTriangle
        className="mb-4 h-10 w-10 text-red-400 dark:text-red-500"
        aria-hidden="true"
      />
      <h3 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-400">
        Failed to load dashboard
      </h3>
      <p className="mb-6 text-sm text-red-500 dark:text-red-400/80">
        {message}
      </p>
      <button
        onClick={onRetry}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          "bg-red-600 text-white hover:bg-red-700",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500",
        )}
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}

// ─── Dashboard Page ──────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/dashboard/stats");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please sign in again.");
        }
        throw new Error("Failed to fetch dashboard data");
      }

      const result: DashboardData = await response.json();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ── Loading State ───────────────────────────────────────────────
  if (isLoading && !data) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Loading your dashboard data..."
        />
        <KpiGridSkeleton />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div
              className={cn(
                "animate-pulse rounded-xl border",
                "border-zinc-200 dark:border-white/5",
                "bg-white dark:bg-[#0A0F1A]/95",
                "h-64 p-5",
              )}
              aria-hidden="true"
            >
              <div className="mb-4 h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-3 rounded bg-zinc-200 dark:bg-zinc-800" />
                ))}
              </div>
            </div>
          </div>
          <div>
            <div
              className={cn(
                "animate-pulse rounded-xl border",
                "border-zinc-200 dark:border-white/5",
                "bg-white dark:bg-[#0A0F1A]/95",
                "h-48 p-5",
              )}
              aria-hidden="true"
            >
              <div className="mb-4 h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 rounded bg-zinc-200 dark:bg-zinc-800" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────
  if (error && !data) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Something went wrong"
        />
        <ErrorState message={error} onRetry={fetchStats} />
      </div>
    );
  }

  // ── Data State ─────────────────────────────────────────────────
  const stats = data?.stats;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={
          lastUpdated
            ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
            : undefined
        }
        actions={
          <button
            onClick={fetchStats}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "border border-zinc-200 dark:border-white/10",
              "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/5",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
            )}
            aria-label="Refresh dashboard data"
          >
            <RefreshCw
              className={cn("h-4 w-4", isLoading && "animate-spin")}
              aria-hidden="true"
            />
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        }
      />

      {/* KPI Cards Grid */}
      <section aria-label="Key performance indicators">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KPI_CARDS.map((card) => (
            <KpiCard
              key={card.key}
              icon={card.icon}
              label={card.label}
              value={stats?.[card.key] ?? 0}
              accentClass={card.accentClass}
              isLoading={isLoading}
            />
          ))}
        </div>
      </section>

      {/* Bottom Section: Recent Activity + Quick Actions */}
      <section className="mt-6" aria-label="Activity and actions">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity
              contacts={data?.recentContacts ?? []}
              auditLogs={data?.recentAuditLogs ?? []}
              isLoading={isLoading}
            />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </section>
    </div>
  );
}
