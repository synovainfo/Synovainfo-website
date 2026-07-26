"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Mail,
  Users,
  UserCheck,
  UserX,
  MailOpen,
  Download,
  Upload,
  X,
  Send,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: string;
  source: string | null;
  subscribedAt: string;
  unsubscribedAt: string | null;
  createdAt: string;
}

interface NewsletterStats {
  total: number;
  active: number;
  unsubscribed: number;
  bounced: number;
  last30Days: number;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface DashboardResponse {
  subscribers: Subscriber[];
  pagination: Pagination;
  stats: NewsletterStats;
}

type SortField = "email" | "name" | "status" | "subscribedAt" | "createdAt";
type SortOrder = "asc" | "desc";

// ---------------------------------------------------------------------------
// NewsletterDashboardPage
// ---------------------------------------------------------------------------

export default function NewsletterDashboardPage() {
  // Data state
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("subscribedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Add subscriber modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addName, setAddName] = useState("");
  const [addSource, setAddSource] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // Import CSV modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Subscriber | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch subscribers
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", "20");
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (statusFilter) params.set("status", statusFilter);
      params.set("sort", sortField);
      params.set("order", sortOrder);

      const res = await fetch(`/api/admin/newsletter?${params}`);
      if (!res.ok) throw new Error("Failed to fetch subscribers");
      const data: DashboardResponse = await res.json();
      setSubscribers(data.subscribers);
      setPagination(data.pagination);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, sortField, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sort toggle
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5" />
    );
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ── Add Subscriber ──

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);

