"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  Trash2,
  Edit,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  GripVertical,
  PlusCircle,
  FolderPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  _count: { faqs: number };
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  status: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string; slug: string };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// FAQAdminPage
// ---------------------------------------------------------------------------

export default function FAQAdminPage() {
  // Categories
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catsError, setCatsError] = useState<string | null>(null);

  // FAQ items (flattened from selected category)
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(false);
  const [faqsError, setFaqsError] = useState<string | null>(null);

  // Selected category
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  // Modals
  const [catModal, setCatModal] = useState<{
    open: boolean;
    edit: FAQCategory | null;
  }>({ open: false, edit: null });
  const [faqModal, setFaqModal] = useState<{
    open: boolean;
    edit: FAQItem | null;
    categoryId: string | null;
  }>({ open: false, edit: null, categoryId: null });
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "category" | "faq";
    id: string;
    name: string;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [delError, setDelError] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Fetch categories
  // -----------------------------------------------------------------------
  const fetchCategories = useCallback(async () => {
    setCatsLoading(true);
    setCatsError(null);
    try {
      const res = await fetch("/api/admin/faq/categories?pageSize=100");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.categories ?? []);
      if (data.categories?.length > 0 && !selectedCatId) {
        setSelectedCatId(data.categories[0].id);
      }
    } catch (err) {
      setCatsError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setCatsLoading(false);
    }
  }, [selectedCatId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // -----------------------------------------------------------------------
  // Fetch FAQs for selected category
  // -----------------------------------------------------------------------
  const fetchFaqs = useCallback(async (catId: string) => {
    setFaqsLoading(true);
    setFaqsError(null);
    try {
      const res = await fetch(`/api/admin/faq/categories/${catId}`);
      if (!res.ok) throw new Error("Failed to fetch FAQs");
      const data = await res.json();
      setFaqs(data.category?.faqs ?? []);
    } catch (err) {
      setFaqsError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setFaqsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCatId) {
      fetchFaqs(selectedCatId);
    } else {
      setFaqs([]);
    }
  }, [selectedCatId, fetchFaqs]);

  // -----------------------------------------------------------------------
  // Category CRUD
  // -----------------------------------------------------------------------
  const handleCatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const body: Record<string, unknown> = {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      order: Number(formData.get("order")) || 0,
    };

    try {
      const url = catModal.edit
        ? `/api/admin/faq/categories/${catModal.edit.id}`
        : "/api/admin/faq/categories";
      const method = catModal.edit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Failed to save category");
      }

      setCatModal({ open: false, edit: null });
      fetchCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCatDelete = async () => {
    if (!deleteTarget || deleteTarget.type !== "category") return;
    setSubmitting(true);
    setDelError(null);
    try {
      const res = await fetch(
        `/api/admin/faq/categories/${deleteTarget.id}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Failed to delete");
      }
      if (selectedCatId === deleteTarget.id) setSelectedCatId(null);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      setDelError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------------------------------------------------
  // FAQ CRUD
  // -----------------------------------------------------------------------
  const handleFaqSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const body: Record<string, unknown> = {
      question: String(formData.get("question") ?? ""),
      answer: String(formData.get("answer") ?? ""),
      categoryId: faqModal.edit
        ? faqModal.edit.categoryId
        : faqModal.categoryId,
      order: Number(formData.get("order")) || 0,
      status: formData.get("status") === "true",
    };

    try {
      const url = faqModal.edit
        ? `/api/admin/faq/${faqModal.edit.id}`
        : "/api/admin/faq";
      const method = faqModal.edit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Failed to save FAQ");
      }

      setFaqModal({ open: false, edit: null, categoryId: null });
      if (selectedCatId) fetchFaqs(selectedCatId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFaqDelete = async () => {
    if (!deleteTarget || deleteTarget.type !== "faq") return;
    setSubmitting(true);
    setDelError(null);
    try {
      const res = await fetch(`/api/admin/faq/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Failed to delete");
      }
      setDeleteTarget(null);
      if (selectedCatId) fetchFaqs(selectedCatId);
    } catch (err) {
      setDelError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div>
      <PageHeader
        title="FAQ Management"
        description="Manage frequently asked questions and categories"
        actions={
          <button
            onClick={() => setCatModal({ open: true, edit: null })}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-500",
              "transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
            )}
          >
            <FolderPlus className="h-4 w-4" />
            New Category
          </button>
        }
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* =============================================================== */}
        {/* Categories sidebar */}
        {/* =============================================================== */}
        <div className="w-full shrink-0 lg:w-72">
          <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Categories
              </h3>
              <button
                onClick={fetchCategories}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Refresh"
              >
                <RefreshCw
                  className={cn("h-3.5 w-3.5", catsLoading && "animate-spin")}
                />
              </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto p-2">
              {catsLoading && categories.length === 0 && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                </div>
              )}

              {catsError && (
                <div className="px-2 py-4 text-center text-xs text-red-500">
                  {catsError}
                </div>
              )}

              {!catsLoading && !catsError && categories.length === 0 && (
                <div className="px-2 py-8 text-center">
                  <HelpCircle className="mx-auto mb-2 h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    No categories yet
                  </p>
                </div>
              )}

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    selectedCatId === cat.id
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{cat.name}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {cat._count.faqs} FAQs
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 ml-2">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setCatModal({ open: true, edit: cat });
                      }}
                      className="rounded p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({
                          type: "category",
                          id: cat.id,
                          name: cat.name,
                        });
                      }}
                      className="rounded p-1 text-zinc-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* FAQ items */}
        {/* =============================================================== */}
        <div className="flex-1 min-w-0">
          {!selectedCatId ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-20 dark:border-zinc-700 dark:bg-zinc-900">
              <HelpCircle className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
              <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Select a category
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Choose a category from the sidebar to view its FAQs
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {categories.find((c) => c.id === selectedCatId)?.name ??
                    "FAQs"}
                </h3>
                <button
                  onClick={() =>
                    setFaqModal({
                      open: true,
                      edit: null,
                      categoryId: selectedCatId,
                    })
                  }
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                    "bg-blue-600 text-white hover:bg-blue-500",
                    "transition-colors",
                  )}
                >
                  <PlusCircle className="h-4 w-4" />
                  Add FAQ
                </button>
              </div>

              {faqsLoading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              )}

              {faqsError && (
                <div
                  className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                  role="alert"
                >
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{faqsError}</span>
                </div>
              )}

              {!faqsLoading && !faqsError && faqs.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-16 dark:border-zinc-700 dark:bg-zinc-900">
                  <HelpCircle className="mb-4 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    No FAQs in this category yet
                  </p>
                  <button
                    onClick={() =>
                      setFaqModal({
                        open: true,
                        edit: null,
                        categoryId: selectedCatId,
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                  >
                    <Plus className="h-4 w-4" />
                    Add First FAQ
                  </button>
                </div>
              )}

              {!faqsLoading && faqs.length > 0 && (
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <FAQCard
                      key={faq.id}
                      faq={faq}
                      onEdit={() =>
                        setFaqModal({ open: true, edit: faq, categoryId: null })
                      }
                      onDelete={() =>
                        setDeleteTarget({
                          type: "faq",
                          id: faq.id,
                          name: faq.question,
                        })
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* =============================================================== */}
      {/* Category Modal */}
      {/* =============================================================== */}
      {(catModal.open) && (
        <Modal
          title={catModal.edit ? "Edit Category" : "New Category"}
          onClose={() => setCatModal({ open: false, edit: null })}
        >
          <form onSubmit={handleCatSubmit} className="space-y-4">
            <fieldset>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                defaultValue={catModal.edit?.name ?? ""}
                required
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. General"
              />
            </fieldset>
            <fieldset>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                name="slug"
                defaultValue={catModal.edit?.slug ?? ""}
                required
                pattern="^[a-z0-9-]+$"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="general"
              />
            </fieldset>
            <fieldset>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={catModal.edit?.description ?? ""}
                rows={2}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </fieldset>
            <fieldset>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Order
              </label>
              <input
                name="order"
                type="number"
                defaultValue={catModal.edit?.order ?? 0}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </fieldset>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCatModal({ open: false, edit: null })}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {catModal.edit ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =============================================================== */}
      {/* FAQ Modal */}
      {/* =============================================================== */}
      {faqModal.open && (
        <Modal
          title={faqModal.edit ? "Edit FAQ" : "New FAQ"}
          onClose={() =>
            setFaqModal({ open: false, edit: null, categoryId: null })
          }
        >
          <form onSubmit={handleFaqSubmit} className="space-y-4">
            <fieldset>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                name="question"
                defaultValue={faqModal.edit?.question ?? ""}
                required
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="What is your question?"
              />
            </fieldset>
            <fieldset>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                name="answer"
                defaultValue={faqModal.edit?.answer ?? ""}
                required
                rows={5}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Type your answer here..."
              />
            </fieldset>
            <fieldset>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Order
              </label>
              <input
                name="order"
                type="number"
                defaultValue={faqModal.edit?.order ?? 0}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </fieldset>
            <fieldset>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Status
              </label>
              <select
                name="status"
                defaultValue={String(faqModal.edit?.status ?? true)}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </fieldset>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setFaqModal({ open: false, edit: null, categoryId: null })
                }
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {faqModal.edit ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =============================================================== */}
      {/* Delete Modal */}
      {/* =============================================================== */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !submitting && setDeleteTarget(null)}
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
                  Delete {deleteTarget.type === "category" ? "Category" : "FAQ"}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {deleteTarget.type === "category"
                    ? "This will also delete all FAQs in this category."
                    : "This action cannot be undone."}
                </p>
              </div>
            </div>

            {delError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {delError}
              </div>
            )}

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {deleteTarget.name}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteTarget(null);
                  setDelError(null);
                }}
                disabled={submitting}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={
                  deleteTarget.type === "category"
                    ? handleCatDelete
                    : handleFaqDelete
                }
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
              >
                {submitting ? (
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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FAQCard({
  faq,
  onEdit,
  onDelete,
}: {
  faq: FAQItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-0.5 shrink-0 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {faq.question}
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400">
                <span>Order: {faq.order}</span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    faq.status
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                  )}
                >
                  {faq.status ? "Active" : "Inactive"}
                </span>
                <span>{formatDate(faq.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onEdit}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                title="Edit FAQ"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                title="Delete FAQ"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {expanded && (
            <div className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                {faq.answer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal wrapper
// ---------------------------------------------------------------------------

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="mx-4 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
