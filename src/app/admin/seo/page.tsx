// =============================================================================
// Admin SEO Manager — tabs: Redirects, Broken Links, SEO Score, Global Settings
// =============================================================================
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Save,
  ArrowRightLeft,
  Link,
  Search,
  Settings,
  Trash2,
  Plus,
  RefreshCw,
  ExternalLink,
  Unlink,
  Shield,
  BarChart3,
  ScanSearch,
  ArrowUpDown,
  Wifi,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// =============================================================================
// Types
// =============================================================================

type TabId = "redirects" | "broken-links" | "seo-score" | "global-settings";

interface Tab {
  id: TabId;
  label: string;
  icon: typeof ArrowRightLeft;
}

const TABS: Tab[] = [
  { id: "redirects", label: "Redirects", icon: ArrowRightLeft },
  { id: "broken-links", label: "Broken Links", icon: Unlink },
  { id: "seo-score", label: "SEO Score", icon: BarChart3 },
  { id: "global-settings", label: "Global Settings", icon: Settings },
];

// =============================================================================
// Types for data entities
// =============================================================================

interface RedirectItem {
  id: string;
  source: string;
  target: string;
  type: 301 | 302;
  wildcard: boolean;
  active: boolean;
  hitCount: number;
  createdAt: string;
}

interface BrokenLink {
  id: string;
  sourcePage: string;
  sourcePageTitle: string;
  brokenUrl: string;
  statusCode: number;
  anchorText: string;
  foundAt: string;
}

interface ScanData {
  id: string;
  startedAt: string;
  completedAt: string;
  totalUrls: number;
  brokenCount: number;
  links: BrokenLink[];
}

interface SeoScoreItem {
  id: string;
  pageId: string;
  title: string;
  slug: string;
  score: number;
  recommendations: string[];
  lastChecked: string;
}

// =============================================================================
// Validation schemas
// =============================================================================

const redirectFormSchema = z.object({
  source: z
    .string()
    .min(1, "Source path is required")
    .max(500)
    .startsWith("/", "Must start with /"),
  target: z
    .string()
    .min(1, "Target path is required")
    .max(500)
    .startsWith("/", "Must start with /"),
  type: z.union([z.literal(301), z.literal(302)]).default(301),
  wildcard: z.boolean().default(false),
});

type RedirectForm = z.infer<typeof redirectFormSchema>;

const REDIRECT_DEFAULTS: RedirectForm = {
  source: "",
  target: "",
  type: 301,
  wildcard: false,
};

const globalSettingsSchema = z.object({
  metaTitleTemplate: z.string().max(200).default(""),
  metaDescription: z.string().max(500).default(""),
  ogImage: z.string().default(""),
  googleAnalyticsId: z.string().default(""),
  googleSearchConsoleCode: z.string().default(""),
  twitterHandle: z.string().default(""),
});

type GlobalSettingsForm = z.infer<typeof globalSettingsSchema>;

const GLOBAL_SETTINGS_DEFAULTS: GlobalSettingsForm = {
  metaTitleTemplate: "",
  metaDescription: "",
  ogImage: "",
  googleAnalyticsId: "",
  googleSearchConsoleCode: "",
  twitterHandle: "",
};

// =============================================================================
// Helpers
// =============================================================================

/** Prepend tab prefix to form field names for API keys */
function prefixKeys<T extends Record<string, string>>(
  prefix: string,
  data: T,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    result[`${prefix}.${key}`] = value;
  }
  return result;
}

/** Strip tab prefix from API keys to get form field names */
function stripPrefix<T>(prefix: string, settings: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(settings)) {
    if (key.startsWith(`${prefix}.`)) {
      result[key.slice(prefix.length + 1)] = value;
    }
  }
  return result as T;
}

// =============================================================================
// Status badge
// =============================================================================

function StatusBadge({
  active,
  label,
}: {
  active: boolean;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        active
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
      )}
    >
      {active ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}
      {label ?? (active ? "Active" : "Inactive")}
    </span>
  );
}

// =============================================================================
// Score indicator
// =============================================================================

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-green-600 dark:text-green-400"
      : score >= 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const bg =
    score >= 80
      ? "bg-green-100 dark:bg-green-900/30"
      : score >= 50
        ? "bg-amber-100 dark:bg-amber-900/30"
        : "bg-red-100 dark:bg-red-900/30";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        color,
        bg,
      )}
    >
      {score}/100
    </span>
  );
}

