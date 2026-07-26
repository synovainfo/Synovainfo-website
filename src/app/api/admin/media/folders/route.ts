// =============================================================================
// GET  /api/admin/media/folders — list all folders (flat list — client builds tree)
// POST /api/admin/media/folders — create a new folder
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(100),
  parentId: z.string().optional().nullable(),
});

// ---------------------------------------------------------------------------
// GET — list all folders (flat)
// ---------------------------------------------------------------------------

export const GET = withPermission(async () => {
  try {
    const folders = await prisma.mediaFolder.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            children: true,
            media: true,
          },
        },
      },
    });

    return NextResponse.json({ folders });
  } catch (error) {
    console.error("[MEDIA_FOLDERS_GET]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch folders",
      },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// POST — create folder
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    const userId = token?.sub ?? "";

    const body = await request.json();
    const parsed = createFolderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, parentId } = parsed.data;

    // If parentId provided, verify it exists
    if (parentId) {
      const parent = await prisma.mediaFolder.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        return NextResponse.json(
          { error: "Not Found", message: "Parent folder not found" },
          { status: 404 },
        );
      }
    }

    const folder = await prisma.mediaFolder.create({
      data: {
        name,
        parentId: parentId ?? null,
        createdById: userId,
      },
    });

    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    console.error("[MEDIA_FOLDERS_POST]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create folder",
      },
      { status: 500 },
    );
  }
}, "pages:manage");
