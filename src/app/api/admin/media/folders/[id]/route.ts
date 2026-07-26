// =============================================================================
// PUT    /api/admin/media/folders/[id] — rename a folder
// DELETE /api/admin/media/folders/[id] — delete an empty folder
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const renameFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(100),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getId(
  context: {
    params: Promise<Record<string, string | string[] | undefined>>;
  },
): Promise<string | null> {
  const params = await context.params;
  const id = params.id;
  return typeof id === "string" ? id : null;
}

// ---------------------------------------------------------------------------
// PUT — rename
// ---------------------------------------------------------------------------

export const PUT = withPermission(
  async (
    request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> },
  ) => {
    try {
      const id = await getId(context);
      if (!id) {
        return NextResponse.json(
          { error: "Bad Request", message: "Folder ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.mediaFolder.findUnique({
        where: { id },
      });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Folder not found" },
          { status: 404 },
        );
      }

      const body = await request.json();
      const parsed = renameFolderSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "Validation Error",
            details: parsed.error.flatten().fieldErrors,
          },
          { status: 400 },
        );
      }

      const folder = await prisma.mediaFolder.update({
        where: { id },
        data: { name: parsed.data.name },
      });

      return NextResponse.json({ folder });
    } catch (error) {
      console.error("[MEDIA_FOLDERS_PUT]", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Failed to rename folder",
        },
        { status: 500 },
      );
    }
  },
  "pages:manage",
);

// ---------------------------------------------------------------------------
// DELETE — delete folder (only if empty — no children, no media)
// ---------------------------------------------------------------------------

export const DELETE = withPermission(
  async (
    _request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> },
  ) => {
    try {
      const id = await getId(context);
      if (!id) {
        return NextResponse.json(
          { error: "Bad Request", message: "Folder ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.mediaFolder.findUnique({
        where: { id },
        include: {
          _count: { select: { children: true, media: true } },
        },
      });

      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Folder not found" },
          { status: 404 },
        );
      }

      if (existing._count.children > 0 || existing._count.media > 0) {
        return NextResponse.json(
          {
            error: "Conflict",
            message:
              "Folder is not empty. Remove all files and subfolders first.",
          },
          { status: 409 },
        );
      }

      await prisma.mediaFolder.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: "Folder deleted successfully",
      });
    } catch (error) {
      console.error("[MEDIA_FOLDERS_DELETE]", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Failed to delete folder",
        },
        { status: 500 },
      );
    }
  },
  "pages:manage",
);
