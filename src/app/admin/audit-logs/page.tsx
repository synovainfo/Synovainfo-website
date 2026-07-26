"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Loader2,
  AlertCircle,
  RefreshCw,
  ClipboardList,
  Filter,
  X,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuditEntry {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string } | null;
  action: string;
  resource: string;
  resourceId: string | null;
  details: string;
  ipAddress: string | null;
  createdAt: string;
}

interface AuditLogsResponse {
  data: AuditEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: {
    actions: string[];
    resources: string[];
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ACTION_BADGE_COLORS: Record<string, string> = {
  CREATE:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  UPDATE:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  DELETE:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  LOGIN:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  LOGOUT:
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400",
  EXPORT:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

function getActionBadge(action: string): string {
  const base = action.split(":")[1]?.toUpperCase() ?? action.toUpperCase();
  return (
    ACTION_BADGE_COLORS[base] ??
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(dateStr: string) {
  return `${formatDate(dateStr)} ${formatTime(dateStr)}`;
}

// ---------------------------------------------------------------------------
// AuditLogsPage
// ---------------------------------------------------------------------------

export default function AuditLogsPage() {
  // Data state
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter options from API
  const [availableActions, setAvailableActions] = useState<string[]>([]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", "30");
      params.set("order", sortOrder);
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (actionFilter) params.set("action", actionFilter);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await fetch(`/api/admin/audit-logs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch audit logs");

      const data: AuditLogsResponse = await res.json();
      setLogs(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      if (data.filters) {
        setAvailableActions(data.filters.actions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, actionFilter, dateFrom, dateTo, sortOrder]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Toggle sort
  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Timestamp",
      "User Name",
      "User Email",
      "Action",
      "Resource",
      "Resource ID",
      "Details",
      "IP Address",
    ];

    const rows = logs.map((log) => [
      log.createdAt,
      log.user?.name ?? "—",
      log.user?.email ?? "—",
      log.action,
      log.resource,
      log.resourceId ?? "—",
      log.details,
      log.ipAddress ?? "—",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setActionFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const hasFilters = debouncedSearch || actionFilter || dateFrom || dateTo;

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Track all administrative actions and changes"
        actions={
          <button
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-500",
              "transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
              logs.length === 0 && "cursor-not-allowed opacity-50",
            )}
            title="Export visible logs as CSV"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      {/* ── Filters ── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search actions, resources, users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full rounded-lg border border-zinc-200 py-2 pl-10 pr-3 text-sm",
                "bg-white text-zinc-900 placeholder:text-zinc-400",
                "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
              )}
            />
          </div>

          {/* Action filter */}
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className={cn(
              "rounded-lg border border-zinc-200 px-3 py-2 text-sm",
              "bg-white text-zinc-900",
              "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
            )}
          >
            <option value="">All Actions</option>
            {availableActions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Date from */}
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className={cn(
                "rounded-lg border border-zinc-200 py-2 pl-10 pr-3 text-sm",
                "bg-white text-zinc-900",
                "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
              )}
              title="From date"
            />
          </div>

          {/* Date to */}
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className={cn(
                "rounded-lg border border-zinc-200 py-2 pl-10 pr-3 text-sm",
                "bg-white text-zinc-900",
                "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
              )}
              title="To date"
            />
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
                "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100",
                "dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800",
              )}
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        {/* Refresh */}
        <button
          onClick={fetchLogs}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
            "text-zinc-600 hover:bg-zinc-100",
            "dark:text-zinc-400 dark:hover:bg-zinc-800",
            "transition-colors",
          )}
          title="Refresh"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

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

      {/* ── Loading state ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && logs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ClipboardList className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No audit logs found
          </h3>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            {hasFilters
              ? "Try adjusting your search or filters"
              : "No administrative actions have been recorded yet. Audit logs will appear here as users perform actions."}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* ── Table ── */}
      {!loading && logs.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    User
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400"
                    onClick={toggleSort}
                  >
                    <span className="inline-flex items-center">
                      Timestamp
                      {sortOrder === "asc" ? (
                        <ArrowUp className="ml-1 h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="ml-1 h-3.5 w-3.5" />
                      )}
                    </span>
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Action
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 md:table-cell">
                    Resource
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 lg:table-cell">
                    Details
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 xl:table-cell">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                          {log.user?.name ?? "Unknown"}
                        </p>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {log.user?.email ?? "—"}
                        </p>
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                      <span className="whitespace-nowrap">
                        {formatDate(log.createdAt)}
                      </span>
                      <br />
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {formatTime(log.createdAt)}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          getActionBadge(log.action),
                        )}
                      >
                        {log.action}
                      </span>
                    </td>

                    {/* Resource */}
                    <td className="hidden px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 md:table-cell">
                      <div className="min-w-0">
                        <p className="truncate">{log.resource}</p>
                        {log.resourceId && (
                          <p className="truncate text-xs text-zinc-400 dark:text-zinc-500">
                            ID: {log.resourceId}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Details */}
                    <td className="hidden max-w-[200px] px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 lg:table-cell">
                      <p className="truncate" title={log.details}>
                        {log.details}
                      </p>
                    </td>

                    {/* IP */}
                    <td className="hidden px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400 xl:table-cell">
                      {log.ipAddress ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-zinc-500 dark:text-zinc-400">
                Showing {(page - 1) * 30 + 1}–
                {Math.min(page * 30, total)} of {total} logs
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={cn(
                    "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium transition-colors",
                    "dark:border-zinc-700",
                    page <= 1
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  )}
                >
                  Previous
                </button>
                <span className="px-2 text-zinc-500 dark:text-zinc-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={cn(
                    "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium transition-colors",
                    "dark:border-zinc-700",
                    page >= totalPages
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  )}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
