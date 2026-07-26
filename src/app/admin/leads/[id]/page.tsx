"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Clock,
  Building2,
  DollarSign,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AssignedUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface ActivityEntry {
  id: string;
  type: string;
  description: string | null;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface LeadDetail {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  serviceInterest: string | null;
  value: number | null;
  stage: string;
  assignedTo: AssignedUser | null;
  assignedToId: string | null;
  source: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LeadResponse {
  lead: LeadDetail & { activities: ActivityEntry[] };
}

interface UserOption {
  id: string;
  name: string;
  email: string;
}

const STAGES = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"] as const;

const STAGE_BADGE_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  CONTACTED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  QUALIFIED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  PROPOSAL: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  WON: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  LOST: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STAGE_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  PROPOSAL: "Proposal",
  WON: "Won",
  LOST: "Lost",
};

// ---------------------------------------------------------------------------
// LeadDetailPage
// ---------------------------------------------------------------------------

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  // Data state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Lead data
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);

  // Editable fields
  const [stage, setStage] = useState("");
  const [value, setValue] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [notes, setNotes] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceInterest, setServiceInterest] = useState("");

  // Fetch lead
  const fetchLead = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Lead not found");
        throw new Error("Failed to fetch lead");
      }
      const data: LeadResponse = await res.json();
      setLead(data.lead);
      setActivities(data.lead.activities ?? []);
      setStage(data.lead.stage);
      setValue(data.lead.value != null ? String(data.lead.value) : "");
      setAssignedToId(data.lead.assignedToId ?? "");
      setNotes(data.lead.notes ?? "");
      setCompanyName(data.lead.companyName);
      setContactName(data.lead.contactName ?? "");
      setEmail(data.lead.email ?? "");
      setPhone(data.lead.phone ?? "");
      setServiceInterest(data.lead.serviceInterest ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  // Fetch users for assignee dropdown
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users?pageSize=100");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users ?? []);
      }
    } catch {
      // Non-critical
    }
  }, []);

  useEffect(() => {
    fetchLead();
    fetchUsers();
  }, [fetchLead, fetchUsers]);

  // Save changes
  const handleSave = async () => {
    setServerError(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      const body: Record<string, unknown> = {};
      if (stage !== lead?.stage) body.stage = stage;
      const numValue = value ? parseInt(value, 10) : null;
      if (numValue !== lead?.value) body.value = numValue;
      if (assignedToId !== (lead?.assignedToId ?? ""))
        body.assignedToId = assignedToId || null;
      if (notes !== (lead?.notes ?? "")) body.notes = notes;
      if (companyName !== lead?.companyName) body.companyName = companyName;
      if (contactName !== (lead?.contactName ?? ""))
        body.contactName = contactName || undefined;
      if (email !== (lead?.email ?? "")) body.email = email || undefined;
      if (phone !== (lead?.phone ?? "")) body.phone = phone || undefined;
      if (serviceInterest !== (lead?.serviceInterest ?? ""))
        body.serviceInterest = serviceInterest || undefined;

      if (Object.keys(body).length === 0) {
        setSuccessMessage("No changes to save");
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to update");
      }

      setSuccessMessage("Lead updated successfully");
      fetchLead();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    setDeleting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Failed to delete");
      }
      router.push("/admin/leads");
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

  // Format currency
  const formatCurrency = (val: number | null) => {
    if (val == null) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Stage progress calculation
  const stageIndex = STAGES.indexOf(stage as typeof STAGES[number]);
  const stageProgress = stageIndex >= 0 ? ((stageIndex + 1) / STAGES.length) * 100 : 0;

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
          href="/admin/leads"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Pipeline
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchLead}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/leads"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Pipeline
      </Link>

      <PageHeader
        title={lead.companyName}
        description="Lead details and pipeline management"
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
        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Details Card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Lead Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 dark:border-zinc-600",
                  )}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 dark:border-zinc-600",
                  )}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 dark:border-zinc-600",
                  )}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 dark:border-zinc-600",
                  )}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Service Interest
                </label>
                <input
                  type="text"
                  value={serviceInterest}
                  onChange={(e) => setServiceInterest(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 dark:border-zinc-600",
                  )}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Value (USD)
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 dark:border-zinc-600",
                  )}
                  min={0}
                />
              </div>
            </div>

            {/* Stage Progress Bar */}
            <div className="mt-6">
              <label className="mb-2 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Pipeline Progress
              </label>
              <div className="flex items-center gap-2 mb-2">
                {STAGES.map((s, idx) => (
                  <div key={s} className="flex items-center gap-0">
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                        idx <= stageIndex
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400",
                      )}
                    >
                      {idx + 1}
                    </span>
                    {idx < STAGES.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 w-6 sm:w-10",
                          idx < stageIndex
                            ? "bg-blue-600"
                            : "bg-zinc-200 dark:bg-zinc-700",
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                {STAGES.map((s, i) => (
                  <span
                    key={s}
                    className={cn(
                      i <= stageIndex && "font-medium text-blue-600 dark:text-blue-400",
                    )}
                  >
                    {STAGE_LABELS[s] ?? s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add internal notes about this lead..."
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm",
                "bg-white text-zinc-900 placeholder:text-zinc-400",
                "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                "dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                "border-zinc-300 dark:border-zinc-600",
              )}
            />
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          {/* Management Card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Management
            </h3>
            <div className="space-y-4">
              {/* Stage dropdown */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Stage
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {STAGE_LABELS[s] ?? s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee dropdown */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Assigned To
                </label>
                <select
                  value={assignedToId}
                  onChange={(e) => setAssignedToId(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save / Delete buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className={cn(
                  "flex-1 rounded-lg px-4 py-2 text-sm font-medium",
                  "bg-blue-600 text-white hover:bg-blue-500",
                  "transition-colors",
                  saving && "cursor-not-allowed opacity-70",
                )}
              >
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  "text-red-600 hover:bg-red-50",
                  "dark:text-red-400 dark:hover:bg-red-950/30",
                  "transition-colors",
                )}
                title="Delete lead"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Details Card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Stage</span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    STAGE_BADGE_COLORS[stage] ??
                      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
                  )}
                >
                  {STAGE_LABELS[stage] ?? stage}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Value</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(lead.value)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Source</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {lead.source || "Direct"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Created</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {formatDate(lead.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Updated</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {formatDate(lead.updatedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Activities</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {activities.length}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-zinc-500" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Activity Timeline
              </h3>
            </div>

            {activities.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <Clock className="mb-2 h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  No activity yet
                </p>
              </div>
            ) : (
              <div className="relative max-h-80 space-y-0 overflow-y-auto">
                {/* Timeline line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-zinc-200 dark:bg-zinc-700" />

                {activities.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "relative flex items-start gap-3 pb-4 pl-0",
                      idx === 0 && "pt-0",
                    )}
                  >
                    {/* Dot */}
                    <div className="relative z-10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full border-2 border-blue-500 bg-white dark:bg-zinc-900" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                            {entry.type.replace(/_/g, " ")}
                          </p>
                          {entry.description && (
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                              {entry.description}
                            </p>
                          )}
                          <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                            by {entry.createdBy.name}
                          </p>
                        </div>
                        <time className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">
                          {formatDate(entry.createdAt)}
                        </time>
                      </div>
                    </div>
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
                  Delete Lead
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete the lead for{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {lead.companyName}
              </strong>
              ? All associated data will be permanently removed.
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
                  "Delete Lead"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
