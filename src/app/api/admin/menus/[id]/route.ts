// =============================================================================
// GET    /api/admin/menus/[id] — single menu with nested items (tree)
// PUT    /api/admin/menus/[id] — update menu + bulk replace items
// DELETE /api/admin/menus/[id] — delete menu (cascades items)
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const updateMenuSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  location: z.string().max(100).optional().nullable(),
});

type MenuItemInput = z.infer<typeof menuItemSchema>;
const menuItemSchema: z.ZodType<{
  id?: string;
  parentId?: string | null;
  label: string;
  url?: string | null;
  target?: "_self" | "_blank";
  icon?: string | null;
  cssClass?: string | null;
  isVisible?: boolean;
  isMegaMenu?: boolean;
  megaMenuColumns?: unknown;
  order?: number;
  children?: MenuItemInput[];
}> = z.object({
  id: z.string().optional(),
  parentId: z.string().nullable().optional(),
  label: z.string().min(1, "Label is required").max(200),
  url: z.string().max(500).optional().nullable(),
  target: z.enum(["_self", "_blank"]).optional().default("_self"),
  icon: z.string().max(100).optional().nullable(),
  cssClass: z.string().max(200).optional().nullable(),
  isVisible: z.boolean().optional().default(true),
  isMegaMenu: z.boolean().optional().default(false),
  megaMenuColumns: z.any().optional().nullable(),
  order: z.number().int().optional().default(0),
  children: z.lazy(() => menuItemSchema.array().optional()),
});


