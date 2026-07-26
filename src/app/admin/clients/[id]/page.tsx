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
  Building2,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

const updateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  description: z.string().max(5000).optional().nullable(),
  logo: z.string().max(500).optional().nullable(),
  websiteUrl: z.string().max(500).optional().nullable(),
  industry: z.string().max(200).optional().nullable(),
  order: z.number().int(),
  status: z.boolean(),
});

type UpdateForm = z.infer<typeof updateSchema>;

export default function EditClientPage() {
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
    name: "",
    slug: "",
    description: "",
    logo: "",
    websiteUrl: "",
    industry: "",
    order: 0,
    status: true,
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof UpdateForm, string>>
  >({});

  const fetchClient = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/clients/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Client not found");
        throw new Error("Failed to fetch client");
      }
      const data = await res.json();
      const c = data.client;
      setForm({
        name: c.name,
        slug: c.slug,
        description: c.description ?? "",
        logo: c.logo ?? "",
        websiteUrl: c.websiteUrl ?? "",
        industry: c.industry ?? "",
        order: c.order,
        status: c.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

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
      const res = await fetch(`/api/admin/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to update");
      }
      setSuccessMessage("Client updated successfully");
      fetchClient();
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
      const res = await fetch(`/api/admin/clients/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to delete");
      router.push("/admin/clients");
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
          href="/admin/clients"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Clients
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchClient}
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
        href="/admin/clients"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Clients
      </Link>

      <PageHeader title={form.name} description="Edit client details" />

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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-name"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                aria-invalid={!!formErrors.name}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900",
                  "focus:outline-none focus:ring-1",
                  "dark:bg-zinc-800 dark:text-zinc-100",
                  formErrors.name
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                )}
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-slug"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-slug"
                type="text"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                aria-invalid={!!formErrors.slug}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900",
                  "focus:outline-none focus:ring-1",
                  "dark:bg-zinc-800 dark:text-zinc-100",
                  formErrors.slug
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                )}
              />
              {formErrors.slug && (
                <p className="mt-1 text-xs text-red-500">{formErrors.slug}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value || null)}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm",
                "bg-white text-zinc-900",
                "focus:outline-none focus:ring-1",
                "dark:bg-zinc-800 dark:text-zinc-100",
                "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-industry"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Industry
              </label>
              <input
                id="edit-industry"
                type="text"
                value={form.industry ?? ""}
                onChange={(e) => handleChange("industry", e.target.value || null)}
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
                htmlFor="edit-websiteUrl"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Website URL
              </label>
              <input
                id="edit-websiteUrl"
                type="url"
                value={form.websiteUrl ?? ""}
                onChange={(e) => handleChange("websiteUrl", e.target.value || null)}
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
              htmlFor="edit-logo"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Logo URL
            </label>
            <input
              id="edit-logo"
              type="url"
              value={form.logo ?? ""}
              onChange={(e) => handleChange("logo", e.target.value || null)}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm",
                "bg-white text-zinc-900",
                "focus:outline-none focus:ring-1",
                "dark:bg-zinc-800 dark:text-zinc-100",
                "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
              )}
            />
            {form.logo && (
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <img
                  src={form.logo}
                  alt="Logo preview"
                  className="h-10 w-10 rounded object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="text-xs text-zinc-500">Logo preview</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
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
                onChange={(e) => handleChange("order", parseInt(e.target.value) || 0)}
                className={cn(
                  "w-24 rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900",
                  "focus:outline-none focus:ring-1",
                  "dark:bg-zinc-800 dark:text-zinc-100",
                  "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                )}
              />
            </div>

            <div className="flex items-center gap-3 pt-5">
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
              href="/admin/clients"
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
                  Delete Client
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">{form.name}</strong>?
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
