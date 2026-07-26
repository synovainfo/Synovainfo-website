"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  FileText,
  Eye,
  EyeOff,
  ChevronLeft,
  CheckCircle2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  submitButtonText: string;
  successMessage: string | null;
  emailNotification: string | null;
  status: boolean;
  fieldCount: number;
  submissionCount: number;
  lastSubmissionAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface FormsResponse {
  forms: FormListItem[];
  pagination: Pagination;
}

type SortField = "name" | "status" | "createdAt";
type SortOrder = "asc" | "desc";

// ---------------------------------------------------------------------------
// Create Form Schema
// ---------------------------------------------------------------------------

const createFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional().nullable(),
});

type CreateFormData = z.infer<typeof createFormSchema>;

// ---------------------------------------------------------------------------
// FormListPage
// ---------------------------------------------------------------------------

export default function FormListPage() {
  const router = useRouter();

  // Data state
  const [forms, setForms] = useState<FormListItem[]>([]);
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

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<CreateFormData>({
    name: "",
    slug: "",
    description: "",
  });
  const [createErrors, setCreateErrors] = useState<Partial<Record<string, string>>>({});
  const [creating, setCreating] = useState(false);
  const [createServerError, setCreateServerError] = useState<string | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<FormListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (name: string) => {
    setCreateForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  // Fetch forms
  const fetchForms = useCallback(async () => {
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

      const res = await fetch(`/api/admin/forms?${params}`);
      if (!res.ok) throw new Error("Failed to fetch forms");
      const data: FormsResponse = await res.json();
      setForms(data.forms);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, sortField, sortOrder]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

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

  // Create handler
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateServerError(null);
    setCreateErrors({});

    const result = createFormSchema.safeParse(createForm);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setCreateErrors(fieldErrors);
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to create form");
      }

      setShowCreate(false);
      setCreateForm({ name: "", slug: "", description: "" });
      fetchForms();
      router.push(`/admin/forms/${data.form.id}`);
    } catch (err) {
      setCreateServerError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setCreating(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/forms/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Failed to delete form");
      }
      setDeleteTarget(null);
      fetchForms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <PageHeader
        title="Forms"
        description="Manage your contact and survey forms"
        actions={
          <button
            onClick={() => setShowCreate(true)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-500",
              "transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
            )}
          >
            <Plus className="h-4 w-4" />
            New Form
          </button>
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
              placeholder="Search forms..."
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
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <button
          onClick={fetchForms}
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
      {!loading && !error && forms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No forms found
          </h3>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            {debouncedSearch || statusFilter
              ? "Try adjusting your search or filters"
              : "Get started by creating your first form"}
          </p>
          {!debouncedSearch && !statusFilter && (
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              New Form
            </button>
          )}
        </div>
      )}

      {/* ── Table ── */}
      {!loading && forms.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400"
                    onClick={() => toggleSort("name")}
                  >
                    <span className="inline-flex items-center">
                      Form
                      <SortIcon field="name" />
                    </span>
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Fields
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Submissions
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 lg:table-cell">
                    Last Submission
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
                {forms.map((form) => (
                  <tr
                    key={form.id}
                    className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/forms/${form.id}`}
                        className="font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                      >
                        {form.name}
                      </Link>
                      {form.description && (
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400 max-w-[250px]">
                          {form.description}
                        </p>
                      )}
                    </td>

                    {/* Fields count */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {form.fieldCount}
                      </span>
                    </td>

                    {/* Submissions */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {form.submissionCount}
                      </span>
                    </td>

                    {/* Last submission */}
                    <td className="hidden px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 lg:table-cell">
                      {formatDate(form.lastSubmissionAt)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-medium",
                          form.status
                            ? "text-green-700 dark:text-green-400"
                            : "text-red-700 dark:text-red-400",
                        )}
                      >
                        {form.status ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                        {form.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="hidden px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 md:table-cell">
                      {formatDate(form.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/forms/${form.id}`}
                          className={cn(
                            "rounded-lg p-2 text-zinc-400 transition-colors",
                            "hover:bg-zinc-100 hover:text-zinc-700",
                            "dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
                          )}
                          title="Edit form"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(form)}
                          className={cn(
                            "rounded-lg p-2 text-zinc-400 transition-colors",
                            "hover:bg-red-50 hover:text-red-600",
                            "dark:hover:bg-red-950/30 dark:hover:text-red-400",
                          )}
                          title="Delete form"
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
                {pagination.total} forms
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

      {/* ── Create Modal ── */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !creating && setShowCreate(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Create new form"
        >
          <div
            className="mx-4 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Create New Form
              </h3>
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Server error */}
            {createServerError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                {createServerError}
              </div>
            )}

            <form onSubmit={handleCreate} noValidate className="space-y-4">
              <div>
                <label htmlFor="create-name" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="create-name"
                  type="text"
                  value={createForm.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Contact Us"
                  aria-invalid={!!createErrors.name}
                  className={cn(
                    inputClass,
                    createErrors.name && inputErrorClass,
                  )}
                />
                {createErrors.name && <p className="mt-1 text-xs text-red-500">{createErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="create-slug" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  id="create-slug"
                  type="text"
                  value={createForm.slug}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g. contact-us"
                  aria-invalid={!!createErrors.slug}
                  className={cn(
                    inputClass,
                    createErrors.slug && inputErrorClass,
                  )}
                />
                {createErrors.slug && <p className="mt-1 text-xs text-red-500">{createErrors.slug}</p>}
              </div>

              <div>
                <label htmlFor="create-description" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  id="create-description"
                  rows={3}
                  value={createForm.description ?? ""}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description for this form"
                  className={cn(inputClass, "resize-y")}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  disabled={creating}
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
                  type="submit"
                  disabled={creating}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                    "bg-blue-600 text-white hover:bg-blue-500",
                    "transition-colors",
                    creating && "cursor-not-allowed opacity-70",
                  )}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating…
                    </>
                  ) : (
                    "Create Form"
                  )}
                </button>
              </div>
            </form>
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
                  Delete Form
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {deleteTarget.name}
              </strong>
              ? This will permanently remove this form and all its submissions.
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
                  "Delete Form"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared class names
// ---------------------------------------------------------------------------

const inputClass =
  "w-full rounded-lg border px-3 py-2 text-sm bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:border-zinc-600";

const inputErrorClass =
  "border-red-400 focus:border-red-500 focus:ring-red-500";
