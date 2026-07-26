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
  Star,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const updateSchema = z.object({
  quote: z.string().min(1, "Quote is required").max(2000),
  author: z.string().min(1, "Author name is required").max(200),
  title: z.string().max(200).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  avatar: z.string().max(500).optional().nullable(),
  rating: z.number().int().min(1).max(5),
  status: z.boolean(),
  order: z.number().int(),
});

type UpdateForm = z.infer<typeof updateSchema>;

interface TestimonialData {
  id: string;
  quote: string;
  author: string;
  title: string | null;
  company: string | null;
  avatar: string | null;
  rating: number;
  status: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// EditTestimonialPage
// ---------------------------------------------------------------------------

export default function EditTestimonialPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [form, setForm] = useState<UpdateForm>({
    quote: "",
    author: "",
    title: "",
    company: "",
    avatar: "",
    rating: 5,
    status: true,
    order: 0,
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof UpdateForm, string>>
  >({});

  const fetchTestimonial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Testimonial not found");
        throw new Error("Failed to fetch testimonial");
      }
      const data = await res.json();
      const t: TestimonialData = data.testimonial;
      setForm({
        quote: t.quote,
        author: t.author,
        title: t.title ?? "",
        company: t.company ?? "",
        avatar: t.avatar ?? "",
        rating: t.rating,
        status: t.status,
        order: t.order,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTestimonial();
  }, [fetchTestimonial]);

  const handleChange = (
    field: keyof UpdateForm,
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const result = updateSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof UpdateForm, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof UpdateForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setFormErrors(fieldErrors);
      return;
    }

    setFormErrors({});
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to update");
      }
      setSuccessMessage("Testimonial updated successfully");
      fetchTestimonial();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to delete");
      router.push("/admin/testimonials");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link
          href="/admin/testimonials"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Testimonials
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchTestimonial}
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
        href="/admin/testimonials"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Testimonials
      </Link>

      <PageHeader title="Edit Testimonial" description={`${form.author}`} />

      {successMessage && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

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

      <form
        onSubmit={handleSave}
        noValidate
        className="max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="edit-quote"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Quote <span className="text-red-500">*</span>
            </label>
            <textarea
              id="edit-quote"
              rows={4}
              value={form.quote}
              onChange={(e) => handleChange("quote", e.target.value)}
              aria-invalid={!!formErrors.quote}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm",
                "bg-white text-zinc-900",
                "focus:outline-none focus:ring-1",
                "dark:bg-zinc-800 dark:text-zinc-100",
                formErrors.quote
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
              )}
            />
            {formErrors.quote && (
              <p className="mt-1 text-xs text-red-500">{formErrors.quote}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-author"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Author <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-author"
                type="text"
                value={form.author}
                onChange={(e) => handleChange("author", e.target.value)}
                aria-invalid={!!formErrors.author}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900",
                  "focus:outline-none focus:ring-1",
                  "dark:bg-zinc-800 dark:text-zinc-100",
                  formErrors.author
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                )}
              />
              {formErrors.author && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.author}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-title"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Title
              </label>
              <input
                id="edit-title"
                type="text"
                value={form.title ?? ""}
                onChange={(e) =>
                  handleChange("title", e.target.value || null)
                }
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900",
                  "focus:outline-none focus:ring-1",
                  "dark:bg-zinc-800 dark:text-zinc-100",
                  "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                )}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-company"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Company
            </label>
            <input
              id="edit-company"
              type="text"
              value={form.company ?? ""}
              onChange={(e) =>
                handleChange("company", e.target.value || null)
              }
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm",
                "bg-white text-zinc-900",
                "focus:outline-none focus:ring-1",
                "dark:bg-zinc-800 dark:text-zinc-100",
                "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
              )}
            />
          </div>

          <div>
            <label
              htmlFor="edit-avatar"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Avatar URL
            </label>
            <input
              id="edit-avatar"
              type="url"
              value={form.avatar ?? ""}
              onChange={(e) =>
                handleChange("avatar", e.target.value || null)
              }
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm",
                "bg-white text-zinc-900",
                "focus:outline-none focus:ring-1",
                "dark:bg-zinc-800 dark:text-zinc-100",
                "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
              )}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleChange("rating", star)}
                  className="transition-transform hover:scale-110"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={cn(
                      "h-6 w-6",
                      star <= form.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-none text-zinc-300 dark:text-zinc-600",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-order"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Display Order
            </label>
            <input
              id="edit-order"
              type="number"
              value={form.order}
              onChange={(e) =>
                handleChange("order", parseInt(e.target.value) || 0)
              }
              className={cn(
                "w-24 rounded-lg border px-3 py-2 text-sm",
                "bg-white text-zinc-900",
                "focus:outline-none focus:ring-1",
                "dark:bg-zinc-800 dark:text-zinc-100",
                "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
              )}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="edit-status"
              type="checkbox"
              checked={form.status}
              onChange={(e) => handleChange("status", e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
            />
            <label
              htmlFor="edit-status"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Active
            </label>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-700">
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

          <div className="flex items-center gap-3">
            <Link
              href="/admin/testimonials"
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

      {/* Delete Modal */}
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
                  Delete Testimonial
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete this testimonial from{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {form.author}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
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
