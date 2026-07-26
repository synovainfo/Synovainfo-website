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
  Trash2,
  Send,
  Save,
  BarChart3,
  Users,
  Eye,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignStats {
  totalSends: number;
  totalOpens: number;
  openRate: number;
}

interface Campaign {
  id: string;
  subject: string;
  body: string;
  status: string;
  recipientCount: number;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  stats?: CampaignStats;
}

interface CampaignResponse {
  campaign: Campaign;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const campaignFormSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  body: z.string().min(1, "Body is required"),
});

type CampaignForm = z.infer<typeof campaignFormSchema>;

// ---------------------------------------------------------------------------
// CampaignEditorPage
// ---------------------------------------------------------------------------

export default function CampaignEditorPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const isNew = campaignId === "new";

  // Data state
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState<string>("draft");
  const [campaignStats, setCampaignStats] = useState<CampaignStats | null>(null);
  const [sentAt, setSentAt] = useState<string | null>(null);
  const [recipientCount, setRecipientCount] = useState(0);

  // Form
  const [form, setForm] = useState<CampaignForm>({
    subject: "",
    body: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});

  // Fetch campaign (edit mode)
  const fetchCampaign = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${campaignId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Campaign not found");
        throw new Error("Failed to fetch campaign");
      }
      const data: CampaignResponse = await res.json();
      const camp = data.campaign;
      setForm({
        subject: camp.subject,
        body: camp.body,
      });
      setCampaignStatus(camp.status);
      setSentAt(camp.sentAt);
      setRecipientCount(camp.recipientCount);
      if (camp.stats) {
        setCampaignStats(camp.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [campaignId, isNew]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  // Form change handler
  const handleChange = (field: keyof CampaignForm, value: string) => {
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

  // Save draft handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const result = campaignFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setFormErrors(fieldErrors);
      return;
    }

    setFormErrors({});
    setSaving(true);

    try {
      if (isNew) {
        // Create new campaign as draft
        const res = await fetch("/api/admin/newsletter/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...result.data, status: "draft" }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message ?? data.error ?? "Failed to create campaign");
        }
        setSuccessMessage("Campaign saved as draft");
        // Redirect to edit mode
        router.push(`/admin/newsletter/${data.campaign.id}`);
      } else {
        // Update existing campaign
        const res = await fetch(`/api/admin/newsletter/campaigns/${campaignId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message ?? data.error ?? "Failed to save campaign");
        }
        setSuccessMessage("Campaign saved");
        fetchCampaign();
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  // Send campaign handler
  const handleSend = async () => {
    if (isNew) {
      // First save as draft, then send
      setServerError(null);
      const result = campaignFormSchema.safeParse(form);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as string;
          if (!fieldErrors[field]) fieldErrors[field] = issue.message;
        }
        setFormErrors(fieldErrors);
        setShowSendConfirm(false);
        return;
      }

      setSending(true);
      try {
        // Create as draft first
        const createRes = await fetch("/api/admin/newsletter/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...result.data, status: "draft" }),
        });
        const createData = await createRes.json();
        if (!createRes.ok) {
          throw new Error(createData.message ?? "Failed to create campaign");
        }

        // Then send it
        const sendRes = await fetch(
          `/api/admin/newsletter/campaigns/${createData.campaign.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "send" }),
          },
        );
        const sendData = await sendRes.json();
        if (!sendRes.ok) {
          throw new Error(sendData.message ?? "Failed to send campaign");
        }
        setSuccessMessage(sendData.message ?? "Campaign sent successfully");
        router.push(`/admin/newsletter/${createData.campaign.id}`);
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Failed to send campaign");
      } finally {
        setSending(false);
        setShowSendConfirm(false);
      }
    } else {
      // Send existing draft
      setSending(true);
      setServerError(null);
      try {
        const res = await fetch(`/api/admin/newsletter/campaigns/${campaignId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "send" }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message ?? data.error ?? "Failed to send campaign");
        }
        setSuccessMessage(data.message ?? "Campaign sent successfully");
        fetchCampaign();
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Failed to send campaign");
      } finally {
        setSending(false);
        setShowSendConfirm(false);
      }
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${campaignId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Failed to delete campaign");
      }
      router.push("/admin/newsletter");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Status badge
  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
      sent: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
          styles[status] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
        )}
      >
        {status === "sent" && <CheckCircle2 className="h-3 w-3" />}
        {status === "draft" && <Eye className="h-3 w-3" />}
        {status === "scheduled" && <Clock className="h-3 w-3" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
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
          href="/admin/newsletter"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Newsletter
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchCampaign}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const canSend = campaignStatus === "draft" || isNew;
  const canEdit = campaignStatus === "draft" || isNew;
  const isSent = campaignStatus === "sent";

  return (
    <div>
      <Link
        href="/admin/newsletter"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Newsletter
      </Link>

      <PageHeader
        title={isNew ? "New Campaign" : "Edit Campaign"}
        description={isNew ? "Create a new email campaign" : form.subject || "Untitled campaign"}
        actions={
          !isNew && (
            <div className="flex items-center gap-2">
              <StatusBadge status={campaignStatus} />
              {isSent && campaignStats && (
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  <Users className="inline h-3.5 w-3.5 mr-1" />
                  {recipientCount} recipients
                </span>
              )}
            </div>
          )
        }
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

      {/* ── Sent Campaign Stats ── */}
      {isSent && campaignStats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Sent</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                  {campaignStats.totalSends}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Send className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Opens</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                  {campaignStats.totalOpens}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <Eye className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Open Rate</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                  {campaignStats.openRate}%
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </div>
          {sentAt && (
            <div className="sm:col-span-3 text-sm text-zinc-500 dark:text-zinc-400">
              Sent on {formatDate(sentAt)}
            </div>
          )}
        </div>
      )}

      {/* ── Campaign Form ── */}
      <form onSubmit={handleSave} noValidate className="max-w-3xl space-y-6">
        {/* Campaign Details */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Campaign Details
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                id="subject"
                type="text"
                value={form.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                placeholder="Enter campaign subject"
                disabled={!canEdit}
                aria-invalid={!!formErrors.subject}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:border-zinc-600",
                  formErrors.subject && "border-red-400 focus:border-red-500 focus:ring-red-500",
                  !canEdit && "cursor-not-allowed opacity-70",
                )}
              />
              {formErrors.subject && <p className="mt-1 text-xs text-red-500">{formErrors.subject}</p>}
            </div>

            <div>
              <label htmlFor="body" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Body <span className="text-red-500">*</span>
              </label>
              <textarea
                id="body"
                rows={16}
                value={form.body}
                onChange={(e) => handleChange("body", e.target.value)}
                placeholder="Write your campaign content here... HTML is supported."
                disabled={!canEdit}
                aria-invalid={!!formErrors.body}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:border-zinc-600 resize-y min-h-[300px] font-mono",
                  formErrors.body && "border-red-400 focus:border-red-500 focus:ring-red-500",
                  !canEdit && "cursor-not-allowed opacity-70",
                )}
              />
              {formErrors.body && <p className="mt-1 text-xs text-red-500">{formErrors.body}</p>}
              <p className="mt-1 text-xs text-zinc-400">
                Supports HTML content for rich email formatting.
              </p>
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-700">
          <div>
            {!isNew && canEdit && (
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
                Delete Campaign
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/newsletter"
              className={cn(
                "rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium",
                "text-zinc-700 hover:bg-zinc-50",
                "dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
                "transition-colors",
              )}
            >
              Cancel
            </Link>
            {canSend && (
              <button
                type="button"
                onClick={() => setShowSendConfirm(true)}
                disabled={sending}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                  "bg-green-600 text-white hover:bg-green-500",
                  "transition-colors",
                  sending && "cursor-not-allowed opacity-70",
                )}
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {isNew ? "Create & Send" : "Send Campaign"}
                  </>
                )}
              </button>
            )}
            {canEdit && (
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
                  <>
                    <Save className="h-4 w-4" />
                    {isNew ? "Save Draft" : "Save Changes"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* ── Send Confirmation Modal ── */}
      {showSendConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !sending && setShowSendConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm send"
        >
          <div
            className="mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Send Campaign
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to send{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                &ldquo;{form.subject || "Untitled"}&rdquo;
              </strong>
              ? This will deliver the campaign to all active subscribers immediately.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSendConfirm(false)}
                disabled={sending}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
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
                  Delete Campaign
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                &ldquo;{form.subject || "Untitled campaign"}&rdquo;
              </strong>
              ? This will permanently remove this campaign.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete Campaign"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
