"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import {
  Loader2,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Trash2,
  Clock,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  image: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ActivityEntry {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}

interface UserResponse {
  user: UserDetail;
  activity: ActivityEntry[];
}

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .refine(
      (val) => val === "" || val.length >= 8,
      "Password must be at least 8 characters",
    )
    .optional()
    .or(z.literal("")),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"]),
  isActive: z.boolean(),
});

type UpdateUserForm = z.infer<typeof updateUserSchema>;

const ROLES = [
  { value: "VIEWER", label: "Viewer", description: "Read-only access" },
  { value: "EDITOR", label: "Editor", description: "Can create and edit content" },
  { value: "ADMIN", label: "Admin", description: "Full content management" },
  { value: "SUPER_ADMIN", label: "Super Admin", description: "Full system access" },
] as const;

// ---------------------------------------------------------------------------
// UserEditPage
// ---------------------------------------------------------------------------

export default function UserEditPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  // Data state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // User data
  const [user, setUser] = useState<UserDetail | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  // Form
  const [form, setForm] = useState<UpdateUserForm>({
    name: "",
    email: "",
    password: "",
    role: "EDITOR",
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UpdateUserForm, string>>>({});

  // Fetch user
  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("User not found");
        throw new Error("Failed to fetch user");
      }
      const data: UserResponse = await res.json();
      setUser(data.user);
      setActivity(data.activity);
      setForm({
        name: data.user.name,
        email: data.user.email,
        password: "",
        role: data.user.role as UpdateUserForm["role"],
        isActive: data.user.isActive,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Form change handler
  const handleChange = (field: keyof UpdateUserForm, value: string | boolean) => {
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

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    // Validate
    const result = updateUserSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof UpdateUserForm, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof UpdateUserForm;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setFormErrors(fieldErrors);
      return;
    }

    setFormErrors({});
    setSaving(true);

    try {
      const body: Record<string, unknown> = {
        name: result.data.name,
        email: result.data.email,
        role: result.data.role,
        isActive: result.data.isActive,
      };
      if (result.data.password) {
        body.password = result.data.password;
      }

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to update user");
      }

      setSuccessMessage("User updated successfully");
      // Refresh user data
      fetchUser();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    setDeleting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Failed to delete user");
      }
      router.push("/admin/users");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
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
          href="/admin/users"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Users
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchUser}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/users"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Users
      </Link>

      <PageHeader
        title={user.name}
        description="Edit user details and manage account"
      />

      {/* Success banner */}
      {successMessage && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Edit Form ── */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSave}
            noValidate
            className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="edit-name"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  aria-invalid={!!formErrors.name}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    formErrors.name
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                      : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="edit-email"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  aria-invalid={!!formErrors.email}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    formErrors.email
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                      : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                />
                {formErrors.email && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="edit-password"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="edit-password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Leave blank to keep current password"
                    autoComplete="new-password"
                    aria-invalid={!!formErrors.password}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2 pr-10 text-sm",
                      "bg-white text-zinc-900 placeholder:text-zinc-400",
                      "focus:outline-none focus:ring-1",
                      "dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                      formErrors.password
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
                {formErrors.password && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
                )}
                <p className="mt-1 text-xs text-zinc-400">
                  Min. 8 characters. Leave empty to keep current password.
                </p>
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="edit-role"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit-role"
                  value={form.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <input
                  id="edit-isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                />
                <label
                  htmlFor="edit-isActive"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Active account
                </label>
              </div>
            </div>

            {/* Form actions */}
            <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-700">
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
                Delete User
              </button>

              <div className="flex items-center gap-3">
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
          </form>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          {/* User info card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Account Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Status</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 font-medium",
                    user.isActive
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400",
                  )}
                >
                  {user.isActive ? (
                    <UserCheck className="h-3.5 w-3.5" />
                  ) : (
                    <UserX className="h-3.5 w-3.5" />
                  )}
                  {user.isActive ? "Active" : "Suspended"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Role</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {user.role.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Last Login</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {formatDate(user.lastLoginAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Created</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Updated</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {formatDate(user.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Activity log */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-zinc-500" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Recent Activity
              </h3>
            </div>

            {activity.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <Shield className="mb-2 h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  No recent activity
                </p>
              </div>
            ) : (
              <div className="max-h-80 space-y-0 overflow-y-auto">
                {activity.map((entry) => (
                  <div
                    key={entry.id}
                    className="border-b border-zinc-100 py-2.5 last:border-0 dark:border-zinc-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                          {entry.action.replace(/_/g, " ")}
                        </p>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {entry.resource}
                          {entry.resourceId && ` — ${entry.resourceId}`}
                        </p>
                      </div>
                      <time className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">
                        {formatDate(entry.createdAt)}
                      </time>
                    </div>
                    {entry.details && (
                      <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                        {JSON.stringify(entry.details).slice(0, 80)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                  Delete User
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">{user.name}</strong>?
              Their account will be permanently removed.
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
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
