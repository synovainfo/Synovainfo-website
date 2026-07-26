"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
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
  Cpu,
  CheckCircle2,
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
  category: string | null;
  description: string | null;
  icon: string | null;
  websiteUrl: string | null;
  proficiencyLevel: number;
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

interface TechnologiesResponse {
  technologies: Technology[];
  pagination: Pagination;
}

type SortField = "name" | "category" | "proficiencyLevel" | "status" | "createdAt";
type SortOrder = "asc" | "desc";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const technologySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  proficiencyLevel: z.number().int().min(0).max(100),
  status: z.boolean(),
});

type TechnologyForm = z.infer<typeof technologySchema>;

const emptyForm: TechnologyForm = {
  name: "",
  slug: "",
  category: "",
  description: "",
  icon: "",
  websiteUrl: "",
  proficiencyLevel: 0,
  status: true,
};

// ---------------------------------------------------------------------------
// SortIcon component (defined outside component to avoid React 19 static-components rule)
// ---------------------------------------------------------------------------

function SortIcon({
  field,
  sortField,
  sortOrder,
}: {
  field: SortField;
  sortField: SortField;
  sortOrder: SortOrder;
}) {
  if (sortField !== field) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
  return sortOrder === "asc" ? (
    <ArrowUp className="ml-1 h-3.5 w-3.5" />
  ) : (
    <ArrowDown className="ml-1 h-3.5 w-3.5" />
  );
}

// ---------------------------------------------------------------------------
// TechnologiesPage
// ---------------------------------------------------------------------------

