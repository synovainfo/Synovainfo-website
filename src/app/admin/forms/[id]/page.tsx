"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  GripVertical,
  Trash2,
  FileDown,
  Eye,
  EyeOff,
  ExternalLink,
  Calendar,
  Monitor,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FieldType = "TEXT" | "EMAIL" | "TEXTAREA" | "SELECT" | "CHECKBOX" | "RADIO" | "FILE" | "PHONE" | "DATE";

interface FormField {
  id: string;
  formId: string;
  type: FieldType;
  label: string;
  placeholder: string | null;
  required: boolean;
  validationRules: Record<string, unknown> | null;
  options: string[] | null;
  order: number;
  createdAt: string;
}

interface FormDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  submitButtonText: string;
  successMessage: string | null;
  emailNotification: string | null;
  status: boolean;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

interface FormResponse {
  form: FormDetail;
}

interface Submission {
  id: string;
  data: Record<string, string> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface SubmissionsResponse {
  submissions: Submission[];
  fieldLabels: string[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "TEXT", label: "Text" },
  { value: "EMAIL", label: "Email" },
  { value: "TEXTAREA", label: "Textarea" },
  { value: "SELECT", label: "Select" },
  { value: "CHECKBOX", label: "Checkbox" },
  { value: "RADIO", label: "Radio" },
  { value: "FILE", label: "File" },
  { value: "PHONE", label: "Phone" },
  { value: "DATE", label: "Date" },
];

const FIELD_TYPE_COLORS: Record<FieldType, string> = {
  TEXT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  EMAIL: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  TEXTAREA: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  SELECT: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  CHECKBOX: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  RADIO: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  FILE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PHONE: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  DATE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// ---------------------------------------------------------------------------
// FormEditorPage
// ---------------------------------------------------------------------------

export default function FormEditorPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  // Data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormDetail | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<"builder" | "submissions">("builder");

  // Form settings
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [submitButtonText, setSubmitButtonText] = useState("Submit");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailNotification, setEmailNotification] = useState("");
  const [status, setStatus] = useState(true);

  // Form fields (local state for drag-reorder)
  const [fields, setFields] = useState<FormField[]>([]);

  // Save state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Field editor modal
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [fieldForm, setFieldForm] = useState<{
    type: FieldType;
    label: string;
    placeholder: string;
    required: boolean;
    options: string;
    validationRules: string;
  }>({
    type: "TEXT",
    label: "",
    placeholder: "",
    required: false,
    options: "",
    validationRules: "",
  });

  // Submissions state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [fieldLabels, setFieldLabels] = useState<string[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsPagination, setSubmissionsPagination] = useState<{
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [detailSubmission, setDetailSubmission] = useState<Submission | null>(null);

  // Fetch form
  const fetchForm = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/forms/${formId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Form not found");
        throw new Error("Failed to fetch form");
      }
      const data: FormResponse = await res.json();
      const f = data.form;
      setForm(f);
      setName(f.name);
      setSlug(f.slug);
      setDescription(f.description ?? "");
      setSubmitButtonText(f.submitButtonText);
      setSuccessMessage(f.successMessage ?? "");
      setEmailNotification(f.emailNotification ?? "");
      setStatus(f.status);
      setFields(f.fields);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  // Fetch submissions
  const fetchSubmissions = useCallback(async (pageNum: number = 1) => {
    setSubmissionsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pageNum));
      params.set("pageSize", "20");
      const res = await fetch(`/api/admin/forms/${formId}/submissions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch submissions");
      const data: SubmissionsResponse = await res.json();
      setSubmissions(data.submissions);
      setFieldLabels(data.fieldLabels);
      setSubmissionsPagination(data.pagination);
    } catch {
      // Silent fail
    } finally {
      setSubmissionsLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    if (activeTab === "submissions") {
      fetchSubmissions(submissionsPage);
    }
  }, [activeTab, submissionsPage, fetchSubmissions]);

  // Field operations
  const addField = () => {
    setFieldForm({ type: "TEXT", label: "", placeholder: "", required: false, options: "", validationRules: "" });
    setEditingFieldIndex(null);
    setShowFieldModal(true);
  };

  const editField = (index: number) => {
    const f = fields[index];
    setFieldForm({
      type: f.type,
      label: f.label,
      placeholder: f.placeholder ?? "",
      required: f.required,
      options: f.options?.join("\n") ?? "",
      validationRules: f.validationRules ? JSON.stringify(f.validationRules, null, 2) : "",
    });
    setEditingFieldIndex(index);
    setShowFieldModal(true);
  };

  const saveField = () => {
    if (!fieldForm.label.trim()) return;

    const fieldData = {
      type: fieldForm.type,
      label: fieldForm.label.trim(),
      placeholder: fieldForm.placeholder || null,
      required: fieldForm.required,
      validationRules: fieldForm.validationRules.trim()
        ? (() => { try { return JSON.parse(fieldForm.validationRules); } catch { return null; } })()
        : null,
      options: fieldForm.options.trim()
        ? fieldForm.options.split("\n").map((s) => s.trim()).filter(Boolean)
        : null,
      order: editingFieldIndex !== null ? fields[editingFieldIndex].order : fields.length,
    };

    if (editingFieldIndex !== null) {
      setFields((prev) =>
        prev.map((f, i) =>
          i === editingFieldIndex
            ? { ...f, ...fieldData, id: f.id }
            : f,
        ),
      );
    } else {
      setFields((prev) => [
        ...prev,
        { ...fieldData, id: "", formId, createdAt: new Date().toISOString() } as FormField,
      ]);
    }

    setShowFieldModal(false);
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= fields.length) return;
    setFields((prev) => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next.map((f, i) => ({ ...f, order: i }));
    });
  };

  // Save form
  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(null);
    setSaving(true);

    try {
      const payload = {
        name,
        slug,
        description: description || null,
        submitButtonText,
        successMessage: successMessage || null,
        emailNotification: emailNotification || null,
        status,
        fields: fields.map((f, i) => ({
          type: f.type,
          label: f.label,
          placeholder: f.placeholder,
          required: f.required,
          validationRules: f.validationRules,
          options: f.options,
          order: i,
        })),
      };

      const res = await fetch(`/api/admin/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to update form");
      }

