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

interface Technology {
  id: string;
  name: string;
  slug: string;
}

interface Industry {
  id: string;
  name: string;
  slug: string;
}

interface ServiceDetail {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  fullDescription: string | null;
  icon: string | null;
  category: string | null;
  benefits: string[] | null;
  businessOutcomes: string[] | null;
  status: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  createdAt: string;
  updatedAt: string;
  technologies: { technology: Technology }[];
  industries: { industry: Industry }[];
}

interface ServiceResponse {
  service: ServiceDetail;
}

interface SelectOption {
  id: string;
  name: string;
}

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const updateServiceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  shortDescription: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  status: z.boolean(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  technologyIds: z.array(z.string()),
  industryIds: z.array(z.string()),
});

type UpdateServiceForm = z.infer<typeof updateServiceSchema>;

// ---------------------------------------------------------------------------
// EditServicePage
// ---------------------------------------------------------------------------

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  // Data state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form
  const [form, setForm] = useState<UpdateServiceForm>({
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
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [outcomes, setOutcomes] = useState<string[]>([""]);

  // Options
  const [technologies, setTechnologies] = useState<SelectOption[]>([]);
  const [industries, setIndustries] = useState<SelectOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Load options
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

  // Fetch service
  const fetchService = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Service not found");
        throw new Error("Failed to fetch service");
      }
      const data: ServiceResponse = await res.json();
      const svc = data.service;

      setForm({
        title: svc.title,
        slug: svc.slug,
        shortDescription: svc.shortDescription ?? "",
        fullDescription: svc.fullDescription ?? "",
        icon: svc.icon ?? "",
        category: svc.category ?? "",
        status: svc.status,
        seoTitle: svc.seoTitle ?? "",
        seoDescription: svc.seoDescription ?? "",
        seoKeywords: svc.seoKeywords ?? "",
        technologyIds: svc.technologies.map((t) => t.technology.id),
        industryIds: svc.industries.map((i) => i.industry.id),
      });
      setBenefits(
        Array.isArray(svc.benefits) && svc.benefits.length > 0
          ? svc.benefits
          : [""],
      );
      setOutcomes(
        Array.isArray(svc.businessOutcomes) && svc.businessOutcomes.length > 0
          ? svc.businessOutcomes
          : [""],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  // Handlers
  const handleChange = (
    field: keyof UpdateServiceForm,
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

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const filteredBenefits = benefits.filter((b) => b.trim());
    const filteredOutcomes = outcomes.filter((o) => o.trim());

    const payload = {
      ...form,
      benefits: filteredBenefits.length > 0 ? filteredBenefits : null,
      businessOutcomes: filteredOutcomes.length > 0 ? filteredOutcomes : null,
    };

    const result = updateServiceSchema.safeParse(payload);
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
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to update service");
      }

      setSuccessMessage("Service updated successfully");
      fetchService();
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
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Failed to delete service");
      }
      router.push("/admin/services");
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
          href="/admin/services"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Services
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchService}
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
        href="/admin/services"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Services
      </Link>

      <PageHeader title="Edit Service" description={form.title} />

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
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
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
              {formErrors.title && <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="slug"
                type="text"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                aria-invalid={!!formErrors.slug}
                className={cn(inputClass, formErrors.slug && inputErrorClass)}
              />
              {formErrors.slug && <p className="mt-1 text-xs text-red-500">{formErrors.slug}</p>}
            </div>

            <div>
              <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Category
              </label>
              <select
                id="category"
                value={form.category ?? ""}
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

            <div>
              <label htmlFor="icon" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Icon
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

        {/* Description */}
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
                value={form.shortDescription ?? ""}
                onChange={(e) => handleChange("shortDescription", e.target.value)}
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
                value={form.fullDescription ?? ""}
                onChange={(e) => handleChange("fullDescription", e.target.value)}
                className={cn(inputClass, "resize-y min-h-[120px]")}
              />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Benefits</h3>
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
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Business Outcomes</h3>
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

        {/* Related Items */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Related Items
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
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
                value={form.seoTitle ?? ""}
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
                value={form.seoDescription ?? ""}
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
                value={form.seoKeywords ?? ""}
                onChange={(e) => handleChange("seoKeywords", e.target.value)}
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
            Delete Service
          </button>

          <div className="flex items-center gap-3">
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
                  Delete Service
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">{form.title}</strong>?
              This will permanently remove this service.
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
                  "Delete Service"
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
