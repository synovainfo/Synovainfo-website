// =============================================================================
// Admin Settings — System + Theme configuration with tabs
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
  Globe,
  Palette,
  Search,
  Mail,
  ExternalLink,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import { ColorPicker } from "@/components/admin/color-picker";

// =============================================================================
// Types
// =============================================================================

type TabId = "general" | "theme" | "seo" | "email";

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Globe;
}

const TABS: Tab[] = [
  { id: "general", label: "General", icon: Globe },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "seo", label: "SEO", icon: Search },
  { id: "email", label: "Email", icon: Mail },
];

// =============================================================================
// Validation schemas (one per tab)
// =============================================================================

const generalSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(100, "Max 100 characters"),
  siteDescription: z.string().max(500, "Max 500 characters").default(""),
  logo: z.string().default(""),
  linkedin: z.string().default(""),
  twitter: z.string().default(""),
  github: z.string().default(""),
  youtube: z.string().default(""),
  contactEmail: z
    .string()
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Invalid email")
    .default(""),
  contactPhone: z.string().default(""),
  contactAddress: z.string().default(""),
  googleAnalyticsId: z.string().default(""),
});

const themeSchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
    .default("#2563EB"),
  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
    .default("#7C3AED"),
  fontFamily: z.enum(["Inter", "Plus Jakarta Sans", "Manrope"]).default("Inter"),
  borderRadius: z.coerce.number().min(0).max(24).default(8),
  defaultTheme: z.enum(["light", "dark"]).default("light"),
});

const seoSchema = z.object({
  metaTitleTemplate: z
    .string()
    .max(200, "Max 200 characters")
    .default(""),
  metaDescription: z
    .string()
    .max(500, "Max 500 characters")
    .default(""),
  ogImage: z.string().default(""),
  twitterHandle: z.string().default(""),
  googleSearchConsoleCode: z.string().default(""),
});

const emailSchema = z.object({
  fromName: z.string().min(1, "From name is required").max(100).default(""),
  fromAddress: z
    .string()
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Invalid email")
    .default(""),
  resendApiKey: z.string().default(""),
});

type GeneralForm = z.infer<typeof generalSchema>;
type ThemeForm = z.infer<typeof themeSchema>;
type SeoForm = z.infer<typeof seoSchema>;
type EmailForm = z.infer<typeof emailSchema>;

// =============================================================================
// Default values
// =============================================================================

const GENERAL_DEFAULTS: GeneralForm = {
  siteName: "",
  siteDescription: "",
  logo: "",
  linkedin: "",
  twitter: "",
  github: "",
  youtube: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  googleAnalyticsId: "",
};

const THEME_DEFAULTS: ThemeForm = {
  primaryColor: "#2563EB",
  accentColor: "#7C3AED",
  fontFamily: "Inter",
  borderRadius: 8,
  defaultTheme: "light",
};

const SEO_DEFAULTS: SeoForm = {
  metaTitleTemplate: "",
  metaDescription: "",
  ogImage: "",
  twitterHandle: "",
  googleSearchConsoleCode: "",
};

const EMAIL_DEFAULTS: EmailForm = {
  fromName: "",
  fromAddress: "",
  resendApiKey: "",
};

// =============================================================================
// Helpers
// =============================================================================

