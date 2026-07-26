"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Save,
  Clock,
  Calendar,
  Eye,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SectionBuilder, type Section } from "@/components/admin/section-builder";
import { SEOFields, type SEOData, DEFAULT_SEO } from "@/components/admin/seo-fields";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageAuthor {
  id: string;
  name: string;
  image: string | null;
}

interface PageParent {
  id: string;
  title: string;
}

interface PageChild {
  id: string;
  title: string;
  slug: string;
  status: string;
}

interface PageVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  title: string | null;
  status: string | null;
}

interface PageSection {
  id: string;
  pageId: string;
  sectionType: string;
  title: string | null;
  content: Record<string, unknown> | null;
  order: number;
  isVisible: boolean;
  settings: Record<string, unknown> | null;
}

interface PageDetail {
  id: string;
  title: string;
  slug: string;
  content: Record<string, unknown> | null;
  excerpt: string | null;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  featuredImage: string | null;
  template: string | null;
  publishedAt: string | null;
  scheduledAt: string | null;
  customCss: string | null;
  parentId: string | null;
  authorId: string;
  author: PageAuthor;
  parent: PageParent | null;
  children: PageChild[];
  sections: PageSection[];
  versions: PageVersion[];
  createdAt: string;
  updatedAt: string;
}

interface PageResponse {
  page: PageDetail;
}

// ---------------------------------------------------------------------------
// Tab configuration
// ---------------------------------------------------------------------------

type Tab = "content" | "seo" | "settings";

const TABS: { id: Tab; label: string }[] = [
  { id: "content", label: "Content" },
  { id: "seo", label: "SEO" },
  { id: "settings", label: "Settings" },
];

// ---------------------------------------------------------------------------
// EditPagePage
// ---------------------------------------------------------------------------

