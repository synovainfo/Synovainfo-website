"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Building2,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Technology {
  id: string;
  name: string;
  slug: string;
}

interface Industry {
  id: string;
  name: string;
  slug: string;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  fullDescription: string | null;
  icon: string | null;
  category: string | null;
  benefits: string[] | null;
  businessOutcomes: string[] | null;
  status: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  createdAt: string;
  updatedAt: string;
  technologies: { technology: Technology }[];
  industries: { industry: Industry }[];
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface ServicesResponse {
  services: Service[];
  pagination: Pagination;
}

type SortField = "title" | "category" | "status" | "createdAt";
type SortOrder = "asc" | "desc";

// ---------------------------------------------------------------------------
// ServiceListPage
// ---------------------------------------------------------------------------

export default function ServiceListPage() {
  // Data state
  const [services, setServices] = useState<Service[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch services
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", "20");
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (categoryFilter) params.set("category", categoryFilter);
      if (statusFilter) params.set("status", statusFilter);
      params.set("sort", sortField);
      params.set("order", sortOrder);

      const res = await fetch(`/api/admin/services?${params}`);
      if (!res.ok) throw new Error("Failed to fetch services");
      const data: ServicesResponse = await res.json();
      setServices(data.services);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoryFilter, statusFilter, sortField, sortOrder]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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

  // Delete handler
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/services/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Failed to delete service");
      }
      setDeleteTarget(null);
      fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage your service offerings"
        actions={
          <Link
            href="/admin/services/new"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-500",
              "transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
            )}
          >
            <Plus className="h-4 w-4" />
            New Service
          </Link>
        }
      />

      {/* ── Filters ── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search services..."
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

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className={cn(
              "rounded-lg border border-zinc-200 px-3 py-2 text-sm",
              "bg-white text-zinc-900",
              "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
            )}
          >
            <option value="">All Categories</option>
            <option value="DIGITAL_TRANSFORMATION">Digital Transformation</option>
            <option value="CLOUD_SERVICES">Cloud Services</option>
            <option value="AI_ML">AI &amp; Machine Learning</option>
            <option value="CONSULTING">Consulting</option>
            <option value="DEVELOPMENT">Development</option>
          </select>

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
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <button
          onClick={fetchServices}
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

      {/* ── Loading state ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && services.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Building2 className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No services found
          </h3>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            {debouncedSearch || categoryFilter || statusFilter
              ? "Try adjusting your search or filters"
              : "Get started by creating your first service"}
          </p>
          {!debouncedSearch && !categoryFilter && !statusFilter && (
            <Link
              href="/admin/services/new"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              New Service
            </Link>
          )}
        </div>
      )}

      {/* ── Table ── */}
      {!loading && services.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400"
                    onClick={() => toggleSort("title")}
                  >
                    <span className="inline-flex items-center">
                      Service
                      <SortIcon field="title" />
                    </span>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400"
                    onClick={() => toggleSort("category")}
                  >
                    <span className="inline-flex items-center">
                      Category
                      <SortIcon field="category" />
                    </span>
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 sm:table-cell">
                    Technologies
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
                  <th
                    className="hidden cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 md:table-cell"
                    onClick={() => toggleSort("createdAt")}
                  >
                    <span className="inline-flex items-center">
                      Created
                      <SortIcon field="createdAt" />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {services.map((svc) => (
                  <tr
                    key={svc.id}
                    className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                  >
                    {/* Title */}
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/services/${svc.id}`}
                        className="font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                      >
                        {svc.title}
                      </Link>
                      {svc.shortDescription && (
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400 max-w-[250px]">
                          {svc.shortDescription}
                        </p>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      {svc.category ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {svc.category.replace(/_/g, " ")}
                        </span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>

                    {/* Technologies */}
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {svc.technologies.length === 0 ? (
                          <span className="text-xs text-zinc-400">—</span>
                        ) : (
                          svc.technologies.slice(0, 3).map((t) => (
                            <span
                              key={t.technology.id}
                              className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                            >
                              {t.technology.name}
                            </span>
                          ))
                        )}
                        {svc.technologies.length > 3 && (
                          <span className="text-xs text-zinc-400">
                            +{svc.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-medium",
                          svc.status
                            ? "text-green-700 dark:text-green-400"
                            : "text-red-700 dark:text-red-400",
                        )}
                      >
                        {svc.status ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                        {svc.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="hidden px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 md:table-cell">
                      {formatDate(svc.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/services/${svc.id}`}
                          className={cn(
                            "rounded-lg p-2 text-zinc-400 transition-colors",
                            "hover:bg-zinc-100 hover:text-zinc-700",
                            "dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
                          )}
                          title="Edit service"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(svc)}
                          className={cn(
                            "rounded-lg p-2 text-zinc-400 transition-colors",
                            "hover:bg-red-50 hover:text-red-600",
                            "dark:hover:bg-red-950/30 dark:hover:text-red-400",
                          )}
                          title="Delete service"
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
                {pagination.total} services
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
                  Delete Service
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {deleteTarget.title}
              </strong>
              ? This will permanently remove this service and all associated data.
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
                  "Delete Service"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
