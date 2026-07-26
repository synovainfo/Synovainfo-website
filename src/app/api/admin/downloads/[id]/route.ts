// =============================================================================
// GET    /api/admin/downloads/[id] — single download detail
// PUT    /api/admin/downloads/[id] — update download
// DELETE /api/admin/downloads/[id] — delete download
// Permission: downloads:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";
import { getToken } from "next-auth/jwt";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const updateDownloadSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  fileSize: z.number().int().nonnegative().optional().nullable(),
  fileType: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  status: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getId(context: {
  params: Promise<Record<string, string | string[] | undefined>>;
}): Promise<string | null> {
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
          { error: "Bad Request", message: "Download ID is required" },
          { status: 400 },
        );
      }

      const download = await prisma.download.findUnique({
        where: { id },
      });

      if (!download) {
        return NextResponse.json(
          { error: "Not Found", message: "Download not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ download });
    } catch (error) {
      console.error("[DOWNLOAD_GET]", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: "Failed to fetch download" },
        { status: 500 },
      );
    }
  },
  "downloads:manage",
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
          { error: "Bad Request", message: "Download ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.download.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Download not found" },
          { status: 404 },
        );
      }

      const body = await request.json();
      const parsed = updateDownloadSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
          { status: 400 },
        );
      }

      const { title, description, fileUrl, fileSize, fileType, category, icon, isFeatured, status } =
        parsed.data;

      const updateData: Record<string, unknown> = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
      if (fileSize !== undefined) updateData.fileSize = fileSize;
      if (fileType !== undefined) updateData.fileType = fileType;
      if (category !== undefined) updateData.category = category;
      if (icon !== undefined) updateData.icon = icon;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
      if (status !== undefined) updateData.status = status;

      const download = await prisma.download.update({
        where: { id },
        data: updateData,
      });

      // Audit log
      const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
      });
      await prisma.auditLog
        .create({
          data: {
            userId: token?.sub ?? "unknown",
            action: "UPDATE",
            resource: "Download",
            resourceId: download.id,
            details: { title: download.title },
          },
        })
        .catch((err: unknown) => console.error("[AUDIT_FAILED]", err));

      return NextResponse.json({ download });
    } catch (error) {
      console.error("[DOWNLOAD_PUT]", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: "Failed to update download" },
        { status: 500 },
      );
    }
  },
  "downloads:manage",
);

// ---------------------------------------------------------------------------
// DELETE
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
          { error: "Bad Request", message: "Download ID is required" },
          { status: 400 },
        );
      }

      const existing = await prisma.download.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Download not found" },
          { status: 404 },
        );
      }

      await prisma.download.delete({ where: { id } });

      // Audit log
      const token = await getToken({
        req: _request,
        secret: process.env.AUTH_SECRET,
      });
      await prisma.auditLog
        .create({
          data: {
            userId: token?.sub ?? "unknown",
            action: "DELETE",
            resource: "Download",
            resourceId: id,
            details: { title: existing.title },
          },
        })
        .catch((err: unknown) => console.error("[AUDIT_FAILED]", err));

      return NextResponse.json({ success: true, message: "Download deleted successfully" });
    } catch (error) {
      console.error("[DOWNLOAD_DELETE]", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: "Failed to delete download" },
        { status: 500 },
      );
    }
  },
  "downloads:manage",
);
