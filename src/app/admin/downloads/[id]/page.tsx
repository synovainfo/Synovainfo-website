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
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DownloadDetail {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  fileSize: number | null;
  fileType: string | null;
  category: string | null;
  icon: string | null;
  isFeatured: boolean;
  downloadCount: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DownloadResponse {
  download: DownloadDetail;
}

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const updateDownloadSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  fileSize: z
    .union([z.number().int().nonnegative(), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? null : v)),
  fileType: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  isFeatured: z.boolean(),
  status: z.boolean(),
});

type UpdateDownloadForm = z.infer<typeof updateDownloadSchema>;

// ---------------------------------------------------------------------------
// EditDownloadPage
// ---------------------------------------------------------------------------

export default function EditDownloadPage() {
  const params = useParams();
  const router = useRouter();
  const downloadId = params.id as string;

  // Data state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form
  const [form, setForm] = useState<UpdateDownloadForm>({
    title: "",
    description: "",
    fileUrl: "",
    fileSize: null,
    fileType: "",
    category: "",
    icon: "",
    isFeatured: false,
    status: true,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});

  // Fetch download
  const fetchDownload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/downloads/${downloadId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Download not found");
        throw new Error("Failed to fetch download");
      }
      const data: DownloadResponse = await res.json();
      const dl = data.download;

      setForm({
        title: dl.title,
        description: dl.description ?? "",
        fileUrl: dl.fileUrl ?? "",
        fileSize: dl.fileSize,
        fileType: dl.fileType ?? "",
        category: dl.category ?? "",
        icon: dl.icon ?? "",
        isFeatured: dl.isFeatured,
        status: dl.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [downloadId]);

  useEffect(() => {
    fetchDownload();
  }, [fetchDownload]);

  // Handlers
  const handleChange = (
    field: keyof UpdateDownloadForm,
    value: string | boolean | number | null,
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

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const result = updateDownloadSchema.safeParse(form);
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
      const res = await fetch(`/api/admin/downloads/${downloadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to update download");
      }

      setSuccessMessage("Download updated successfully");
      fetchDownload();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    setDeleting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/admin/downloads/${downloadId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Failed to delete download");
      }
      router.push("/admin/downloads");
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
          href="/admin/downloads"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Downloads
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchDownload}
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
        href="/admin/downloads"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Downloads
      </Link>

      <PageHeader title="Edit Download" description={form.title} />

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
                className={cn(inputClass, formErrors.title && inputErrorClass)}
              />
              {formErrors.title && (
                <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={form.description ?? ""}
                onChange={(e) => handleChange("description", e.target.value)}
                className={cn(inputClass, "resize-y min-h-[100px]")}
              />
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
                <option value="BROCHURE">Brochure</option>
                <option value="WHITEPAPER">Whitepaper</option>
                <option value="CASE_STUDY">Case Study</option>
                <option value="DATASHEET">Datasheet</option>
                <option value="GUIDE">Guide</option>
                <option value="TEMPLATE">Template</option>
                <option value="REPORT">Report</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="icon"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Icon (Lucide icon name)
              </label>
              <input
                id="icon"
                type="text"
                value={form.icon ?? ""}
                onChange={(e) => handleChange("icon", e.target.value)}
                className={cn(inputClass)}
              />
            </div>
          </div>
        </div>

        {/* File Details */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            File Details
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
                placeholder="https://example.com/files/document.pdf"
                className={cn(inputClass)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="fileType"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  File Type
                </label>
                <select
                  id="fileType"
                  value={form.fileType ?? ""}
                  onChange={(e) => handleChange("fileType", e.target.value)}
                  className={cn(selectClass)}
                >
                  <option value="">Select type</option>
                  <option value="PDF">PDF</option>
                  <option value="DOC">DOC</option>
                  <option value="DOCX">DOCX</option>
                  <option value="XLS">XLS</option>
                  <option value="XLSX">XLSX</option>
                  <option value="PPT">PPT</option>
                  <option value="PPTX">PPTX</option>
                  <option value="ZIP">ZIP</option>
                  <option value="PNG">PNG</option>
                  <option value="JPG">JPG</option>
                  <option value="SVG">SVG</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="fileSize"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  File Size (bytes)
                </label>
                <input
                  id="fileSize"
                  type="number"
                  min="0"
                  value={form.fileSize ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "fileSize",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  className={cn(inputClass)}
                  placeholder="e.g. 1048576"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status & Featured */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Visibility
          </h3>
          <div className="space-y-4">
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

            <div className="flex items-center gap-3">
              <input
                id="isFeatured"
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => handleChange("isFeatured", e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500 dark:border-zinc-600"
              />
              <label
                htmlFor="isFeatured"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Featured (highlighted on downloads page)
              </label>
            </div>
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
            Delete Download
          </button>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/downloads"
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
                  Delete Download
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">{form.title}</strong>?
              This will permanently remove this download.
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
                  "Delete Download"
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
