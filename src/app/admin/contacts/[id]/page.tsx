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
  Mail,
  Phone,
  Building2,
  User,
  ArrowRight,
  Plus,
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

interface ContactDetail {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  source: string | null;
  landingPage: string | null;
  referrer: string | null;
  browser: string | null;
  device: string | null;
  ipAddress: string | null;
  status: string;
  assignedTo: AssignedUser | null;
  assignedToId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ContactResponse {
  contact: ContactDetail & { activities: ActivityEntry[] };
}

interface UserOption {
  id: string;
  name: string;
  email: string;
}

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"] as const;

const STATUS_BADGE_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  CONTACTED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  QUALIFIED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  PROPOSAL: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  WON: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  LOST: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const NEXT_STATUS: Record<string, string[]> = {
  NEW: ["CONTACTED"],
  CONTACTED: ["QUALIFIED"],
  QUALIFIED: ["PROPOSAL"],
  PROPOSAL: ["WON", "LOST"],
  WON: [],
  LOST: [],
};

// ---------------------------------------------------------------------------
// ContactDetailPage
// ---------------------------------------------------------------------------

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id as string;

  // Data state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Contact data
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);

  // Editable fields
  const [status, setStatus] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [notes, setNotes] = useState("");

  // Convert to lead
  const [converting, setConverting] = useState(false);

  // Fetch contact
  const fetchContact = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/contacts/${contactId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Contact not found");
        throw new Error("Failed to fetch contact");
      }
      const data: ContactResponse = await res.json();
      setContact(data.contact);
      setActivities(data.contact.activities ?? []);
      setStatus(data.contact.status);
      setAssignedToId(data.contact.assignedToId ?? "");
      setNotes(data.contact.notes ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [contactId]);

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
    fetchContact();
    fetchUsers();
  }, [fetchContact, fetchUsers]);

  // Save changes
  const handleSave = async () => {
    setServerError(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      const body: Record<string, unknown> = {};
      if (status !== contact?.status) body.status = status;
      if (assignedToId !== (contact?.assignedToId ?? ""))
        body.assignedToId = assignedToId || null;
      if (notes !== (contact?.notes ?? "")) body.notes = notes;

      if (Object.keys(body).length === 0) {
        setSuccessMessage("No changes to save");
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/admin/contacts/${contactId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to update");
      }

      setSuccessMessage("Contact updated successfully");
      fetchContact();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setSaving(false);
    }
  };

  // Convert to lead
  const handleConvertToLead = async () => {
    if (!contact) return;
    setConverting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: contact.company || contact.name,
          contactName: contact.name,
          email: contact.email,
          phone: contact.phone ?? "",
          serviceInterest: contact.service ?? "",
          stage: status,
          source: "contact_conversion",
          notes: `Converted from contact: ${contact.name}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Failed to convert to lead");
      }

      setSuccessMessage("Contact converted to lead successfully");
      router.push(`/admin/leads/${data.lead.id}`);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Conversion failed",
      );
    } finally {
      setConverting(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    setDeleting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/admin/contacts/${contactId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Failed to delete");
      }
      router.push("/admin/contacts");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Delete failed",
      );
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
          href="/admin/contacts"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Contacts
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchContact}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!contact) return null;

  const nextStatuses = NEXT_STATUS[status] ?? [];

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/contacts"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Contacts
      </Link>

      <PageHeader
        title={contact.name}
        description={contact.company ? `${contact.company} — Contact Details` : "Contact Details"}
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
          {/* Contact Info Card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Contact Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Full Name
                </label>
                <p className="text-sm text-zinc-900 dark:text-zinc-100">
                  {contact.name}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Company
                </label>
                <p className="text-sm text-zinc-900 dark:text-zinc-100">
                  {contact.company || "—"}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Email
                </label>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  {contact.email}
                  <Mail className="h-3 w-3" />
                </a>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Phone
                </label>
                <p className="inline-flex items-center gap-1 text-sm text-zinc-900 dark:text-zinc-100">
                  {contact.phone || "—"}
                  <Phone className="h-3 w-3 text-zinc-400" />
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Service Interest
                </label>
                <p className="text-sm text-zinc-900 dark:text-zinc-100">
                  {contact.service || "—"}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Source
                </label>
                <p className="text-sm text-zinc-900 dark:text-zinc-100">
                  {contact.source || "Direct"}
                </p>
              </div>
            </div>

            {contact.message && (
              <div className="mt-4">
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Original Message
                </label>
                <p className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300">
                  {contact.message}
                </p>
              </div>
            )}
          </div>

          {/* Status Workflow Card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Status Workflow
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
                  STATUS_BADGE_COLORS[status] ??
                    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
                )}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </span>
              {nextStatuses.length > 0 && (
                <>
                  <ArrowRight className="h-4 w-4 text-zinc-400" />
                  <div className="flex gap-2">
                    {nextStatuses.map((ns) => (
                      <button
                        key={ns}
                        onClick={() => setStatus(ns)}
                        disabled={saving}
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
                          STATUS_BADGE_COLORS[ns] ??
                            "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
                          "hover:opacity-80 cursor-pointer",
                          saving && "cursor-not-allowed opacity-50",
                        )}
                      >
                        {ns.charAt(0) + ns.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {status === "WON" || status === "LOST" ? (
                <span className="text-xs text-zinc-400">(Final stage)</span>
              ) : null}
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
              placeholder="Add internal notes about this contact..."
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
          {/* Status & Assignee Card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Management
            </h3>
            <div className="space-y-4">
              {/* Status dropdown */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0) + s.slice(1).toLowerCase()}
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

              {/* Convert to Lead */}
              <button
                onClick={handleConvertToLead}
                disabled={converting}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                  "bg-green-600 text-white hover:bg-green-500",
                  "transition-colors",
                  converting && "cursor-not-allowed opacity-70",
                )}
              >
                {converting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Converting…
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Convert to Lead
                  </>
                )}
              </button>
            </div>

            {/* Save button */}
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
                title="Delete contact"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Contact details card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Created</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {formatDate(contact.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Updated</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {formatDate(contact.updatedAt)}
                </span>
              </div>
              {contact.landingPage && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Landing Page</span>
                  <span className="max-w-[180px] truncate text-right text-zinc-700 dark:text-zinc-300">
                    {contact.landingPage}
                  </span>
                </div>
              )}
              {contact.referrer && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Referrer</span>
                  <span className="max-w-[180px] truncate text-right text-zinc-700 dark:text-zinc-300">
                    {contact.referrer}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-zinc-500" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Activity
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
              <div className="max-h-80 space-y-0 overflow-y-auto">
                {activities.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "border-b border-zinc-100 py-2.5 last:border-0 dark:border-zinc-800",
                      idx === 0 && "pt-0",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
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
                  Delete Contact
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {contact.name}
              </strong>
              ? Their contact record will be permanently removed.
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
                  "Delete Contact"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
