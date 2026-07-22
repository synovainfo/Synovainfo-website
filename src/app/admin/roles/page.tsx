"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Shield, Users, Loader2, AlertCircle, RefreshCw, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  groupedPermissions: Record<string, string[]>;
  isSystem: boolean;
}

interface RolesResponse {
  roles: Role[];
  resourceGroups: Record<string, string>;
}

const ROLE_ICONS: Record<string, string> = {
  SUPER_ADMIN: "text-purple-600 dark:text-purple-400",
  ADMIN: "text-blue-600 dark:text-blue-400",
  EDITOR: "text-amber-600 dark:text-amber-400",
  VIEWER: "text-zinc-600 dark:text-zinc-400",
};

// ---------------------------------------------------------------------------
// RolesListPage
// ---------------------------------------------------------------------------

export default function RolesListPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [resourceGroups, setResourceGroups] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/roles");
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data: RolesResponse = await res.json();
      setRoles(data.roles);
      setResourceGroups(data.resourceGroups);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Manage roles and their permission sets"
        actions={
          <button
            onClick={fetchRoles}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
              "text-zinc-600 hover:bg-zinc-100",
              "dark:text-zinc-400 dark:hover:bg-zinc-800",
              "transition-colors",
            )}
            title="Refresh"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </button>
        }
      />

      {/* Error banner */}
      {error && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto font-medium hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && roles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Shield className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No roles found
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Roles will appear here once configured.
          </p>
        </div>
      )}

      {/* Role cards */}
      {!loading && roles.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className={cn(
                "group relative rounded-lg border p-5 transition-all duration-200",
                "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600",
              )}
            >
              {/* Icon */}
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    "bg-zinc-100 dark:bg-zinc-800",
                  )}
                >
                  <Shield
                    className={cn(
                      "h-5 w-5",
                      ROLE_ICONS[role.name] ?? "text-zinc-500",
                    )}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {role.name.replace(/_/g, " ")}
                  </h3>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {role.description}
                  </p>
                </div>
              </div>

              {/* User count */}
              <div className="mb-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <Users className="h-3.5 w-3.5" />
                <span>
                  {role.userCount} {role.userCount === 1 ? "user" : "users"}
                </span>
                {role.isSystem && (
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                    System
                  </span>
                )}
              </div>

              {/* Permissions preview */}
              <div className="mb-4">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Permissions ({role.permissions.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(role.groupedPermissions).slice(0, 4).map(([resource]) => (
                    <span
                      key={resource}
                      className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {resourceGroups[resource] ?? resource}
                    </span>
                  ))}
                  {Object.keys(role.groupedPermissions).length > 4 && (
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500">
                      +{Object.keys(role.groupedPermissions).length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <Link
                href={`/admin/roles/${role.id}`}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                  "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                  "dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
                  "transition-colors",
                )}
              >
                <Settings className="h-4 w-4" />
                Edit Permissions
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
