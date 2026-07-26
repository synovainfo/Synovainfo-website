"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  Save,
  Layout,
  Link as LinkIcon,
  Globe,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FooterLink {
  id?: string;
  label: string;
  url: string | null;
  target: string;
  order: number;
}

interface FooterColumn {
  id?: string;
  title: string | null;
  width: number;
  order: number;
  links: FooterLink[];
}

interface FooterData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  columns: FooterColumnData[];
}

interface FooterColumnData {
  id: string;
  footerId: string;
  title: string | null;
  width: number;
  order: number;
  links: FooterLinkData[];
}

interface FooterLinkData {
  id: string;
  footerColumnId: string;
  label: string;
  url: string | null;
  target: string | null;
  order: number;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string | null;
  label: string | null;
}

interface FooterResponse {
  footer: FooterData;
  socialLinks: SocialLink[];
  copyright: string;
}

// ---------------------------------------------------------------------------
// Social Platform Options
// ---------------------------------------------------------------------------

const SOCIAL_PLATFORMS = [
  { value: "linkedin", label: "LinkedIn", icon: "Linkedin" },
  { value: "twitter", label: "Twitter / X", icon: "Twitter" },
  { value: "github", label: "GitHub", icon: "Github" },
  { value: "youtube", label: "YouTube", icon: "Youtube" },
  { value: "instagram", label: "Instagram", icon: "Instagram" },
  { value: "facebook", label: "Facebook", icon: "Globe" },
] as const;

// ---------------------------------------------------------------------------
// FooterEditorPage
// ---------------------------------------------------------------------------

