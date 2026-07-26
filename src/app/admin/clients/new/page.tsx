"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Loader2, ChevronLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const createSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
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
  order: z.number().int().optional().default(0),
  status: z.boolean().optional().default(true),
});

type CreateForm = z.infer<typeof createSchema>;

// ---------------------------------------------------------------------------
// CreateClientPage
// ---------------------------------------------------------------------------

export default function CreateClientPage() {
  const router = useRouter();

  const [form, setForm] = useState<CreateForm>({
    name: "",
    slug: "",
    description: "",
    logo: "",
    websiteUrl: "",
    industry: "",
    order: 0,
    status: true,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateForm, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    field: keyof CreateForm,
    value: string | boolean | number | null,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Auto-generate slug from name
    if (field === "name" && !form.slug && value !== null) {
      const generated = String(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setForm((prev) => ({ ...prev, slug: generated }));
    }
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccess(false);

    const result = createSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CreateForm, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to create client");
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/clients"), 1500);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/clients"
        className={cn(
          "mb-4 inline-flex items-center gap-1.5 text-sm font-medium",
          "text-zinc-500 hover:text-zinc-700",
          "dark:text-zinc-400 dark:hover:text-zinc-200",
          "transition-colors",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Clients
      </Link>

      <PageHeader title="New Client" description="Add a new client" />

      {success && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Client created successfully! Redirecting…</span>
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
        onSubmit={handleSubmit}
        noValidate
        className="max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Acme Corporation"
                aria-invalid={!!errors.name}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:outline-none focus:ring-1",
                  "dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                  errors.name
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                )}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
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
                placeholder="acme-corporation"
                aria-invalid={!!errors.slug}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:outline-none focus:ring-1",
                  "dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                  errors.slug
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                )}
              />
              {errors.slug && (
                <p className="mt-1 text-xs text-red-500">{errors.slug}</p>
              )}
            </div>
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
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value || null)}
              placeholder="Brief description of the client..."
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm",
                "bg-white text-zinc-900 placeholder:text-zinc-400",
                "focus:outline-none focus:ring-1",
                "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500",
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="industry"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Industry
              </label>
              <input
                id="industry"
                type="text"
                value={form.industry ?? ""}
                onChange={(e) => handleChange("industry", e.target.value || null)}
                placeholder="Technology, Healthcare..."
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:outline-none focus:ring-1",
                  "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                )}
              />
            </div>

            <div>
              <label
                htmlFor="websiteUrl"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Website URL
              </label>
              <input
                id="websiteUrl"
                type="url"
                value={form.websiteUrl ?? ""}
                onChange={(e) => handleChange("websiteUrl", e.target.value || null)}
                placeholder="https://example.com"
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:outline-none focus:ring-1",
                  "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                )}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="logo"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Logo URL
            </label>
            <input
              id="logo"
              type="url"
              value={form.logo ?? ""}
              onChange={(e) => handleChange("logo", e.target.value || null)}
              placeholder="https://example.com/logo.svg"
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm",
                "bg-white text-zinc-900 placeholder:text-zinc-400",
                "focus:outline-none focus:ring-1",
                "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500",
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="order"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Display Order
              </label>
              <input
                id="order"
                type="number"
                value={form.order}
                onChange={(e) => handleChange("order", parseInt(e.target.value) || 0)}
                className={cn(
                  "w-24 rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900",
                  "focus:outline-none focus:ring-1",
                  "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100",
                )}
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
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
                Active
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-700">
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
            disabled={submitting || success}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-500",
              "transition-colors",
              (submitting || success) && "cursor-not-allowed opacity-70",
            )}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              "Create Client"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
