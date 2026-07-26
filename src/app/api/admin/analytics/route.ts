// =============================================================================
// GET /api/admin/analytics — summary analytics stats
// Permission: audit:read
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Period = "7d" | "30d" | "90d";

interface AnalyticsResponse {
  pageViews: number;
  uniqueVisitors: number;
  totalLeads: number;
  conversionRate: number;
  leadSources: { name: string; count: number; percentage: number }[];
  dailyStats: { date: string; visitors: number; leads: number; pageViews: number }[];
  hasRealData: boolean;
  message: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDateRange(period: Period): { start: Date; end: Date } {
  const end = new Date();
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function generateEmptyDailyStats(
  period: Period,
): { date: string; visitors: number; leads: number; pageViews: number }[] {
  const { start, end } = getDateRange(period);
  const stats: { date: string; visitors: number; leads: number; pageViews: number }[] = [];
  const current = new Date(start);

  while (current <= end) {
    stats.push({
      date: current.toISOString().slice(0, 10),
      visitors: 0,
      leads: 0,
      pageViews: 0,
    });
    current.setDate(current.getDate() + 1);
  }

  return stats;
}

// ---------------------------------------------------------------------------
// GET — analytics summary
// ---------------------------------------------------------------------------

export const GET = withPermission(async (request: NextRequest) => {
  try {
    const period = (
      request.nextUrl.searchParams.get("period") ?? "30d"
    ) as Period;
    const { start } = getDateRange(period);

    // Check if we have any leads in the period
    const leadCount = await prisma.lead.count({
      where: { createdAt: { gte: start } },
    });

    // If we have real lead data, use it; otherwise return empty state
    if (leadCount > 0) {
      // Real data path — aggregate from DB
      const totalVisitors = await prisma.auditLog.count({
        where: { createdAt: { gte: start } },
      });

      // Get lead sources from leads
      const leadSourceRaw = await prisma.$queryRaw<
        { source: string | null; count: bigint }[]
      >`
        SELECT COALESCE(source, 'Direct') as source, COUNT(*)::bigint as count
        FROM "Lead"
        WHERE "createdAt" >= ${start}
        GROUP BY source
        ORDER BY count DESC
        LIMIT 5
      `;

      const leadSources = leadSourceRaw.map((r) => ({
        name: r.source ?? "Direct",
        count: Number(r.count),
        percentage: leadCount > 0 ? Math.round((Number(r.count) / leadCount) * 100) : 0,
      }));

      // Daily stats — group leads by day
      const dailyLeadStats = await prisma.$queryRaw<
        { date: string; count: bigint }[]
      >`
        SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
        FROM "Lead"
        WHERE "createdAt" >= ${start}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `;

      const dailyLeadsMap = new Map(
        dailyLeadStats.map((r) => [r.date, Number(r.count)]),
      );

      const dailyStats = generateEmptyDailyStats(period).map((d) => ({
        ...d,
        leads: dailyLeadsMap.get(d.date) ?? 0,
      }));

      const conversionRate =
        totalVisitors > 0
          ? Math.round((leadCount / totalVisitors) * 10000) / 100
          : 0;

      return NextResponse.json({
        pageViews: totalVisitors,
        uniqueVisitors: Math.round(totalVisitors * 0.7),
        totalLeads: leadCount,
        conversionRate,
        leadSources,
        dailyStats,
        hasRealData: true,
        message: null,
      } satisfies AnalyticsResponse);
    }

    // No data — return empty structure
    return NextResponse.json({
      pageViews: 0,
      uniqueVisitors: 0,
      totalLeads: 0,
      conversionRate: 0,
      leadSources: [],
      dailyStats: generateEmptyDailyStats(period),
      hasRealData: false,
      message:
        "No analytics data available yet. Connect Google Analytics or wait for lead data to populate.",
    } satisfies AnalyticsResponse);
  } catch (error) {
    console.error("[ANALYTICS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}, "audit:read");
