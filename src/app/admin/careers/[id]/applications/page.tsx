"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  RefreshCw,
  Briefcase,
  ArrowLeft,
  FileText,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  resumeUrl: string | null;
  coverLetter: string | null;
  status: string;
  createdAt: string;
}

interface CareerInfo {
  id: string;
  title: string;
  slug: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface ApplicationsResponse {
  applications: Application[];
  pagination: Pagination;
}

type SortField = "name" | "email" | "status" | "createdAt";
type SortOrder = "asc" | "desc";

const APPLICATION_STATUS_OPTIONS = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEWED",
  "OFFERED",
  "HIRED",
  "REJECTED",
  "WITHDRAWN",
];

const STATUS_BADGE: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  REVIEWING:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  SHORTLISTED:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  INTERVIEWED:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  OFFERED:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  HIRED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  WITHDRAWN:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

// ---------------------------------------------------------------------------
// CareerApplicationsPage
// ---------------------------------------------------------------------------

export default function CareerApplicationsPage() {
  const params = useParams();
  const careerId = params.id as string;

  const [career, setCareer] = useState<CareerInfo | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch career info + applications in parallel
      const [careerRes, appsRes] = await Promise.all([
        fetch(`/api/admin/careers/${careerId}`),
        (() => {
          const params = new URLSearchParams();
          params.set("page", String(page));
          params.set("pageSize", "20");
          if (debouncedSearch) params.set("search", debouncedSearch);
          if (statusFilter) params.set("status", statusFilter);
          params.set("sort", sortField);
          params.set("order", sortOrder);
          return fetch(`/api/admin/careers/${careerId}/applications?${params}`);
        })(),
      ]);

      if (!careerRes.ok) throw new Error("Failed to fetch position");
      if (!appsRes.ok) throw new Error("Failed to fetch applications");

      const careerData: CareerInfo = await careerRes.json();
      const appsData: ApplicationsResponse = await appsRes.json();

      setCareer(careerData);
      setApplications(appsData.applications);
      setPagination(appsData.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [careerId, page, debouncedSearch, statusFilter, sortField, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5" />
    );
  };

  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update status"
      );
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Loading state
  if (loading && !career) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Error state — no career found
  if (error && !career) {
    return (
      <div>
        <PageHeader
          title="Applications"
          description="Could not load position"
          actions={
            <Link
              href="/admin/careers"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Careers
            </Link>
          }
        />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <p className="text-zinc-500 dark:text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={career?.title ?? "Applications"}
        description={`Manage applications for ${career?.title ?? "this position"}`}
        actions={
          <Link
            href="/admin/careers"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium",
              "text-zinc-700 hover:bg-zinc-50",
              "dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
              "transition-colors",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Careers
          </Link>
        }
      />

      {/* Error banner */}
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

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full rounded-lg border border-zinc-200 py-2 pl-10 pr-3 text-sm",
                "bg-white text-zinc-900 placeholder:text-zinc-400",
                "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              )}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className={cn(
              "rounded-lg border border-zinc-200 px-3 py-2 text-sm",
              "bg-white text-zinc-900",
              "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            )}
          >
            <option value="">All Status</option>
            {APPLICATION_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchData}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
            "text-zinc-600 hover:bg-zinc-100",
            "dark:text-zinc-400 dark:hover:bg-zinc-800",
            "transition-colors"
          )}
          title="Refresh"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && applications.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Empty */}
      {!loading && applications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Briefcase className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No applications yet
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {debouncedSearch || statusFilter
              ? "Try adjusting your search or filters"
              : "Applications from candidates will appear here"}
          </p>
        </div>
      )}

      {/* Applications list */}
      {applications.length > 0 && (
        <div className="space-y-3">
          {applications.map((app) => {
            const isExpanded = expandedId === app.id;
            return (
              <div
                key={app.id}
                className={cn(
                  "rounded-xl border border-zinc-200 bg-white transition-shadow",
                  "dark:border-zinc-700 dark:bg-zinc-900",
                  "hover:shadow-sm"
                )}
              >
                {/* Card header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {app.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {app.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {app.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0",
                        STATUS_BADGE[app.status] ??
                          "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      )}
                    >
                      {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                    </span>

                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : app.id)
                      }
                      className={cn(
                        "rounded-lg p-1.5 text-zinc-400 transition-colors",
                        "hover:bg-zinc-100 hover:text-zinc-700",
                        "dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                      )}
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-zinc-200 px-4 pb-4 pt-3 dark:border-zinc-700">
                    <div className="mb-3 flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {app.phone && (
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          {app.phone}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {app.email}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        Applied {formatDate(app.createdAt)}
                      </span>
                    </div>

                    {/* Resume link */}
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "mb-3 inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium",
                          "text-blue-600 hover:bg-blue-50",
                          "dark:border-zinc-700 dark:text-blue-400 dark:hover:bg-blue-950/30",
                          "transition-colors"
                        )}
                      >
                        <Download className="h-3.5 w-3.5" />
                        View Resume
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    {/* Cover letter */}
                    {app.coverLetter && (
                      <div className="mb-3">
                        <p className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Cover Letter
                        </p>
                        <p className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 whitespace-pre-wrap">
                          {app.coverLetter}
                        </p>
                      </div>
                    )}

                    {/* Status update */}
                    <div className="flex items-center gap-2 pt-1">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Update Status:
                      </label>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusUpdate(app.id, e.target.value)
                        }
                        className={cn(
                          "rounded-lg border border-zinc-200 px-2 py-1 text-xs",
                          "bg-white text-zinc-900",
                          "focus:border-blue-500 focus:outline-none",
                          "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        )}
                      >
                        {APPLICATION_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0) + s.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-zinc-500 dark:text-zinc-400">
            Showing{" "}
            {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(
              pagination.page * pagination.pageSize,
              pagination.total
            )}{" "}
            of {pagination.total} applications
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
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              Previous
            </button>
            <span className="px-2 text-zinc-500 dark:text-zinc-400">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page >= pagination.totalPages}
              className={cn(
                "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium transition-colors",
                "dark:border-zinc-700",
                page >= pagination.totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
