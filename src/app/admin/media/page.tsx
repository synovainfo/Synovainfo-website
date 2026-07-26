"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { cn } from "@/lib/utils";
import {
  Upload,
  Grid3X3,
  List,
  FolderOpen,
  Folder,
  Plus,
  ImageIcon,
  FileText,
  Video,
  File,
  Search,
  X,
  Trash2,
  Copy,
  Check,
  Loader2,
  ChevronRight,
  ChevronDown,
  Edit3,
  AlertTriangle,
  MoreHorizontal,
  Download,
  ExternalLink,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────

interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  _count: { children: number; media: number };
  children?: FolderItem[];
}

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  caption: string | null;
  tags: string[] | null;
  folderId: string | null;
  url: string;
  createdAt: string;
  updatedAt: string;
  folder?: { id: string; name: string } | null;
  uploadedBy?: { id: string; name: string } | null;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function formatSize(bytes: number | null): string {
  if (!bytes || bytes === 0) return "—";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getFileIcon(mimeType: string | null) {
  if (!mimeType) return File;
  if (mimeType === "image/svg+xml") return ImageIcon;
  if (mimeType.startsWith("image/")) return ImageIcon;
  if (mimeType.startsWith("video/")) return Video;
  if (mimeType === "application/pdf") return FileText;
  return File;
}

function isPreviewable(mimeType: string | null): boolean {
  if (!mimeType) return false;
  if (mimeType.startsWith("image/")) return true;
  if (mimeType === "application/pdf") return true;
  return false;
}

function buildTree(folders: FolderItem[]): FolderItem[] {
  const map = new Map<string, FolderItem>();
  const roots: FolderItem[] = [];

  for (const f of folders) {
    map.set(f.id, { ...f, children: [] });
  }

  for (const f of map.values()) {
    if (f.parentId && map.has(f.parentId)) {
      map.get(f.parentId)!.children!.push(f);
    } else {
      roots.push(f);
    }
  }

  return roots;
}

function getMediaType(mimeType: string | null): string {
  if (!mimeType) return "DOCUMENT";
  if (mimeType === "image/svg+xml") return "SVG";
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (mimeType === "application/pdf") return "PDF";
  return "DOCUMENT";
}

// ─── Folder Tree Component ──────────────────────────────────────────

function FolderTree({
  folders,
  currentFolder,
  onSelect,
  depth = 0,
}: {
  folders: FolderItem[];
  currentFolder: string | null;
  onSelect: (id: string | null) => void;
  depth?: number;
}) {
  return (
    <>
      {folders.map((folder) => (
        <FolderTreeItem
          key={folder.id}
          folder={folder}
          currentFolder={currentFolder}
          onSelect={onSelect}
          depth={depth}
        />
      ))}
    </>
  );
}

function FolderTreeItem({
  folder,
  currentFolder,
  onSelect,
  depth,
}: {
  folder: FolderItem;
  currentFolder: string | null;
  onSelect: (id: string | null) => void;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = (folder.children?.length ?? 0) > 0;
  const isActive = currentFolder === folder.id;

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(isActive ? null : folder.id)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
          isActive
            ? "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-700 dark:text-white"
            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
        )}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="shrink-0 rounded p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <Folder className="h-4 w-4 shrink-0 text-amber-500" />
        <span className="truncate flex-1">{folder.name}</span>
        {folder._count.media > 0 && (
          <span className="shrink-0 rounded-full bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
            {folder._count.media}
          </span>
        )}
      </button>
      {hasChildren && expanded && (
        <FolderTree
          folders={folder.children!}
          currentFolder={currentFolder}
          onSelect={onSelect}
          depth={depth + 1}
        />
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function MediaLibraryPage() {
  // ── State ──
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 48,
    total: 0,
    totalPages: 0,
  });

  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailId, setDetailId] = useState<string | null>(null);

  // Modals
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showRenameFolder, setShowRenameFolder] = useState<string | null>(null);
  const [showDeleteFolder, setShowDeleteFolder] = useState<string | null>(null);
  const [showDeleteMedia, setShowDeleteMedia] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState("");

  // Detail modal state
  const [detailMedia, setDetailMedia] = useState<MediaItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editAltText, setEditAltText] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editTags, setEditTags] = useState("");
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Data Fetching ──

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("pageSize", String(pagination.pageSize));
      if (currentFolder) params.set("folderId", currentFolder);
      if (search) params.set("search", search);
      if (typeFilter) params.set("type", typeFilter);

      const res = await fetch(`/api/admin/media?${params}`);
      if (!res.ok) throw new Error("Failed to fetch media");

      const data = await res.json();
      setMedia(data.media);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, currentFolder, search, typeFilter]);

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media/folders");
      if (!res.ok) return;
      const data = await res.json();
      setFolders(data.folders);
    } catch {
      // silently fail — folders are secondary
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  // ── Search debounce ──

  const handleSearchInput = useCallback((value: string) => {
    setSearchInput(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setSearch(value);
      setPagination((p) => ({ ...p, page: 1 }));
    }, 400);
  }, []);

  // ── Upload ──

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading ${file.name}...`);

        try {
          const formData = new FormData();
          formData.append("file", file);
          if (currentFolder) formData.append("folderId", currentFolder);

          const res = await fetch("/api/admin/media", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const err = await res.json();
            setUploadProgress(`Failed: ${err.message}`);
            continue;
          }
        } catch {
          setUploadProgress(`Failed to upload ${file.name}`);
        }
      }

      setUploadProgress(null);
      setUploading(false);
      fetchMedia();
      fetchFolders();
    },
    [currentFolder, fetchMedia, fetchFolders],
  );

  // ── Copy URL ──

  const handleCopyUrl = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${url}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = `${window.location.origin}${url}`;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  // ── Detail Modal ──

  const openDetail = useCallback(async (id: string) => {
    setDetailId(id);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/media/${id}`);
      if (!res.ok) throw new Error("Failed to fetch media details");
      const data = await res.json();
      setDetailMedia(data.media);
      setEditAltText(data.media.altText ?? "");
      setEditCaption(data.media.caption ?? "");
      setEditTags(
        Array.isArray(data.media.tags)
          ? (data.media.tags as string[]).join(", ")
          : "",
      );
    } catch {
      setDetailMedia(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setDetailId(null);
    setDetailMedia(null);
  }, []);

  const saveDetail = useCallback(async () => {
    if (!detailMedia) return;
    try {
      const tags = editTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(`/api/admin/media/${detailMedia.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          altText: editAltText || null,
          caption: editCaption || null,
          tags,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");
      closeDetail();
      fetchMedia();
    } catch {
      // silently fail
    }
  }, [detailMedia, editAltText, editCaption, editTags, closeDetail, fetchMedia]);

  // ── Delete media ──

  const deleteSelected = useCallback(async () => {
    for (const id of selectedIds) {
      try {
        await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      } catch {
        // continue
      }
    }
    setSelectedIds(new Set());
    setShowDeleteMedia(false);
    fetchMedia();
    fetchFolders();
  }, [selectedIds, fetchMedia, fetchFolders]);

  const deleteMediaItem = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      } catch {
        // continue
      }
      closeDetail();
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      fetchMedia();
      fetchFolders();
    },
    [closeDetail, fetchMedia, fetchFolders],
  );

  // ── Folder operations ──

  const createFolder = useCallback(async () => {
    if (!folderNameInput.trim()) return;
    try {
      await fetch("/api/admin/media/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: folderNameInput.trim(),
          parentId: currentFolder,
        }),
      });
      setFolderNameInput("");
      setShowCreateFolder(false);
      fetchFolders();
    } catch {
      // silently fail
    }
  }, [folderNameInput, currentFolder, fetchFolders]);

  const renameFolder = useCallback(async () => {
    if (!showRenameFolder || !folderNameInput.trim()) return;
    try {
      await fetch(`/api/admin/media/folders/${showRenameFolder}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: folderNameInput.trim() }),
      });
      setFolderNameInput("");
      setShowRenameFolder(null);
      fetchFolders();
    } catch {
      // silently fail
    }
  }, [showRenameFolder, folderNameInput, fetchFolders]);

  const deleteFolder = useCallback(async () => {
    if (!showDeleteFolder) return;
    try {
      const res = await fetch(
        `/api/admin/media/folders/${showDeleteFolder}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete folder");
        return;
      }
      setShowDeleteFolder(null);
      if (currentFolder === showDeleteFolder) {
        setCurrentFolder(null);
      }
      fetchFolders();
      fetchMedia();
    } catch {
      // silently fail
    }
  }, [showDeleteFolder, currentFolder, fetchFolders, fetchMedia]);

  // ── Select all / none ──

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === media.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(media.map((m) => m.id)));
    }
  }, [media, selectedIds]);

  const isSelectedAll = media.length > 0 && selectedIds.size === media.length;

  // ── Folder tree with root node ──

  const folderTree = buildTree(folders);

  // ── Filter buttons ──

  const TYPE_FILTERS = [
    { value: "", label: "All" },
    { value: "IMAGE", label: "Images" },
    { value: "SVG", label: "SVG" },
    { value: "PDF", label: "PDF" },
    { value: "VIDEO", label: "Video" },
    { value: "DOCUMENT", label: "Docs" },
  ];

  const renderFolderContextMenu = (folder: FolderItem) => (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowRenameFolder(folder.id);
          setFolderNameInput(folder.name);
        }}
        className="rounded p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        title="Rename"
      >
        <Edit3 className="h-3 w-3" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowDeleteFolder(folder.id);
        }}
        className="rounded p-0.5 text-zinc-400 hover:text-red-500"
        title="Delete"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );

  // ── Render ──

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Media Library"
        description="Manage images, SVGs, PDFs, and videos"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCreateFolder(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <Plus className="h-4 w-4" />
              Folder
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.svg,.pdf,video/*"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </div>
        }
      />

      {uploadProgress && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
          {uploadProgress}
        </div>
      )}

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* ── Left sidebar — Folder Tree ── */}
        <aside className="hidden w-56 shrink-0 overflow-y-auto md:block">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Folders
            </h3>
            <span className="text-xs text-zinc-400">
              {folders.length}
            </span>
          </div>

          <div className="space-y-0.5">
            {/* Root */}
            <button
              type="button"
              onClick={() => setCurrentFolder(null)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                !currentFolder
                  ? "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
              )}
            >
              <FolderOpen className="h-4 w-4 shrink-0 text-blue-500" />
              <span className="flex-1 truncate">All Files</span>
              {pagination.total > 0 && (
                <span className="shrink-0 rounded-full bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                  {pagination.total}
                </span>
              )}
            </button>

            <FolderTree
              folders={folderTree}
              currentFolder={currentFolder}
              onSelect={setCurrentFolder}
            />
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white py-1.5 pl-9 pr-8 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Type filters */}
            <div className="flex items-center gap-1">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => {
                    setTypeFilter(f.value);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                    typeFilter === f.value
                      ? "bg-zinc-800 text-white dark:bg-white dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="flex items-center rounded-md border border-zinc-300 dark:border-zinc-600">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-l-md p-1.5 transition-colors",
                  viewMode === "grid"
                    ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
                )}
                title="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-r-md p-1.5 transition-colors",
                  viewMode === "list"
                    ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
                )}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Bulk actions */}
          {selectedIds.size > 0 && (
            <div className="mb-3 flex items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/50">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {selectedIds.size} selected
              </span>
              <button
                type="button"
                onClick={() => setShowDeleteMedia(true)}
                className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-zinc-500 underline hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              >
                Clear selection
              </button>
            </div>
          )}

          {/* Content area */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <AlertTriangle className="mb-2 h-8 w-8 text-red-400" />
                <p className="text-sm">{error}</p>
                <button
                  type="button"
                  onClick={fetchMedia}
                  className="mt-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  Try again
                </button>
              </div>
            ) : media.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <FolderOpen className="mb-2 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                <p className="text-sm font-medium">
                  {currentFolder
                    ? "No files in this folder"
                    : search || typeFilter
                      ? "No files match your filters"
                      : "No files yet"}
                </p>
                {!search && !typeFilter && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload your first file
                  </button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              /* ── Grid View ── */
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {media.map((item) => {
                    const Icon = getFileIcon(item.mimeType);
                    const isSelected = selectedIds.has(item.id);
                    const isImage =
                      item.mimeType?.startsWith("image/") &&
                      item.mimeType !== "image/svg+xml";
                    const isSvg = item.mimeType === "image/svg+xml";

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "group relative cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-md",
                          isSelected
                            ? "border-blue-500 ring-2 ring-blue-500/30"
                            : "border-zinc-200 dark:border-zinc-700",
                        )}
                        onClick={() => openDetail(item.id)}
                      >
                        {/* Checkbox overlay */}
                        <div
                          className="absolute left-2 top-2 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(item.id)}
                            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>

                        {/* Thumbnail */}
                        <div className="flex aspect-square items-center justify-center bg-zinc-50 dark:bg-zinc-800/50">
                          {isImage && item.url ? (
                            <img
                              src={item.url}
                              alt={item.altText ?? item.originalName}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : isSvg && item.url ? (
                            <img
                              src={item.url}
                              alt={item.altText ?? item.originalName}
                              className="max-h-2/3 max-w-2/3 p-4"
                              loading="lazy"
                            />
                          ) : (
                            <Icon className="h-10 w-10 text-zinc-400" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="border-t border-zinc-200 px-2 py-1.5 dark:border-zinc-700">
                          <p className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            {item.originalName}
                          </p>
                          <p className="text-[10px] text-zinc-400">
                            {formatSize(item.size)}
                            {item.width && item.height
                              ? ` · ${item.width}×${item.height}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* ── List View ── */
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-left text-xs uppercase text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                      <th className="w-8 pb-2 pl-1">
                        <input
                          type="checkbox"
                          checked={isSelectedAll}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="pb-2 pr-4 font-medium">File</th>
                      <th className="pb-2 pr-4 font-medium">Type</th>
                      <th className="pb-2 pr-4 font-medium">Size</th>
                      <th className="pb-2 pr-4 font-medium">Dimensions</th>
                      <th className="pb-2 pr-4 font-medium">Date</th>
                      <th className="w-16 pb-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {media.map((item) => {
                      const Icon = getFileIcon(item.mimeType);
                      const isSelected = selectedIds.has(item.id);
                      const type = getMediaType(item.mimeType);

                      return (
                        <tr
                          key={item.id}
                          className={cn(
                            "border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50",
                            isSelected && "bg-blue-50 dark:bg-blue-950/20",
                          )}
                        >
                          <td
                            className="py-2 pl-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(item.id)}
                              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td
                            className="cursor-pointer py-2 pr-4"
                            onClick={() => openDetail(item.id)}
                          >
                            <div className="flex items-center gap-2">
                              {item.url &&
                              isPreviewable(item.mimeType) ? (
                                <img
                                  src={item.url}
                                  alt=""
                                  className="h-8 w-8 shrink-0 rounded object-cover"
                                />
                              ) : (
                                <Icon className="h-8 w-8 shrink-0 p-1 text-zinc-400" />
                              )}
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                  {item.originalName}
                                </p>
                                {item.altText && (
                                  <p className="truncate text-xs text-zinc-400">
                                    {item.altText}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-2 pr-4">
                            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                              {type}
                            </span>
                          </td>
                          <td className="py-2 pr-4 text-sm text-zinc-500">
                            {formatSize(item.size)}
                          </td>
                          <td className="py-2 pr-4 text-sm text-zinc-500">
                            {item.width && item.height
                              ? `${item.width}×${item.height}`
                              : "—"}
                          </td>
                          <td className="py-2 pr-4 text-sm text-zinc-500">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="py-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyUrl(item.url);
                              }}
                              className="rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                              title="Copy URL"
                            >
                              {copied ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Pagination ── */}
            {pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-zinc-200 px-1 py-3 dark:border-zinc-700">
                <p className="text-xs text-zinc-500">
                  Showing {(pagination.page - 1) * pagination.pageSize + 1}–
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.total,
                  )}{" "}
                  of {pagination.total}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={pagination.page <= 1}
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page - 1 }))
                    }
                    className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    Prev
                  </button>
                  {Array.from(
                    { length: Math.min(pagination.totalPages, 5) },
                    (_, i) => {
                      const start = Math.max(
                        1,
                        pagination.page - 2,
                      );
                      const pageNum = start + i;
                      if (pageNum > pagination.totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() =>
                            setPagination((p) => ({
                              ...p,
                              page: pageNum,
                            }))
                          }
                          className={cn(
                            "rounded-md px-2.5 py-1 text-xs font-medium",
                            pagination.page === pageNum
                              ? "bg-zinc-800 text-white dark:bg-white dark:text-zinc-900"
                              : "border border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800",
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                  <button
                    type="button"
                    disabled={
                      pagination.page >= pagination.totalPages
                    }
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page + 1 }))
                    }
                    className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* Detail Modal */}
      {/* ════════════════════════════════════════════════════════════════ */}

      {detailId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeDetail}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                File Details
              </h2>
              <button
                type="button"
                onClick={closeDetail}
                className="rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
              </div>
            ) : detailMedia ? (
              <>
                {/* Preview */}
                <div className="flex max-h-72 items-center justify-center overflow-hidden border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                  {detailMedia.mimeType?.startsWith("image/") &&
                  detailMedia.url ? (
                    <img
                      src={detailMedia.url}
                      alt={detailMedia.altText ?? detailMedia.originalName}
                      className="max-h-72 max-w-full object-contain"
                    />
                  ) : detailMedia.mimeType === "application/pdf" &&
                    detailMedia.url ? (
                    <iframe
                      src={detailMedia.url}
                      className="h-72 w-full"
                      title="PDF preview"
                    />
                  ) : (
                    <div className="flex flex-col items-center py-10 text-zinc-400">
                      {React.createElement(getFileIcon(detailMedia.mimeType), {
                        className: "h-16 w-16 mb-2",
                      })}
                      <p className="text-sm">
                        Preview not available
                      </p>
                    </div>
                  )}
                </div>

                {/* Details & Edit */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Filename
                      </span>
                      <p className="truncate text-zinc-800 dark:text-zinc-200">
                        {detailMedia.originalName}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Type
                      </span>
                      <p className="text-zinc-800 dark:text-zinc-200">
                        {detailMedia.mimeType ?? "Unknown"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Size
                      </span>
                      <p className="text-zinc-800 dark:text-zinc-200">
                        {formatSize(detailMedia.size)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Dimensions
                      </span>
                      <p className="text-zinc-800 dark:text-zinc-200">
                        {detailMedia.width && detailMedia.height
                          ? `${detailMedia.width}×${detailMedia.height}`
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Uploaded
                      </span>
                      <p className="text-zinc-800 dark:text-zinc-200">
                        {formatDate(detailMedia.createdAt)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Uploaded by
                      </span>
                      <p className="text-zinc-800 dark:text-zinc-200">
                        {detailMedia.uploadedBy?.name ?? "—"}
                      </p>
                    </div>
                  </div>

                  {/* URL */}
                  <div className="mb-4">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      URL
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 truncate rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {detailMedia.url}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(detailMedia.url)}
                        className="shrink-0 rounded p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        title="Copy URL"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Edit fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={editAltText}
                        onChange={(e) => setEditAltText(e.target.value)}
                        placeholder="Describe the image"
                        className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Caption
                      </label>
                      <textarea
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        rows={2}
                        placeholder="Optional caption"
                        className="mt-1 w-full resize-none rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="hero, banner, team"
                        className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => deleteMediaItem(detailMedia.id)}
                    className="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={closeDetail}
                      className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveDetail}
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-20 text-zinc-500">
                <AlertTriangle className="mr-2 h-6 w-6" />
                <p>Failed to load file details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* Create Folder Modal */}
      {/* ════════════════════════════════════════════════════════════════ */}

      {showCreateFolder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCreateFolder(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
              Create Folder
            </h3>
            <input
              type="text"
              value={folderNameInput}
              onChange={(e) => setFolderNameInput(e.target.value)}
              placeholder="Folder name"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && createFolder()}
              className="mb-4 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreateFolder(false);
                  setFolderNameInput("");
                }}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createFolder}
                disabled={!folderNameInput.trim()}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* Rename Folder Modal */}
      {/* ════════════════════════════════════════════════════════════════ */}

      {showRenameFolder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setShowRenameFolder(null);
            setFolderNameInput("");
          }}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
              Rename Folder
            </h3>
            <input
              type="text"
              value={folderNameInput}
              onChange={(e) => setFolderNameInput(e.target.value)}
              placeholder="Folder name"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && renameFolder()}
              className="mb-4 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowRenameFolder(null);
                  setFolderNameInput("");
                }}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={renameFolder}
                disabled={!folderNameInput.trim()}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* Delete Folder Confirmation */}
      {/* ════════════════════════════════════════════════════════════════ */}

      {showDeleteFolder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDeleteFolder(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Delete Folder
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone. The folder must be empty.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteFolder(null)}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteFolder}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* Delete Media Confirmation */}
      {/* ════════════════════════════════════════════════════════════════ */}

      {showDeleteMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDeleteMedia(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Delete {selectedIds.size} file{selectedIds.size > 1 ? "s" : ""}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This will soft-delete the selected files.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteMedia(false)}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteSelected}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
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
