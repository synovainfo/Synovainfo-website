"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Shield,
  ChevronDown,
  ChevronRight,
  Save,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RoleDetail {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: string[];
  groupedPermissions: Record<string, string[]>;
  users: { id: string; name: string; email: string; isActive: boolean }[];
}

interface RoleResponse {
  role: RoleDetail;
}

// ---------------------------------------------------------------------------
// Permission definitions (mirrors the server-side Permissions constant)
// ---------------------------------------------------------------------------

const PERMISSION_ACTIONS = [
  { value: "create", label: "Create" },
  { value: "read", label: "Read" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "publish", label: "Publish" },
  { value: "manage", label: "Manage" },
  { value: "export", label: "Export" },
  { value: "send", label: "Send" },
];

const RESOURCE_GROUPS: Record<string, { label: string; actions: string[] }> = {
  pages: {
    label: "Pages",
    actions: ["create", "read", "update", "delete", "publish"],
  },
  services: {
    label: "Services",
    actions: ["create", "read", "update", "delete", "publish"],
  },
  industries: {
    label: "Industries",
    actions: ["create", "read", "update", "delete", "publish"],
  },
  blog: {
    label: "Blog",
    actions: ["create", "read", "update", "delete", "publish"],
  },
  media: {
    label: "Media",
    actions: ["create", "read", "update", "delete"],
  },
  users: {
    label: "Users",
    actions: ["create", "read", "update", "delete", "manage"],
  },
  roles: {
    label: "Roles",
    actions: ["create", "read", "update", "delete", "manage"],
  },
  settings: {
    label: "Settings",
    actions: ["read", "update", "manage"],
  },
  audit: {
    label: "Audit Logs",
    actions: ["read", "export"],
  },
  leads: {
    label: "Leads",
    actions: ["read", "update", "export", "manage"],
  },
  newsletter: {
    label: "Newsletter",
    actions: ["create", "read", "update", "delete", "send"],
  },
  forms: {
    label: "Forms",
    actions: ["create", "read", "update", "delete"],
  },
  seo: {
    label: "SEO",
    actions: ["read", "update", "manage"],
  },
  "site-config": {
    label: "Site Config",
    actions: ["read", "update", "manage"],
  },
  theme: {
    label: "Theme",
    actions: ["read", "update", "manage"],
  },
};

// ---------------------------------------------------------------------------
// RolesEditPage
// ---------------------------------------------------------------------------

export default function RoleEditPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;

  const [role, setRole] = useState<RoleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Permission selections
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState(false);

  // Fetch role
  const fetchRole = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/roles/${roleId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Role not found");
        throw new Error("Failed to fetch role");
      }
      const data: RoleResponse = await res.json();
      setRole(data.role);
      setSelectedPermissions(new Set(data.role.permissions));

      // Expand all groups by default
      const resources = Object.keys(RESOURCE_GROUPS);
      setExpandedGroups(new Set(resources));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    fetchRole();
  }, [fetchRole]);

  // Toggle a single permission
  const togglePermission = (perm: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(perm)) {
        next.delete(perm);
      } else {
        next.add(perm);
      }
      return next;
    });
    setDirty(true);
    setSuccessMessage(null);
  };

  // Toggle all permissions for a resource
  const toggleResource = (resource: string, actions: string[]) => {
    const perms = actions.map((a) => `${resource}:${a}`);
    const allSelected = perms.every((p) => selectedPermissions.has(p));

    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      for (const perm of perms) {
        if (allSelected) {
          next.delete(perm);
        } else {
          next.add(perm);
        }
      }
      return next;
    });
    setDirty(true);
    setSuccessMessage(null);
  };

  // Toggle resource group expansion
  const toggleGroup = (resource: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(resource)) {
        next.delete(resource);
      } else {
        next.add(resource);
      }
      return next;
    });
  };

  // Save handler
  const handleSave = async () => {
    setSaving(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/admin/roles/${roleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permissions: Array.from(selectedPermissions),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to save permissions");
      }

      setSuccessMessage(data.message ?? "Permissions updated successfully");
      setDirty(false);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  // Get resource state
  const getResourceState = (resource: string, actions: string[]) => {
    const perms = actions.map((a) => `${resource}:${a}`);
    const selected = perms.filter((p) => selectedPermissions.has(p));
    if (selected.length === 0) return "none";
    if (selected.length === perms.length) return "all";
    return "partial";
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
  if (error || !role) {
    return (
      <div>
        <Link
          href="/admin/roles"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Roles
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error ?? "Role not found"}
          </h3>
          <Link
            href="/admin/roles"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Back to roles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/roles"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Roles
      </Link>

      <PageHeader
        title={`${role.name.replace(/_/g, " ")} Permissions`}
        description={role.description || "Configure resource permissions for this role"}
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

      {/* Role info bar */}
      <div className="mb-6 flex items-center gap-4 rounded-lg border border-zinc-200 bg-white px-5 py-3 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {role.name.replace(/_/g, " ")}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {role.permissions.length} permissions assigned
            {role.users.length > 0 && ` · ${role.users.length} users`}
            {role.isSystem && " · System role"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Users className="h-3.5 w-3.5" />
          {role.users.length} user{(role.users.length ?? 0) !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Permission groups */}
      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-700">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Resource Permissions
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Toggle individual permissions or use the group toggle to select all/none per resource
          </p>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {Object.entries(RESOURCE_GROUPS).map(([resource, config]) => {
            const state = getResourceState(resource, config.actions);
            const isExpanded = expandedGroups.has(resource);

            return (
              <div key={resource}>
                {/* Group header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(resource)}
                  className={cn(
                    "flex w-full items-center gap-3 px-5 py-3 text-left transition-colors",
                    "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                  )}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
                  )}

                  <span className="flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {config.label}
                  </span>

                  {/* Select all / none */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleResource(resource, config.actions);
                    }}
                    className={cn(
                      "rounded px-2 py-0.5 text-xs font-medium transition-colors",
                      state === "all"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                        : state === "partial"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",
                    )}
                  >
                    {state === "all"
                      ? "All"
                      : state === "partial"
                        ? "Partial"
                        : "None"}
                  </button>

                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {config.actions.length}
                  </span>
                </button>

                {/* Permission checkboxes */}
                {isExpanded && (
                  <div className="grid grid-cols-2 gap-1 px-5 pb-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {config.actions.map((action) => {
                      const perm = `${resource}:${action}`;
                      const isSelected = selectedPermissions.has(perm);
                      return (
                        <label
                          key={perm}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors",
                            "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                            isSelected && "bg-blue-50 dark:bg-blue-950/20",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => togglePermission(perm)}
                            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                          />
                          <span
                            className={cn(
                              "text-sm",
                              isSelected
                                ? "font-medium text-blue-700 dark:text-blue-400"
                                : "text-zinc-600 dark:text-zinc-400",
                            )}
                          >
                            {PERMISSION_ACTIONS.find((a) => a.value === action)?.label ?? action}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save button */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          {dirty && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              You have unsaved changes
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/roles"
            className={cn(
              "rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium",
              "text-zinc-700 hover:bg-zinc-50",
              "dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
              "transition-colors",
            )}
          >
            Back to Roles
          </Link>
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
                Save Permissions
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