/** Prepend tab prefix to form field names for API keys */
function prefixKeys<T extends Record<string, unknown>>(
  prefix: string,
  data: T,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
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
// Theme Preview Panel
// =============================================================================

function ThemePreview({ primaryColor, accentColor, fontFamily, borderRadius, defaultTheme }: ThemeForm) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700"
      style={{
        fontFamily,
        borderRadius: `${borderRadius}px`,
      }}
    >
      {/* Preview header */}
      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-700 dark:bg-zinc-800/50">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Live Preview
        </p>
      </div>

      {/* Preview content */}
      <div className="space-y-3 p-4" style={{ backgroundColor: defaultTheme === "dark" ? "#0F172A" : "#FFFFFF" }}>
        {/* Nav bar mock */}
        <div
          className="flex items-center gap-3 px-3 py-2"
          style={{
            backgroundColor: primaryColor,
            borderRadius: `${Math.max(borderRadius - 4, 4)}px`,
          }}
        >
          <div className="h-2 w-20 rounded bg-white/30" />
          <div className="ml-auto flex gap-3">
            <div className="h-2 w-10 rounded bg-white/20" />
            <div className="h-2 w-10 rounded bg-white/20" />
          </div>
        </div>

        {/* Card mock */}
        <div
          className="space-y-2 border p-3"
          style={{
            borderColor: `${primaryColor}20`,
            borderRadius: `${Math.max(borderRadius - 4, 4)}px`,
            backgroundColor: defaultTheme === "dark" ? "#1E293B" : "#FFFFFF",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-lg"
              style={{ backgroundColor: accentColor }}
            />
            <div>
              <div
                className="h-3 w-28 rounded"
                style={{
                  backgroundColor: defaultTheme === "dark" ? "#475569" : "#E2E8F0",
                }}
              />
              <div
                className="mt-1 h-2 w-20 rounded"
                style={{
                  backgroundColor: defaultTheme === "dark" ? "#334155" : "#F1F5F9",
                }}
              />
            </div>
          </div>
          <div
            className="h-2 w-full rounded"
            style={{
              backgroundColor: defaultTheme === "dark" ? "#334155" : "#F1F5F9",
            }}
          />
          <div
            className="h-2 w-3/4 rounded"
            style={{
              backgroundColor: defaultTheme === "dark" ? "#334155" : "#F1F5F9",
            }}
          />
          <div className="flex gap-2 pt-1">
            <div
              className="h-6 flex-1 rounded px-3 text-[10px] font-medium leading-6 text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Primary
            </div>
            <div
              className="h-6 flex-1 rounded px-3 text-[10px] font-medium leading-6 text-white"
              style={{ backgroundColor: accentColor }}
            >
              Accent
            </div>
          </div>
        </div>

        {/* Font preview */}
        <p
          className="text-xs text-zinc-400 dark:text-zinc-500"
          style={{ fontFamily }}
        >
          Font: <span className="font-medium">{fontFamily}</span>
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// General Tab
// =============================================================================

function GeneralTab({
  settings,
  onSaved,
}: {
  settings: Record<string, unknown>;
  onSaved: () => void;
}) {
  const initial = useMemo(
    () => ({ ...GENERAL_DEFAULTS, ...stripPrefix<GeneralForm>("general", settings) }),
    [settings],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<GeneralForm>({
    resolver: zodResolver(generalSchema) as any,
    defaultValues: initial,
    values: initial,
  });

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (data: GeneralForm) => {
      setSaveError(null);
      setSaveSuccess(null);
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prefixKeys("general", data as unknown as Record<string, unknown>)),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message ?? "Failed to save settings");
        }
        setSaveSuccess("General settings saved");
        onSaved();
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "An error occurred");
      }
    },
    [onSaved],
  );

  return (
    <TabSection
      title="General Settings"
      description="Manage your site name, description, social links, and contact information"
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      saveError={saveError}
      saveSuccess={saveSuccess}
      onDismissSave={() => { setSaveError(null); setSaveSuccess(null); }}
      onReset={() => reset(initial)}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Site Name" error={errors.siteName?.message} required className="sm:col-span-2">
          <input
            {...register("siteName")}
            placeholder="Synova Infotech"
            className={inputCls(errors.siteName)}
          />
        </Field>

        <Field label="Site Description" error={errors.siteDescription?.message} className="sm:col-span-2">
          <textarea
            {...register("siteDescription")}
            rows={3}
            placeholder="Enterprise IT solutions provider"
            className={cn(inputCls(errors.siteDescription), "resize-y min-h-[80px]")}
          />
        </Field>

        <Field label="Logo URL" error={errors.logo?.message} className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <input
              {...register("logo")}
              placeholder="/uploads/logo.svg"
              className={cn(inputCls(errors.logo), "flex-1")}
            />
            <span className="shrink-0 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-xs text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800">
              Upload UI placeholder
            </span>
          </div>
        </Field>

        {/* Social links */}
        <div className="sm:col-span-2">
          <h4 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
            Social Links
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="LinkedIn URL" error={errors.linkedin?.message}>
              <input
                {...register("linkedin")}
                placeholder="https://linkedin.com/company/synova"
                className={inputCls(errors.linkedin)}
              />
            </Field>
            <Field label="Twitter URL" error={errors.twitter?.message}>
              <input
                {...register("twitter")}
                placeholder="https://twitter.com/synova"
                className={inputCls(errors.twitter)}
              />
            </Field>
            <Field label="GitHub URL" error={errors.github?.message}>
              <input
                {...register("github")}
                placeholder="https://github.com/synova"
                className={inputCls(errors.github)}
              />
            </Field>
            <Field label="YouTube URL" error={errors.youtube?.message}>
              <input
                {...register("youtube")}
                placeholder="https://youtube.com/@synova"
                className={inputCls(errors.youtube)}
              />
            </Field>
          </div>
        </div>

        {/* Contact info */}
        <div className="sm:col-span-2">
          <h4 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
            Contact Information
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact Email" error={errors.contactEmail?.message}>
              <input
                {...register("contactEmail")}
                type="email"
                placeholder="contact@synovainfo.com"
                className={inputCls(errors.contactEmail)}
              />
            </Field>
            <Field label="Contact Phone" error={errors.contactPhone?.message}>
              <input
                {...register("contactPhone")}
                placeholder="+1 (555) 123-4567"
                className={inputCls(errors.contactPhone)}
              />
            </Field>
            <Field label="Address" error={errors.contactAddress?.message} className="sm:col-span-2">
              <textarea
                {...register("contactAddress")}
                rows={2}
                placeholder="123 Business Ave, Suite 100"
                className={cn(inputCls(errors.contactAddress), "resize-y min-h-[60px]")}
              />
            </Field>
          </div>
        </div>

        <Field label="Google Analytics ID" error={errors.googleAnalyticsId?.message} className="sm:col-span-2">
          <input
            {...register("googleAnalyticsId")}
            placeholder="G-XXXXXXXXXX"
            className={inputCls(errors.googleAnalyticsId)}
          />
        </Field>
      </div>
    </TabSection>
  );
}