      setSaveSuccess("Form saved successfully");
      fetchForm();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  // Delete form
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/forms/${formId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to delete form");
      router.push("/admin/forms");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // CSV export
  const handleExportCsv = () => {
    window.open(`/api/admin/forms/${formId}/submissions?format=csv`, "_blank");
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          href="/admin/forms"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Forms
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchForm}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const tabs: { key: "builder" | "submissions"; label: string; count?: number }[] = [
    { key: "builder", label: "Builder" },
    { key: "submissions", label: "Submissions" },
  ];

  return (
    <div>
      <Link
        href="/admin/forms"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Forms
      </Link>

      <PageHeader title="Edit Form" description={name} />

      {/* Success banner */}
      {saveSuccess && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{saveSuccess}</span>
          <button
            onClick={() => setSaveSuccess(null)}
            className="ml-auto font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error banner */}
      {saveError && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{saveError}</span>
          <button
            onClick={() => setSaveError(null)}
            className="ml-auto font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "pb-3 text-sm font-medium transition-colors relative",
                activeTab === tab.key
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
              )}
            >
              {tab.label}
              {tab.key === "submissions" && form && (
                <span className="ml-1.5 rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">
                  {submissionsPagination?.total ?? "..."}
                </span>
              )}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          BUILDER TAB
          ═══════════════════════════════════════════════════════ */}
      {activeTab === "builder" && (
        <div className="max-w-4xl space-y-6">
          {/* Form Settings */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Form Settings
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-name" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="edit-slug" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Slug
                </label>
                <input
                  id="edit-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="edit-description" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={cn(inputClass, "resize-y")}
                />
              </div>
              <div>
                <label htmlFor="edit-button-text" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Submit Button Text
                </label>
                <input
                  id="edit-button-text"
                  type="text"
                  value={submitButtonText}
                  onChange={(e) => setSubmitButtonText(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="edit-success" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Success Message
                </label>
                <input
                  id="edit-success"
                  type="text"
                  value={successMessage}
                  onChange={(e) => setSuccessMessage(e.target.value)}
                  placeholder="Thank you for your submission!"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="edit-email" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email Notification
                </label>
                <input
                  id="edit-email"
                  type="email"
                  value={emailNotification}
                  onChange={(e) => setEmailNotification(e.target.value)}
                  placeholder="admin@example.com"
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  id="edit-status"
                  type="checkbox"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                />
                <label htmlFor="edit-status" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Form is active (accepting submissions)
                </label>
              </div>
            </div>
          </div>

          {/* Field Builder */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Form Fields
              </h3>
              <button
                onClick={addField}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Field
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 text-3xl text-zinc-300 dark:text-zinc-600">
                  <FileTextIcon />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No fields yet. Click &quot;Add Field&quot; to start building your form.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {fields.map((field, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-700 dark:bg-zinc-800/30"
                  >
                    {/* Drag handle (visual only) */}
                    <div className="cursor-grab text-zinc-300 dark:text-zinc-600">
                      <GripVertical className="h-4 w-4" />
                    </div>

                    {/* Move buttons */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveField(i, -1)}
                        disabled={i === 0}
                        className="p-0.5 text-zinc-400 hover:text-zinc-600 disabled:opacity-20 disabled:cursor-not-allowed dark:hover:text-zinc-300"
                        title="Move up"
                      >
                        <ChevronLeft className="h-3 w-3 rotate-90" />
                      </button>
                      <button
                        onClick={() => moveField(i, 1)}
                        disabled={i === fields.length - 1}
                        className="p-0.5 text-zinc-400 hover:text-zinc-600 disabled:opacity-20 disabled:cursor-not-allowed dark:hover:text-zinc-300"
                        title="Move down"
                      >
                        <ChevronLeft className="h-3 w-3 -rotate-90" />
                      </button>
                    </div>

                    {/* Field info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                          {field.label}
                        </span>
                        {field.required && (
                          <span className="text-red-500 text-xs">*</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          FIELD_TYPE_COLORS[field.type],
                        )}>
                          {FIELD_TYPES.find((t) => t.value === field.type)?.label}
                        </span>
                        {field.placeholder && (
                          <span className="text-xs text-zinc-400 truncate">
                            Placeholder: {field.placeholder}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => editField(i)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                        title="Edit field"
                      >
                        <FileEditIcon />
                      </button>
                      <button
                        onClick={() => removeField(i)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                        title="Remove field"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              Delete Form
            </button>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/forms"
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
                onClick={handleSave}
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
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SUBMISSIONS TAB
          ═══════════════════════════════════════════════════════ */}
      {activeTab === "submissions" && (
        <div>
          {/* Export button */}
          <div className="mb-4 flex items-center justify-end">
            <button
              onClick={handleExportCsv}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                "text-zinc-600 hover:bg-zinc-100",
                "dark:text-zinc-400 dark:hover:bg-zinc-800",
                "transition-colors",
              )}
            >
              <FileDown className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          {/* Loading */}
          {submissionsLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}

          {/* Empty */}
          {!submissionsLoading && submissions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileTextIcon />
              <h3 className="mb-1 mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                No submissions yet
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Submissions will appear here once users fill out this form.
              </p>
            </div>
          )}

          {/* Submissions table */}
          {!submissionsLoading && submissions.length > 0 && (
            <>
              <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                        #
                      </th>
                      {fieldLabels.slice(0, 4).map((label) => (
                        <th
                          key={label}
                          className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400"
                        >
                          {label}
                        </th>
                      ))}
                      <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 md:table-cell">
                        Date
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                    {submissions.map((sub, idx) => {
                      const rowNum = submissionsPagination
                        ? (submissionsPagination.page - 1) * submissionsPagination.pageSize + idx + 1
                        : idx + 1;
                      return (
                        <tr
                          key={sub.id}
                          className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                        >
                          <td className="px-4 py-3 text-xs text-zinc-400">
                            {rowNum}
                          </td>
                          {fieldLabels.slice(0, 4).map((label) => (
                            <td
                              key={label}
                              className="max-w-[200px] truncate px-4 py-3 text-zinc-900 dark:text-zinc-100"
                            >
                              {sub.data?.[label] ?? "—"}
                            </td>
                          ))}
                          <td className="hidden px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 md:table-cell">
                            {formatDate(sub.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setDetailSubmission(sub)}
                              className={cn(
                                "rounded-lg p-1.5 text-zinc-400 transition-colors",
                                "hover:bg-zinc-100 hover:text-zinc-700",
                                "dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
                              )}
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {submissionsPagination && submissionsPagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm">
                  <p className="text-zinc-500 dark:text-zinc-400">
                    Showing{" "}
                    {(submissionsPagination.page - 1) * submissionsPagination.pageSize + 1}–
                    {Math.min(
                      submissionsPagination.page * submissionsPagination.pageSize,
                      submissionsPagination.total,
                    )}{" "}
                    of {submissionsPagination.total} submissions
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSubmissionsPage((p) => Math.max(1, p - 1))}
                      disabled={submissionsPage <= 1}
                      className={cn(
                        "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium transition-colors",
                        "dark:border-zinc-700",
                        submissionsPage <= 1
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                      )}
                    >
                      Previous
                    </button>
                    <span className="px-2 text-zinc-500 dark:text-zinc-400">
                      Page {submissionsPagination.page} of {submissionsPagination.totalPages}
                    </span>
                    <button
                      onClick={() => setSubmissionsPage((p) => Math.min(submissionsPagination.totalPages, p + 1))}
                      disabled={submissionsPage >= submissionsPagination.totalPages}
                      className={cn(
                        "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium transition-colors",
                        "dark:border-zinc-700",
                        submissionsPage >= submissionsPagination.totalPages
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                      )}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Field Editor Modal ── */}
      {showFieldModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowFieldModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Edit field"
        >
          <div
            className="mx-4 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {editingFieldIndex !== null ? "Edit Field" : "Add Field"}
              </h3>
              <button
                onClick={() => setShowFieldModal(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Field type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Field Type
                </label>
                <select
                  value={fieldForm.type}
                  onChange={(e) => setFieldForm((prev) => ({ ...prev, type: e.target.value as FieldType }))}
                  className={selectClass}
                >
                  {FIELD_TYPES.map((ft) => (
                    <option key={ft.value} value={ft.value}>{ft.label}</option>
                  ))}
                </select>
              </div>

              {/* Label */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fieldForm.label}
                  onChange={(e) => setFieldForm((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g. Full Name"
                  className={inputClass}
                />
              </div>

              {/* Placeholder */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={fieldForm.placeholder}
                  onChange={(e) => setFieldForm((prev) => ({ ...prev, placeholder: e.target.value }))}
                  placeholder="e.g. Enter your name"
                  className={inputClass}
                />
              </div>

              {/* Required */}
              <div className="flex items-center gap-3">
                <input
                  id="field-required"
                  type="checkbox"
                  checked={fieldForm.required}
                  onChange={(e) => setFieldForm((prev) => ({ ...prev, required: e.target.checked }))}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                />
                <label htmlFor="field-required" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Required field
                </label>
              </div>

              {/* Options for select/radio/checkbox */}
              {(fieldForm.type === "SELECT" || fieldForm.type === "RADIO" || fieldForm.type === "CHECKBOX") && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Options (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={fieldForm.options}
                    onChange={(e) => setFieldForm((prev) => ({ ...prev, options: e.target.value }))}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    className={cn(inputClass, "resize-y font-mono text-xs")}
                  />
                </div>
              )}

              {/* Validation rules (JSON) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Validation Rules (JSON)
                </label>
                <textarea
                  rows={3}
                  value={fieldForm.validationRules}
                  onChange={(e) => setFieldForm((prev) => ({ ...prev, validationRules: e.target.value }))}
                  placeholder='{"minLength": 3, "maxLength": 100}'
                  className={cn(inputClass, "resize-y font-mono text-xs")}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowFieldModal(false)}
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
                onClick={saveField}
                disabled={!fieldForm.label.trim()}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                  "bg-blue-600 text-white hover:bg-blue-500",
                  "transition-colors",
                  !fieldForm.label.trim() && "cursor-not-allowed opacity-70",
                )}
              >
                {editingFieldIndex !== null ? "Update Field" : "Add Field"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Submission Detail Modal ── */}
      {detailSubmission && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setDetailSubmission(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Submission details"
        >
          <div
            className="mx-4 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Submission Details
              </h3>
              <button
                onClick={() => setDetailSubmission(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Submitted data */}
            <div className="mb-6 space-y-3">
              <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Form Data
              </h4>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {fieldLabels.map((label) => (
                  <div key={label} className="flex gap-4 py-2">
                    <span className="w-1/3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {label}
                    </span>
                    <span className="w-2/3 text-sm text-zinc-900 dark:text-zinc-100 break-words">
                      {detailSubmission.data?.[label] ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Metadata
              </h4>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Calendar className="h-4 w-4" />
                {formatDate(detailSubmission.createdAt)}
              </div>
              {detailSubmission.ipAddress && (
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Globe className="h-4 w-4" />
                  {detailSubmission.ipAddress}
                </div>
              )}
              {detailSubmission.userAgent && (
                <div className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Monitor className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="break-all">{detailSubmission.userAgent}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                  Delete Form
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">{name}</strong>?
              This will permanently remove this form and all its submissions.
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
                  "Delete Form"
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
// Inline SVG icons (used where lucide doesn't have them)
// ---------------------------------------------------------------------------

function FileTextIcon() {
  return (
    <svg
      className="h-12 w-12 text-zinc-300 dark:text-zinc-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  );
}

function FileEditIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Shared class names
// ---------------------------------------------------------------------------

const inputClass =
  "w-full rounded-lg border px-3 py-2 text-sm bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:border-zinc-600";

const selectClass =
  "w-full rounded-lg border px-3 py-2 text-sm bg-white text-zinc-900 focus:outline-none focus:ring-1 border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-600";
