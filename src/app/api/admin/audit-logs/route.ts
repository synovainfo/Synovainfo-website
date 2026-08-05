// =============================================================================
// GET /api/admin/audit-logs — paginated, searchable, filterable audit log list
// Permission: audit:read
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuditLogQuery {
  search?: string;
  userId?: string;
  action?: string;
  resource?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  pageSize: number;
  sort: string;
  order: "asc" | "desc";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseQuery(searchParams: URLSearchParams): AuditLogQuery {
  return {
    search: searchParams.get("search") || undefined,
    userId: searchParams.get("userId") || undefined,
    action: searchParams.get("action") || undefined,
    resource: searchParams.get("resource") || undefined,
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
    page: Math.max(1, parseInt(searchParams.get("page") ?? "1", 10)),
    pageSize: Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") ?? "30", 10)),
    ),
    sort: searchParams.get("sort") ?? "createdAt",
    order: searchParams.get("order") === "asc" ? "asc" : "desc",
  };
}

function buildWhere(q: AuditLogQuery) {
  const where: Record<string, unknown> = {};

  // Search across action, resource, resourceId, and user name/email
  if (q.search) {
    where.OR = [
      { action: { contains: q.search } },
      { resource: { contains: q.search } },
      { resourceId: { contains: q.search } },
      {
        user: {
          OR: [
            { name: { contains: q.search } },
            { email: { contains: q.search } },
          ],
        },
      },
    ];
  }

  if (q.userId) {
    where.userId = q.userId;
  }

  if (q.action) {
    where.action = q.action;
  }

  if (q.resource) {
    where.resource = q.resource;
  }

  // Date range
  if (q.dateFrom || q.dateTo) {
    const createdAt: Record<string, Date> = {};
    if (q.dateFrom) createdAt.gte = new Date(q.dateFrom);
    if (q.dateTo) createdAt.lte = new Date(q.dateTo);
    where.createdAt = createdAt;
  }

  return where;
}

function formatDetails(
  details: Record<string, unknown> | null | undefined,
): string {
  if (!details) return "—";
  try {
    const str =
      typeof details === "string" ? details : JSON.stringify(details);
    return str.length > 120 ? str.slice(0, 120) + "…" : str;
  } catch {
    return "—";
  }
}

// ---------------------------------------------------------------------------
// GET — list audit logs
// ---------------------------------------------------------------------------

export const GET = withPermission(async (request: NextRequest) => {
  try {
    const q = parseQuery(request.nextUrl.searchParams);
    const where = buildWhere(q);

    // Validate sort field to prevent injection
    const ALLOWED_SORT = [
      "createdAt",
      "action",
      "resource",
      "userId",
    ] as const;
    const sortField = ALLOWED_SORT.includes(q.sort as (typeof ALLOWED_SORT)[number])
      ? q.sort
      : "createdAt";

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: where as Prisma.AuditLogWhereInput,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { [sortField]: q.order },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      prisma.auditLog.count({
        where: where as Prisma.AuditLogWhereInput,
      }),
    ]);

    // Get distinct action types for filter dropdown
    const actions = await prisma.auditLog.findMany({
      select: { action: true },
      distinct: ["action"],
      orderBy: { action: "asc" },
    });

    // Get distinct resource types for filter dropdown
    const resources = await prisma.auditLog.findMany({
      select: { resource: true },
      distinct: ["resource"],
      orderBy: { resource: "asc" },
    });

    const data = logs.map((log) => ({
      id: log.id,
      userId: log.userId,
      user: log.user,
      action: log.action,
      resource: log.resource,
      resourceId: log.resourceId,
      details: formatDetails(log.details as Record<string, unknown> | null),
      ipAddress: log.ipAddress,
      createdAt: log.createdAt.toISOString(),
    }));

    return NextResponse.json({
      data,
      total,
      page: q.page,
      pageSize: q.pageSize,
      totalPages: Math.ceil(total / q.pageSize),
      filters: {
        actions: actions.map((a) => a.action),
        resources: resources.map((r) => r.resource),
      },
    });
  } catch (error) {
    console.error("[AUDIT_LOGS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch audit logs" },
      { status: 500 },
    );
  }
}, "audit:read");
