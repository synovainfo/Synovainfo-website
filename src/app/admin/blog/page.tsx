"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Author {
  id: string;
  name: string;
  image: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  scheduledAt: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  category: Category;
  tags: Tag[];
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface PostsResponse {
  posts: BlogPostItem[];
  pagination: Pagination;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

type SortField = "title" | "status" | "createdAt" | "updatedAt" | "publishedAt" | "viewCount";
type SortOrder = "asc" | "desc";

// ---------------------------------------------------------------------------
// Status Badge
// ---------------------------------------------------------------------------

function StatusBadge({ status, scheduledAt }: { status: string; scheduledAt?: string | null }) {
  if (status === "SCHEDULED") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        SCHEDULED
        {scheduledAt && (
          <span className="opacity-70">
            {new Date(scheduledAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </span>
    );
  }

  if (status === "PUBLISHED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        PUBLISHED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
      DRAFT
    </span>
  );
}

// ---------------------------------------------------------------------------
// Blog Posts List Page
// ---------------------------------------------------------------------------

export default function BlogPostsListPage() {
  const router = useRouter();

  // Data state
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<BlogPostItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // New post dialog
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch categories for filter and new post dialog
  useEffect(() => {
    fetch("/api/admin/blog/categories")
      .then((res) => res.ok ? res.json() : { categories: [] })
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => { /* silently ignore */ });
  }, []);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", "20");
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("categoryId", categoryFilter);
      params.set("sort", sortField);
      params.set("order", sortOrder);

      const res = await fetch(`/api/admin/blog?${params}`);
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      const data: PostsResponse = await res.json();
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, categoryFilter, sortField, sortOrder]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
    if (sortField !== field)
      return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
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
      const res = await fetch(`/api/admin/blog/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Failed to delete post");
      }
      setDeleteTarget(null);
      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // Create post
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!newTitle.trim() || !newCategoryId) return;

    setCreating(true);
    try {
      const slug =
        newSlug.trim() ||
        newTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          slug,
          categoryId: newCategoryId,
          status: "DRAFT",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to create post");
      }

      setShowNewPost(false);
      setNewTitle("");
      setNewSlug("");
      setNewCategoryId("");
      router.push(`/admin/blog/${data.post.id}`);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setCreating(false);
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
        title="Blog Posts"
        description="Manage your blog content"
        actions={
          <button
            onClick={() => setShowNewPost(true)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-500",
              "transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
            )}
          >
            <Plus className="h-4 w-4" />
            New Post
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
              placeholder="Search posts..."
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
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className={cn(
              "rounded-lg border border-zinc-200 px-3 py-2 text-sm",
              "bg-white text-zinc-900",
              "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
            )}
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="SCHEDULED">Scheduled</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className={cn(
              "rounded-lg border border-zinc-200 px-3 py-2 text-sm",
              "bg-white text-zinc-900",
              "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
            )}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchPosts}
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
      {!loading && !error && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No blog posts found
          </h3>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            {debouncedSearch || statusFilter || categoryFilter
              ? "Try adjusting your search or filters"
              : "Get started by writing your first blog post"}
          </p>
          {!debouncedSearch && !statusFilter && !categoryFilter && (
            <button
              onClick={() => setShowNewPost(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              New Post
            </button>
          )}
        </div>
      )}

      {/* ── Table ── */}
      {!loading && posts.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Title
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Category
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Author
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Status
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400"
                  onClick={() => toggleSort("publishedAt")}
                >
                  <span className="inline-flex items-center">
                    Published
                    <SortIcon field="publishedAt" />
                  </span>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400"
                  onClick={() => toggleSort("viewCount")}
                >
                  <span className="inline-flex items-center">
                    Views
                    <SortIcon field="viewCount" />
                  </span>
                </th>
                <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {post.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      {post.author.image ? (
                        <img
                          src={post.author.image}
                          alt=""
                          className="h-5 w-5 rounded-full"
                        />
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300">
                          {post.author.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{post.author.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={post.status}
                      scheduledAt={post.scheduledAt}
                    />
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {formatDate(post.publishedAt)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {post.viewCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="rounded-md p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 dark:hover:text-blue-400 dark:hover:bg-zinc-800"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="rounded-md p-1.5 text-zinc-400 hover:text-red-600 hover:bg-zinc-100 dark:hover:text-red-400 dark:hover:bg-zinc-800"
                        title="Delete"
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
      )}

      {/* ── Pagination ── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">
            Showing {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
            {pagination.total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={cn(
                "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm transition-colors",
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
                "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm transition-colors",
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

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Delete Post
            </h3>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {deleteTarget.title}
              </strong>
              ? This action can be undone (soft delete).
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className={cn(
                  "rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium transition-colors",
                  "dark:border-zinc-700 dark:text-zinc-300",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors",
                  "bg-red-600 hover:bg-red-500",
                  deleting && "cursor-not-allowed opacity-60",
                )}
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── New Post Dialog ── */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              New Blog Post
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label
                  htmlFor="new-title"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Title *
                </label>
                <input
                  id="new-title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug.trim()) {
                      setNewSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, ""),
                      );
                    }
                  }}
                  placeholder="Enter post title"
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="new-slug"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Slug
                </label>
                <input
                  id="new-slug"
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="my-post-title"
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label
                  htmlFor="new-category"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Category *
                </label>
                <select
                  id="new-category"
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {createError && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {createError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewPost(false);
                    setCreateError(null);
                  }}
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTitle.trim() || !newCategoryId}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white",
                    "bg-blue-600 hover:bg-blue-500",
                    (creating || !newTitle.trim() || !newCategoryId) && "cursor-not-allowed opacity-60",
                  )}
                >
                  {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                  {creating ? "Creating..." : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
