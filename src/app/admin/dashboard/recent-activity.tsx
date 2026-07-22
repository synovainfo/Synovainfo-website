"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Mail, ClipboardList, ArrowRight, Inbox } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────

export interface ContactItem {
  id: string;
  name: string;
  company: string | null;
  email: string;
  service: string | null;
  status: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  createdAt: string;
  user: { name: string } | null;
}

interface RecentActivityProps {
  contacts: ContactItem[];
  auditLogs: AuditLogItem[];
  isLoading?: boolean;
}

// ─── Relative Time Helper ───────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs < 60) return "just now";
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Status Badge ────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  CONTACTED:
    "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  QUALIFIED:
    "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  PROPOSAL:
    "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  WON: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  LOST: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ??
          "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
      )}
    >
      {status}
    </span>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────

function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-3 flex-1 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-12 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  message,
}: {
  icon: React.ComponentType<{ className?: string }>;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Icon
        className="mb-2 h-8 w-8 text-zinc-300 dark:text-zinc-600"
        aria-hidden="true"
      />
      <p className="text-sm text-zinc-400 dark:text-zinc-500">{message}</p>
    </div>
  );
}

// ─── Table Section ───────────────────────────────────────────────────

function ContactTable({
  contacts,
  isLoading,
}: {
  contacts: ContactItem[];
  isLoading: boolean;
}) {
  if (isLoading) return <TableSkeleton rows={4} />;
  if (contacts.length === 0) {
    return <EmptyState icon={Inbox} message="No contact inquiries yet" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-100 dark:border-white/5">
            <th className="pb-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400">
              Name
            </th>
            <th className="hidden pb-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400 sm:table-cell">
              Company
            </th>
            <th className="pb-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400">
              Status
            </th>
            <th className="pb-2 text-right font-medium text-zinc-500 dark:text-zinc-400">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
          {contacts.map((contact) => (
            <tr key={contact.id} className="group hover:bg-zinc-50 dark:hover:bg-white/[0.02]">
              <td className="py-3 pr-4">
                <div className="font-medium text-zinc-900 dark:text-white">
                  {contact.name}
                </div>
                <div className="text-xs text-zinc-400 dark:text-zinc-500">
                  {contact.email}
                </div>
              </td>
              <td className="hidden py-3 pr-4 text-zinc-600 dark:text-zinc-400 sm:table-cell">
                {contact.company ?? "—"}
              </td>
              <td className="py-3 pr-4">
                <StatusBadge status={contact.status} />
              </td>
              <td className="whitespace-nowrap py-3 text-right text-xs text-zinc-400 dark:text-zinc-500">
                {formatRelativeTime(contact.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AuditLogTable({
  logs,
  isLoading,
}: {
  logs: AuditLogItem[];
  isLoading: boolean;
}) {
  if (isLoading) return <TableSkeleton rows={3} />;
  if (logs.length === 0) {
    return (
      <EmptyState icon={ClipboardList} message="No recent activity" />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-100 dark:border-white/5">
            <th className="pb-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400">
              Action
            </th>
            <th className="hidden pb-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400 md:table-cell">
              Resource
            </th>
            <th className="hidden pb-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400 sm:table-cell">
              User
            </th>
            <th className="pb-2 text-right font-medium text-zinc-500 dark:text-zinc-400">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
          {logs.map((log) => (
            <tr key={log.id} className="group hover:bg-zinc-50 dark:hover:bg-white/[0.02]">
              <td className="py-3 pr-4">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      log.action.toLowerCase().includes("create")
                        ? "bg-emerald-500"
                        : log.action.toLowerCase().includes("delete")
                          ? "bg-red-500"
                          : log.action.toLowerCase().includes("update")
                            ? "bg-amber-500"
                            : "bg-blue-500",
                    )}
                    aria-hidden="true"
                  />
                  <span className="capitalize text-zinc-900 dark:text-white">
                    {log.action.toLowerCase()}
                  </span>
                </span>
              </td>
              <td className="hidden py-3 pr-4 text-zinc-600 dark:text-zinc-400 md:table-cell">
                <span className="capitalize">{log.resource.replace(/_/g, " ")}</span>
              </td>
              <td className="hidden py-3 pr-4 text-zinc-600 dark:text-zinc-400 sm:table-cell">
                {log.user?.name ?? "System"}
              </td>
              <td className="whitespace-nowrap py-3 text-right text-xs text-zinc-400 dark:text-zinc-500">
                {formatRelativeTime(log.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Recent Activity ─────────────────────────────────────────────────

export function RecentActivity({
  contacts,
  auditLogs,
  isLoading = false,
}: RecentActivityProps) {
  return (
    <div className="space-y-6">
      {/* Recent Contacts */}
      <div
        className={cn(
          "rounded-xl border transition-all duration-300",
          "border-zinc-200/80 dark:border-white/5",
          "bg-white/80 backdrop-blur-xl dark:bg-[#0A0F1A]/95",
          "p-5",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-zinc-500" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Recent Contact Inquiries
            </h3>
          </div>
          <Link
            href="/admin/contacts"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors"
          >
            View All
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
        <ContactTable contacts={contacts} isLoading={isLoading} />
      </div>

      {/* Recent Audit Logs */}
      <div
        className={cn(
          "rounded-xl border transition-all duration-300",
          "border-zinc-200/80 dark:border-white/5",
          "bg-white/80 backdrop-blur-xl dark:bg-[#0A0F1A]/95",
          "p-5",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-zinc-500" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          <Link
            href="/admin/audit-logs"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors"
          >
            View All
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
        <AuditLogTable logs={auditLogs} isLoading={isLoading} />
      </div>
    </div>
  );
}
