"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Save,
  Layout,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HomepageSection {
  id: string;
  sectionType: string;
  title: string | null;
  content: Record<string, unknown> | null;
  order: number;
  isVisible: boolean;
  settings: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

interface SectionsResponse {
  sections: HomepageSection[];
}

// ---------------------------------------------------------------------------
// Section config
// ---------------------------------------------------------------------------

const SECTION_TYPES = [
  { value: "hero", label: "Hero", description: "Main banner section" },
  { value: "services", label: "Services", description: "Service offerings" },
  { value: "industries", label: "Industries", description: "Industry verticals" },
  { value: "about", label: "About", description: "Company information" },
  { value: "stats", label: "Stats", description: "Key statistics" },
  { value: "testimonials", label: "Testimonials", description: "Client testimonials" },
  { value: "clients", label: "Clients", description: "Client logos" },
  { value: "process", label: "Process", description: "Work process" },
  { value: "why-us", label: "Why Us", description: "Reasons to choose" },
  { value: "technologies", label: "Technologies", description: "Technology stack" },
  { value: "careers", label: "Careers", description: "Job openings" },
  { value: "faq", label: "FAQ", description: "Frequently asked questions" },
  { value: "contact", label: "Contact", description: "Contact form section" },
];

const SECTION_BADGE_COLORS: Record<string, string> = {
  hero: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  services: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  industries: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  about: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  stats: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  testimonials: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  clients: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  process: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  "why-us": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  technologies: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  careers: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  faq: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  contact: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400",
};

function getSectionLabel(sectionType: string): string {
  const found = SECTION_TYPES.find((st) => st.value === sectionType);
  return found?.label ?? sectionType;
}

function getSectionDescription(sectionType: string): string {
  const found = SECTION_TYPES.find((st) => st.value === sectionType);
  return found?.description ?? "";
}

// ---------------------------------------------------------------------------
// HomepagePage
// ---------------------------------------------------------------------------

export default function HomepagePage() {
  // Data state
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  // Track which sections have been modified
  const [modifiedSections, setModifiedSections] = useState<Record<string, boolean>>({});

  // Fetch sections
  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/homepage");
      if (!res.ok) throw new Error("Failed to fetch homepage sections");
      const data: SectionsResponse = await res.json();
      setSections(data.sections);
      setModifiedSections({});
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // Set up initial sections if empty
  const initializeSections = () => {
    if (sections.length > 0) return;

    const initialSections = SECTION_TYPES.map((st, i) => ({
      id: "",
      sectionType: st.value,
      title: st.label,
      content: null,
      order: i,
      isVisible: true,
      settings: null,
      createdAt: "",
      updatedAt: "",
    }));
    setSections(initialSections);
    setDirty(true);
  };

  // Update a section field
  const updateSection = (index: number, field: string, value: unknown) => {
    setSections((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setModifiedSections((prev) => ({
      ...prev,
      [sections[index]?.sectionType ?? index]: true,
    }));
    setDirty(true);
    if (saveSuccess) setSaveSuccess(null);
  };

  // Move section up/down
  const moveSection = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sections.length) return;

    setSections((prev) => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next.map((s, i) => ({ ...s, order: i }));
    });
    setDirty(true);
    setModifiedSections((prev) => ({
      ...prev,
      [sections[index]?.sectionType ?? index]: true,
      [sections[newIndex]?.sectionType ?? newIndex]: true,
    }));
  };

  // Save all sections
  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(null);
    setSaving(true);

    try {
      const payload = {
        sections: sections.map((s, i) => ({
          sectionType: s.sectionType,
          title: s.title,
          content: s.content,
          order: i,
          isVisible: s.isVisible,
          settings: s.settings,
        })),
      };

      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to save homepage sections");
      }

      setSections(data.sections);
      setModifiedSections({});
      setDirty(false);
      setSaveSuccess("Homepage sections saved successfully");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSaving(false);
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
        <PageHeader
          title="Homepage Sections"
          description="Manage the sections displayed on your homepage"
        />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchSections}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // If no sections exist, show initialization prompt
  const showInitPrompt = sections.length === 0;

  return (
    <div>
      <PageHeader
        title="Homepage Sections"
        description="Reorder, hide, or edit the sections on your homepage"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchSections}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                "text-zinc-600 hover:bg-zinc-100",
                "dark:text-zinc-400 dark:hover:bg-zinc-800",
                "transition-colors",
              )}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            {!showInitPrompt && (
              <button
                onClick={handleSave}
                disabled={saving || !dirty}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                  "bg-blue-600 text-white hover:bg-blue-500",
                  "transition-colors",
                  (saving || !dirty) && "cursor-not-allowed opacity-70",
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
            )}
          </div>
        }
      />

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

      {/* Initialize prompt */}
      {showInitPrompt && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Layout className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No homepage sections configured
          </h3>
          <p className="mb-6 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            Initialize the default homepage sections to start customizing your homepage layout.
            You can reorder, rename, and toggle visibility for each section.
          </p>
          <button
            onClick={initializeSections}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            <Layout className="h-4 w-4" />
            Initialize Default Sections
          </button>
        </div>
      )}

      {/* Sections list */}
      {!showInitPrompt && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            <ArrowUpDown className="h-3.5 w-3.5" />
            Drag reorder using the up/down buttons
          </div>
          {sections.map((section, i) => (
            <div
              key={section.sectionType}
              className={cn(
                "rounded-lg border p-4 transition-colors",
                modifiedSections[section.sectionType]
                  ? "border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/20"
                  : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900",
              )}
            >
              <div className="flex items-center gap-4">
                {/* Reorder buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveSection(i, -1)}
                    disabled={i === 0}
                    className={cn(
                      "rounded p-0.5 transition-colors",
                      "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100",
                      "dark:hover:text-zinc-300 dark:hover:bg-zinc-800",
                      i === 0 && "opacity-20 cursor-not-allowed",
                    )}
                    title="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveSection(i, 1)}
                    disabled={i === sections.length - 1}
                    className={cn(
                      "rounded p-0.5 transition-colors",
                      "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100",
                      "dark:hover:text-zinc-300 dark:hover:bg-zinc-800",
                      i === sections.length - 1 && "opacity-20 cursor-not-allowed",
                    )}
                    title="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Order badge */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {section.order + 1}
                </div>

                {/* Section info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        SECTION_BADGE_COLORS[section.sectionType] ??
                          "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
                      )}
                    >
                      {getSectionLabel(section.sectionType)}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {section.sectionType}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {getSectionDescription(section.sectionType)}
                  </p>
                </div>

                {/* Title editor */}
                <div className="w-48">
                  <input
                    type="text"
                    value={section.title ?? ""}
                    onChange={(e) => updateSection(i, "title", e.target.value)}
                    placeholder={getSectionLabel(section.sectionType)}
                    className={cn(
                      "w-full rounded-lg border px-2.5 py-1.5 text-sm",
                      "bg-white text-zinc-900 placeholder:text-zinc-400",
                      "focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500",
                      "border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:border-zinc-600",
                    )}
                  />
                </div>

                {/* Visibility toggle */}
                <button
                  onClick={() => updateSection(i, "isVisible", !section.isVisible)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    section.isVisible
                      ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400",
                  )}
                  title={section.isVisible ? "Visible" : "Hidden"}
                >
                  {section.isVisible ? (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      Hidden
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
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
