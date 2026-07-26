"use client";

import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
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
  Globe,
  CheckCircle2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  capabilities: string[] | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface IndustriesResponse {
  industries: Industry[];
  pagination: Pagination;
}

type SortField = "name" | "status" | "createdAt";
type SortOrder = "asc" | "desc";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const industrySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  capabilities: z.array(z.string()).optional().nullable(),
  status: z.boolean(),
});

type IndustryForm = z.infer<typeof industrySchema>;

const emptyForm: IndustryForm = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  capabilities: [],
  status: true,
};

// ---------------------------------------------------------------------------
// IndustriesPage
// ---------------------------------------------------------------------------

export default function IndustriesPage() {
  // List state
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Editor modal
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<IndustryForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [capabilityInput, setCapabilityInput] = useState("");

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Industry | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch
  const fetchIndustries = useCallback(async () => {
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

      const res = await fetch(`/api/admin/industries?${params}`);
      if (!res.ok) throw new Error("Failed to fetch industries");
      const data: IndustriesResponse = await res.json();
      setIndustries(data.industries);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, sortField, sortOrder]);

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  // Sort
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

  // Open editor for create
  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setServerError(null);
    setCapabilityInput("");
    setEditorOpen(true);
  };

  // Open editor for edit
  const openEdit = async (industry: Industry) => {
    setEditingId(industry.id);
    setForm({
      name: industry.name,
      slug: industry.slug,
      description: industry.description ?? "",
      icon: industry.icon ?? "",
      capabilities: industry.capabilities ?? [],
      status: industry.status,
    });
    setFormErrors({});
    setServerError(null);
    setCapabilityInput("");
    setEditorOpen(true);
  };

  // Form handlers
  const handleFormChange = (field: keyof IndustryForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const autoSlug = (val: string) =>
    val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 200);

  const addCapability = () => {
    const val = capabilityInput.trim();
    if (val) {
      setForm((prev) => ({
        ...prev,
        capabilities: [...(prev.capabilities ?? []), val],
      }));
      setCapabilityInput("");
    }
  };

  const removeCapability = (index: number) => {
    setForm((prev) => ({
      ...prev,
      capabilities: (prev.capabilities ?? []).filter((_, i) => i !== index),
    }));
  };

  // Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const result = industrySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setFormErrors(fieldErrors);
      return;
    }

    setFormErrors({});
    setSaving(true);

    try {
      const url = editingId
        ? `/api/admin/industries/${editingId}`
        : "/api/admin/industries";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to save industry");
      }

      setSuccessMessage(
        editingId ? "Industry updated successfully" : "Industry created successfully",
      );
      setEditorOpen(false);
      fetchIndustries();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/industries/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Failed to delete industry");
      }
      setDeleteTarget(null);
      fetchIndustries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div>
      <PageHeader
        title="Industries"
        description="Manage industry verticals"
        actions={
          <button
            onClick={openCreate}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-500",
              "transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
            )}
          >
            <Plus className="h-4 w-4" />
            New Industry
          </button>
        }
      />

      {/* Success banner */}
      {successMessage && (
        <div
          className="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="ml-auto font-medium hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search industries..."
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
          onClick={fetchIndustries}
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

      {/* ── Error ── */}
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

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && industries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Globe className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No industries found
          </h3>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            {debouncedSearch || statusFilter
              ? "Try adjusting your search or filters"
              : "Get started by creating your first industry"}
          </p>
          {!debouncedSearch && !statusFilter && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              New Industry
            </button>
          )}
        </div>
      )}

      {/* ── Table ── */}
      {!loading && industries.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <th className="cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400" onClick={() => toggleSort("name")}>
                    <span className="inline-flex items-center">
                      Name <SortIcon field="name" />
                    </span>
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Slug</th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 sm:table-cell">Capabilities</th>
                  <th className="cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400" onClick={() => toggleSort("status")}>
                    <span className="inline-flex items-center">
                      Status <SortIcon field="status" />
                    </span>
                  </th>
                  <th className="hidden cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 md:table-cell" onClick={() => toggleSort("createdAt")}>
                    <span className="inline-flex items-center">
                      Created <SortIcon field="createdAt" />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {industries.map((ind) => (
                  <tr key={ind.id} className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{ind.name}</td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{ind.slug}</td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(!ind.capabilities || ind.capabilities.length === 0) ? (
                          <span className="text-xs text-zinc-400">—</span>
                        ) : (
                          ind.capabilities.slice(0, 3).map((cap, i) => (
                            <span key={i} className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                              {cap}
                            </span>
                          ))
                        )}
                        {ind.capabilities && ind.capabilities.length > 3 && (
                          <span className="text-xs text-zinc-400">+{ind.capabilities.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-medium",
                        ind.status ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400",
                      )}>
                        {ind.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 md:table-cell">
                      {formatDate(ind.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(ind)}
                          className={cn(
                            "rounded-lg p-2 text-zinc-400 transition-colors",
                            "hover:bg-zinc-100 hover:text-zinc-700",
                            "dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
                          )}
                          title="Edit industry"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(ind)}
                          className={cn(
                            "rounded-lg p-2 text-zinc-400 transition-colors",
                            "hover:bg-red-50 hover:text-red-600",
                            "dark:hover:bg-red-950/30 dark:hover:text-red-400",
                          )}
                          title="Delete industry"
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

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-zinc-500 dark:text-zinc-400">
                Showing {(pagination.page - 1) * pagination.pageSize + 1}–
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} industries
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                  className={cn("rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium transition-colors dark:border-zinc-700",
                    page <= 1 ? "cursor-not-allowed opacity-50" : "hover:bg-zinc-100 dark:hover:bg-zinc-800")}>
                  Previous
                </button>
                <span className="px-2 text-zinc-500 dark:text-zinc-400">Page {pagination.page} of {pagination.totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages}
                  className={cn("rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium transition-colors dark:border-zinc-700",
                    page >= pagination.totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-zinc-100 dark:hover:bg-zinc-800")}>
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Create/Edit Modal ── */}
      {editorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !saving && setEditorOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={editingId ? "Edit industry" : "Create industry"}
        >
          <div
            className="mx-4 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {editingId ? "Edit Industry" : "Create Industry"}
            </h3>

            <form onSubmit={handleSave} noValidate className="space-y-4">
              <div>
                <label htmlFor="ind-name" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="ind-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleFormChange("name", val);
                    if (!editingId) handleFormChange("slug", autoSlug(val));
                  }}
                  aria-invalid={!!formErrors.name}
                  className={cn(inputClass, formErrors.name && inputErrorClass)}
                />
                {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="ind-slug" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  id="ind-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleFormChange("slug", e.target.value)}
                  aria-invalid={!!formErrors.slug}
                  className={cn(inputClass, formErrors.slug && inputErrorClass)}
                />
                {formErrors.slug && <p className="mt-1 text-xs text-red-500">{formErrors.slug}</p>}
              </div>

              <div>
                <label htmlFor="ind-description" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  id="ind-description"
                  rows={3}
                  value={form.description ?? ""}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  className={cn(inputClass, "resize-y")}
                />
              </div>

              <div>
                <label htmlFor="ind-icon" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Icon
                </label>
                <input
                  id="ind-icon"
                  type="text"
                  value={form.icon ?? ""}
                  onChange={(e) => handleFormChange("icon", e.target.value)}
                  className={cn(inputClass)}
                />
              </div>

              {/* Capabilities */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Capabilities
                </label>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {(form.capabilities ?? []).map((cap, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {cap}
                      <button type="button" onClick={() => removeCapability(i)} className="hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={capabilityInput}
                    onChange={(e) => setCapabilityInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCapability(); } }}
                    placeholder="Add capability..."
                    className={cn(inputClass, "flex-1")}
                  />
                  <button
                    type="button"
                    onClick={addCapability}
                    className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <input
                  id="ind-status"
                  type="checkbox"
                  checked={form.status}
                  onChange={(e) => handleFormChange("status", e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                />
                <label htmlFor="ind-status" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Active
                </label>
              </div>

              {/* Server error */}
              {serverError && (
                <p className="text-sm text-red-500">{serverError}</p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  disabled={saving}
                  className={cn(
                    "rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium",
                    "text-zinc-700 hover:bg-zinc-50",
                    "dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
                  )}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                    "bg-blue-600 text-white hover:bg-blue-500",
                    saving && "cursor-not-allowed opacity-70",
                  )}
                >
                  {saving ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    "Create Industry"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ── */}
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
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Delete Industry</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete <strong className="text-zinc-900 dark:text-zinc-100">{deleteTarget.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors">
                {deleting ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting…</> : "Delete Industry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared classes
// ---------------------------------------------------------------------------

const inputClass =
  "w-full rounded-lg border px-3 py-2 text-sm bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:border-zinc-600";

const inputErrorClass =
  "border-red-400 focus:border-red-500 focus:ring-red-500";
