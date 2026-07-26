"use client";

import { useState } from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Section {
  id?: string;
  sectionType: string;
  title: string | null;
  content: Record<string, unknown> | null;
  order: number;
  isVisible: boolean;
  settings: Record<string, unknown> | null;
}

export type SectionTypeOption = {
  value: string;
  label: string;
  description: string;
  icon?: string;
};

export const DEFAULT_SECTION_TYPES: SectionTypeOption[] = [
  { value: "hero", label: "Hero", description: "Full-width banner with headline and CTA" },
  { value: "about", label: "About", description: "Company overview or mission statement" },
  { value: "services", label: "Services", description: "List of services offered" },
  { value: "industries", label: "Industries", description: "Industries served" },
  { value: "stats", label: "Stats", description: "Key metrics and statistics" },
  { value: "testimonials", label: "Testimonials", description: "Client testimonials or reviews" },
  { value: "process", label: "Process", description: "Step-by-step workflow" },
  { value: "faq", label: "FAQ", description: "Frequently asked questions" },
  { value: "contact", label: "Contact", description: "Contact form or information" },
  { value: "custom", label: "Custom", description: "Custom HTML/section content" },
];

interface SectionBuilderProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
  sectionTypes?: SectionTypeOption[];
}

// ---------------------------------------------------------------------------
// SectionBuilder
// ---------------------------------------------------------------------------

export function SectionBuilder({
  sections,
  onChange,
  sectionTypes = DEFAULT_SECTION_TYPES,
}: SectionBuilderProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([0]),
  );
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const addSection = (sectionType: string) => {
    const newSection: Section = {
      sectionType,
      title: null,
      content: null,
      order: sections.length,
      isVisible: true,
      settings: null,
    };
    onChange([...sections, newSection]);
    setExpandedSections(new Set([sections.length]));
  };

  const removeSection = (index: number) => {
    const updated = sections.filter((_, i) => i !== index).map((s, i) => ({
      ...s,
      order: i,
    }));
    onChange(updated);
    setDeleteTarget(null);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const updated = [...sections];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated.map((s, i) => ({ ...s, order: i })));
  };

  const updateSection = (
    index: number,
    field: keyof Section,
    value: unknown,
  ) => {
    const updated = sections.map((s, i) =>
      i === index ? { ...s, [field]: value } : s,
    );
    onChange(updated);
  };

  const [showAddMenu, setShowAddMenu] = useState<number | null>(null);

  // Section type label helper
  const getSectionTypeLabel = (type: string) => {
    const found = sectionTypes.find((st) => st.value === type);
    return found?.label ?? type;
  };

  return (
    <div className="space-y-3">
      {/* Section list */}
      {sections.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 py-10 text-center dark:border-zinc-700">
          <p className="mb-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            No sections yet
          </p>
          <p className="mb-4 text-xs text-zinc-400 dark:text-zinc-500">
            Add a section to start building your page content
          </p>
        </div>
      )}

      {sections.map((section, index) => (
        <div
          key={index}
          className={cn(
            "rounded-lg border bg-white dark:bg-zinc-900",
            section.isVisible
              ? "border-zinc-200 dark:border-zinc-700"
              : "border-dashed border-zinc-300 dark:border-zinc-600",
          )}
        >
          {/* Section header */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2.5",
              expandedSections.has(index)
                ? "border-b border-zinc-200 dark:border-zinc-700"
                : "",
            )}
          >
            <GripVertical className="h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" />

            <button
              type="button"
              onClick={() => toggleExpand(index)}
              className="flex flex-1 items-center gap-2 text-left"
            >
              <span
                className={cn(
                  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                  "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
                )}
              >
                {getSectionTypeLabel(section.sectionType)}
              </span>
              {section.title && (
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
                  {section.title}
                </span>
              )}
              {!section.isVisible && (
                <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <EyeOff className="h-3 w-3" />
                  Hidden
                </span>
              )}
            </button>

            <div className="flex items-center gap-0.5 shrink-0">
              {/* Visibility toggle */}
              <button
                type="button"
                onClick={() =>
                  updateSection(index, "isVisible", !section.isVisible)
                }
                className={cn(
                  "rounded p-1 transition-colors",
                  section.isVisible
                    ? "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    : "text-amber-500 hover:text-amber-400",
                )}
                title={section.isVisible ? "Hide section" : "Show section"}
              >
                {section.isVisible ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
              </button>

              {/* Move up */}
              <button
                type="button"
                onClick={() => moveSection(index, "up")}
                disabled={index === 0}
                className={cn(
                  "rounded p-1 text-zinc-400 transition-colors",
                  index === 0
                    ? "cursor-not-allowed opacity-30"
                    : "hover:text-zinc-600 dark:hover:text-zinc-300",
                )}
                title="Move up"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>

              {/* Move down */}
              <button
                type="button"
                onClick={() => moveSection(index, "down")}
                disabled={index === sections.length - 1}
                className={cn(
                  "rounded p-1 text-zinc-400 transition-colors",
                  index === sections.length - 1
                    ? "cursor-not-allowed opacity-30"
                    : "hover:text-zinc-600 dark:hover:text-zinc-300",
                )}
                title="Move down"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => setDeleteTarget(index)}
                className="rounded p-1 text-zinc-400 transition-colors hover:text-red-500"
                title="Remove section"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Expanded content */}
          {expandedSections.has(index) && (
            <div className="space-y-4 p-4">
              {/* Section title */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Section Title
                </label>
                <input
                  type="text"
                  value={section.title ?? ""}
                  onChange={(e) =>
                    updateSection(index, "title", e.target.value || null)
                  }
                  placeholder={`${getSectionTypeLabel(section.sectionType)} title`}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              {/* Content (rich text) */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Content
                </label>
                <RichTextEditor
                  value={
                    typeof section.content?.html === "string"
                      ? section.content.html
                      : ""
                  }
                  onChange={(html) =>
                    updateSection(index, "content", {
                      ...(section.content ?? {}),
                      html,
                    })
                  }
                  placeholder={`Enter ${getSectionTypeLabel(section.sectionType)} content...`}
                  minHeight="150px"
                />
              </div>

              {/* CSS class */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  CSS Class
                </label>
                <input
                  type="text"
                  value={
                    typeof section.settings?.cssClass === "string"
                      ? section.settings.cssClass
                      : ""
                  }
                  onChange={(e) =>
                    updateSection(index, "settings", {
                      ...(section.settings ?? {}),
                      cssClass: e.target.value || null,
                    })
                  }
                  placeholder="custom-section-class"
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add section button with type selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowAddMenu(showAddMenu !== null ? null : 0)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-500 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
        >
          <Plus className="h-4 w-4" />
          Add Section
        </button>

        {showAddMenu !== null && (
          <div
            className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
            onMouseLeave={() => setShowAddMenu(null)}
          >
            <div className="grid grid-cols-2 gap-1">
              {sectionTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    addSection(type.value);
                    setShowAddMenu(null);
                  }}
                  className="rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <span className="block text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {type.label}
                  </span>
                  <span className="block text-xs text-zinc-400">
                    {type.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteTarget !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm section deletion"
        >
          <div
            className="mx-4 w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Remove Section
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to remove the{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {getSectionTypeLabel(sections[deleteTarget]?.sectionType ?? "")}
              </strong>{" "}
              section? Its content will be permanently deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => removeSection(deleteTarget)}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
