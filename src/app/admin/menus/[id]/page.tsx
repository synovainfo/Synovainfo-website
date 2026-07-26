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
  Plus,
  Trash2,
  Edit,
  X,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  GripVertical,
  Save,
  ExternalLink,
  Menu as MenuIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MenuData {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MenuItemData {
  id: string;
  menuId: string;
  parentId: string | null;
  label: string;
  url: string | null;
  target: string | null;
  icon: string | null;
  cssClass: string | null;
  isVisible: boolean;
  isMegaMenu: boolean;
  megaMenuColumns: unknown;
  order: number;
  children?: MenuItemData[];
}

// ---------------------------------------------------------------------------
// Item Form Schema
// ---------------------------------------------------------------------------

const itemFormSchema = z.object({
  label: z.string().min(1, "Label is required").max(200),
  url: z.string().max(500).optional().nullable(),
  target: z.enum(["_self", "_blank"]).default("_self"),
  icon: z.string().max(100).optional().nullable(),
  cssClass: z.string().max(200).optional().nullable(),
  isVisible: z.boolean().default(true),
  isMegaMenu: z.boolean().default(false),
  parentId: z.string().nullable().optional(),
});

type ItemForm = z.infer<typeof itemFormSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a flat list of items from the tree for the parentId dropdown */
function flattenForDropdown(
  items: MenuItemData[],
  depth = 0,
  maxDepth = 2,
): Array<MenuItemData & { depth: number }> {
  const result: Array<MenuItemData & { depth: number }> = [];
  for (const item of items) {
    result.push({ ...item, depth });
    if (item.children && item.children.length > 0 && depth < maxDepth) {
      result.push(...flattenForDropdown(item.children, depth + 1, maxDepth));
    }
  }
  return result;
}

/** Recursively update an item and its children's visibility */
function toggleVisibility(
  items: MenuItemData[],
  itemId: string,
  visible: boolean,
): MenuItemData[] {
  return items.map((item) => {
    if (item.id === itemId) {
      return {
        ...item,
        isVisible: visible,
        children: item.children
          ? toggleVisibilityTree(item.children, visible)
          : item.children,
      };
    }
    if (item.children) {
      return { ...item, children: toggleVisibility(item.children, itemId, visible) };
    }
    return item;
  });
}

function toggleVisibilityTree(
  items: MenuItemData[],
  visible: boolean,
): MenuItemData[] {
  return items.map((item) => ({
    ...item,
    isVisible: visible,
    children: item.children
      ? toggleVisibilityTree(item.children, visible)
      : item.children,
  }));
}

/** Move an item up or down within its sibling list */
function moveItem(
  items: MenuItemData[],
  itemId: string,
  direction: "up" | "down",
): MenuItemData[] {
  // Check root level first
  const rootIdx = items.findIndex((c) => c.id === itemId);
  if (rootIdx >= 0) {
    const newItems = [...items];
    const swapIdx = direction === "up" ? rootIdx - 1 : rootIdx + 1;
    if (swapIdx < 0 || swapIdx >= newItems.length) return items;
    [newItems[rootIdx], newItems[swapIdx]] = [
      newItems[swapIdx],
      newItems[rootIdx],
    ];
    newItems.forEach((c, i) => (c.order = i));
    return newItems;
  }

  // Recurse into children of each item
  return items.map((parent) => {
    if (!parent.children) return parent;

    const idx = parent.children.findIndex((c) => c.id === itemId);
    if (idx >= 0) {
      const newChildren = [...parent.children];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= newChildren.length) return parent;
      [newChildren[idx], newChildren[swapIdx]] = [
        newChildren[swapIdx],
        newChildren[idx],
      ];
      newChildren.forEach((c, i) => (c.order = i));
      return { ...parent, children: newChildren };
    }

    return { ...parent, children: moveItem(parent.children, itemId, direction) };
  });
}

/** Remove an item from the tree */
function removeItem(items: MenuItemData[], itemId: string): MenuItemData[] {
  return items
    .filter((item) => item.id !== itemId)
    .map((item) => ({
      ...item,
      children: item.children ? removeItem(item.children, itemId) : item.children,
    }));
}

/** Update item fields in the tree */
function updateItemInTree(
  items: MenuItemData[],
  itemId: string,
  updates: Partial<MenuItemData>,
): MenuItemData[] {
  return items.map((item) => {
    if (item.id === itemId) {
      return { ...item, ...updates };
    }
    if (item.children) {
      return {
        ...item,
        children: updateItemInTree(item.children, itemId, updates),
      };
    }
    return item;
  });
}

// ---------------------------------------------------------------------------
// EditMenuPage
// ---------------------------------------------------------------------------