// =============================================================================
// Status code badge
// =============================================================================

function StatusCodeBadge({ code }: { code: number }) {
  const color =
    code === 0
      ? "text-red-600 dark:text-red-400"
      : code >= 500
        ? "text-red-600 dark:text-red-400"
        : code >= 400
          ? "text-amber-600 dark:text-amber-400"
          : "text-green-600 dark:text-green-400";

  const bg =
    code === 0
      ? "bg-red-100 dark:bg-red-900/30"
      : code >= 500
        ? "bg-red-100 dark:bg-red-900/30"
        : code >= 400
          ? "bg-amber-100 dark:bg-amber-900/30"
          : "bg-green-100 dark:bg-green-900/30";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-mono font-medium",
        color,
        bg,
      )}
    >
      {code === 0 ? "N/A" : code}
    </span>
  );
}

// =============================================================================
// Input field primitive
// =============================================================================

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

function Field({ label, error, required, children, className }: FieldProps) {
  const errorId = `${label.replace(/\s+/g, "-").toLowerCase()}-error`;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-sm font-medium text-[var(--color-text)]">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// Input class helper
// =============================================================================

function inputCls(error?: { message?: string }) {
  return cn(
    "w-full rounded-lg border bg-[var(--glass-bg)] px-3 py-2 text-sm",
    "text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]",
    "transition-all duration-200 focus:outline-none",
    error
      ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
      : "border-[var(--glass-border)] focus:border-[var(--color-accent-blue)]/50 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]",
  );
}

// =============================================================================
// Table primitive
// =============================================================================

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

function DataTable<T extends { id: string }>({
  columns,
  data,
  emptyMessage = "No data available",
  loading = false,
  onDelete,
  getItemId,
}: {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  loading?: boolean;
  onDelete?: (id: string) => void;
  getItemId?: (item: T) => string;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Search className="mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
        <thead className="bg-zinc-50 dark:bg-zinc-800/50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400",
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
            {onDelete && (
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {data.map((item) => {
            const id = getItemId ? getItemId(item) : item.id;
            return (
              <tr
                key={id}
                className="bg-white transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/50"
              >
                {columns.map((col) => (
                  <td
                    key={`${id}-${col.key}`}
                    className={cn(
                      "whitespace-nowrap px-4 py-3 text-sm text-[var(--color-text)]",
                      col.className,
                    )}
                  >
                    {col.render(item)}
                  </td>
                ))}
                {onDelete && (
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      onClick={() => onDelete(id)}
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// 1. Redirects Tab
// =============================================================================

function RedirectsTab() {
  const [redirects, setRedirects] = useState<RedirectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RedirectForm>({
    resolver: zodResolver(redirectFormSchema) as any,
    defaultValues: REDIRECT_DEFAULTS,
  });

  const fetchRedirects = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/seo/redirects");
      if (!res.ok) throw new Error("Failed to load redirects");
      const data = await res.json();
      setRedirects(data.redirects ?? []);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRedirects();
  }, [fetchRedirects]);

  const onSubmit = useCallback(
    async (formData: RedirectForm) => {
      setSaveError(null);
      setSaveSuccess(null);
      try {
        const res = await fetch("/api/admin/seo/redirects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message ?? json.details?.source?.[0] ?? "Failed to create redirect");
        }
        setSaveSuccess(`Redirect from "${formData.source}" → "${formData.target}" created`);
        reset(REDIRECT_DEFAULTS);
        setShowForm(false);
        fetchRedirects();
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "An error occurred");
      }
    },
    [fetchRedirects, reset],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/admin/seo/redirects/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete redirect");
        setRedirects((prev) => prev.filter((r) => r.id !== id));
      } catch (err) {
        console.error("Delete failed", err);
      }
    },
    [],
  );

  const columns: Column<RedirectItem>[] = [
    {
      key: "source",
      header: "Source",
      render: (item) => (
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-mono text-blue-600 dark:bg-zinc-800 dark:text-blue-400">
          {item.source}
        </code>
      ),
    },
    {
      key: "target",
      header: "Target",
      render: (item) => (
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-mono text-emerald-600 dark:bg-zinc-800 dark:text-emerald-400">
          {item.target}
        </code>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          {item.type}
        </span>
      ),
      className: "text-center",
    },
    {
      key: "wildcard",
      header: "Wildcard",
      render: (item) => (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {item.wildcard ? "Yes" : "No"}
        </span>
      ),
      className: "text-center",
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge active={item.active} />,
    },
    {
      key: "hits",
      header: "Hits",
      render: (item) => (
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
          {item.hitCount}
        </span>
      ),
      className: "text-center",
    },
  ];

  return (
    <div>
      {/* Section heading + actions */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Redirect Manager</h2>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Manage URL redirects and wildcard patterns
          </p>
        </div>
        <button
          onClick={() => setShowForm((p) => !p)}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            showForm
              ? "border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              : "bg-blue-600 text-white hover:bg-blue-500",
          )}
        >
          {showForm ? "Cancel" : (
            <>
              <Plus className="h-4 w-4" />
              Add Redirect
            </>
          )}
        </button>
      </div>

      {/* Success banner */}
      {saveSuccess && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{saveSuccess}</span>
          <button
            type="button"
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
            type="button"
            onClick={() => setSaveError(null)}
            className="ml-auto font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add redirect form */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Source Path" error={errors.source?.message} required>
              <input
                {...register("source")}
                placeholder="/old-page"
                className={inputCls(errors.source)}
              />
            </Field>

            <Field label="Target Path" error={errors.target?.message} required>
              <input
                {...register("target")}
                placeholder="/new-page"
                className={inputCls(errors.target)}
              />
            </Field>

            <Field label="Redirect Type" error={errors.type?.message}>
              <select
                {...register("type", { valueAsNumber: true })}
                className={inputCls(errors.type)}
              >
                <option value={301}>301 — Permanent</option>
                <option value={302}>302 — Temporary</option>
              </select>
            </Field>

            <Field label="Wildcard Pattern">
              <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  {...register("wildcard")}
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                />
                Enable wildcard (<code className="text-xs">*</code> matches any segment)
              </label>
            </Field>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { setShowForm(false); reset(REDIRECT_DEFAULTS); }}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                "bg-blue-600 text-white hover:bg-blue-500",
                isSubmitting && "cursor-not-allowed opacity-70",
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Redirect
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Redirects table */}
      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <DataTable
          columns={columns}
          data={redirects}
          loading={loading}
          emptyMessage={fetchError ? fetchError : "No redirects configured yet"}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

// =============================================================================
// 2. Broken Links Tab
// =============================================================================

function BrokenLinksTab() {
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/seo/scan-results");
      if (!res.ok) throw new Error("Failed to load scan results");
      const data = await res.json();
      setScanData(data.scan);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleScan = useCallback(async () => {
    setScanning(true);
    setScanError(null);
    try {
      const res = await fetch("/api/admin/seo/scan", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Scan failed");
      setScanData(data.scan);
    } catch (err) {
      setScanError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setScanning(false);
    }
  }, []);

  const columns: Column<BrokenLink>[] = [
    {
      key: "sourcePage",
      header: "Source Page",
      render: (item) => (
        <div className="max-w-[200px] truncate">
          <p className="text-sm font-medium text-[var(--color-text)]">{item.sourcePageTitle}</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">/{item.sourcePage}</p>
        </div>
      ),
    },
    {
      key: "brokenUrl",
      header: "Broken URL",
      render: (item) => (
        <code className="max-w-[220px] block truncate rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-mono text-red-600 dark:bg-zinc-800 dark:text-red-400">
          {item.brokenUrl}
        </code>
      ),
    },
    {
      key: "statusCode",
      header: "Status",
      render: (item) => <StatusCodeBadge code={item.statusCode} />,
      className: "text-center",
    },
    {
      key: "anchorText",
      header: "Anchor Text",
      render: (item) => (
        <span className="max-w-[160px] block truncate text-xs text-zinc-500 dark:text-zinc-400">
          {item.anchorText}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Section heading + actions */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Broken Link Scanner</h2>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Scan published pages for broken external links
          </p>
        </div>
        <button
          onClick={handleScan}
          disabled={scanning}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            "bg-blue-600 text-white hover:bg-blue-500",
            scanning && "cursor-not-allowed opacity-70",
          )}
        >
          {scanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scanning…
            </>
          ) : (
            <>
              <ScanSearch className="h-4 w-4" />
              Run Scan
            </>
          )}
        </button>
      </div>

      {/* Scan summary card */}
      {scanData && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              URLs Checked
            </p>
            <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">{scanData.totalUrls}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Broken Links
            </p>
            <p
              className={cn(
                "mt-1 text-2xl font-bold",
                scanData.brokenCount > 0
                  ? "text-red-500"
                  : "text-green-500",
              )}
            >
              {scanData.brokenCount}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Last Scanned
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
              {new Date(scanData.completedAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Scan error */}
      {scanError && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{scanError}</span>
          <button
            type="button"
            onClick={() => setScanError(null)}
            className="ml-auto font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Broken links table */}
      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <DataTable
          columns={columns}
          data={scanData?.links ?? []}
          loading={loading}
          emptyMessage={
            fetchError
              ? fetchError
              : scanData
                ? "No broken links found! Your site is healthy."
                : "No scan results available yet. Run a scan to check for broken links."
          }
        />
      </div>
    </div>
  );
}

// =============================================================================
// 3. SEO Score Tab
// =============================================================================

function SeoScoreTab() {
  const [scores, setScores] = useState<SeoScoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/seo/scores");
      if (!res.ok) throw new Error("Failed to load SEO scores");
      const data = await res.json();
      setScores(data.scores ?? []);
      setLastUpdated(data.lastUpdated ?? null);
      setTotalPages(data.totalPages ?? 0);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const handleRescan = useCallback(async () => {
    setScanning(true);
    try {
      const res = await fetch("/api/admin/seo/scores", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Re-scan failed");
      setScores(data.scores ?? []);
      setLastUpdated(data.lastUpdated ?? null);
      setTotalPages(data.totalPages ?? 0);
    } catch (err) {
      console.error("Re-scan failed", err);
    } finally {
      setScanning(false);
    }
  }, []);

  const averageScore = useMemo(() => {
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);
  }, [scores]);

  const columns: Column<SeoScoreItem>[] = [
    {
      key: "page",
      header: "Page",
      render: (item) => (
        <div className="max-w-[240px]">
          <p className="text-sm font-medium text-[var(--color-text)] truncate">{item.title}</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">/{item.slug}</p>
        </div>
      ),
    },
    {
      key: "score",
      header: "Score",
      render: (item) => <ScoreBadge score={item.score} />,
      className: "text-center",
    },
    {
      key: "recommendations",
      header: "Recommendations",
      render: (item) => (
        <div className="max-w-[300px]">
          {item.recommendations.length === 0 ? (
            <span className="text-xs text-green-500">All good!</span>
          ) : (
            <ul className="list-inside list-disc space-y-0.5">
              {item.recommendations.slice(0, 3).map((rec, i) => (
                <li key={i} className="text-xs text-zinc-500 dark:text-zinc-400">
                  {rec}
                </li>
              ))}
              {item.recommendations.length > 3 && (
                <li className="text-xs text-zinc-400 dark:text-zinc-500">
                  +{item.recommendations.length - 3} more
                </li>
              )}
            </ul>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Section heading + actions */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">SEO Score Analysis</h2>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Per-page SEO score and optimisation recommendations
          </p>
        </div>
        <button
          onClick={handleRescan}
          disabled={scanning}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            "bg-blue-600 text-white hover:bg-blue-500",
            scanning && "cursor-not-allowed opacity-70",
          )}
        >
          {scanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scanning…
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Re-scan All Pages
            </>
          )}
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Pages Scanned
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">{totalPages}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Average Score
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">{averageScore}/100</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Last Updated
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
            {lastUpdated ? new Date(lastUpdated).toLocaleString() : "Never"}
          </p>
        </div>
      </div>

      {/* Scores table */}
      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <DataTable
          columns={columns}
          data={scores}
          loading={loading}
          emptyMessage={
            fetchError
              ? fetchError
              : "No pages found. Publish a page first to see its SEO score."
          }
        />
      </div>
    </div>
  );
}

// =============================================================================
// 4. Global Settings Tab
// =============================================================================

function GlobalSettingsTab({
  settings,
  onSaved,
}: {
  settings: Record<string, unknown>;
  onSaved: () => void;
}) {
  const initial = useMemo(
    () => ({ ...GLOBAL_SETTINGS_DEFAULTS, ...stripPrefix<GlobalSettingsForm>("seoGlobal", settings) }),
    [settings],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<GlobalSettingsForm>({
    resolver: zodResolver(globalSettingsSchema) as any,
    defaultValues: initial,
    values: initial,
  });

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (data: GlobalSettingsForm) => {
      setSaveError(null);
      setSaveSuccess(null);
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prefixKeys("seoGlobal", data)),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message ?? "Failed to save settings");
        }
        setSaveSuccess("Global SEO settings saved");
        onSaved();
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "An error occurred");
      }
    },
    [onSaved],
  );

  return (
    <div>
      {/* Section heading */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">Global SEO Settings</h2>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
          Configure default meta templates, analytics, and search engine integration
        </p>
      </div>

      {/* Success banner */}
      {saveSuccess && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{saveSuccess}</span>
          <button
            type="button"
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
            type="button"
            onClick={() => setSaveError(null)}
            className="ml-auto font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Settings form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Meta Title Template" error={errors.metaTitleTemplate?.message} className="sm:col-span-2">
              <input
                {...register("metaTitleTemplate")}
                placeholder="%s — Synova Infotech"
                className={inputCls(errors.metaTitleTemplate)}
              />
              <p className="mt-1 text-xs text-zinc-400">
                Use <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">%s</code> as placeholder for page title
              </p>
            </Field>

            <Field label="Default Meta Description" error={errors.metaDescription?.message} className="sm:col-span-2">
              <textarea
                {...register("metaDescription")}
                rows={3}
                placeholder="Enterprise IT solutions and digital transformation services"
                className={cn(inputCls(errors.metaDescription), "resize-y min-h-[80px]")}
              />
            </Field>

            <Field label="Default OG Image URL" error={errors.ogImage?.message} className="sm:col-span-2">
              <input
                {...register("ogImage")}
                placeholder="/images/og-default.jpg"
                className={inputCls(errors.ogImage)}
              />
            </Field>

            <Field label="Google Analytics ID" error={errors.googleAnalyticsId?.message}>
              <input
                {...register("googleAnalyticsId")}
                placeholder="G-XXXXXXXXXX"
                className={inputCls(errors.googleAnalyticsId)}
              />
            </Field>

            <Field label="Google Search Console Code" error={errors.googleSearchConsoleCode?.message}>
              <input
                {...register("googleSearchConsoleCode")}
                placeholder="1234567890abcdef"
                className={inputCls(errors.googleSearchConsoleCode)}
              />
            </Field>

            <Field label="Twitter Handle" error={errors.twitterHandle?.message}>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">@</span>
                <input
                  {...register("twitterHandle")}
                  placeholder="synovainfo"
                  className={cn(inputCls(errors.twitterHandle), "pl-7")}
                />
              </div>
            </Field>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            {isDirty && (
              <p className="text-sm text-amber-600 dark:text-amber-400">You have unsaved changes</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isDirty && (
              <button
                type="button"
                onClick={() => reset(initial)}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Reset
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                "bg-blue-600 text-white hover:bg-blue-500",
                isSubmitting && "cursor-not-allowed opacity-70",
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// =============================================================================
// Main SEO Manager Page
// =============================================================================

export default function SeoManagerPage() {
  const [activeTab, setActiveTab] = useState<TabId>("redirects");
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      const data = await res.json();
      setSettings(data.settings ?? {});
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Loading state
  if (loading && activeTab === "global-settings") {
    return (
      <div>
        <PageHeader
          title="SEO Manager"
          description="Manage redirects, broken links, SEO scores, and global settings"
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  // Fetch error state
  if (fetchError && activeTab === "global-settings") {
    return (
      <div>
        <PageHeader
          title="SEO Manager"
          description="Manage redirects, broken links, SEO scores, and global settings"
        />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Failed to load settings
          </h3>
          <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">{fetchError}</p>
          <button
            onClick={fetchSettings}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="SEO Manager"
        description="Manage redirects, broken links, SEO scores, and global settings"
      />

      {/* Tab navigation */}
      <div className="mb-8 border-b border-zinc-200 dark:border-zinc-700">
        <nav className="-mb-px flex gap-6 overflow-x-auto" role="tablist" aria-label="SEO Manager tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-seo-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-1 pb-3 pt-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab panels */}
      <div role="tabpanel" id={`tabpanel-seo-${activeTab}`} aria-labelledby={activeTab}>
        {activeTab === "redirects" && <RedirectsTab />}
        {activeTab === "broken-links" && <BrokenLinksTab />}
        {activeTab === "seo-score" && <SeoScoreTab />}
        {activeTab === "global-settings" && (
          <GlobalSettingsTab settings={settings ?? {}} onSaved={fetchSettings} />
        )}
      </div>
    </div>
  );
}
