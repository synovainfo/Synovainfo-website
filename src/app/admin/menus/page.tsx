"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Search,
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
  Menu as MenuIcon,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MenuItem {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { items: number };
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface MenusResponse {
  menus: MenuItem[];
  pagination: Pagination;
}

// ---------------------------------------------------------------------------
// Create Menu Modal Schema
// ---------------------------------------------------------------------------

const createSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  location: z.string().max(100).optional().nullable(),
});

type CreateForm = z.infer<typeof createSchema>;

// ---------------------------------------------------------------------------
// MenusListPage
// ---------------------------------------------------------------------------

export default function MenusListPage() {
  const router = useRouter();

  // Data
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>({
    name: "",
    slug: "",
    location: "",
  });
  const [createErrors, setCreateErrors] = useState<
    Partial<Record<keyof CreateForm, string>>
  >({});
  const [creating, setCreating] = useState(false);
  const [createServerError, setCreateServerError] = useState<string | null>(
    null,
  );

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch
  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", "50");
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/admin/menus?${params}`);
      if (!res.ok) throw new Error("Failed to fetch menus");
      const data: MenusResponse = await res.json();
      setMenus(data.menus);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // Auto-generate slug from name
  useEffect(() => {
    if (createForm.name && !createForm.slug) {
      const generated = createForm.name
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setCreateForm((prev) => ({ ...prev, slug: generated }));
    }
  }, [createForm.name, createForm.slug]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateServerError(null);

    const result = createSchema.safeParse(createForm);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CreateForm, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setCreateErrors(fieldErrors);
      return;
    }

    setCreateErrors({});
    setCreating(true);

    try {
      const res = await fetch("/api/admin/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to create menu");
      }
      setShowCreate(false);
      setCreateForm({ name: "", slug: "", location: "" });
      router.push(`/admin/menus/${data.menu.id}`);
    } catch (err) {
      setCreateServerError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/menus/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Failed to delete");
      }
      setDeleteTarget(null);
      fetchMenus();
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
        title="Menus"
        description="Create and manage navigation menus"
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
            New Menu
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search menus..."
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
        </div>

        <button
          onClick={fetchMenus}
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

      {/* Error */}
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && menus.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MenuIcon className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No menus found
          </h3>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            {debouncedSearch
              ? "Try adjusting your search"
              : "Get started by creating your first navigation menu"}
          </p>
          {!debouncedSearch && (
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              New Menu
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && menus.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Menu
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 sm:table-cell">
                    Slug
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 sm:table-cell">
                    Location
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Items
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 md:table-cell">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {menus.map((menu) => (
                  <tr
                    key={menu.id}
                    className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/menus/${menu.id}`}
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                      >
                        <MenuIcon className="h-4 w-4 shrink-0" />
                        {menu.name}
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 sm:table-cell">
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                        {menu.slug}
                      </code>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 sm:table-cell">
                      {menu.location ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {menu.location}
                        </span>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-500">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                      {menu._count.items}
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 md:table-cell">
                      {formatDate(menu.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/menus/${menu.id}`}
                          className={cn(
                            "rounded-lg p-2 text-zinc-400 transition-colors",
                            "hover:bg-zinc-100 hover:text-zinc-700",
                            "dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
                          )}
                          title="Edit menu"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(menu)}
                          className={cn(
                            "rounded-lg p-2 text-zinc-400 transition-colors",
                            "hover:bg-red-50 hover:text-red-600",
                            "dark:hover:bg-red-950/30 dark:hover:text-red-400",
                          )}
                          title="Delete menu"
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
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.total,
                )}{" "}
                of {pagination.total} menus
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
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
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

      {/* Create Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !creating && setShowCreate(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Create new menu"
        >
          <div
            className="mx-4 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Create New Menu
            </h3>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              Define a new navigation menu for your site.
            </p>

            {createServerError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{createServerError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="create-name"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="create-name"
                  type="text"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  aria-invalid={!!createErrors.name}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    createErrors.name
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                      : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                  placeholder="e.g. Main Navigation"
                />
                {createErrors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {createErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="create-slug"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  id="create-slug"
                  type="text"
                  value={createForm.slug}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-"),
                    }))
                  }
                  aria-invalid={!!createErrors.slug}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    createErrors.slug
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                      : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                  placeholder="e.g. main-navigation"
                />
                {createErrors.slug && (
                  <p className="mt-1 text-xs text-red-500">
                    {createErrors.slug}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="create-location"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Location
                </label>
                <input
                  id="create-location"
                  type="text"
                  value={createForm.location ?? ""}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      location: e.target.value || null,
                    }))
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                  placeholder="e.g. header, footer, sidebar"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    setCreateServerError(null);
                    setCreateErrors({});
                  }}
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
                    "Create Menu"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
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
                  Delete Menu
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
              ? All menu items within it will also be deleted.
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
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