// =============================================================================
// Theme Tab
// =============================================================================

function ThemeTab({
  settings,
  onSaved,
}: {
  settings: Record<string, unknown>;
  onSaved: () => void;
}) {
  const initial = useMemo(
    () => ({ ...THEME_DEFAULTS, ...stripPrefix<ThemeForm>("theme", settings) }),
    [settings],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ThemeForm>({
    resolver: zodResolver(themeSchema) as any,
    defaultValues: initial,
    values: initial,
  });

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const watched = watch();
  const primaryColor = watched.primaryColor ?? THEME_DEFAULTS.primaryColor;
  const accentColor = watched.accentColor ?? THEME_DEFAULTS.accentColor;

  const onSubmit = useCallback(
    async (data: ThemeForm) => {
      setSaveError(null);
      setSaveSuccess(null);
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prefixKeys("theme", data as unknown as Record<string, unknown>)),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message ?? "Failed to save settings");
        }
        setSaveSuccess("Theme settings saved");
        onSaved();
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "An error occurred");
      }
    },
    [onSaved],
  );

  return (
    <TabSection
      title="Theme Settings"
      description="Customize the appearance of your admin panel and website"
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      saveError={saveError}
      saveSuccess={saveSuccess}
      onDismissSave={() => { setSaveError(null); setSaveSuccess(null); }}
      onReset={() => reset(initial)}
    >
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form fields */}
        <div className="space-y-6 lg:col-span-3">
          <ColorPicker
            label="Primary Color"
            value={primaryColor}
            onChange={(c) => setValue("primaryColor", c, { shouldDirty: true })}
            error={errors.primaryColor?.message}
          />

          <ColorPicker
            label="Accent Color"
            value={accentColor}
            onChange={(c) => setValue("accentColor", c, { shouldDirty: true })}
            error={errors.accentColor?.message}
          />

          <Field label="Font Family" error={errors.fontFamily?.message} required>
            <select
              {...register("fontFamily")}
              className={inputCls(errors.fontFamily)}
            >
              <option value="Inter">Inter</option>
              <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
              <option value="Manrope">Manrope</option>
            </select>
          </Field>

          <Field label={`Border Radius: ${watched.borderRadius ?? 8}px`} error={errors.borderRadius?.message}>
            <input
              type="range"
              min={0}
              max={24}
              step={1}
              {...register("borderRadius", { valueAsNumber: true })}
              className="w-full cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-zinc-400">
              <span>0px</span>
              <span>12px</span>
              <span>24px</span>
            </div>
          </Field>

          <Field label="Default Theme" error={errors.defaultTheme?.message} required>
            <div className="flex gap-3">
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 transition-colors",
                  watched.defaultTheme === "light"
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-400"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800",
                )}
              >
                <input
                  type="radio"
                  value="light"
                  {...register("defaultTheme")}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-2",
                    watched.defaultTheme === "light"
                      ? "border-blue-500 bg-blue-500"
                      : "border-zinc-300 dark:border-zinc-600",
                  )}
                />
                Light
              </label>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 transition-colors",
                  watched.defaultTheme === "dark"
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-400"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800",
                )}
              >
                <input
                  type="radio"
                  value="dark"
                  {...register("defaultTheme")}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-2",
                    watched.defaultTheme === "dark"
                      ? "border-blue-500 bg-blue-500"
                      : "border-zinc-300 dark:border-zinc-600",
                  )}
                />
                Dark
              </label>
            </div>
          </Field>
        </div>

        {/* Live preview panel */}
        <div className="lg:col-span-2 lg:sticky lg:top-6 lg:self-start">
          <ThemePreview {...watched} />
        </div>
      </div>
    </TabSection>
  );
}

