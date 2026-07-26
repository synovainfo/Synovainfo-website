"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  Plus,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormState {
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  benefits: string;
  salaryMin: string;
  salaryMax: string;
  status: boolean;
  featured: boolean;
}

interface FieldError {
  path: string[];
  message: string;
}

const CAREER_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE"];

// ---------------------------------------------------------------------------
// CareerNewPage
// ---------------------------------------------------------------------------

export default function CareerNewPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    department: "",
    location: "",
    type: "FULL_TIME",
    description: "",
    requirements: "",
    benefits: "",
    salaryMin: "",
    salaryMax: "",
    status: true,
    featured: false,
  });

  const [errors, setErrors] = useState<FieldError[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !prev.slug) {
        next.slug = value
          .toString()
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
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      status: form.status,
      featured: form.featured,
    };

    try {
      const res = await fetch("/api/admin/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setServerError(data.message ?? "Failed to create position");
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/careers");
        router.refresh();
      }, 1000);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const getError = (field: string) =>
    errors.find((e) => e.path.includes(field))?.message;

  return (
    <div>
      <PageHeader
        title="New Position"
        description="Create a new job position"
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
          Position created! Redirecting…
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
                placeholder="e.g. Senior Software Engineer"
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
                placeholder="senior-software-engineer"
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
                value={form.department}
                onChange={(e) => update("department", e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                )}
                placeholder="Engineering"
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
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                )}
                placeholder="Pune, India"
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

            {/* Salary range */}
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
                  value={form.salaryMin}
                  onChange={(e) => update("salaryMin", e.target.value)}
                  className={cn(
                    "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                    "bg-white text-zinc-900 placeholder:text-zinc-400",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                  )}
                  placeholder="600000"
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
                  value={form.salaryMax}
                  onChange={(e) => update("salaryMax", e.target.value)}
                  className={cn(
                    "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                    "bg-white text-zinc-900 placeholder:text-zinc-400",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                  )}
                  placeholder="1800000"
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
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                )}
                placeholder="Describe the role, responsibilities, and ideal candidate..."
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
                value={form.requirements}
                onChange={(e) => update("requirements", e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                )}
                placeholder="One per line or comma-separated..."
              />
              <p className="mt-1 text-xs text-zinc-400">
                Enter one requirement per line, or use a comma-separated list.
              </p>
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
                value={form.benefits}
                onChange={(e) => update("benefits", e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
                )}
                placeholder="One per line or comma-separated..."
              />
              <p className="mt-1 text-xs text-zinc-400">
                Enter one benefit per line, or use a comma-separated list.
              </p>
            </fieldset>
          </div>
        </div>

        {/* Status and Featured */}
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
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Active
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Featured
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/careers"
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
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Position
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


