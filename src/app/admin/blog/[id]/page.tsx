"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Save,
  Clock,
  Calendar,
  Eye,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SEOFields, type SEOData, DEFAULT_SEO } from "@/components/admin/seo-fields";

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

interface BlogPostDetail {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featuredImage: string | null;
  authorId: string;
  author: Author;
  categoryId: string;
  category: Category;
  tags: Tag[];
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  publishedAt: string | null;
  scheduledAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PostResponse {
  post: BlogPostDetail;
}

// ---------------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------------

type Tab = "content" | "seo";

const TABS: { id: Tab; label: string }[] = [
  { id: "content", label: "Content" },
  { id: "seo", label: "SEO" },
];

// ---------------------------------------------------------------------------
// EditBlogPostPage
// ---------------------------------------------------------------------------

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const isNew = postId === "new";

  // Data state
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("content");

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "SCHEDULED">("DRAFT");
  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImagePreview, setFeaturedImagePreview] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState("");

  // SEO
  const [seo, setSeo] = useState<SEOData>(DEFAULT_SEO);

  // Lookup data
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title.trim()) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generated);
    }
  }, [title, slugManuallyEdited]);

  // Fetch categories and tags for dropdowns
  useEffect(() => {
    async function loadLookups() {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetch("/api/admin/blog/categories"),
          fetch("/api/admin/blog/tags"),
        ]);
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories ?? []);
        }
        if (tagRes.ok) {
          const tagData = await tagRes.json();
          setTags(tagData.tags ?? []);
        }
      } catch {
        // Non-critical
      }
    }
    loadLookups();
  }, []);

  // Fetch post
  const fetchPost = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Blog post not found");
        throw new Error("Failed to fetch blog post");
      }
      const data: PostResponse = await res.json();
      const post = data.post;

      setTitle(post.title);
      setSlug(post.slug);
      setSlugManuallyEdited(true);
      setContent(post.content ?? "");
      setExcerpt(post.excerpt ?? "");
      setStatus(post.status);
      setFeaturedImage(post.featuredImage ?? "");
      setFeaturedImagePreview(post.featuredImage ?? "");
      setCategoryId(post.categoryId);
      setSelectedTagIds(post.tags.map((t) => t.id));
      setScheduledAt(post.scheduledAt ?? "");

      setSeo({
        title: post.seoTitle ?? "",
        description: post.seoDescription ?? "",
        keywords: post.seoKeywords ?? "",
        canonicalUrl: post.canonicalUrl ?? "",
        robotsIndex: true,
        robotsFollow: true,
        ogTitle: "",
        ogDescription: "",
        ogImage: post.ogImage ?? "",
        jsonldType: "Article",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [postId, isNew]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // Featured image upload
  const handleFeaturedImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setFeaturedImage(url);
        setFeaturedImagePreview(url);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // Tag toggle
  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  // Save handler
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setServerError("Title is required");
      return;
    }
    if (!slug.trim()) {
      setServerError("Slug is required");
      return;
    }
    if (!categoryId) {
      setServerError("Category is required");
      return;
    }

    setSaving(true);

    const payload: Record<string, unknown> = {
      title: title.trim(),
      slug: slug.trim(),
      content: content || null,
      excerpt: excerpt.trim() || null,
      featuredImage: featuredImage || null,
      categoryId,
      tagIds: selectedTagIds,
      status,
      seoTitle: seo.title || null,
      seoDescription: seo.description || null,
      seoKeywords: seo.keywords || null,
      canonicalUrl: seo.canonicalUrl || null,
      ogImage: seo.ogImage || null,
    };

    if (scheduledAt) {
      payload.scheduledAt = new Date(scheduledAt).toISOString();
    } else {
      payload.scheduledAt = null;
    }

    try {
      if (isNew) {
        // Create new post
        const res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message ?? data.error ?? "Failed to create post");
        }
        setSuccessMessage("Post created successfully");
        router.push(`/admin/blog/${data.post.id}`);
      } else {
        // Update existing
        const res = await fetch(`/api/admin/blog/${postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message ?? data.error ?? "Failed to update post");
        }
        setSuccessMessage("Post saved successfully");
        // Refresh SEO state from server
        if (data.post) {
          setSeo({
            title: data.post.seoTitle ?? "",
            description: data.post.seoDescription ?? "",
            keywords: data.post.seoKeywords ?? "",
            canonicalUrl: data.post.canonicalUrl ?? "",
            robotsIndex: true,
            robotsFollow: true,
            ogTitle: "",
            ogDescription: "",
            ogImage: data.post.ogImage ?? "",
            jsonldType: "Article",
          });
        }
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    setDeleting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Failed to delete post");
      }
      router.push("/admin/blog");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Error state (not found)
  if (error) {
    return (
      <div>
        <Link
          href="/admin/blog"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Blog
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchPost}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/blog"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      <PageHeader
        title={isNew ? "New Blog Post" : title || "Untitled Post"}
        description={isNew ? "Create a new blog post" : `/${slug || "—"}`}
        actions={
          <div className="flex items-center gap-3">
            {!isNew && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                  "text-red-600 hover:bg-red-50",
                  "dark:text-red-400 dark:hover:bg-red-950/30",
                  "transition-colors",
                )}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                "bg-blue-600 text-white hover:bg-blue-500",
                "transition-colors",
                saving && "cursor-not-allowed opacity-70",
              )}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving&hellip;
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isNew ? "Create" : "Save"}
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Success banner */}
      {successMessage && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-auto font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error banner */}
      {serverError && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{serverError}</span>
          <button
            onClick={() => setServerError(null)}
            className="ml-auto font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Quick Action Buttons ── */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {status === "DRAFT" && (
          <button
            type="button"
            onClick={async () => {
              setStatus("PUBLISHED");
              // Save with published status
              setSaving(true);
              try {
                const payload: Record<string, unknown> = {
                  title: title.trim(),
                  slug: slug.trim(),
                  content: content || null,
                  excerpt: excerpt.trim() || null,
                  featuredImage: featuredImage || null,
                  categoryId,
                  tagIds: selectedTagIds,
                  status: "PUBLISHED",
                  seoTitle: seo.title || null,
                  seoDescription: seo.description || null,
                  seoKeywords: seo.keywords || null,
                  canonicalUrl: seo.canonicalUrl || null,
                  ogImage: seo.ogImage || null,
                };

                if (isNew) {
                  const res = await fetch("/api/admin/blog", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message ?? "Failed to publish");
                  setSuccessMessage("Post published");
                  router.push(`/admin/blog/${data.post.id}`);
                } else {
                  const res = await fetch(`/api/admin/blog/${postId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message ?? "Failed to publish");
                  setSuccessMessage("Post published successfully");
                  fetchPost();
                }
              } catch (err) {
                setServerError(err instanceof Error ? err.message : "Publish failed");
              } finally {
                setSaving(false);
              }
            }}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "bg-green-600 text-white hover:bg-green-500",
              "transition-colors",
            )}
          >
            <Eye className="h-4 w-4" />
            Publish Now
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setStatus("SCHEDULED");
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
            status === "SCHEDULED"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800",
            "transition-colors",
          )}
        >
          <Clock className="h-4 w-4" />
          {status === "SCHEDULED" ? "Scheduled" : "Schedule"}
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Panels ── */}
      <div className="space-y-6">
        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-6">
            {/* Title / Slug / Status row */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Title */}
                <div>
                  <label
                    htmlFor="post-title"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="post-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label
                    htmlFor="post-slug"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="post-slug"
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugManuallyEdited(true);
                    }}
                    placeholder="post-url-slug"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="post-status"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Status
                  </label>
                  <select
                    id="post-status"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "DRAFT" | "PUBLISHED" | "SCHEDULED")
                    }
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="SCHEDULED">Scheduled</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="post-category"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="post-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Schedule date */}
              {status === "SCHEDULED" && (
                <div className="mt-4">
                  <label
                    htmlFor="post-schedule"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    <Calendar className="mr-1.5 inline-block h-4 w-4" />
                    Schedule Date
                  </label>
                  <input
                    id="post-schedule"
                    type="datetime-local"
                    value={
                      scheduledAt
                        ? new Date(scheduledAt).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        setScheduledAt(new Date(val).toISOString());
                      } else {
                        setScheduledAt("");
                      }
                    }}
                    className="w-full max-w-xs rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              )}
            </div>

            {/* Featured Image */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Featured Image
              </h3>
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={handleFeaturedImageUpload}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <ImageIcon className="h-4 w-4" />
                  Upload Image
                </button>
                {featuredImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImage("");
                      setFeaturedImagePreview("");
                    }}
                    className="rounded-lg p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {featuredImagePreview && (
                <div className="mt-2 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <img
                    src={featuredImagePreview}
                    alt="Featured preview"
                    className="max-h-48 w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <label
                htmlFor="post-excerpt"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Excerpt / Summary
              </label>
              <textarea
                id="post-excerpt"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the post..."
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 resize-y"
              />
            </div>

            {/* Tags */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Tags
              </h3>
              {tags.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No tags available.{" "}
                  <Link
                    href="/admin/blog/tags"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Create tags
                  </Link>
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                        selectedTagIds.includes(tag.id)
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700",
                      )}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Author info */}
            {!isNew && (
              <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
                <h3 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Author
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      Author (from session)
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      The author is set automatically from the authenticated user
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Content: Rich text editor */}
            <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
              <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Content
                </h3>
              </div>
              <div className="p-4">
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Start writing your blog post..."
                  minHeight="400px"
                />
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
              SEO Settings
            </h3>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              Configure search engine optimization and social sharing for this post
            </p>
            <SEOFields value={seo} onChange={setSeo} />
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Delete Post
            </h3>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {title || "this post"}
              </strong>
              ? This action can be undone (soft delete).
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white",
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
    </div>
  );
}
