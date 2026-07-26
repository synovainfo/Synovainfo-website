// =============================================================================
// GET  /api/admin/media — paginated media list with folder / search / type filter
// POST /api/admin/media — upload a file (multipart/form-data)
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { withPermission } from "@/lib/authorization";
import {
  generateFilename,
  saveFile,
  getImageDimensions,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/media";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(48),
  search: z.string().optional().default(""),
  folderId: z.string().optional(),
  type: z.enum(["IMAGE", "SVG", "VIDEO", "PDF", "DOCUMENT"]).optional(),
  sort: z
    .enum(["createdAt", "updatedAt", "filename", "size"])
    .optional()
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// ---------------------------------------------------------------------------
// GET — paginated list
// ---------------------------------------------------------------------------

export const GET = withPermission(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const parsed = listQuerySchema.safeParse(
      Object.fromEntries(url.searchParams),
    );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { page, pageSize, search, folderId, type, sort, order } =
      parsed.data;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { deletedAt: null };

    if (folderId) {
      where.folderId = folderId;
    } else if (folderId === "") {
      // Explicit empty = root level only
      where.folderId = null;
    }

    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: "insensitive" } },
        { altText: { contains: search, mode: "insensitive" } },
        { caption: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type) {
      switch (type) {
        case "IMAGE":
          where.mimeType = { startsWith: "image/", not: "image/svg+xml" };
          break;
        case "SVG":
          where.mimeType = "image/svg+xml";
          break;
        case "VIDEO":
          where.mimeType = { startsWith: "video/" };
          break;
        case "PDF":
          where.mimeType = "application/pdf";
          break;
        case "DOCUMENT":
          where.mimeType = { notIn: ["image/svg+xml", "application/pdf"] };
          where.NOT = [
            { mimeType: { startsWith: "image/" } },
            { mimeType: { startsWith: "video/" } },
          ];
          break;
      }
    }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
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
          uploadedBy: { select: { id: true, name: true } },
        },
      }),
      prisma.media.count({ where }),
    ]);

    return NextResponse.json({
      media,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[MEDIA_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch media" },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// POST — upload file
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    const userId = token?.sub ?? "";

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folderId = (formData.get("folderId") as string | null) || null;
    const altText = (formData.get("altText") as string | null) || null;

    if (!file) {
      return NextResponse.json(
        { error: "Bad Request", message: "File is required" },
        { status: 400 },
      );
    }

    // Validate MIME
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: `File type "${file.type}" is not allowed`,
        },
        { status: 400 },
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "File exceeds maximum size of 20 MB",
        },
        { status: 400 },
      );
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate filename and save
    const filename = generateFilename(file.name);
    const url = await saveFile(buffer, filename);

    // Detect dimensions for images
    let width: number | null = null;
    let height: number | null = null;
    if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      const dims = getImageDimensions(buffer);
      if (dims) {
        width = dims.width;
        height = dims.height;
      }
    }

    // Create DB record
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        width,
        height,
        altText,
        folderId,
        uploadedById: userId,
        url,
      },
      select: {
        id: true,
        filename: true,
        originalName: true,
        mimeType: true,
        size: true,
        width: true,
        height: true,
        altText: true,
        tags: true,
        folderId: true,
        url: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    console.error("[MEDIA_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to upload file" },
      { status: 500 },
    );
  }
}, "pages:manage");