export default function FooterEditorPage() {
  // Data
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [footerId, setFooterId] = useState<string | null>(null);
  const [footerName, setFooterName] = useState("");
  const [columns, setColumns] = useState<FooterColumn[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [copyright, setCopyright] = useState("");

  // New column form
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newColumnWidth, setNewColumnWidth] = useState(3);

  // Column link modals
  const [editingColumnIdx, setEditingColumnIdx] = useState<number | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingLinkIdx, setEditingLinkIdx] = useState<number | null>(null);
  const [linkForm, setLinkForm] = useState({ label: "", url: "", target: "_self" });

  // Social link modal
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [editingSocialIdx, setEditingSocialIdx] = useState<number | null>(null);
  const [socialForm, setSocialForm] = useState({ platform: "linkedin", url: "", label: "" });

  // Delete confirmation
  const [deleteColumnIdx, setDeleteColumnIdx] = useState<number | null>(null);

  // Fetch
  const fetchFooter = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/footer");
      if (!res.ok) throw new Error("Failed to fetch footer");
      const data: FooterResponse = await res.json();

      setFooterId(data.footer.id);
      setFooterName(data.footer.name);

      // Map DB columns to editable shape
      const mappedColumns: FooterColumn[] = data.footer.columns.map((col) => ({
        id: col.id,
        title: col.title,
        width: col.width,
        order: col.order,
        links: col.links.map((link) => ({
          id: link.id,
          label: link.label,
          url: link.url,
          target: link.target ?? "_self",
          order: link.order,
        })),
      }));
      setColumns(mappedColumns);
      setSocialLinks(data.socialLinks);
      setCopyright(data.copyright);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFooter();
  }, [fetchFooter]);

  // Add column
  const handleAddColumn = () => {
    setColumns((prev) => [
      ...prev,
      {
        title: newColumnTitle || null,
        width: newColumnWidth,
        order: prev.length,
        links: [],
      },
    ]);
    setNewColumnTitle("");
    setNewColumnWidth(3);
  };

  // Remove column
  const handleRemoveColumn = (idx: number) => {
    setColumns((prev) => prev.filter((_, i) => i !== idx));
    setDeleteColumnIdx(null);
  };

  // Move column
  const handleMoveColumn = (idx: number, direction: "up" | "down") => {
    const newCols = [...columns];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newCols.length) return;
    [newCols[idx], newCols[swapIdx]] = [newCols[swapIdx], newCols[idx]];
    newCols.forEach((c, i) => (c.order = i));
    setColumns(newCols);
  };

  // Update column field
  const handleColumnChange = (
    idx: number,
    field: "title" | "width",
    value: string | number,
  ) => {
    setColumns((prev) =>
      prev.map((col, i) =>
        i === idx ? { ...col, [field]: value } : col,
      ),
    );
  };

  // Link modal
  const openAddLink = (colIdx: number) => {
    setEditingColumnIdx(colIdx);
    setEditingLinkIdx(null);
    setLinkForm({ label: "", url: "", target: "_self" });
    setShowLinkModal(true);
  };

  const openEditLink = (colIdx: number, linkIdx: number) => {
    setEditingColumnIdx(colIdx);
    setEditingLinkIdx(linkIdx);
    const link = columns[colIdx].links[linkIdx];
    setLinkForm({
      label: link.label,
      url: link.url ?? "",
      target: link.target,
    });
    setShowLinkModal(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingColumnIdx === null) return;

    const newLink: FooterLink = {
      label: linkForm.label,
      url: linkForm.url || null,
      target: linkForm.target,
      order: 0,
    };

    setColumns((prev) =>
      prev.map((col, ci) => {
        if (ci !== editingColumnIdx) return col;
        const newLinks = [...col.links];
        if (editingLinkIdx !== null) {
          newLinks[editingLinkIdx] = { ...newLinks[editingLinkIdx], ...newLink };
        } else {
          newLink.order = newLinks.length;
          newLinks.push(newLink);
        }
        return { ...col, links: newLinks };
      }),
    );

    setShowLinkModal(false);
    setEditingColumnIdx(null);
    setEditingLinkIdx(null);
  };

  const handleDeleteLink = (colIdx: number, linkIdx: number) => {
    setColumns((prev) =>
      prev.map((col, ci) =>
        ci === colIdx
          ? {
              ...col,
              links: col.links.filter((_, li) => li !== linkIdx),
            }
          : col,
      ),
    );
  };

  // Social link handlers
  const openAddSocial = () => {
    setEditingSocialIdx(null);
    setSocialForm({ platform: "linkedin", url: "", label: "" });
    setShowSocialModal(true);
  };

  const openEditSocial = (idx: number) => {
    setEditingSocialIdx(idx);
    const link = socialLinks[idx];
    setSocialForm({
      platform: link.platform,
      url: link.url,
      label: link.label ?? "",
    });
    setShowSocialModal(true);
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    const newSocial: SocialLink = {
      platform: socialForm.platform,
      url: socialForm.url,
      icon: null,
      label: socialForm.label || null,
    };

    if (editingSocialIdx !== null) {
      setSocialLinks((prev) =>
        prev.map((s, i) => (i === editingSocialIdx ? newSocial : s)),
      );
    } else {
      setSocialLinks((prev) => [...prev, newSocial]);
    }

    setShowSocialModal(false);
  };

  const handleDeleteSocial = (idx: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save all
  const handleSave = async () => {
    setServerError(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      const payload = {
        name: footerName,
        columns: columns.map((col, ci) => ({
          title: col.title,
          width: col.width,
          order: ci,
          links: col.links.map((link, li) => ({
            label: link.label,
            url: link.url,
            target: link.target,
            order: li,
          })),
        })),
        socialLinks: socialLinks.map((s) => ({
          platform: s.platform,
          url: s.url,
          icon: s.icon,
          label: s.label,
        })),
        copyright,
      };

      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to save footer");
      }

      setSuccessMessage("Footer saved successfully");

      // Refresh with server data
      if (data.footer) {
        setFooterId(data.footer.id);
        const mappedColumns: FooterColumn[] = data.footer.columns.map(
          (col: FooterColumnData) => ({
            id: col.id,
            title: col.title,
            width: col.width,
            order: col.order,
            links: col.links.map((link: FooterLinkData) => ({
              id: link.id,
              label: link.label,
              url: link.url,
              target: link.target ?? "_self",
              order: link.order,
            })),
          }),
        );
        setColumns(mappedColumns);
      }
      if (data.socialLinks) setSocialLinks(data.socialLinks);
      if (data.copyright) setCopyright(data.copyright);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setSaving(false);
    }
  };

  const getSocialIcon = (_platform: string) => {
    return <Globe className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {error}
        </h3>
        <button
          onClick={fetchFooter}
          className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Footer Editor"
        description="Manage your website footer columns, links, and social icons"
        actions={
          <button
            onClick={handleSave}
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
                Save Footer
              </>
            )}
          </button>
        }
      />

      {successMessage && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

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

      {/* Footer Name */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Settings
        </h2>
        <div>
          <label
            htmlFor="footer-name"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Footer Name
          </label>
          <input
            id="footer-name"
            type="text"
            value={footerName}
            onChange={(e) => setFooterName(e.target.value)}
            className={cn(
              "w-full max-w-sm rounded-lg border px-3 py-2 text-sm",
              "bg-white text-zinc-900",
              "focus:outline-none focus:ring-1",
              "dark:bg-zinc-800 dark:text-zinc-100",
              "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
            )}
          />
        </div>
      </div>

      {/* Columns */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Columns ({columns.length})
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {columns.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Layout className="mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
              <h3 className="mb-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                No columns yet
              </h3>
              <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
                Add footer columns with links to get started.
              </p>
            </div>
          )}

          {columns.map((col, colIdx) => (
            <div
              key={colIdx}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveColumn(colIdx, "up")}
                    disabled={colIdx === 0}
                    className={cn(
                      "rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300",
                      colIdx === 0 && "opacity-30 cursor-not-allowed",
                    )}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveColumn(colIdx, "down")}
                    disabled={colIdx === columns.length - 1}
                    className={cn(
                      "rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300",
                      colIdx === columns.length - 1 && "opacity-30 cursor-not-allowed",
                    )}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={col.title ?? ""}
                  onChange={(e) => handleColumnChange(colIdx, "title", e.target.value)}
                  placeholder="Column title"
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-1.5 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                />

                <div className="flex items-center gap-2">
                  <label className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                    Width:
                  </label>
                  <select
                    value={col.width}
                    onChange={(e) =>
                      handleColumnChange(colIdx, "width", parseInt(e.target.value))
                    }
                    className={cn(
                      "rounded-lg border px-2 py-1.5 text-sm",
                      "bg-white text-zinc-900",
                      "focus:outline-none focus:ring-1",
                      "dark:bg-zinc-800 dark:text-zinc-100",
                      "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                    )}
                  >
                    {[1, 2, 3, 4].map((w) => (
                      <option key={w} value={w}>
                        {w}/4
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setDeleteColumnIdx(colIdx)}
                  className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  title="Remove column"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Column Links */}
              <div className="ml-9 space-y-1">
                {col.links.map((link, linkIdx) => (
                  <div
                    key={linkIdx}
                    className="group flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <LinkIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                    <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300 truncate">
                      {link.label}
                    </span>
                    {link.url && (
                      <span className="hidden sm:inline text-xs text-zinc-400 dark:text-zinc-500 truncate max-w-[200px]">
                        {link.url}
                      </span>
                    )}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditLink(colIdx, linkIdx)}
                        className="rounded p-1 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteLink(colIdx, linkIdx)}
                        className="rounded p-1 text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => openAddLink(colIdx)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Add Link
                </button>
              </div>
            </div>
          ))}

          {/* Add Column Form */}
          <div className="flex items-end gap-3 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-700">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Column Title
              </label>
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="e.g. Services"
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900",
                  "focus:outline-none focus:ring-1",
                  "dark:bg-zinc-800 dark:text-zinc-100",
                  "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                )}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Width
              </label>
              <select
                value={newColumnWidth}
                onChange={(e) => setNewColumnWidth(parseInt(e.target.value))}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm",
                  "bg-white text-zinc-900",
                  "focus:outline-none focus:ring-1",
                  "dark:bg-zinc-800 dark:text-zinc-100",
                  "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                )}
              >
                {[1, 2, 3, 4].map((w) => (
                  <option key={w} value={w}>
                    {w}/4
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddColumn}
              disabled={!newColumnTitle.trim()}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
                "bg-blue-600 text-white hover:bg-blue-500",
                "transition-colors",
                !newColumnTitle.trim() && "cursor-not-allowed opacity-50",
              )}
            >
              <Plus className="h-4 w-4" />
              Add Column
            </button>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Social Links ({socialLinks.length})
          </h2>
          <button
            onClick={openAddSocial}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Social Link
          </button>
        </div>

        <div className="p-6">
          {socialLinks.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
              No social links configured. Add LinkedIn, Twitter, GitHub, etc.
            </p>
          ) : (
            <div className="space-y-2">
              {socialLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-3 rounded-lg px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {getSocialIcon(link.platform)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                      {link.platform}
                    </p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {link.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditSocial(idx)}
                      className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                      title="Edit"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteSocial(idx)}
                      className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Copyright & Bottom Bar
        </h2>
        <div>
          <label
            htmlFor="footer-copyright"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Copyright Text
          </label>
          <input
            id="footer-copyright"
            type="text"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            className={cn(
              "w-full max-w-2xl rounded-lg border px-3 py-2 text-sm font-mono",
              "bg-white text-zinc-900",
              "focus:outline-none focus:ring-1",
              "dark:bg-zinc-800 dark:text-zinc-100",
              "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
            )}
          />
          <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">
            Use{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">
              {"{year}"}
            </code>{" "}
            as a placeholder for the current year.
          </p>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && editingColumnIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLinkModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label={editingLinkIdx !== null ? "Edit link" : "Add link"}
        >
          <div
            className="mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {editingLinkIdx !== null ? "Edit Link" : "Add Link"}
              </h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="link-label"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  id="link-label"
                  type="text"
                  value={linkForm.label}
                  onChange={(e) =>
                    setLinkForm((prev) => ({ ...prev, label: e.target.value }))
                  }
                  required
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                  placeholder="e.g. Privacy Policy"
                />
              </div>

              <div>
                <label
                  htmlFor="link-url"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  URL
                </label>
                <input
                  id="link-url"
                  type="text"
                  value={linkForm.url}
                  onChange={(e) =>
                    setLinkForm((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                  placeholder="/privacy or https://example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="link-target"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Target
                </label>
                <select
                  id="link-target"
                  value={linkForm.target}
                  onChange={(e) =>
                    setLinkForm((prev) => ({
                      ...prev,
                      target: e.target.value,
                    }))
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                >
                  <option value="_self">Same tab (_self)</option>
                  <option value="_blank">New tab (_blank)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
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
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                    "bg-blue-600 text-white hover:bg-blue-500",
                    "transition-colors",
                  )}
                >
                  {editingLinkIdx !== null ? "Update Link" : "Add Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Social Link Modal */}
      {showSocialModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowSocialModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label={editingSocialIdx !== null ? "Edit social link" : "Add social link"}
        >
          <div
            className="mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {editingSocialIdx !== null ? "Edit Social Link" : "Add Social Link"}
              </h3>
              <button
                onClick={() => setShowSocialModal(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSocial} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="social-platform"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Platform
                </label>
                <select
                  id="social-platform"
                  value={socialForm.platform}
                  onChange={(e) =>
                    setSocialForm((prev) => ({
                      ...prev,
                      platform: e.target.value,
                    }))
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="social-url"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  id="social-url"
                  type="url"
                  value={socialForm.url}
                  onChange={(e) =>
                    setSocialForm((prev) => ({
                      ...prev,
                      url: e.target.value,
                    }))
                  }
                  required
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                  placeholder="https://linkedin.com/company/synova"
                />
              </div>

              <div>
                <label
                  htmlFor="social-label"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Label (optional)
                </label>
                <input
                  id="social-label"
                  type="text"
                  value={socialForm.label}
                  onChange={(e) =>
                    setSocialForm((prev) => ({
                      ...prev,
                      label: e.target.value,
                    }))
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                  placeholder="Follow us on LinkedIn"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setShowSocialModal(false)}
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
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                    "bg-blue-600 text-white hover:bg-blue-500",
                    "transition-colors",
                  )}
                >
                  {editingSocialIdx !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Column Confirm */}
      {deleteColumnIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setDeleteColumnIdx(null)}
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
                  Delete Column
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete the column{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {columns[deleteColumnIdx]?.title ?? `Column ${deleteColumnIdx + 1}`}
              </strong>
              ? All links within it will also be removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteColumnIdx(null)}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveColumn(deleteColumnIdx)}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
