"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Trash2,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Career {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  type: string;
  description: string | null;
  requirements: string | null;
  benefits: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  status: boolean;
  featured: boolean | null;
}

interface FieldError {
  path: string[];
  message: string;
}

const CAREER_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE"];
const EMPTY = "";

// ---------------------------------------------------------------------------
// CareerEditPage
// ---------------------------------------------------------------------------

export default function CareerEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [errors, setErrors] = useState<FieldError[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch career
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/careers/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Position not found");
          throw new Error("Failed to fetch position");
        }
        const data: Career = await res.json();
        setForm(data);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const update = (field: keyof Career, value: string | boolean | number | null) => {
    if (!form) return;
    setForm((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [field]: value };
      if (value !== null && field === "title" && next.slug === prev.slug) {
        next.slug = String(value)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      return next;
    });
    setErrors((prev) => prev.filter((e) => !e.path.includes(field)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSubmitting(true);
    setServerError(null);
    setErrors([]);
    setSuccess(false);

    const body: Record<string, unknown> = {
      title: form.title,
      slug: form.slug,
      department: form.department || null,
      location: form.location || null,
      type: form.type,
      description: form.description || null,
      requirements: form.requirements || null,
      benefits: form.benefits || null,
      salaryMin: form.salaryMin,
      salaryMax: form.salaryMax,
      status: form.status,
      featured: form.featured ?? false,
    };

    try {
      const res = await fetch(`/api/admin/careers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setServerError(data.message ?? "Failed to update position");
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/careers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Failed to delete");
      }
      router.push("/admin/careers");
      router.refresh();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Fetch error
  if (fetchError || !form) {
    return (
      <div>
        <PageHeader
          title="Edit Position"
          description={fetchError ?? "Position not found"}
          actions={
            <Link
              href="/admin/careers"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          }
        />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <p className="text-zinc-500 dark:text-zinc-400">{fetchError ?? "Position not found"}</p>
        </div>
      </div>
    );
  }

  const getError = (field: string) =>
    errors.find((e) => e.path.includes(field))?.message;

  return (
    <div>
      <PageHeader
        title={form.title}
        description="Edit job position"
        actions={
          <Link
            href="/admin/careers"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium",
              "text-zinc-700 hover:bg-zinc-50",
              "dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
              "transition-colors",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        }
      />

      {/* Success banner */}
      {success && (
        <div
          className="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle className="h-5 w-5 shrink-0" />
          Changes saved successfully!
        </div>
      )}

      {/* Server error */}
      {serverError && (
        <div
          className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{serverError}</span>
          <button onClick={() => setServerError(null)} className="ml-auto font-medium hover:underline">
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Position Details
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <fieldset>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:outline-none focus:ring-1",
                  getError("title")
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-200 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700",
                  "dark:bg-zinc-800 dark:text-zinc-100",
                )}
              />
              {getError("title") && (
                <p className="mt-1 text-xs text-red-500">{getError("title")}</p>
              )}
            </fieldset>

            {/* Slug */}
            <fieldset>
              <label
                htmlFor="slug"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="slug"
                type="text"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:outline-none focus:ring-1",
                  getError("slug")
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-200 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700",
                  "dark:bg-zinc-800 dark:text-zinc-100",
                )}
              />
              {getError("slug") && (
                <p className="mt-1 text-xs text-red-500">{getError("slug")}</p>
              )}
            </fieldset>

            {/* Department */}
            <fieldset>
              <label
                htmlFor="department"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Department
              </label>
              <input
                id="department"
                type="text"
                value={form.department ?? EMPTY}
                onChange={(e) => update("department", e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                )}
              />
            </fieldset>

            {/* Location */}
            <fieldset>
              <label
                htmlFor="location"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                value={form.location ?? EMPTY}
                onChange={(e) => update("location", e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                )}
              />
            </fieldset>

            {/* Type */}
            <fieldset>
              <label
                htmlFor="type"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                )}
              >
                {CAREER_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* Salary */}
            <div className="grid grid-cols-2 gap-3">
              <fieldset>
                <label
                  htmlFor="salaryMin"
                  className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Salary Min (₹)
                </label>
                <input
                  id="salaryMin"
                  type="number"
                  value={form.salaryMin ?? EMPTY}
                  onChange={(e) =>
                    update("salaryMin", e.target.value ? Number(e.target.value) : null)
                  }
                  className={cn(
                    "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                    "bg-white text-zinc-900 placeholder:text-zinc-400",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                  )}
                />
              </fieldset>
              <fieldset>
                <label
                  htmlFor="salaryMax"
                  className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Salary Max (₹)
                </label>
                <input
                  id="salaryMax"
                  type="number"
                  value={form.salaryMax ?? EMPTY}
                  onChange={(e) =>
                    update("salaryMax", e.target.value ? Number(e.target.value) : null)
                  }
                  className={cn(
                    "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                    "bg-white text-zinc-900 placeholder:text-zinc-400",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                  )}
                />
              </fieldset>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Description & Details
          </h3>
          <div className="space-y-4">
            <fieldset>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={6}
                value={form.description ?? EMPTY}
                onChange={(e) => update("description", e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                )}
              />
            </fieldset>

            <fieldset>
              <label
                htmlFor="requirements"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Requirements
              </label>
              <textarea
                id="requirements"
                rows={4}
                value={form.requirements ?? EMPTY}
                onChange={(e) => update("requirements", e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                )}
              />
            </fieldset>

            <fieldset>
              <label
                htmlFor="benefits"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Benefits
              </label>
              <textarea
                id="benefits"
                rows={4}
                value={form.benefits ?? EMPTY}
                onChange={(e) => update("benefits", e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                )}
              />
            </fieldset>
          </div>
        </div>

        {/* Status */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Publishing
          </h3>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.status}
                onChange={(e) => update("status", e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Active</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured ?? false}
                onChange={(e) => update("featured", e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Featured</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-4 w-4" />
            Delete Position
          </button>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/careers"
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !deleting && setShowDeleteModal(false)}
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
                  Delete Position
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This will also remove all applications.
                </p>
              </div>
            </div>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">{form.title}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
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