export default function TechnologiesPage() {
  // List state
  const [technologies, setTechnologies] = useState<Technology[]>([]);
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

  // Editor modal
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TechnologyForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Technology | null>(null);
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
  const fetchTechnologies = useCallback(async () => {
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

      const res = await fetch(`/api/admin/technologies?${params}`);
      if (!res.ok) throw new Error("Failed to fetch technologies");
      const data: TechnologiesResponse = await res.json();
      setTechnologies(data.technologies);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoryFilter, statusFilter, sortField, sortOrder]);

  useEffect(() => {
    startTransition(() => {
      fetchTechnologies();
    });
  }, [fetchTechnologies]);

  // Sort
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Open editor
  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setServerError(null);
    setEditorOpen(true);
  };

  const openEdit = (tech: Technology) => {
    setEditingId(tech.id);
    setForm({
      name: tech.name,
      slug: tech.slug,
      category: tech.category ?? "",
      description: tech.description ?? "",
      icon: tech.icon ?? "",
      websiteUrl: tech.websiteUrl ?? "",
      proficiencyLevel: tech.proficiencyLevel,
      status: tech.status,
    });
    setFormErrors({});
    setServerError(null);
    setEditorOpen(true);
  };

  // Form handlers
  const handleFormChange = (field: keyof TechnologyForm, value: string | boolean | number) => {
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

  // Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const result = technologySchema.safeParse(form);
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
        ? `/api/admin/technologies/${editingId}`
        : "/api/admin/technologies";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to save technology");
      }

      setSuccessMessage(
        editingId ? "Technology updated successfully" : "Technology created successfully",
      );
      setEditorOpen(false);
      fetchTechnologies();
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
      const res = await fetch(`/api/admin/technologies/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Failed to delete technology");
      }
      setDeleteTarget(null);
      fetchTechnologies();
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
        title="Technologies"
        description="Manage technology stack items"
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
            New Technology
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
              placeholder="Search technologies..."
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
            <option value="FRONTEND">Frontend</option>
            <option value="BACKEND">Backend</option>
            <option value="DATABASE">Database</option>
            <option value="CLOUD">Cloud</option>
            <option value="DEVOPS">DevOps</option>
            <option value="MOBILE">Mobile</option>
            <option value="AI_ML">AI/ML</option>
            <option value="TOOLS">Tools</option>
          </select>

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
          onClick={fetchTechnologies}
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
      {!loading && !error && technologies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Cpu className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No technologies found
          </h3>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            {debouncedSearch || categoryFilter || statusFilter
              ? "Try adjusting your search or filters"
              : "Get started by adding your first technology"}
          </p>
          {!debouncedSearch && !categoryFilter && !statusFilter && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              New Technology
            </button>
          )}
        </div>
      )}

      {/* ── Table ── */}
      {!loading && technologies.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <th className="cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400" onClick={() => toggleSort("name")}>
                    <span className="inline-flex items-center">
                      Name <SortIcon field="name" sortField={sortField} sortOrder={sortOrder} />
                    </span>
                  </th>
                  <th className="cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400" onClick={() => toggleSort("category")}>
                    <span className="inline-flex items-center">
                      Category <SortIcon field="category" sortField={sortField} sortOrder={sortOrder} />
                    </span>
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 sm:table-cell">Description</th>
                  <th className="hidden cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 md:table-cell" onClick={() => toggleSort("proficiencyLevel")}>
                    <span className="inline-flex items-center">
                      Proficiency <SortIcon field="proficiencyLevel" sortField={sortField} sortOrder={sortOrder} />
                    </span>
                  </th>
                  <th className="cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400" onClick={() => toggleSort("status")}>
                    <span className="inline-flex items-center">
                      Status <SortIcon field="status" sortField={sortField} sortOrder={sortOrder} />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {technologies.map((tech) => (
                  <tr key={tech.id} className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{tech.name}</span>
                        {tech.websiteUrl && (
                          <a href={tech.websiteUrl} target="_blank" rel="noopener noreferrer" className="ml-1.5 text-blue-500 hover:text-blue-400">
                            ↗
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {tech.category ? (
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          {tech.category.replace(/_/g, " ")}
                        </span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="max-w-[200px] truncate block text-zinc-500 dark:text-zinc-400">
                        {tech.description || "—"}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${tech.proficiencyLevel}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{tech.proficiencyLevel}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-medium",
                        tech.status ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400",
                      )}>
                        {tech.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(tech)}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                          title="Edit technology">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(tech)}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                          title="Delete technology">
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
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
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
          aria-label={editingId ? "Edit technology" : "Create technology"}
        >
          <div
            className="mx-4 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {editingId ? "Edit Technology" : "Create Technology"}
            </h3>

            <form onSubmit={handleSave} noValidate className="space-y-4">
              <div>
                <label htmlFor="tech-name" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="tech-name"
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
                <label htmlFor="tech-slug" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  id="tech-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleFormChange("slug", e.target.value)}
                  aria-invalid={!!formErrors.slug}
                  className={cn(inputClass, formErrors.slug && inputErrorClass)}
                />
                {formErrors.slug && <p className="mt-1 text-xs text-red-500">{formErrors.slug}</p>}
              </div>

              <div>
                <label htmlFor="tech-category" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Category
                </label>
                <select
                  id="tech-category"
                  value={form.category ?? ""}
                  onChange={(e) => handleFormChange("category", e.target.value)}
                  className={cn(selectClass)}
                >
                  <option value="">Select category</option>
                  <option value="FRONTEND">Frontend</option>
                  <option value="BACKEND">Backend</option>
                  <option value="DATABASE">Database</option>
                  <option value="CLOUD">Cloud</option>
                  <option value="DEVOPS">DevOps</option>
                  <option value="MOBILE">Mobile</option>
                  <option value="AI_ML">AI/ML</option>
                  <option value="TOOLS">Tools</option>
                </select>
              </div>

              <div>
                <label htmlFor="tech-description" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  id="tech-description"
                  rows={3}
                  value={form.description ?? ""}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  className={cn(inputClass, "resize-y")}
                />
              </div>

              <div>
                <label htmlFor="tech-icon" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Icon
                </label>
                <input
                  id="tech-icon"
                  type="text"
                  value={form.icon ?? ""}
                  onChange={(e) => handleFormChange("icon", e.target.value)}
                  className={cn(inputClass)}
                />
              </div>

              <div>
                <label htmlFor="tech-website" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Website URL
                </label>
                <input
                  id="tech-website"
                  type="url"
                  value={form.websiteUrl ?? ""}
                  onChange={(e) => handleFormChange("websiteUrl", e.target.value)}
                  placeholder="https://"
                  className={cn(inputClass)}
                />
              </div>

              <div>
                <label htmlFor="tech-proficiency" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Proficiency Level: {form.proficiencyLevel}%
                </label>
                <input
                  id="tech-proficiency"
                  type="range"
                  min={0}
                  max={100}
                  value={form.proficiencyLevel}
                  onChange={(e) => handleFormChange("proficiencyLevel", Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="tech-status"
                  type="checkbox"
                  checked={form.status}
                  onChange={(e) => handleFormChange("status", e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                />
                <label htmlFor="tech-status" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Active
                </label>
              </div>

              {serverError && <p className="text-sm text-red-500">{serverError}</p>}

              <div className="flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button type="button" onClick={() => setEditorOpen(false)} disabled={saving}
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className={cn("inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-500", saving && "cursor-not-allowed opacity-70")}>
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : editingId ? "Save Changes" : "Create Technology"}
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
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Delete Technology</h3>
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
                {deleting ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting…</> : "Delete Technology"}
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

const selectClass =
  "w-full rounded-lg border px-3 py-2 text-sm bg-white text-zinc-900 focus:outline-none focus:ring-1 border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-600";
