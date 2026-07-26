"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import {
  Loader2,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const createServiceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  icon: z.string().optional(),
  category: z.string().optional(),
  status: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  technologyIds: z.array(z.string()),
  industryIds: z.array(z.string()),
});

type CreateServiceForm = z.infer<typeof createServiceSchema>;

// ---------------------------------------------------------------------------
// CreateServicePage
// ---------------------------------------------------------------------------

interface SelectOption {
  id: string;
  name: string;
}

export default function CreateServicePage() {
  const router = useRouter();

  const [form, setForm] = useState<CreateServiceForm>({
    title: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    icon: "",
    category: "",
    status: true,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    technologyIds: [],
    industryIds: [],
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [outcomes, setOutcomes] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Options for selects
  const [technologies, setTechnologies] = useState<SelectOption[]>([]);
  const [industries, setIndustries] = useState<SelectOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [techRes, indRes] = await Promise.all([
          fetch("/api/admin/technologies?pageSize=100"),
          fetch("/api/admin/industries?pageSize=100"),
        ]);
        if (techRes.ok) {
          const techData = await techRes.json();
          setTechnologies(techData.technologies || []);
        }
        if (indRes.ok) {
          const indData = await indRes.json();
          setIndustries(indData.industries || []);
        }
      } catch {
        // Non-critical
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug:
        prev.slug === autoSlug(prev.title)
          ? autoSlug(value)
          : prev.slug,
    }));
    clearError("title");
  };

  const autoSlug = (val: string) =>
    val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 200);

  const handleChange = (
    field: keyof CreateServiceForm,
    value: string | boolean | string[],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const handleArrayItem = (
    field: "benefits" | "outcomes",
    action: "add" | "remove" | "update",
    index?: number,
    value?: string,
  ) => {
    const setter = field === "benefits" ? setBenefits : setOutcomes;
    setter((prev) => {
      const next = [...prev];
      if (action === "add") next.push("");
      if (action === "remove" && index !== undefined) next.splice(index, 1);
      if (action === "update" && index !== undefined && value !== undefined)
        next[index] = value;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccess(false);

    const filteredBenefits = benefits.filter((b) => b.trim());
    const filteredOutcomes = outcomes.filter((o) => o.trim());

    const payload = {
      ...form,
      benefits: filteredBenefits.length > 0 ? filteredBenefits : null,
      businessOutcomes: filteredOutcomes.length > 0 ? filteredOutcomes : null,
    };

    const result = createServiceSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to create service");
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/services"), 1500);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/services"
        className={cn(
          "mb-4 inline-flex items-center gap-1.5 text-sm font-medium",
          "text-zinc-500 hover:text-zinc-700",
          "dark:text-zinc-400 dark:hover:text-zinc-200",
          "transition-colors",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Services
      </Link>

      <PageHeader
        title="New Service"
        description="Create a new service offering"
      />

      {/* Success banner */}
      {success && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Service created successfully! Redirecting…</span>
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-3xl space-y-6"
      >
        {/* Main Details */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Basic Information
          </h3>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Cloud Migration Services"
                aria-invalid={!!errors.title}
                className={cn(inputClass, errors.title && inputErrorClass)}
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="slug"
                type="text"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="cloud-migration-services"
                aria-invalid={!!errors.slug}
                className={cn(inputClass, errors.slug && inputErrorClass)}
              />
              {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Category
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className={cn(selectClass)}
              >
                <option value="">Select category</option>
                <option value="DIGITAL_TRANSFORMATION">Digital Transformation</option>
                <option value="CLOUD_SERVICES">Cloud Services</option>
                <option value="AI_ML">AI &amp; Machine Learning</option>
                <option value="CONSULTING">Consulting</option>
                <option value="DEVELOPMENT">Development</option>
              </select>
            </div>

            {/* Icon */}
            <div>
              <label htmlFor="icon" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Icon (SVG string or URL)
              </label>
              <input
                id="icon"
                type="text"
                value={form.icon}
                onChange={(e) => handleChange("icon", e.target.value)}
                placeholder="<svg>...</svg> or https://..."
                className={cn(inputClass)}
              />
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Description
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="shortDescription" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Short Description
              </label>
              <input
                id="shortDescription"
                type="text"
                value={form.shortDescription}
                onChange={(e) => handleChange("shortDescription", e.target.value)}
                placeholder="Brief overview of the service"
                className={cn(inputClass)}
              />
            </div>
            <div>
              <label htmlFor="fullDescription" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Full Description
              </label>
              <textarea
                id="fullDescription"
                rows={6}
                value={form.fullDescription}
                onChange={(e) => handleChange("fullDescription", e.target.value)}
                placeholder="Detailed description of the service..."
                className={cn(inputClass, "resize-y min-h-[120px]")}
              />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Benefits
            </h3>
            <button
              type="button"
              onClick={() => handleArrayItem("benefits", "add")}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Benefit
            </button>
          </div>
          <div className="space-y-3">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleArrayItem("benefits", "update", i, e.target.value)}
                  placeholder={`Benefit ${i + 1}`}
                  className={cn(inputClass, "flex-1")}
                />
                {benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleArrayItem("benefits", "remove", i)}
                    className="p-1 text-zinc-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Business Outcomes */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Business Outcomes
            </h3>
            <button
              type="button"
              onClick={() => handleArrayItem("outcomes", "add")}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Outcome
            </button>
          </div>
          <div className="space-y-3">
            {outcomes.map((outcome, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => handleArrayItem("outcomes", "update", i, e.target.value)}
                  placeholder={`Outcome ${i + 1}`}
                  className={cn(inputClass, "flex-1")}
                />
                {outcomes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleArrayItem("outcomes", "remove", i)}
                    className="p-1 text-zinc-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Relations */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Related Items
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Technologies */}
            <div>
              <label htmlFor="technologies" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Technologies
              </label>
              {loadingOptions ? (
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading…
                </div>
              ) : (
                <select
                  id="technologies"
                  multiple
                  value={form.technologyIds}
                  onChange={(e) =>
                    handleChange(
                      "technologyIds",
                      Array.from(e.target.selectedOptions, (o) => o.value),
                    )
                  }
                  className={cn(selectClass, "min-h-[100px]")}
                >
                  {technologies.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-1 text-xs text-zinc-400">Ctrl+click to select multiple</p>
            </div>

            {/* Industries */}
            <div>
              <label htmlFor="industries" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Industries
              </label>
              {loadingOptions ? (
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading…
                </div>
              ) : (
                <select
                  id="industries"
                  multiple
                  value={form.industryIds}
                  onChange={(e) =>
                    handleChange(
                      "industryIds",
                      Array.from(e.target.selectedOptions, (o) => o.value),
                    )
                  }
                  className={cn(selectClass, "min-h-[100px]")}
                >
                  {industries.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.name}
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-1 text-xs text-zinc-400">Ctrl+click to select multiple</p>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            SEO Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="seoTitle" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                SEO Title
              </label>
              <input
                id="seoTitle"
                type="text"
                value={form.seoTitle}
                onChange={(e) => handleChange("seoTitle", e.target.value)}
                className={cn(inputClass)}
              />
            </div>
            <div>
              <label htmlFor="seoDescription" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                SEO Description
              </label>
              <textarea
                id="seoDescription"
                rows={2}
                value={form.seoDescription}
                onChange={(e) => handleChange("seoDescription", e.target.value)}
                className={cn(inputClass, "resize-y")}
              />
            </div>
            <div>
              <label htmlFor="seoKeywords" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                SEO Keywords
              </label>
              <input
                id="seoKeywords"
                type="text"
                value={form.seoKeywords}
                onChange={(e) => handleChange("seoKeywords", e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
                className={cn(inputClass)}
              />
            </div>
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
            <label htmlFor="status" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Published (visible on website)
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-700">
          <Link
            href="/admin/services"
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
              "Create Service"
            )}
          </button>
        </div>
      </form>
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