// =============================================================================
// SEO Tab
// =============================================================================

function SeoTab({
  settings,
  onSaved,
}: {
  settings: Record<string, unknown>;
  onSaved: () => void;
}) {
  const initial = useMemo(
    () => ({ ...SEO_DEFAULTS, ...stripPrefix<SeoForm>("seo", settings) }),
    [settings],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SeoForm>({
    resolver: zodResolver(seoSchema) as any,
    defaultValues: initial,
    values: initial,
  });

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (data: SeoForm) => {
      setSaveError(null);
      setSaveSuccess(null);
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prefixKeys("seo", data as unknown as Record<string, unknown>)),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message ?? "Failed to save settings");
        }
        setSaveSuccess("SEO settings saved");
        onSaved();
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "An error occurred");
      }
    },
    [onSaved],
  );

  return (
    <TabSection
      title="SEO Settings"
      description="Configure default meta tags, Open Graph, and search engine preferences"
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      saveError={saveError}
      saveSuccess={saveSuccess}
      onDismissSave={() => { setSaveError(null); setSaveSuccess(null); }}
      onReset={() => reset(initial)}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Meta Title Template" error={errors.metaTitleTemplate?.message} className="sm:col-span-2">
          <input
            {...register("metaTitleTemplate")}
            placeholder="%s — Synova Infotech"
            className={inputCls(errors.metaTitleTemplate)}
          />
          <p className="mt-1 text-xs text-zinc-400">
            Use <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">%s</code> as a placeholder
            for the page title
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
          <div className="flex items-center gap-3">
            <input
              {...register("ogImage")}
              placeholder="/images/og-default.jpg"
              className={cn(inputCls(errors.ogImage), "flex-1")}
            />
            <span className="shrink-0 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-xs text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800">
              Upload UI placeholder
            </span>
          </div>
        </Field>

        <Field label="Twitter Handle" error={errors.twitterHandle?.message}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              @
            </span>
            <input
              {...register("twitterHandle")}
              placeholder="synovainfo"
              className={cn(inputCls(errors.twitterHandle), "pl-7")}
            />
          </div>
        </Field>

        <Field label="Google Search Console Code" error={errors.googleSearchConsoleCode?.message}>
          <input
            {...register("googleSearchConsoleCode")}
            placeholder="1234567890abcdef"
            className={inputCls(errors.googleSearchConsoleCode)}
          />
        </Field>
      </div>
    </TabSection>
  );
}

// =============================================================================
// Email Tab
// =============================================================================

