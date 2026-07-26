"use client";

import { useRef, useState } from "react";
import { Image, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  jsonldType: string;
}

export const DEFAULT_SEO: SEOData = {
  title: "",
  description: "",
  keywords: "",
  canonicalUrl: "",
  robotsIndex: true,
  robotsFollow: true,
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  jsonldType: "WebPage",
};

export const JSONLD_TYPES = [
  { value: "WebPage", label: "WebPage" },
  { value: "Article", label: "Article" },
  { value: "FAQPage", label: "FAQPage" },
  { value: "AboutPage", label: "AboutPage" },
  { value: "ContactPage", label: "ContactPage" },
  { value: "Service", label: "Service" },
  { value: "Product", label: "Product" },
  { value: "Organization", label: "Organization" },
  { value: "BreadcrumbList", label: "BreadcrumbList" },
  { value: "LocalBusiness", label: "LocalBusiness" },
];

interface SEOFieldsProps {
  value: SEOData;
  onChange: (seo: SEOData) => void;
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function updateField(
  prev: SEOData,
  field: keyof SEOData,
  value: string | boolean,
): SEOData {
  return { ...prev, [field]: value };
}

// ---------------------------------------------------------------------------
// SEOFields
// ---------------------------------------------------------------------------

export function SEOFields({ value, onChange }: SEOFieldsProps) {
  const ogImageInputRef = useRef<HTMLInputElement>(null);
  const [ogImagePreview, setOgImagePreview] = useState(value.ogImage);

  const handleOgImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setOgImagePreview(url);
        onChange(updateField(value, "ogImage", url));
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* ── Basic SEO ── */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
          SEO Metadata
        </h3>
        <div className="space-y-4">
          {/* SEO Title */}
          <div>
            <label
              htmlFor="seo-title"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              SEO Title
              <span className="ml-2 text-xs text-zinc-400">
                ({value.title.length}/70 recommended)
              </span>
            </label>
            <input
              id="seo-title"
              type="text"
              value={value.title}
              onChange={(e) =>
                onChange(updateField(value, "title", e.target.value))
              }
              placeholder="Page title for search engines"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <div className="mt-1 h-1 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={cn(
                  "h-1 rounded-full transition-all",
                  value.title.length > 70
                    ? "bg-amber-500"
                    : value.title.length > 55
                      ? "bg-green-500"
                      : "bg-blue-500",
                )}
                style={{
                  width: `${Math.min((value.title.length / 70) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <label
              htmlFor="seo-description"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Meta Description
              <span className="ml-2 text-xs text-zinc-400">
                ({value.description.length}/160 recommended)
              </span>
            </label>
            <textarea
              id="seo-description"
              rows={3}
              value={value.description}
              onChange={(e) =>
                onChange(updateField(value, "description", e.target.value))
              }
              placeholder="Brief description for search results"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 resize-y"
            />
            <div className="mt-1 h-1 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={cn(
                  "h-1 rounded-full transition-all",
                  value.description.length > 160
                    ? "bg-amber-500"
                    : value.description.length > 140
                      ? "bg-green-500"
                      : "bg-blue-500",
                )}
                style={{
                  width: `${Math.min((value.description.length / 160) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Meta Keywords */}
          <div>
            <label
              htmlFor="seo-keywords"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Meta Keywords
            </label>
            <input
              id="seo-keywords"
              type="text"
              value={value.keywords}
              onChange={(e) =>
                onChange(updateField(value, "keywords", e.target.value))
              }
              placeholder="keyword1, keyword2, keyword3"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          {/* Canonical URL */}
          <div>
            <label
              htmlFor="seo-canonical"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Canonical URL
            </label>
            <input
              id="seo-canonical"
              type="url"
              value={value.canonicalUrl}
              onChange={(e) =>
                onChange(updateField(value, "canonicalUrl", e.target.value))
              }
              placeholder="https://example.com/page"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          {/* Robots */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={value.robotsIndex}
                onChange={(e) =>
                  onChange(updateField(value, "robotsIndex", e.target.checked))
                }
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
              />
              Allow indexing (index)
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={value.robotsFollow}
                onChange={(e) =>
                  onChange(
                    updateField(value, "robotsFollow", e.target.checked),
                  )
                }
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
              />
              Follow links (follow)
            </label>
          </div>
        </div>
      </div>

      {/* ── OpenGraph ── */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Open Graph
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="og-title"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              OG Title
            </label>
            <input
              id="og-title"
              type="text"
              value={value.ogTitle}
              onChange={(e) =>
                onChange(updateField(value, "ogTitle", e.target.value))
              }
              placeholder="Title for social sharing"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="og-description"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              OG Description
            </label>
            <textarea
              id="og-description"
              rows={2}
              value={value.ogDescription}
              onChange={(e) =>
                onChange(
                  updateField(value, "ogDescription", e.target.value),
                )
              }
              placeholder="Description for social sharing"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 resize-y"
            />
          </div>

          {/* OG Image */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              OG Image
            </label>
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={handleOgImageUpload}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <Image className="h-4 w-4" />
                Upload Image
              </button>
              {value.ogImage && (
                <button
                  type="button"
                  onClick={() => {
                    setOgImagePreview("");
                    onChange(updateField(value, "ogImage", ""));
                  }}
                  className="rounded-lg p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {ogImagePreview && (
              <div className="mt-2 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                <img
                  src={ogImagePreview}
                  alt="OG Preview"
                  className="max-h-40 w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── JSON-LD ── */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Structured Data (JSON-LD)
        </h3>
        <div>
          <label
            htmlFor="jsonld-type"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Schema Type
          </label>
          <select
            id="jsonld-type"
            value={value.jsonldType}
            onChange={(e) =>
              onChange(updateField(value, "jsonldType", e.target.value))
            }
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {JSONLD_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