export default function EditPagePage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  // Data state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("content");

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "SCHEDULED">("DRAFT");
  const [featuredImage, setFeaturedImage] = useState("");
  const [template, setTemplate] = useState("");
  const [parentId, setParentId] = useState("");
  const [customCss, setCustomCss] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [publishedAt, setPublishedAt] = useState("");

  // Sections
  const [sections, setSections] = useState<Section[]>([]);

  // SEO
  const [seo, setSeo] = useState<SEOData>(DEFAULT_SEO);

  // Rich text body (for simple pages without sections)
  const [bodyContent, setBodyContent] = useState("");

  // Featured image preview
  const [featuredImagePreview, setFeaturedImagePreview] = useState("");

  // Available parent pages
  const [availableParents, setAvailableParents] = useState<PageParent[]>([]);

  // Version info
  const [latestVersion, setLatestVersion] = useState<number>(0);

  // Track if slug should auto-generate from title
  const titleRef = useRef(title);
  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title.trim()) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generated);
    }
  }, [title, slugManuallyEdited]);

  // Fetch available parent pages
  useEffect(() => {
    async function loadParents() {
      try {
        const res = await fetch("/api/admin/pages?pageSize=100&sort=title&order=asc");
        if (res.ok) {
          const data = await res.json();
          setAvailableParents(
            (data.pages ?? []).filter((p: { id: string }) => p.id !== pageId),
          );
        }
      } catch {
        // Non-critical
      }
    }
    loadParents();
  }, [pageId]);

  // Fetch page
  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Page not found");
        throw new Error("Failed to fetch page");
      }
      const data: PageResponse = await res.json();
      const pg = data.page;

      setTitle(pg.title);
      setSlug(pg.slug);
      setSlugManuallyEdited(true);
      setExcerpt(pg.excerpt ?? "");
      setStatus(pg.status);
      setFeaturedImage(pg.featuredImage ?? "");
      setFeaturedImagePreview(pg.featuredImage ?? "");
      setTemplate(pg.template ?? "default");
      setParentId(pg.parentId ?? "");
      setCustomCss(pg.customCss ?? "");
      setPublishedAt(pg.publishedAt ?? "");
      setScheduledAt(pg.scheduledAt ?? "");

      // Content
      const content = pg.content as Record<string, unknown> | null;
      if (content?.seo) {
        const seoData = content.seo as Record<string, unknown>;
        setSeo({
          title: (seoData.title as string) ?? "",
          description: (seoData.description as string) ?? "",
          keywords: (seoData.keywords as string) ?? "",
          canonicalUrl: (seoData.canonicalUrl as string) ?? "",
          robotsIndex: (seoData.robotsIndex as boolean) ?? true,
          robotsFollow: (seoData.robotsFollow as boolean) ?? true,
          ogTitle: (seoData.ogTitle as string) ?? "",
          ogDescription: (seoData.ogDescription as string) ?? "",
          ogImage: (seoData.ogImage as string) ?? "",
          jsonldType: (seoData.jsonldType as string) ?? "WebPage",
        });
      } else {
        setSeo(DEFAULT_SEO);
      }
      setBodyContent((content?.body as string) ?? "");

      // Sections
      setSections(
        pg.sections.map((s) => ({
          id: s.id,
          sectionType: s.sectionType,
          title: s.title,
          content: s.content as Record<string, unknown> | null,
          order: s.order,
          isVisible: s.isVisible,
          settings: s.settings as Record<string, unknown> | null,
        })),
      );

      // Version
      if (pg.versions.length > 0) {
        setLatestVersion(pg.versions[0].versionNumber);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  // Featured image upload
  const handleFeaturedImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setFeaturedImage(url);
        setFeaturedImagePreview(url);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // Save handler
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setServerError("Title is required");
      return;
    }
    if (!slug.trim()) {
      setServerError("Slug is required");
      return;
    }

    setSaving(true);

    // Build payload
    const payload: Record<string, unknown> = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      status,
      featuredImage: featuredImage || null,
      template: template || null,
      parentId: parentId || null,
      customCss: customCss || null,
      content: {
        body: bodyContent || null,
        seo: seo,
      },
      sections: sections.map((s, i) => ({
        sectionType: s.sectionType,
        title: s.title,
        content: s.content,
        order: i,
        isVisible: s.isVisible,
        settings: s.settings,
      })),
    };

    if (scheduledAt) {
      payload.scheduledAt = new Date(scheduledAt).toISOString();
    } else {
      payload.scheduledAt = null;
    }

    try {
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to update page");
      }

      setSuccessMessage("Page saved successfully");
      fetchPage();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    setDeleting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Failed to delete page");
      }
      router.push("/admin/pages");
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
          href="/admin/pages"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Pages
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchPage}
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
        href="/admin/pages"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Pages
      </Link>

      <PageHeader
        title={`${title || "Untitled Page"}${latestVersion > 0 ? ` (v${latestVersion})` : ""}`}
        description={`/${slug || "—"}`}
        actions={
          <div className="flex items-center gap-3">
            {status === "PUBLISHED" && (
              <Link
                href={`/${slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
              >
                <Eye className="h-4 w-4" />
                View
              </Link>
            )}
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
            <button
              type="button"
              onClick={() => handleSave()}
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
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Success banner */}
      {successMessage && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-auto font-medium hover:underline"
          >
            Dismiss
          </button>
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

      {/* ── Tabs ── */}
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Panels ── */}
      <div className="space-y-6">
        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-6">
            {/* Title / Slug / Status row */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Title */}
                <div>
                  <label
                    htmlFor="page-title"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="page-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Page title"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label
                    htmlFor="page-slug"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                      /
                    </span>
                    <input
                      id="page-slug"
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSlugManuallyEdited(true);
                        setSlug(e.target.value);
                      }}
                      placeholder="page-slug"
                      className="w-full rounded-lg border border-zinc-200 px-7 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status / Scheduling */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Status */}
                <div>
                  <label
                    htmlFor="page-status"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Status
                  </label>
                  <select
                    id="page-status"
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as "DRAFT" | "PUBLISHED" | "SCHEDULED",
                      )
                    }
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="SCHEDULED">Scheduled</option>
                  </select>
                </div>

                {/* Scheduled At */}
                {status === "SCHEDULED" && (
                  <div>
                    <label
                      htmlFor="page-scheduled"
                      className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      <Calendar className="mr-1 inline h-3.5 w-3.5" />
                      Publish Date
                    </label>
                    <input
                      id="page-scheduled"
                      type="datetime-local"
                      value={scheduledAt ? scheduledAt.slice(0, 16) : ""}
                      onChange={(e) =>
                        setScheduledAt(
                          e.target.value ? new Date(e.target.value).toISOString() : "",
                        )
                      }
                      className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                )}

                {/* Published date display */}
                {publishedAt && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      <Clock className="mr-1 inline h-3.5 w-3.5" />
                      Published
                    </label>
                    <p className="py-2 text-sm text-zinc-700 dark:text-zinc-300">
                      {new Date(publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Featured Image
              </h3>
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={handleFeaturedImageUpload}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <ImageIcon className="h-4 w-4" />
                  Upload Image
                </button>
                {featuredImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImage("");
                      setFeaturedImagePreview("");
                    }}
                    className="rounded-lg p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {featuredImagePreview && (
                <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700 max-w-md">
                  <img
                    src={featuredImagePreview}
                    alt="Featured preview"
                    className="max-h-48 w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <label
                htmlFor="page-excerpt"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Excerpt
              </label>
              <textarea
                id="page-excerpt"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the page content"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 resize-y"
              />
            </div>

            {/* Section Builder */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Page Sections
              </h3>
              <SectionBuilder
                sections={sections}
                onChange={setSections}
              />
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <SEOFields value={seo} onChange={setSeo} />
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Template */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Layout & Template
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="page-template"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Template
                  </label>
                  <select
                    id="page-template"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    <option value="default">Default</option>
                    <option value="full-width">Full Width</option>
                    <option value="landing">Landing Page</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="page-parent"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Parent Page
                  </label>
                  <select
                    id="page-parent"
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    <option value="">No parent (top-level)</option>
                    {availableParents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Custom CSS */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Custom Styling
              </h3>
              <div>
                <label
                  htmlFor="page-css"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Custom CSS Class
                </label>
                <input
                  id="page-css"
                  type="text"
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  placeholder="page-custom-class"
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Version History */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Version History
              </h3>
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => {
                  const v = i + 1;
                  return (
                    <div
                      key={v}
                      className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800/50"
                    >
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        Version {v}
                      </span>
                      <span className="text-xs text-zinc-400">—</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-zinc-400">
                Version history is tracked automatically on every save. Use the
                API to restore previous versions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky Save Bar ── */}
      <div className="sticky bottom-0 mt-8 -mx-6 rounded-t-xl border border-zinc-200 bg-white/95 backdrop-blur-sm px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900/95">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {status === "PUBLISHED"
              ? "Changes are saved as a new version"
              : "Draft mode — publish when ready"}
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/pages"
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-medium",
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
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

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
                  Delete Page
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {title || "this page"}
              </strong>
              ? This will permanently remove this page and all associated data.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
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
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Page
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
