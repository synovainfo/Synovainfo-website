"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Download,
  Trash2,
  RotateCcw,
  Loader2,
  AlertCircle,
  RefreshCw,
  Database,
  HardDrive,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BackupStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

interface Backup {
  id: string;
  filename: string;
  fileSize: number | null;
  type: string;
  status: BackupStatus;
  fileUrl: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

interface BackupsResponse {
  data: Backup[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  BackupStatus,
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string }
> = {
  COMPLETED: {
    icon: CheckCircle2,
    label: "Completed",
    color:
      "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
  },
  RUNNING: {
    icon: Loader2,
    label: "Creating…",
    color:
      "text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
  },
  PENDING: {
    icon: Clock,
    label: "Pending",
    color:
      "text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30",
  },
  FAILED: {
    icon: XCircle,
    label: "Failed",
    color:
      "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
  },
};

function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIdx = 0;
  while (size >= 1024 && unitIdx < units.length - 1) {
    size /= 1024;
    unitIdx++;
  }
  return `${size.toFixed(1)} ${units[unitIdx]}`;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDuration(startedAt: string | null, completedAt: string | null): string {
  if (!startedAt) return "—";
  const start = new Date(startedAt);
  const end = completedAt ? new Date(completedAt) : new Date();
  const diffMs = end.getTime() - start.getTime();
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}

// ---------------------------------------------------------------------------
// BackupsPage
// ---------------------------------------------------------------------------

export default function BackupsPage() {
  // Data state
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create state
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Backup | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Restore confirmation
  const [restoreTarget, setRestoreTarget] = useState<Backup | null>(null);
  const [restoring, setRestoring] = useState(false);

  // Fetch backups
  const fetchBackups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/backups");
      if (!res.ok) throw new Error("Failed to fetch backups");
      const data: BackupsResponse = await res.json();
      setBackups(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  // Poll for running backups
  useEffect(() => {
    const hasRunning = backups.some((b) => b.status === "RUNNING");
    if (!hasRunning) return;

    const interval = setInterval(fetchBackups, 3000);
    return () => clearInterval(interval);
  }, [backups, fetchBackups]);

  // Create backup
  const handleCreateBackup = async () => {
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch("/api/admin/backups", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Failed to create backup");
      }
      await fetchBackups();
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create backup",
      );
    } finally {
      setCreating(false);
    }
  };

  // Delete backup
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/backups/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Failed to delete backup");
      }
      setDeleteTarget(null);
      fetchBackups();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // Restore backup (stub)
  const handleRestore = async () => {
    if (!restoreTarget) return;
    setRestoring(true);
    // Simulate restore — in production this would call an API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRestoring(false);
    setRestoreTarget(null);
  };

  const StatusBadge = ({ status }: { status: BackupStatus }) => {
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.FAILED;
    const Icon = config.icon;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
          config.color,
        )}
      >
        <Icon
          className={cn(
            "h-3.5 w-3.5",
            status === "RUNNING" && "animate-spin",
          )}
        />
        {config.label}
      </span>
    );
  };

  return (
    <div>
      <PageHeader
        title="Backups"
        description="Create and manage database backups"
        actions={
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-500",
              "transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
              creating && "cursor-not-allowed opacity-70",
            )}
          >
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Backup
              </>
            )}
          </button>
        }
      />

      {createError && (
        <div
          className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{createError}</span>
          <button
            onClick={() => setCreateError(null)}
            className="ml-auto font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Error banner ── */}
      {error && (
        <div
          className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && backups.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <HardDrive className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No backups yet
          </h3>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            Create your first backup to protect your data. Backups can be used
            to restore your website in case of emergencies.
          </p>
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500",
              creating && "cursor-not-allowed opacity-70",
            )}
          >
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Backup
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Backup list ── */}
      {!loading && backups.length > 0 && (
        <div className="space-y-3">
          {backups.map((backup) => (
            <div
              key={backup.id}
              className={cn(
                "flex flex-col gap-4 rounded-lg border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between",
                "dark:border-zinc-700",
                "bg-white dark:bg-zinc-900",
                "transition-colors",
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {backup.filename}
                    </p>
                    <StatusBadge status={backup.status} />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{formatFileSize(backup.fileSize)}</span>
                    <span>{backup.type}</span>
                    <span>{formatDate(backup.createdAt)}</span>
                    <span>Duration: {getDuration(backup.startedAt, backup.completedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {backup.status === "COMPLETED" && (
                  <>
                    <button
                      onClick={() => setRestoreTarget(backup)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                        "text-amber-700 hover:bg-amber-50",
                        "dark:text-amber-400 dark:hover:bg-amber-950/30",
                        "transition-colors",
                      )}
                      title="Restore from this backup"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restore
                    </button>
                    <button
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                        "text-blue-700 hover:bg-blue-50",
                        "dark:text-blue-400 dark:hover:bg-blue-950/30",
                        "transition-colors",
                      )}
                      title="Download backup"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </>
                )}
                <button
                  onClick={() => setDeleteTarget(backup)}
                  disabled={backup.status === "RUNNING"}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                    "text-red-600 hover:bg-red-50",
                    "dark:text-red-400 dark:hover:bg-red-950/30",
                    "transition-colors",
                    backup.status === "RUNNING" &&
                      "cursor-not-allowed opacity-50",
                  )}
                  title="Delete backup"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteTarget(null)}
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
                  Delete Backup
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {deleteTarget.filename}
              </strong>
              ? The backup file will be permanently removed and cannot be used
              for restore.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
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
                  "Delete Backup"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Restore Confirmation Modal ── */}
      {restoreTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !restoring && setRestoreTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm restore"
        >
          <div
            className="mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <RotateCcw className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Restore Backup
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This will overwrite current data.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to restore from{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {restoreTarget.filename}
              </strong>
              ? This will replace your current database with the data from this
              backup. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRestoreTarget(null)}
                disabled={restoring}
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
                onClick={handleRestore}
                disabled={restoring}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                  "bg-amber-600 text-white hover:bg-amber-500",
                  "transition-colors",
                  restoring && "cursor-not-allowed opacity-70",
                )}
              >
                {restoring ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Restoring…
                  </>
                ) : (
                  "Restore Backup"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
