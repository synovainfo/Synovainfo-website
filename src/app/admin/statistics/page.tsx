"use client";

import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import {
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Eye,
  EyeOff,
  GripVertical,
  Trash2,
  CheckCircle2,
  Pencil,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Statistic {
  id: string;
  label: string;
  value: string;
  prefix: string | null;
  suffix: string | null;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StatisticsResponse {
  statistics: Statistic[];
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const statisticSchema = z.object({
  label: z.string().min(1, "Label is required").max(200),
  value: z.string().min(1, "Value is required").max(200),
  prefix: z.string().optional().nullable(),
  suffix: z.string().optional().nullable(),
  isVisible: z.boolean(),
});

type StatisticForm = z.infer<typeof statisticSchema>;

const emptyForm: StatisticForm = {
  label: "",
  value: "",
  prefix: "",
  suffix: "",
  isVisible: true,
};

// ---------------------------------------------------------------------------
// StatisticsPage
// ---------------------------------------------------------------------------

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editor
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StatisticForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Statistic | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Fetch
  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/statistics");
      if (!res.ok) throw new Error("Failed to fetch statistics");
      const data: StatisticsResponse = await res.json();
      setStatistics(data.statistics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Open create
  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setServerError(null);
    setEditorOpen(true);
  };

  // Open edit
  const openEdit = (stat: Statistic) => {
    setEditingId(stat.id);
    setForm({
      label: stat.label,
      value: stat.value,
      prefix: stat.prefix ?? "",
      suffix: stat.suffix ?? "",
      isVisible: stat.isVisible,
    });
    setFormErrors({});
    setServerError(null);
    setEditorOpen(true);
  };

  // Form handlers
  const handleFormChange = (field: keyof StatisticForm, value: string | boolean) => {
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

  // Save (create or update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const result = statisticSchema.safeParse(form);
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
      if (editingId) {
        // Update single statistic
        const res = await fetch(`/api/admin/statistics/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message ?? data.error ?? "Failed to update statistic");
        }
        setSuccessMessage("Statistic updated successfully");
      } else {
        // Create new statistic via POST
        const res = await fetch("/api/admin/statistics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message ?? data.error ?? "Failed to create statistic");
        }
        setSuccessMessage("Statistic created successfully");
      }

      setEditorOpen(false);
      fetchStatistics();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  // Drag handlers
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newList = [...statistics];
    const [moved] = newList.splice(dragIndex, 1);
    newList.splice(index, 0, moved);
    setStatistics(newList);
    setDragIndex(index);
  };

  const handleDragEnd = async () => {
    setDragIndex(null);
    // Persist new order
    const reordered = statistics.map((stat, i) => ({
      id: stat.id,
      order: i,
    }));
    await persistOrder(reordered);
  };

  const persistOrder = async (orderData: { id: string; order: number }[]) => {
    try {
      const res = await fetch("/api/admin/statistics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statistics: orderData }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Failed to save order");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save order");
      fetchStatistics(); // Revert
    }
  };

  // Toggle visibility
  const toggleVisibility = async (stat: Statistic) => {
    try {
      const res = await fetch(`/api/admin/statistics/${stat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !stat.isVisible }),
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      fetchStatistics();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/statistics/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Failed to delete statistic");
      }
      setDeleteTarget(null);
      fetchStatistics();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Statistics"
        description="Manage stats displayed on the homepage. Drag to reorder."
        actions={
          <button
            onClick={openCreate}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-500",
              "transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
            )}
          >
            <Plus className="h-4 w-4" />
            New Statistic
          </button>
        }
      />

      {/* Success banner */}
      {successMessage && (
        <div
          className="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="ml-auto font-medium hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto font-medium hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && statistics.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BarChart3 className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No statistics found
          </h3>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            Add statistics to display on your homepage.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            New Statistic
          </button>
        </div>
      )}

      {/* Statistic List */}
      {!loading && statistics.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-4">
            <span className="w-8" />
            <span className="flex-1">Label</span>
            <span className="w-24 text-center">Value</span>
            <span className="w-16 text-center">Prefix</span>
            <span className="w-16 text-center">Suffix</span>
            <span className="w-20 text-center">Status</span>
            <span className="w-24 text-right">Actions</span>
          </div>

          {statistics.map((stat, index) => (
            <div
              key={stat.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-3 transition-colors",
                "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600",
                dragIndex === index && "opacity-50 border-blue-400 dark:border-blue-500",
              )}
            >
              {/* Drag handle */}
              <div className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <GripVertical className="h-4 w-4" />
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {stat.label}
                </p>
              </div>

              {/* Value */}
              <div className="w-24 text-center">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {stat.prefix}{stat.value}{stat.suffix}
                </span>
              </div>

              {/* Prefix */}
              <div className="w-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
                {stat.prefix || "—"}
              </div>

              {/* Suffix */}
              <div className="w-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
                {stat.suffix || "—"}
              </div>

              {/* Visibility toggle */}
              <div className="w-20 text-center">
                <button
                  onClick={() => toggleVisibility(stat)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                    stat.isVisible
                      ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400",
                  )}
                  title={stat.isVisible ? "Click to hide" : "Click to show"}
                >
                  {stat.isVisible ? (
                    <><Eye className="h-3 w-3" /> Visible</>
                  ) : (
                    <><EyeOff className="h-3 w-3" /> Hidden</>
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="w-24 flex items-center justify-end gap-1">
                <button
                  onClick={() => openEdit(stat)}
                  className={cn(
                    "rounded-lg p-2 text-zinc-400 transition-colors",
                    "hover:bg-zinc-100 hover:text-zinc-700",
                    "dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
                  )}
                  title="Edit statistic"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(stat)}
                  className={cn(
                    "rounded-lg p-2 text-zinc-400 transition-colors",
                    "hover:bg-red-50 hover:text-red-600",
                    "dark:hover:bg-red-950/30 dark:hover:text-red-400",
                  )}
                  title="Delete statistic"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Save order button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                const reordered = statistics.map((stat, i) => ({
                  id: stat.id,
                  order: i,
                }));
                persistOrder(reordered);
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                "dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
                "transition-colors",
              )}
            >
              <RefreshCw className="h-4 w-4" />
              Save Order
            </button>
          </div>
        </div>
      )}

      {/* ── Create/Edit Modal ── */}
      {editorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !saving && setEditorOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={editingId ? "Edit statistic" : "Create statistic"}
        >
          <div
            className="mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {editingId ? "Edit Statistic" : "Create Statistic"}
              </h3>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} noValidate className="space-y-4">
              <div>
                <label htmlFor="stat-label" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  id="stat-label"
                  type="text"
                  value={form.label}
                  onChange={(e) => handleFormChange("label", e.target.value)}
                  placeholder="e.g. Happy Clients"
                  aria-invalid={!!formErrors.label}
                  className={cn(inputClass, formErrors.label && inputErrorClass)}
                />
                {formErrors.label && <p className="mt-1 text-xs text-red-500">{formErrors.label}</p>}
              </div>

              <div>
                <label htmlFor="stat-value" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Value <span className="text-red-500">*</span>
                </label>
                <input
                  id="stat-value"
                  type="text"
                  value={form.value}
                  onChange={(e) => handleFormChange("value", e.target.value)}
                  placeholder="e.g. 500"
                  aria-invalid={!!formErrors.value}
                  className={cn(inputClass, formErrors.value && inputErrorClass)}
                />
                {formErrors.value && <p className="mt-1 text-xs text-red-500">{formErrors.value}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stat-prefix" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Prefix
                  </label>
                  <input
                    id="stat-prefix"
                    type="text"
                    value={form.prefix ?? ""}
                    onChange={(e) => handleFormChange("prefix", e.target.value)}
                    placeholder="e.g. $"
                    className={cn(inputClass)}
                  />
                </div>
                <div>
                  <label htmlFor="stat-suffix" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Suffix
                  </label>
                  <input
                    id="stat-suffix"
                    type="text"
                    value={form.suffix ?? ""}
                    onChange={(e) => handleFormChange("suffix", e.target.value)}
                    placeholder="e.g. +"
                    className={cn(inputClass)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="stat-visible"
                  type="checkbox"
                  checked={form.isVisible}
                  onChange={(e) => handleFormChange("isVisible", e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                />
                <label htmlFor="stat-visible" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Visible on website
                </label>
              </div>

              {serverError && <p className="text-sm text-red-500">{serverError}</p>}

              <div className="flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button type="button" onClick={() => setEditorOpen(false)} disabled={saving}
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className={cn("inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-500", saving && "cursor-not-allowed opacity-70")}>
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : editingId ? "Save Changes" : "Create Statistic"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteTarget(null)}
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
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Delete Statistic</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete <strong className="text-zinc-900 dark:text-zinc-100">{deleteTarget.label}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors">
                {deleting ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting…</> : "Delete Statistic"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared classes
// ---------------------------------------------------------------------------

const inputClass =
  "w-full rounded-lg border px-3 py-2 text-sm bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:border-zinc-600";

const inputErrorClass =
  "border-red-400 focus:border-red-500 focus:ring-red-500";
