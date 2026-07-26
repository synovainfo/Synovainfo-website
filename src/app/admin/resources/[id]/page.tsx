"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import {
  Loader2,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ResourceDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: string | null;
  fileUrl: string | null;
  coverImage: string | null;
  category: string | null;
  tags: string[] | null;
  downloadCount: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ResourceResponse {
  resource: ResourceDetail;
}

// ---------------------------------------------------------------------------
// Resource types
// ---------------------------------------------------------------------------

const RESOURCE_TYPES = [
  { value: "WHITEPAPER", label: "Whitepaper" },
  { value: "GUIDE", label: "Guide" },
  { value: "EBOOK", label: "eBook" },
  { value: "DATASHEET", label: "Datasheet" },
  { value: "CASE_STUDY", label: "Case Study" },
] as const;

const RESOURCE_CATEGORIES = [
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "BUSINESS", label: "Business" },
  { value: "INDUSTRY", label: "Industry" },
  { value: "INNOVATION", label: "Innovation" },
  { value: "CLOUD", label: "Cloud" },
  { value: "AI_ML", label: "AI & Machine Learning" },
  { value: "SECURITY", label: "Security" },
  { value: "DIGITAL_TRANSFORMATION", label: "Digital Transformation" },
] as const;

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const updateResourceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase alphanumeric with hyphens",
    ),
  description: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  status: z.boolean(),
});

type UpdateResourceForm = z.infer<typeof updateResourceSchema>;

// ---------------------------------------------------------------------------
// EditResourcePage
// ---------------------------------------------------------------------------

export default function EditResourcePage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = params.id as string;

  // Data state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form
  const [form, setForm] = useState<UpdateResourceForm>({
    title: "",
    slug: "",
    description: "",
    type: "",
    fileUrl: "",
    coverImage: "",
    category: "",
    tags: [],
    status: true,
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<string, string>>
  >({});
  const [tagInput, setTagInput] = useState("");

  // Fetch resource
  const fetchResource = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/resources/${resourceId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Resource not found");
        throw new Error("Failed to fetch resource");
      }
      const data: ResourceResponse = await res.json();
      const r = data.resource;

      setForm({
        title: r.title,
        slug: r.slug,
        description: r.description ?? "",
        type: r.type ?? "",
        fileUrl: r.fileUrl ?? "",
        coverImage: r.coverImage ?? "",
        category: r.category ?? "",
        tags: Array.isArray(r.tags) ? r.tags : [],
        status: r.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    fetchResource();
  }, [fetchResource]);

  // Handlers
  const handleChange = (
    field: keyof UpdateResourceForm,
    value: string | boolean | string[],
  ) => {
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

  // Tag management
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (form.tags?.includes(trimmed)) return;
    handleChange("tags", [...(form.tags ?? []), trimmed]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    handleChange(
      "tags",
      (form.tags ?? []).filter((t) => t !== tag),
    );
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const payload = {
      ...form,
      tags: form.tags && form.tags.length > 0 ? form.tags : null,
    };

    const result = updateResourceSchema.safeParse(payload);
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
      const res = await fetch(`/api/admin/resources/${resourceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message ?? data.error ?? "Failed to update resource",
        );
      }

      setSuccessMessage("Resource updated successfully");
      fetchResource();
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
      const res = await fetch(`/api/admin/resources/${resourceId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Failed to delete resource");
      }
      router.push("/admin/resources");
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

  // Error state
  if (error) {
    return (
      <div>
        <Link
          href="/admin/resources"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Resources
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchResource}
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
        href="/admin/resources"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Resources
      </Link>

      <PageHeader title="Edit Resource" description={form.title} />

      {/* Success banner */}
      {successMessage && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
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

      <form onSubmit={handleSave} noValidate className="max-w-3xl space-y-6">
        {/* Basic Information */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                aria-invalid={!!formErrors.title}
                className={cn(
                  inputClass,
                  formErrors.title && inputErrorClass,
                )}
              />
              {formErrors.title && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="slug"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="slug"
                type="text"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                aria-invalid={!!formErrors.slug}
                className={cn(
                  inputClass,
                  formErrors.slug && inputErrorClass,
                )}
              />
              {formErrors.slug && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.slug}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="type"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Resource Type
              </label>
              <select
                id="type"
                value={form.type ?? ""}
                onChange={(e) => handleChange("type", e.target.value)}
                className={cn(selectClass)}
              >
                <option value="">Select type</option>
                {RESOURCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Category
              </label>
              <select
                id="category"
                value={form.category ?? ""}
                onChange={(e) => handleChange("category", e.target.value)}
                className={cn(selectClass)}
              >
                <option value="">Select category</option>
                {RESOURCE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Description
          </h3>
          <div>
            <textarea
              id="description"
              rows={6}
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className={cn(inputClass, "resize-y min-h-[120px]")}
              placeholder="Enter a detailed description of this resource..."
            />
          </div>
        </div>

        {/* Files & Media */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Files &amp; Media
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="fileUrl"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                File URL
              </label>
              <input
                id="fileUrl"
                type="text"
                value={form.fileUrl ?? ""}
                onChange={(e) => handleChange("fileUrl", e.target.value)}
                className={cn(inputClass)}
                placeholder="https://example.com/resource.pdf"
              />
            </div>
            <div>
              <label
                htmlFor="coverImage"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Cover Image URL
              </label>
              <input
                id="coverImage"
                type="text"
                value={form.coverImage ?? ""}
                onChange={(e) => handleChange("coverImage", e.target.value)}
                className={cn(inputClass)}
                placeholder="https://example.com/cover.jpg"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Tags
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter..."
                className={cn(inputClass, "flex-1")}
              />
              <button
                type="button"
                onClick={addTag}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
            {form.tags && form.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                No tags added yet.
              </p>
            )}
          </div>
        </div>

        {/* Status toggle */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <input
              id="status"
              type="checkbox"
              checked={form.status}
              onChange={(e) => handleChange("status", e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
            />
            <label
              htmlFor="status"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Published (visible on website)
            </label>
          </div>
        </div>

        {/* Form actions */}
        <div className="flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-700">
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
            Delete Resource
          </button>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/resources"
              className={cn(
                "rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium",
                "text-zinc-700 hover:bg-zinc-50",
                "dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
                "transition-colors",
              )}
            >
              Cancel
            </Link>
            <button
              type="submit"
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
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ── Delete Confirmation ── */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !deleting && setShowDeleteConfirm(false)}
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
                  Delete Resource
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {form.title}
              </strong>
              ? This will permanently remove this resource.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
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
                  "Delete Resource"
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

const selectClass =
  "w-full rounded-lg border px-3 py-2 text-sm bg-white text-zinc-900 focus:outline-none focus:ring-1 border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-600";