function EmailTab({
  settings,
  onSaved,
}: {
  settings: Record<string, unknown>;
  onSaved: () => void;
}) {
  const initial = useMemo(
    () => ({ ...EMAIL_DEFAULTS, ...stripPrefix<EmailForm>("email", settings) }),
    [settings],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema) as any,
    defaultValues: initial,
    values: initial,
  });

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const [showApiKey, setShowApiKey] = useState(false);

  const onSubmit = useCallback(
    async (data: EmailForm) => {
      setSaveError(null);
      setSaveSuccess(null);
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prefixKeys("email", data as unknown as Record<string, unknown>)),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message ?? "Failed to save settings");
        }
        setSaveSuccess("Email settings saved");
        onSaved();
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "An error occurred");
      }
    },
    [onSaved],
  );

  const handleTestEmail = useCallback(async () => {
    setTestStatus("sending");
    try {
      const res = await fetch("/api/admin/settings/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Test failed");
      setTestStatus("sent");
      setTimeout(() => setTestStatus("idle"), 4000);
    } catch {
      setTestStatus("error");
      setTimeout(() => setTestStatus("idle"), 4000);
    }
  }, []);

  return (
    <TabSection
      title="Email Settings"
      description="Configure email sender details and SMTP / Resend integration"
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      saveError={saveError}
      saveSuccess={saveSuccess}
      onDismissSave={() => { setSaveError(null); setSaveSuccess(null); }}
      onReset={() => reset(initial)}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="From Name" error={errors.fromName?.message} required>
          <input
            {...register("fromName")}
            placeholder="Synova Infotech"
            className={inputCls(errors.fromName)}
          />
        </Field>

        <Field label="From Email" error={errors.fromAddress?.message}>
          <input
            {...register("fromAddress")}
            type="email"
            placeholder="noreply@synovainfo.com"
            className={inputCls(errors.fromAddress)}
          />
        </Field>

        <Field label="Resend API Key" error={errors.resendApiKey?.message} className="sm:col-span-2">
          <div className="relative">
            <input
              {...register("resendApiKey")}
              type={showApiKey ? "text" : "password"}
              placeholder="re_..."
              className={cn(inputCls(errors.resendApiKey), "pr-10 font-mono")}
            />
            <button
              type="button"
              onClick={() => setShowApiKey((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              {showApiKey ? "Hide" : "Show"}
            </button>
          </div>
        </Field>

        {/* Test email section */}
        <div className="sm:col-span-2">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  Test Email Configuration
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Send a test email to verify your configuration
                </p>
              </div>
              <button
                type="button"
                disabled={testStatus === "sending"}
                onClick={handleTestEmail}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  testStatus === "sent"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : testStatus === "error"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-blue-600 text-white hover:bg-blue-500",
                  testStatus === "sending" && "cursor-not-allowed opacity-70",
                )}
              >
                {testStatus === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : testStatus === "sent" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Sent
                  </>
                ) : testStatus === "error" ? (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    Failed
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Test
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </TabSection>
  );
}

// =============================================================================
// TabSection — reusable wrapper for each tab's form content
// =============================================================================

interface TabSectionProps {
  title: string;
  description: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isDirty: boolean;
  saveError: string | null;
  saveSuccess: string | null;
  onDismissSave: () => void;
  onReset: () => void;
  children: React.ReactNode;
}

function TabSection({
  title,
  description,
  onSubmit,
  isSubmitting,
  isDirty,
  saveError,
  saveSuccess,
  onDismissSave,
  onReset,
  children,
}: TabSectionProps) {
  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Section heading */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
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
            onClick={onDismissSave}
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
            onClick={onDismissSave}
            className="ml-auto font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Form card */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        {children}
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          {isDirty && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              You have unsaved changes
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isDirty && (
            <button
              type="button"
              onClick={onReset}
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
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </form>
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
// Main SettingsPage
// =============================================================================

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
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
  if (loading) {
    return (
      <div>
        <PageHeader title="Settings" description="Manage system configuration and preferences" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  // Fetch error state
  if (fetchError) {
    return (
      <div>
        <PageHeader title="Settings" description="Manage system configuration and preferences" />
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
        title="Settings"
        description="Manage system configuration and preferences"
        actions={
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
            <ExternalLink className="h-3.5 w-3.5" />
            Changes apply immediately
          </div>
        }
      />

      {/* Tab navigation */}
      <div className="mb-8 border-b border-zinc-200 dark:border-zinc-700">
        <nav className="-mb-px flex gap-6 overflow-x-auto" role="tablist" aria-label="Settings tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
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
      <div role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={activeTab}>
        {activeTab === "general" && (
          <GeneralTab settings={settings ?? {}} onSaved={fetchSettings} />
        )}
        {activeTab === "theme" && (
          <ThemeTab settings={settings ?? {}} onSaved={fetchSettings} />
        )}
        {activeTab === "seo" && (
          <SeoTab settings={settings ?? {}} onSaved={fetchSettings} />
        )}
        {activeTab === "email" && (
          <EmailTab settings={settings ?? {}} onSaved={fetchSettings} />
        )}
      </div>
    </div>
  );
}
