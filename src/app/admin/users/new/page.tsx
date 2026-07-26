"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import {
  Loader2,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"], {
    error: "Please select a role",
  }),
  isActive: z.boolean(),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

const ROLES = [
  { value: "VIEWER", label: "Viewer", description: "Read-only access" },
  { value: "EDITOR", label: "Editor", description: "Can create and edit content" },
  { value: "ADMIN", label: "Admin", description: "Full content management" },
  { value: "SUPER_ADMIN", label: "Super Admin", description: "Full system access" },
] as const;

// ---------------------------------------------------------------------------
// CreateUserPage
// ---------------------------------------------------------------------------

export default function CreateUserPage() {
  const router = useRouter();

  const [form, setForm] = useState<CreateUserForm>({
    name: "",
    email: "",
    password: "",
    role: "EDITOR",
    isActive: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserForm, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof CreateUserForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field-level error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccess(false);

    // Validate
    const result = createUserSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CreateUserForm, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateUserForm;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to create user");
      }

      setSuccess(true);
      // Redirect after short delay
      setTimeout(() => {
        router.push("/admin/users");
      }, 1500);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/users"
        className={cn(
          "mb-4 inline-flex items-center gap-1.5 text-sm font-medium",
          "text-zinc-500 hover:text-zinc-700",
          "dark:text-zinc-400 dark:hover:text-zinc-200",
          "transition-colors",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Users
      </Link>

      <PageHeader
        title="New User"
        description="Create a new admin user account"
      />

      {/* Success banner */}
      {success && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>User created successfully! Redirecting…</span>
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe"
              aria-invalid={!!errors.name}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm",
                "bg-white text-zinc-900 placeholder:text-zinc-400",
                "focus:outline-none focus:ring-1",
                "dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
              )}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@synovainfotech.com"
              autoComplete="off"
              aria-invalid={!!errors.email}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm",
                "bg-white text-zinc-900 placeholder:text-zinc-400",
                "focus:outline-none focus:ring-1",
                "dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
              )}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 pr-10 text-sm",
                  "bg-white text-zinc-900 placeholder:text-zinc-400",
                  "focus:outline-none focus:ring-1",
                  "dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                  errors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
            <p className="mt-1 text-xs text-zinc-400">
              Must be at least 8 characters
            </p>
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm",
                "bg-white text-zinc-900",
                "focus:outline-none focus:ring-1",
                "dark:bg-zinc-800 dark:text-zinc-100",
                errors.role
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
              )}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-red-500">{errors.role}</p>
            )}
            <p className="mt-1 text-xs text-zinc-400">
              {ROLES.find((r) => r.value === form.role)?.description}
            </p>
          </div>

          {/* Active status */}
          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Active account
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-700">
          <Link
            href="/admin/users"
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
            disabled={submitting || success}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-500",
              "transition-colors",
              (submitting || success) && "cursor-not-allowed opacity-70",
            )}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              "Create User"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
