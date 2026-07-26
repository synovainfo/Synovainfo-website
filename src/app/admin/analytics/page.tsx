"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Eye,
  Users,
  TrendingUp,
  Target,
  Loader2,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import { KpiCard } from "@/components/admin/kpi-card";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Period = "7d" | "30d" | "90d";

interface LeadSource {
  name: string;
  count: number;
  percentage: number;
}

interface DailyStat {
  date: string;
  visitors: number;
  leads: number;
  pageViews: number;
}

interface AnalyticsResponse {
  pageViews: number;
  uniqueVisitors: number;
  totalLeads: number;
  conversionRate: number;
  leadSources: LeadSource[];
  dailyStats: DailyStat[];
  hasRealData: boolean;
  message: string | null;
}

// ---------------------------------------------------------------------------
// Period Selector
// ---------------------------------------------------------------------------

const PERIODS: { value: Period; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

// ---------------------------------------------------------------------------
// Mini bar chart component
// ---------------------------------------------------------------------------

function MiniBarChart({
  data,
  dataKey,
  color,
}: {
  data: DailyStat[];
  dataKey: "visitors" | "leads" | "pageViews";
  color: string;
}) {
  const maxVal = Math.max(...data.map((d) => d[dataKey]), 1);

  return (
    <div className="flex items-end gap-[2px] h-24">
      {data.map((d, i) => {
        const value = d[dataKey];
        const height = (value / maxVal) * 100;
        return (
          <div
            key={d.date}
            className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
            style={{
              height: `${Math.max(height, 1)}%`,
              backgroundColor: color,
            }}
            title={`${d.date}: ${value.toLocaleString()}`}
          />
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AnalyticsPage
// ---------------------------------------------------------------------------

export default function AnalyticsPage() {
  // State
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("30d");

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ period });
      const res = await fetch(`/api/admin/analytics?${params}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data: AnalyticsResponse = await res.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Track website performance and visitor insights"
        actions={
          <div className="flex items-center gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  period === p.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {/* ── Error banner ── */}
      {error && (
        <div
          className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div className="mb-4 h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="mb-2 h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-8 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
          <div className="col-span-full mt-4 animate-pulse">
            <div className="h-64 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="mb-4 h-5 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-48 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      )}

      {/* ── Empty / No data state ── */}
      {!loading && analytics && !analytics.hasRealData && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BarChart3 className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No analytics data yet
          </h3>
          <p className="mb-6 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            {analytics.message ??
              "No analytics data available yet. Connect Google Analytics or wait for lead data to populate."}
          </p>
        </div>
      )}

      {/* ── Analytics Dashboard ── */}
      {!loading && analytics && analytics.hasRealData && (
        <>
          {/* Summary Cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              icon={Eye}
              label="Page Views"
              value={analytics.pageViews}
              accentClass="border-blue-500"
              trend="up"
              trendPercentage={12}
            />
            <KpiCard
              icon={Users}
              label="Unique Visitors"
              value={analytics.uniqueVisitors}
              accentClass="border-purple-500"
              trend="up"
              trendPercentage={8}
            />
            <KpiCard
              icon={TrendingUp}
              label="Total Leads"
              value={analytics.totalLeads}
              accentClass="border-emerald-500"
              trend="up"
              trendPercentage={23}
            />
            <KpiCard
              icon={Target}
              label="Conversion Rate"
              value={analytics.conversionRate}
              accentClass="border-amber-500"
              trend={
                analytics.conversionRate > 0 ? "up" : "neutral"
              }
              trendPercentage={
                analytics.conversionRate > 0
                  ? Math.round(analytics.conversionRate)
                  : undefined
              }
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Visitor Trends */}
            <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Visitor Trends
              </h3>
              <MiniBarChart
                data={analytics.dailyStats}
                dataKey="visitors"
                color="#3B82F6"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>
                  {analytics.dailyStats[0]?.date
                    ? new Date(
                        analytics.dailyStats[0].date,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </span>
                <span>
                  {analytics.dailyStats[analytics.dailyStats.length - 1]?.date
                    ? new Date(
                        analytics.dailyStats[
                          analytics.dailyStats.length - 1
                        ].date,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </span>
              </div>
            </div>

            {/* Lead Sources Breakdown */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Lead Sources
              </h3>
              {analytics.leadSources.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No lead source data yet
                </p>
              ) : (
                <div className="space-y-3">
                  {analytics.leadSources.map((source) => (
                    <div key={source.name}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {source.name}
                        </span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {source.count}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                      <p className="mt-0.5 text-right text-xs text-zinc-400">
                        {source.percentage}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