const bulkReplaceItemsSchema = z.object({
  items: z.array(menuItemSchema as z.ZodType<MenuItemInput>),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getId(
  context: { params: Promise<Record<string, string | string[] | undefined>> },
): Promise<string | null> {
  const params = await context.params;
  const id = params.id;
  return typeof id === "string" ? id : null;
}

async function findMenuOrError(id: string) {
  const menu = await prisma.menu.findUnique({ where: { id } });
  if (!menu) {
    return {
      error: NextResponse.json(
        { error: "Not Found", message: "Menu not found" },
        { status: 404 },
      ),
    };
  }
  return { menu };
}

// ---------------------------------------------------------------------------
// Build tree from flat items
// ---------------------------------------------------------------------------

interface MenuItemRaw {
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
  createdAt: Date;
  updatedAt: Date;
  children?: MenuItemRaw[];
}

function buildItemTree(items: MenuItemRaw[]): MenuItemRaw[] {
  const map = new Map<string, MenuItemRaw>();
  const roots: MenuItemRaw[] = [];

  for (const item of items) {
    map.set(item.id, { ...item, children: [] as unknown as MenuItemRaw[] });
  }

  for (const item of map.values()) {
    if (item.parentId && map.has(item.parentId)) {
      const parent = map.get(item.parentId)!;
      (parent.children as unknown as MenuItemRaw[]).push(item);
    } else {
      roots.push(item);
    }
  }

  const sortItems = (list: MenuItemRaw[]) => {
    list.sort((a, b) => a.order - b.order);
    for (const item of list) {
      if ((item.children as unknown as MenuItemRaw[])?.length) {
        sortItems(item.children as unknown as MenuItemRaw[]);
      }
    }
  };
  sortItems(roots);

  return roots;
}

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(async (
  _request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) => {
  try {
    const id = await getId(context);
    if (!id) {
      return NextResponse.json(
        { error: "Bad Request", message: "ID is required" },
        { status: 400 },
      );
    }

    const result = await findMenuOrError(id);
    if (result.error) return result.error;

    const items = await prisma.menuItem.findMany({
      where: { menuId: id },
      orderBy: { order: "asc" },
    });

    const tree = buildItemTree(items as MenuItemRaw[]);

    return NextResponse.json({
      menu: result.menu,
      items: tree,
      flatItems: items,
    });
  } catch (error) {
    console.error("[MENU_GET]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch menu",
      },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// PUT — update menu metadata
// ---------------------------------------------------------------------------

export const PUT = withPermission(async (
  request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) => {
  try {
    const id = await getId(context);
    if (!id) {
      return NextResponse.json(
        { error: "Bad Request", message: "ID is required" },
        { status: 400 },
      );
    }

    const menuResult = await findMenuOrError(id);
    if (menuResult.error) return menuResult.error;

    const body = await request.json();

    // If items array is present, do a bulk replace
    if (body.items !== undefined) {
      const parsed = bulkReplaceItemsSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "Validation Error",
            details: parsed.error.flatten().fieldErrors,
          },
          { status: 400 },
        );
      }

      // Flatten nested items into a list with parent references
      const flatItems: Array<{
        tempId: string;
        label: string;
        url: string | null;
        target: string;
        icon: string | null;
        cssClass: string | null;
        isVisible: boolean;
        isMegaMenu: boolean;
        megaMenuColumns: unknown;
        order: number;
        parentTempId: string | null;
      }> = [];

      let counter = 0;

      function flattenItems(
        items: MenuItemInput[],
        parentTempId: string | null,
      ) {
        for (const item of items) {
          const tempId = `new_${counter++}`;
          flatItems.push({
            tempId,
            label: item.label,
            url: item.url ?? null,
            target: item.target ?? "_self",
            icon: item.icon ?? null,
            cssClass: item.cssClass ?? null,
            isVisible: item.isVisible ?? true,
            isMegaMenu: item.isMegaMenu ?? false,
            megaMenuColumns: item.megaMenuColumns ?? null,
            order: item.order ?? 0,
            parentTempId,
          });
          if (item.children && item.children.length > 0) {
            flattenItems(item.children, tempId);
          }
        }
      }

      flattenItems(parsed.data.items, null);

      // Replace all items in a transaction
      await prisma.$transaction(async (tx) => {
        // Delete all existing items
        await tx.menuItem.deleteMany({ where: { menuId: id } });

        // Create new items
        for (const item of flatItems) {
          await tx.menuItem.create({
            data: {
              menuId: id,
              label: item.label,
              url: item.url,
              target: item.target,
              icon: item.icon,
              cssClass: item.cssClass,
              isVisible: item.isVisible,
              isMegaMenu: item.isMegaMenu,
              megaMenuColumns: item.megaMenuColumns !== null && item.megaMenuColumns !== undefined
                ? (item.megaMenuColumns as Prisma.InputJsonValue)
                : Prisma.DbNull,
              order: item.order,
              // parentId will be resolved in a second pass
            },
          });
        }
      });

      // Second pass: set parentId relationships
      // Fetch the newly created items to map old temp IDs to real IDs
      const newItems = await prisma.menuItem.findMany({
        where: { menuId: id },
        orderBy: { createdAt: "asc" },
      });

      if (newItems.length !== flatItems.length) {
        // edge case — just return the menu without parent resolution
        const menu = await prisma.menu.findUnique({ where: { id } });
        return NextResponse.json({ menu, items: [] });
      }

      for (let i = 0; i < flatItems.length; i++) {
        const flat = flatItems[i];
        const realItem = newItems[i];
        if (flat.parentTempId !== null) {
          const parentIndex = flatItems.findIndex(
            (f) => f.tempId === flat.parentTempId,
          );
          if (parentIndex >= 0) {
            await prisma.menuItem.update({
              where: { id: realItem.id },
              data: { parentId: newItems[parentIndex].id },
            });
          }
        }
      }

      // Update menu metadata if provided
      const menuUpdate: Record<string, unknown> = {};
      if (body.name !== undefined) menuUpdate.name = body.name;
      if (body.slug !== undefined) menuUpdate.slug = body.slug;
      if (body.location !== undefined) menuUpdate.location = body.location;

      const menu = await prisma.menu.update({
        where: { id },
        data: menuUpdate,
      });

      // Fetch final items
      const finalItems = await prisma.menuItem.findMany({
        where: { menuId: id },
        orderBy: { order: "asc" },
      });

      const tree = buildItemTree(finalItems as MenuItemRaw[]);

      return NextResponse.json({ menu, items: tree, flatItems: finalItems });
    }

    // Otherwise, just update menu metadata
    const parsed = updateMenuSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (parsed.data.slug) {
      const slugExists = await prisma.menu.findFirst({
        where: { slug: parsed.data.slug, id: { not: id } },
      });
      if (slugExists) {
        return NextResponse.json(
          {
            error: "Conflict",
            message: `A menu with slug "${parsed.data.slug}" already exists`,
          },
          { status: 409 },
        );
      }
    }

    const menu = await prisma.menu.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ menu });
  } catch (error) {
    console.error("[MENU_PUT]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to update menu",
      },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

export const DELETE = withPermission(async (
  _request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) => {
  try {
    const id = await getId(context);
    if (!id) {
      return NextResponse.json(
        { error: "Bad Request", message: "ID is required" },
        { status: 400 },
      );
    }

    const result = await findMenuOrError(id);
    if (result.error) return result.error;

    await prisma.menu.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    console.error("[MENU_DELETE]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to delete menu",
      },
      { status: 500 },
    );
  }
}, "pages:manage");