    if (!addEmail.trim() || !addEmail.includes("@")) {
      setAddError("Please enter a valid email address");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: addEmail.trim(),
          name: addName.trim() || null,
          source: addSource.trim() || "manual",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to add subscriber");
      }
      setAddSuccess(`${addEmail.trim()} subscribed successfully`);
      setAddEmail("");
      setAddName("");
      setAddSource("");
      fetchData();
      setTimeout(() => setAddSuccess(null), 3000);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setAdding(false);
    }
  };

  // ── Import CSV ──

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setCsvText(text);
    };
    reader.readAsText(file);
    // Reset input for re-upload
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const parseCsv = (text: string): { email: string; name?: string }[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const headerLine = lines[0].toLowerCase();
    const hasHeader = headerLine.includes("email");
    const rows = hasHeader ? lines.slice(1) : lines;

    return rows
      .map((line) => {
        const parts = line.split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
        const email = parts[0] || "";
        const name = parts[1] || undefined;
        if (!email || !email.includes("@")) return null;
        return { email, name };
      })
      .filter(Boolean) as { email: string; name?: string }[];
  };

  const handleImportCsv = async () => {
    setImportError(null);
    setImportResult(null);

    if (!csvText.trim()) {
      setImportError("Please paste CSV data or upload a file");
      return;
    }

    const parsed = parseCsv(csvText);
    if (parsed.length === 0) {
      setImportError("No valid email addresses found in CSV. Ensure the format is: email,name");
      return;
    }

    setImporting(true);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscribers: parsed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Import failed");
      }
      setImportResult(
        `Imported ${data.imported} subscriber(s). ${data.skipped} duplicate(s) skipped.`,
      );
      setCsvText("");
      fetchData();
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  // ── Export CSV ──

  const handleExportCsv = async () => {
    try {
      const res = await fetch("/api/admin/newsletter?pageSize=10000");
      if (!res.ok) throw new Error("Failed to fetch subscribers");
      const data: DashboardResponse = await res.json();

      const header = "email,name,status,subscribedAt,source";
      const rows = data.subscribers.map((s) =>
        `"${s.email}","${s.name ?? ""}","${s.status}","${s.subscribedAt}","${s.source ?? ""}"`,
      );
      const csv = [header, ...rows].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    }
  };

  // ── Delete Subscriber ──

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/newsletter/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Failed to delete subscriber");
      }
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // ── Status Badge ──

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      unsubscribed: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      bounced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          styles[status] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
        )}
      >
        {status}
      </span>
    );
  };

  // ── Stat Card ──

  const StatCard = ({
    label,
    value,
    icon: Icon,
    color,
  }: {
    label: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }) => (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", color)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description="Manage subscribers and email campaigns"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                "border border-zinc-200 text-zinc-700 hover:bg-zinc-50",
                "dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
                "transition-colors duration-200",
              )}
            >
              <Upload className="h-4 w-4" />
              Import CSV
            </button>
            <button
              onClick={handleExportCsv}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                "border border-zinc-200 text-zinc-700 hover:bg-zinc-50",
                "dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
                "transition-colors duration-200",
              )}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                "bg-blue-600 text-white hover:bg-blue-500",
                "transition-colors duration-200",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
              )}
            >
              <Plus className="h-4 w-4" />
              Add Subscriber
            </button>
          </div>
        }
      />

      {/* ── Stats Cards ── */}
      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Total Subscribers"
            value={stats.total}
            icon={Users}
            color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          />
          <StatCard
            label="Active"
            value={stats.active}
            icon={UserCheck}
            color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          />
          <StatCard
            label="Unsubscribed"
            value={stats.unsubscribed}
            icon={UserX}
            color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
          />
          <StatCard
            label="Bounced"
            value={stats.bounced}
            icon={MailOpen}
            color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          />
          <StatCard
            label="New (30 days)"
            value={stats.last30Days}
            icon={BarChart3}
            color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          />
        </div>
      )}

      {/* ── Campaigns Link ── */}
      <Link
        href="/admin/newsletter/new"
        className={cn(
          "mb-6 flex items-center gap-3 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-4",
          "dark:border-blue-900/30 dark:bg-blue-950/20",
          "transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/30",
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Create a new campaign
          </p>
          <p className="text-xs text-blue-500 dark:text-blue-400">
            Send newsletters to your subscribers
          </p>
        </div>
        <Plus className="h-5 w-5 text-blue-500" />
      </Link>

      {/* ── Filters ── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by email or name..."
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

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className={cn(
              "rounded-lg border border-zinc-200 px-3 py-2 text-sm",
              "bg-white text-zinc-900",
              "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
            )}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
          </select>
        </div>

        <button
          onClick={fetchData}
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
          <button onClick={() => setError(null)} className="ml-auto font-medium hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* ── Add Success Banner ── */}
      {addSuccess && (
        <div
          className="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <Mail className="h-5 w-5 shrink-0" />
          <span>{addSuccess}</span>
        </div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && subscribers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Mail className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No subscribers found
          </h3>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            {debouncedSearch || statusFilter
              ? "Try adjusting your search or filters"
              : "Start building your email list by adding subscribers"}
          </p>
          {!debouncedSearch && !statusFilter && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              Add Subscriber
            </button>
          )}
        </div>
      )}

      {/* ── Table ── */}
      {!loading && subscribers.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400"
                    onClick={() => toggleSort("email")}
                  >
                    <span className="inline-flex items-center">
                      Email
                      <SortIcon field="email" />
                    </span>
                  </th>
                  <th
                    className="hidden cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 sm:table-cell"
                    onClick={() => toggleSort("name")}
                  >
                    <span className="inline-flex items-center">
                      Name
                      <SortIcon field="name" />
                    </span>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400"
                    onClick={() => toggleSort("status")}
                  >
                    <span className="inline-flex items-center">
                      Status
                      <SortIcon field="status" />
                    </span>
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 md:table-cell">
                    Source
                  </th>
                  <th
                    className="hidden cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 lg:table-cell"
                    onClick={() => toggleSort("subscribedAt")}
                  >
                    <span className="inline-flex items-center">
                      Subscribed
                      <SortIcon field="subscribedAt" />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {subscribers.map((sub) => (
                  <tr
                    key={sub.id}
                    className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {sub.email}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-zinc-600 dark:text-zinc-400 sm:table-cell">
                      {sub.name || <span className="text-zinc-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 md:table-cell">
                      {sub.source || <span className="text-zinc-400">—</span>}
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 lg:table-cell">
                      {formatDate(sub.subscribedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDeleteTarget(sub)}
                          className={cn(
                            "rounded-lg p-2 text-zinc-400 transition-colors",
                            "hover:bg-red-50 hover:text-red-600",
                            "dark:hover:bg-red-950/30 dark:hover:text-red-400",
                          )}
                          title="Delete subscriber"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-zinc-500 dark:text-zinc-400">
                Showing {(pagination.page - 1) * pagination.pageSize + 1}–
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
                {pagination.total} subscribers
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
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className={cn(
                    "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium transition-colors",
                    "dark:border-zinc-700",
                    page >= pagination.totalPages
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

      {/* ── Add Subscriber Modal ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !adding && setShowAddModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Add subscriber"
        >
          <div
            className="mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Add Subscriber
              </h3>
              <button
                onClick={() => { setShowAddModal(false); setAddError(null); setAddSuccess(null); }}
                className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div>
                <label htmlFor="add-email" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="add-email"
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
              </div>
              <div>
                <label htmlFor="add-name" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Name
                </label>
                <input
                  id="add-name"
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
              </div>
              <div>
                <label htmlFor="add-source" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Source
                </label>
                <input
                  id="add-source"
                  type="text"
                  value={addSource}
                  onChange={(e) => setAddSource(e.target.value)}
                  placeholder="manual, website, landing-page..."
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
              </div>

              {addError && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  {addError}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setAddError(null); }}
                  disabled={adding}
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {adding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding…
                    </>
                  ) : (
                    "Add Subscriber"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Import CSV Modal ── */}
      {showImportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !importing && setShowImportModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Import CSV"
        >
          <div
            className="mx-4 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Import Subscribers
              </h3>
              <button
                onClick={() => { setShowImportModal(false); setCsvText(""); setImportResult(null); setImportError(null); }}
                className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-300">
                  Upload a CSV file or paste CSV data. Format: <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">email,name</code>
                </p>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-zinc-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Or paste CSV data
                </label>
                <textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  rows={6}
                  placeholder={"email,name\nuser1@example.com,John\nuser2@example.com,Jane"}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 resize-y"
                />
              </div>

              {importError && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  {importError}
                </div>
              )}
              {importResult && (
                <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600 dark:bg-green-950/30 dark:text-green-400">
                  {importResult}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowImportModal(false); setCsvText(""); setImportResult(null); setImportError(null); }}
                  disabled={importing}
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportCsv}
                  disabled={importing || !csvText.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {importing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Importing…
                    </>
                  ) : (
                    "Import Subscribers"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm deletion"
        >
          <div
            className="mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Delete Subscriber
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {deleteTarget.email}
              </strong>
              ? This will permanently remove this subscriber and all associated data.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className={cn(
                  "rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium",
                  "text-zinc-700 hover:bg-zinc-50",
                  "dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
                  "transition-colors",
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                  "bg-red-600 text-white hover:bg-red-500",
                  "transition-colors",
                  deleting && "cursor-not-allowed opacity-70",
                )}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete Subscriber"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
