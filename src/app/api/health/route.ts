import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const checks: Record<string, string> = {};

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch {
    checks.database = "disconnected";
  }

  // Check Redis
  try {
    // Redis check would go here with actual Redis client
    checks.redis = "fallback (no Redis configured)";
  } catch {
    checks.redis = "unavailable";
  }

  const status = checks.database === "connected" ? "ok" : "degraded";

  return NextResponse.json(
    {
      status,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      checks,
      responseTime: Date.now() - start,
    },
    {
      status: status === "ok" ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
