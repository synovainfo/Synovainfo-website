// =============================================================================
// GET    /api/admin/media/[id] — single media detail
// PUT    /api/admin/media/[id] — update alt text, caption, tags, folder
// DELETE /api/admin/media/[id] — soft-delete media
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const updateMediaSchema = z.object({
  altText: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  folderId: z.string().optional().nullable(),
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
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(
  async (
    _request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> },
  ) => {
    try {
      const id = await getId(context);
      if (!id) {
        return NextResponse.json(
          { error: "Bad Request", message: "Media ID is required" },
          { status: 400 },
        );
      }

      const media = await prisma.media.findFirst({
        where: { id, deletedAt: null },
        select: {
          id: true,
          filename: true,
          originalName: true,
          mimeType: true,
          size: true,
          width: true,
          height: true,
          altText: true,
          caption: true,
          tags: true,
          folderId: true,
          url: true,
          createdAt: true,
          updatedAt: true,
          folder: { select: { id: true, name: true } },
          uploadedBy: { select: { id: true, name: true, image: true } },
        },
      });

      if (!media) {
        return NextResponse.json(
          { error: "Not Found", message: "Media not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ media });
    } catch (error) {
      console.error("[MEDIA_GET_ID]", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: "Failed to fetch media" },
        { status: 500 },
      );
    }
  },
  "pages:manage",
);

// ---------------------------------------------------------------------------
// PUT
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
          { error: "Bad Request", message: "Media ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.media.findFirst({
        where: { id, deletedAt: null },
      });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Media not found" },
          { status: 404 },
        );
      }

      const body = await request.json();
      const parsed = updateMediaSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "Validation Error",
            details: parsed.error.flatten().fieldErrors,
          },
          { status: 400 },
        );
      }

      const { altText, caption, tags, folderId } = parsed.data;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: Record<string, any> = {};
      if (altText !== undefined) updateData.altText = altText;
      if (caption !== undefined) updateData.caption = caption;
      if (tags !== undefined) updateData.tags = tags;
      if (folderId !== undefined) updateData.folderId = folderId;

      const media = await prisma.media.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          filename: true,
          originalName: true,
          mimeType: true,
          size: true,
          width: true,
          height: true,
          altText: true,
          caption: true,
          tags: true,
          folderId: true,
          url: true,
          createdAt: true,
          updatedAt: true,
          folder: { select: { id: true, name: true } },
        },
      });

      return NextResponse.json({ media });
    } catch (error) {
      console.error("[MEDIA_PUT]", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: "Failed to update media" },
        { status: 500 },
      );
    }
  },
  "pages:manage",
);

// ---------------------------------------------------------------------------
// DELETE (soft delete)
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
          { error: "Bad Request", message: "Media ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.media.findFirst({
        where: { id, deletedAt: null },
      });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Media not found" },
          { status: 404 },
        );
      }

      await prisma.media.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        message: "Media deleted successfully",
      });
    } catch (error) {
      console.error("[MEDIA_DELETE]", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: "Failed to delete media" },
        { status: 500 },
      );
    }
  },
  "pages:manage",
);
