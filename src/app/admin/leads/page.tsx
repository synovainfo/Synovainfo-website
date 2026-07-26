"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
  User,
  DollarSign,
  Building2,
  ChevronRight,
  MoreHorizontal,
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

interface Lead {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  serviceInterest: string | null;
  value: number | null;
  stage: string;
  assignedTo: AssignedUser | null;
  source: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    activities: number;
  };
}

interface LeadsResponse {
  leads: Record<string, Lead[]>;
  totals: Record<string, number>;
}

const STAGES = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"] as const;

const STAGE_COLORS: Record<string, { header: string; card: string; label: string }> = {
  NEW: {
    header: "border-t-blue-500 bg-blue-50/50 dark:bg-blue-950/20",
    card: "border-blue-200 dark:border-blue-800",
    label: "text-blue-700 dark:text-blue-400",
  },
  CONTACTED: {
    header: "border-t-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
    card: "border-amber-200 dark:border-amber-800",
    label: "text-amber-700 dark:text-amber-400",
  },
  QUALIFIED: {
    header: "border-t-purple-500 bg-purple-50/50 dark:bg-purple-950/20",
    card: "border-purple-200 dark:border-purple-800",
    label: "text-purple-700 dark:text-purple-400",
  },
  PROPOSAL: {
    header: "border-t-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20",
    card: "border-indigo-200 dark:border-indigo-800",
    label: "text-indigo-700 dark:text-indigo-400",
  },
  WON: {
    header: "border-t-green-500 bg-green-50/50 dark:bg-green-950/20",
    card: "border-green-200 dark:border-green-800",
    label: "text-green-700 dark:text-green-400",
  },
  LOST: {
    header: "border-t-red-500 bg-red-50/50 dark:bg-red-950/20",
    card: "border-red-200 dark:border-red-800",
    label: "text-red-700 dark:text-red-400",
  },
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
// Stage Column Component
// ---------------------------------------------------------------------------

function StageColumn({
  stage,
  leads,
  color,
  onMove,
  onRefresh,
}: {
  stage: string;
  leads: Lead[];
  color: { header: string; card: string; label: string };
  onMove: (leadId: string, newStage: string) => void;
  onRefresh: () => void;
}) {
  const getNextStages = (currentStage: string): string[] => {
    const stageOrder = STAGES.indexOf(currentStage as typeof STAGES[number]);
    if (stageOrder === -1 || stageOrder >= STAGES.length - 1) return [];
    if (currentStage === "PROPOSAL") return ["WON", "LOST"];
    return [STAGES[stageOrder + 1]];
  };

  const getPrevStages = (currentStage: string): string[] => {
    const stageOrder = STAGES.indexOf(currentStage as typeof STAGES[number]);
    if (stageOrder <= 0) return [];
    return [STAGES[stageOrder - 1]];
  };

  const formatCurrency = (val: number | null) => {
    if (val == null) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      className={cn(
        "flex w-[280px] shrink-0 flex-col rounded-lg border border-zinc-200 dark:border-zinc-700",
        "border-t-4",
        color.header,
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-semibold", color.label)}>
            {STAGE_LABELS[stage] ?? stage}
          </span>
          <span
            className={cn(
              "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-medium",
              "bg-white text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
            )}
          >
            {leads.length}
          </span>
        </div>
      </div>

      {/* Cards container */}
      <div className="flex-1 space-y-2 p-2 overflow-y-auto max-h-[calc(100vh-280px)]">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              No leads
            </p>
          </div>
        ) : (
          leads.map((lead) => {
            const nextStages = getNextStages(lead.stage);
            const prevStages = getPrevStages(lead.stage);

            return (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className={cn(
                  "group block rounded-lg border bg-white p-3 shadow-sm transition-all hover:shadow-md",
                  "dark:bg-zinc-900",
                  color.card,
                )}
              >
                {/* Company name */}
                <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {lead.companyName}
                </h4>

                {/* Contact name */}
                {lead.contactName && (
                  <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {lead.contactName}
                  </p>
                )}

                {/* Service & Value */}
                <div className="mt-2 space-y-1">
                  {lead.serviceInterest && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <Building2 className="h-3 w-3 shrink-0" />
                      <span className="truncate">{lead.serviceInterest}</span>
                    </div>
                  )}
                  {lead.value != null && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                      <DollarSign className="h-3 w-3 shrink-0" />
                      <span>{formatCurrency(lead.value)}</span>
                    </div>
                  )}
                </div>

                {/* Assigned user */}
                <div className="mt-2 flex items-center justify-between">
                  {lead.assignedTo ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                        {lead.assignedTo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {lead.assignedTo.name.split(" ")[0]}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        Unassigned
                      </span>
                    </div>
                  )}

                  {/* Stage move buttons */}
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {prevStages.map((ps) => (
                      <button
                        key={ps}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onMove(lead.id, ps);
                        }}
                        className={cn(
                          "rounded p-1 text-xs transition-colors",
                          "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700",
                          "dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
                        )}
                        title={`Move to ${STAGE_LABELS[ps] ?? ps}`}
                      >
                        <ChevronRight className="h-3 w-3 rotate-180" />
                      </button>
                    ))}
                    {nextStages.map((ns) => (
                      <button
                        key={ns}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onMove(lead.id, ns);
                        }}
                        className={cn(
                          "rounded p-1 text-xs transition-colors",
                          "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700",
                          "dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
                        )}
                        title={`Move to ${STAGE_LABELS[ns] ?? ns}`}
                      >
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LeadsKanbanPage
// ---------------------------------------------------------------------------

export default function LeadsKanbanPage() {
  const router = useRouter();

  // Data state
  const [leadsByStage, setLeadsByStage] = useState<Record<string, Lead[]>>({});
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Create lead modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLead, setNewLead] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    serviceInterest: "",
    value: "",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("groupByStage", "true");
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/admin/leads?${params}`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data: LeadsResponse = await res.json();
      setLeadsByStage(data.leads);
      setTotals(data.totals);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Move lead to new stage
  const handleMove = async (leadId: string, newStage: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Failed to move lead");
      }
      fetchLeads();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Move failed");
    }
  };

  // Create lead
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!newLead.companyName.trim()) {
      setCreateError("Company name is required");
      return;
    }

    setCreating(true);
    try {
      const body: Record<string, unknown> = {
        companyName: newLead.companyName,
        contactName: newLead.contactName || undefined,
        email: newLead.email || undefined,
        phone: newLead.phone || undefined,
        serviceInterest: newLead.serviceInterest || undefined,
      };
      if (newLead.value) {
        body.value = parseInt(newLead.value, 10);
      }

      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Failed to create lead");
      }

      setShowCreateModal(false);
      setNewLead({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        serviceInterest: "",
        value: "",
      });
      fetchLeads();
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create lead",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Leads Pipeline"
        description="Track and manage your sales pipeline"
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-500",
              "transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
            )}
          >
            <Plus className="h-4 w-4" />
            New Lead
          </button>
        }
      />

      {/* ── Search & Controls ── */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full rounded-lg border border-zinc-200 py-2 pl-10 pr-3 text-sm",
              "bg-white text-zinc-900 placeholder:text-zinc-400",
              "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
            )}
          />
        </div>
        <button
          onClick={fetchLeads}
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
      </div>

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

      {/* ── Kanban Board ── */}
      {!loading && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              leads={leadsByStage[stage] ?? []}
              color={
                STAGE_COLORS[stage] ?? {
                  header: "border-t-zinc-500 bg-zinc-50/50",
                  card: "border-zinc-200",
                  label: "text-zinc-700",
                }
              }
              onMove={handleMove}
              onRefresh={fetchLeads}
            />
          ))}
        </div>
      )}

      {/* ── Create Lead Modal ── */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !creating && setShowCreateModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Create new lead"
        >
          <div
            className="mx-4 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              New Lead
            </h3>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              Add a new lead to the pipeline
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newLead.companyName}
                  onChange={(e) =>
                    setNewLead((p) => ({ ...p, companyName: e.target.value }))
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 dark:border-zinc-600",
                  )}
                  placeholder="Acme Corp"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={newLead.contactName}
                  onChange={(e) =>
                    setNewLead((p) => ({ ...p, contactName: e.target.value }))
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 dark:border-zinc-600",
                  )}
                  placeholder="John Doe"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) =>
                      setNewLead((p) => ({ ...p, email: e.target.value }))
                    }
                    className={cn(
                      "w-full rounded-lg border px-3 py-2 text-sm",
                      "bg-white text-zinc-900",
                      "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                      "dark:bg-zinc-800 dark:text-zinc-100",
                      "border-zinc-300 dark:border-zinc-600",
                    )}
                    placeholder="john@acme.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newLead.phone}
                    onChange={(e) =>
                      setNewLead((p) => ({ ...p, phone: e.target.value }))
                    }
                    className={cn(
                      "w-full rounded-lg border px-3 py-2 text-sm",
                      "bg-white text-zinc-900",
                      "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                      "dark:bg-zinc-800 dark:text-zinc-100",
                      "border-zinc-300 dark:border-zinc-600",
                    )}
                    placeholder="+1 555-0000"
                  />
                </div>
              </div>

              {/* Service Interest & Value */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Service Interest
                  </label>
                  <input
                    type="text"
                    value={newLead.serviceInterest}
                    onChange={(e) =>
                      setNewLead((p) => ({
                        ...p,
                        serviceInterest: e.target.value,
                      }))
                    }
                    className={cn(
                      "w-full rounded-lg border px-3 py-2 text-sm",
                      "bg-white text-zinc-900",
                      "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                      "dark:bg-zinc-800 dark:text-zinc-100",
                      "border-zinc-300 dark:border-zinc-600",
                    )}
                    placeholder="Web Development"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Value (USD)
                  </label>
                  <input
                    type="number"
                    value={newLead.value}
                    onChange={(e) =>
                      setNewLead((p) => ({ ...p, value: e.target.value }))
                    }
                    className={cn(
                      "w-full rounded-lg border px-3 py-2 text-sm",
                      "bg-white text-zinc-900",
                      "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                      "dark:bg-zinc-800 dark:text-zinc-100",
                      "border-zinc-300 dark:border-zinc-600",
                    )}
                    placeholder="50000"
                    min={0}
                  />
                </div>
              </div>

              {/* Error */}
              {createError && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>{createError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
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
                  type="submit"
                  disabled={creating}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                    "bg-blue-600 text-white hover:bg-blue-500",
                    "transition-colors",
                    creating && "cursor-not-allowed opacity-70",
                  )}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating…
                    </>
                  ) : (
                    "Create Lead"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