export default function EditMenuPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Menu metadata
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [menuName, setMenuName] = useState("");
  const [menuSlug, setMenuSlug] = useState("");
  const [menuLocation, setMenuLocation] = useState("");

  // Items tree
  const [items, setItems] = useState<MenuItemData[]>([]);

  // Add/Edit item modal
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState<ItemForm>({
    label: "",
    url: "",
    target: "_self",
    icon: "",
    cssClass: "",
    isVisible: true,
    isMegaMenu: false,
    parentId: null,
  });
  const [itemFormErrors, setItemFormErrors] = useState<
    Partial<Record<keyof ItemForm, string>>
  >({});

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<MenuItemData | null>(null);

  // Fetch
  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/menus/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Menu not found");
        throw new Error("Failed to fetch menu");
      }
      const data = await res.json();
      setMenu(data.menu);
      setMenuName(data.menu.name);
      setMenuSlug(data.menu.slug);
      setMenuLocation(data.menu.location ?? "");
      setItems(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // Get flat items for parent dropdown (exclude the current item being edited)
  const flatItems = flattenForDropdown(items);
  const parentOptions = editingItemId
    ? flatItems.filter((i) => i.id !== editingItemId)
    : flatItems;

  // Open add item modal
  const openAddItem = (parentId: string | null = null) => {
    setEditingItemId(null);
    setItemForm({
      label: "",
      url: "",
      target: "_self",
      icon: "",
      cssClass: "",
      isVisible: true,
      isMegaMenu: false,
      parentId,
    });
    setItemFormErrors({});
    setShowItemModal(true);
  };

  // Open edit item modal
  const openEditItem = (item: MenuItemData) => {
    setEditingItemId(item.id);
    setItemForm({
      label: item.label,
      url: item.url ?? "",
      target: (item.target as "_self" | "_blank") ?? "_self",
      icon: item.icon ?? "",
      cssClass: item.cssClass ?? "",
      isVisible: item.isVisible,
      isMegaMenu: item.isMegaMenu,
      parentId: item.parentId,
    });
    setItemFormErrors({});
    setShowItemModal(true);
  };

  // Save item (add or edit)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();

    const result = itemFormSchema.safeParse(itemForm);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ItemForm, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ItemForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setItemFormErrors(fieldErrors);
      return;
    }

    setItemFormErrors({});

    const newItem: MenuItemData = {
      id: editingItemId ?? crypto.randomUUID(),
      menuId: id,
      parentId: result.data.parentId ?? null,
      label: result.data.label,
      url: result.data.url || null,
      target: result.data.target,
      icon: result.data.icon || null,
      cssClass: result.data.cssClass || null,
      isVisible: result.data.isVisible,
      isMegaMenu: result.data.isMegaMenu,
      megaMenuColumns: null,
      order: 0,
      children: [],
    };

    if (editingItemId) {
      // Update existing item
      let updated = updateItemInTree(items, editingItemId, newItem);

      // If parentId changed, move the item
      const oldItem = flatItems.find((i) => i.id === editingItemId);
      if (oldItem && oldItem.parentId !== newItem.parentId) {
        updated = removeItem(updated, editingItemId);
        // Re-add to the correct parent
        updated = addItemToTree(updated, newItem);
      }

      setItems(updated);
    } else {
      // Add new item
      setItems(addItemToTree(items, newItem));
    }

    setShowItemModal(false);
  };

  const handleToggleVisibility = (item: MenuItemData) => {
    setItems(toggleVisibility([...items], item.id, !item.isVisible));
  };

  const handleMoveItem = (itemId: string, direction: "up" | "down") => {
    setItems(moveItem([...items], itemId, direction));
  };

  const handleDeleteItem = () => {
    if (!deleteTarget) return;
    setItems(removeItem([...items], deleteTarget.id));
    setDeleteTarget(null);
  };

  // Save everything
  const handleSave = async () => {
    setServerError(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      // Serialize tree to flat list of nested items
      const serializeTree = (treeItems: MenuItemData[]): unknown[] => {
        return treeItems.map((item, index) => ({
          label: item.label,
          url: item.url,
          target: item.target ?? "_self",
          icon: item.icon,
          cssClass: item.cssClass,
          isVisible: item.isVisible,
          isMegaMenu: item.isMegaMenu,
          megaMenuColumns: item.megaMenuColumns,
          order: index,
          children: item.children ? serializeTree(item.children) : [],
        }));
      };

      const payload = {
        name: menuName,
        slug: menuSlug,
        location: menuLocation || null,
        items: serializeTree(items),
      };

      const res = await fetch(`/api/admin/menus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Failed to save menu");
      }

      setSuccessMessage("Menu saved successfully");
      // Refresh to get proper IDs
      fetchMenu();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setSaving(false);
    }
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
      <div>
        <Link
          href="/admin/menus"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Menus
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {error}
          </h3>
          <button
            onClick={fetchMenu}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/menus"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Menus
      </Link>

      <PageHeader
        title={menu?.name ?? "Edit Menu"}
        description={`/${menu?.slug}`}
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
                Save Menu
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

      {/* Menu Metadata */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Menu Settings
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="edit-name"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Name
            </label>
            <input
              id="edit-name"
              type="text"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
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
            <label
              htmlFor="edit-slug"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Slug
            </label>
            <input
              id="edit-slug"
              type="text"
              value={menuSlug}
              onChange={(e) =>
                setMenuSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-"),
                )
              }
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
            <label
              htmlFor="edit-location"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Location
            </label>
            <input
              id="edit-location"
              type="text"
              value={menuLocation}
              onChange={(e) => setMenuLocation(e.target.value)}
              placeholder="e.g. header, footer, sidebar"
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm",
                "bg-white text-zinc-900",
                "focus:outline-none focus:ring-1",
                "dark:bg-zinc-800 dark:text-zinc-100",
                "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
              )}
            />
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Menu Items ({countItems(items)})
          </h2>
          <button
            onClick={() => openAddItem(null)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-500",
              "transition-colors",
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Item
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MenuIcon className="mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
            <h3 className="mb-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              No menu items yet
            </h3>
            <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
              Add navigation links to build your menu.
            </p>
            <button
              onClick={() => openAddItem(null)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
            >
              <Plus className="h-3 w-3" />
              Add First Item
            </button>
          </div>
        ) : (
          <div className="p-4">
            <MenuItemTree
              items={items}
              onEdit={openEditItem}
              onDelete={(item) => setDeleteTarget(item)}
              onToggleVisibility={handleToggleVisibility}
              onMove={handleMoveItem}
              onAddChild={openAddItem}
              depth={0}
            />
          </div>
        )}
      </div>

      {/* Item Modal */}
      {showItemModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowItemModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label={editingItemId ? "Edit menu item" : "Add menu item"}
        >
          <div
            className="mx-4 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {editingItemId ? "Edit Menu Item" : "Add Menu Item"}
              </h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} noValidate className="space-y-4">
              {/* Label */}
              <div>
                <label
                  htmlFor="item-label"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  id="item-label"
                  type="text"
                  value={itemForm.label}
                  onChange={(e) =>
                    setItemForm((prev) => ({ ...prev, label: e.target.value }))
                  }
                  aria-invalid={!!itemFormErrors.label}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    itemFormErrors.label
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                      : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                  placeholder="e.g. About Us"
                />
                {itemFormErrors.label && (
                  <p className="mt-1 text-xs text-red-500">
                    {itemFormErrors.label}
                  </p>
                )}
              </div>

              {/* URL */}
              <div>
                <label
                  htmlFor="item-url"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  URL
                </label>
                <input
                  id="item-url"
                  type="text"
                  value={itemForm.url ?? ""}
                  onChange={(e) =>
                    setItemForm((prev) => ({
                      ...prev,
                      url: e.target.value || null,
                    }))
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                  placeholder="/about or https://example.com"
                />
              </div>

              {/* Target */}
              <div>
                <label
                  htmlFor="item-target"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Target
                </label>
                <select
                  id="item-target"
                  value={itemForm.target}
                  onChange={(e) =>
                    setItemForm((prev) => ({
                      ...prev,
                      target: e.target.value as "_self" | "_blank",
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

              {/* Parent */}
              <div>
                <label
                  htmlFor="item-parent"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Parent Item
                </label>
                <select
                  id="item-parent"
                  value={itemForm.parentId ?? ""}
                  onChange={(e) =>
                    setItemForm((prev) => ({
                      ...prev,
                      parentId: e.target.value || null,
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
                  <option value="">— Root (top level) —</option>
                  {parentOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {"  ".repeat(opt.depth)}
                      {opt.depth > 0 ? "↳ " : ""}
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-zinc-400">
                  Nest items up to 3 levels deep.
                </p>
              </div>

              {/* Icon */}
              <div>
                <label
                  htmlFor="item-icon"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Icon
                </label>
                <input
                  id="item-icon"
                  type="text"
                  value={itemForm.icon ?? ""}
                  onChange={(e) =>
                    setItemForm((prev) => ({
                      ...prev,
                      icon: e.target.value || null,
                    }))
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                  placeholder="e.g. Home, Users, Settings"
                />
              </div>

              {/* CSS Class */}
              <div>
                <label
                  htmlFor="item-css"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  CSS Class
                </label>
                <input
                  id="item-css"
                  type="text"
                  value={itemForm.cssClass ?? ""}
                  onChange={(e) =>
                    setItemForm((prev) => ({
                      ...prev,
                      cssClass: e.target.value || null,
                    }))
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-white text-zinc-900",
                    "focus:outline-none focus:ring-1",
                    "dark:bg-zinc-800 dark:text-zinc-100",
                    "border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600",
                  )}
                  placeholder="e.g. nav-highlight"
                />
              </div>

              {/* Visibility & Mega Menu toggles */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input
                    id="item-visible"
                    type="checkbox"
                    checked={itemForm.isVisible}
                    onChange={(e) =>
                      setItemForm((prev) => ({
                        ...prev,
                        isVisible: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                  />
                  <label
                    htmlFor="item-visible"
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Visible
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="item-megamenu"
                    type="checkbox"
                    checked={itemForm.isMegaMenu}
                    onChange={(e) =>
                      setItemForm((prev) => ({
                        ...prev,
                        isMegaMenu: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                  />
                  <label
                    htmlFor="item-megamenu"
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Mega Menu
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
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
                  {editingItemId ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Item Confirm */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
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
                  Delete Menu Item
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {deleteTarget.label}
              </strong>
              ? {deleteTarget.children && deleteTarget.children.length > 0
                ? `All ${deleteTarget.children.length} child items will also be removed.`
                : ""}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
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

// ---------------------------------------------------------------------------
// MenuItemTree Component
// ---------------------------------------------------------------------------

function MenuItemTree({
  items,
  onEdit,
  onDelete,
  onToggleVisibility,
  onMove,
  onAddChild,
  depth,
}: {
  items: MenuItemData[];
  onEdit: (item: MenuItemData) => void;
  onDelete: (item: MenuItemData) => void;
  onToggleVisibility: (item: MenuItemData) => void;
  onMove: (itemId: string, direction: "up" | "down") => void;
  onAddChild: (parentId: string) => void;
  depth: number;
}) {
  return (
    <ul className={cn("space-y-1", depth > 0 && "ml-6 border-l-2 border-zinc-100 pl-3 dark:border-zinc-700")}>
      {items.map((item, index) => (
        <li key={item.id}>
          <div
            className={cn(
              "group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
              "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
              !item.isVisible && "opacity-50",
            )}
          >
            <GripVertical className="h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600 cursor-grab" />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {item.label}
                </span>
                {item.target === "_blank" && (
                  <ExternalLink className="h-3 w-3 shrink-0 text-zinc-400" />
                )}
                {!item.isVisible && (
                  <span className="inline-flex items-center rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    Hidden
                  </span>
                )}
              </div>
              {item.url && (
                <p className="truncate text-xs text-zinc-400 dark:text-zinc-500">
                  {item.url}
                </p>
              )}
            </div>

            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Add child */}
              {depth < 2 && (
                <button
                  onClick={() => onAddChild(item.id)}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                  title="Add child item"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Move up */}
              {index > 0 && (
                <button
                  onClick={() => onMove(item.id, "up")}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                  title="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Move down */}
              {index < items.length - 1 && (
                <button
                  onClick={() => onMove(item.id, "down")}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                  title="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Toggle visibility */}
              <button
                onClick={() => onToggleVisibility(item)}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                title={item.isVisible ? "Hide item" : "Show item"}
              >
                {item.isVisible ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
              </button>

              {/* Edit */}
              <button
                onClick={() => onEdit(item)}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-700 dark:hover:text-blue-400"
                title="Edit item"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>

              {/* Delete */}
              <button
                onClick={() => onDelete(item)}
                className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                title="Delete item"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Render children */}
          {item.children && item.children.length > 0 && (
            <MenuItemTree
              items={item.children}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleVisibility={onToggleVisibility}
              onMove={onMove}
              onAddChild={onAddChild}
              depth={depth + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Count total items recursively */
function countItems(items: MenuItemData[]): number {
  let count = 0;
  for (const item of items) {
    count++;
    if (item.children && item.children.length > 0) {
      count += countItems(item.children);
    }
  }
  return count;
}

/** Add an item to the tree at the correct parent position */
function addItemToTree(
  items: MenuItemData[],
  newItem: MenuItemData,
): MenuItemData[] {
  if (!newItem.parentId) {
    return [...items, { ...newItem, order: items.length }];
  }

  return items.map((item) => {
    if (item.id === newItem.parentId) {
      return {
        ...item,
        children: [
          ...(item.children ?? []),
          { ...newItem, order: (item.children ?? []).length },
        ],
      };
    }
    if (item.children) {
      return {
        ...item,
        children: addItemToTree(item.children, newItem),
      };
    }
    return item;
  });
}
