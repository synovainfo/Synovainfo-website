// =============================================================================
// GET  /api/admin/downloads — paginated list with search & filter
// POST /api/admin/downloads — create a new download
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

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional().default(""),
  category: z.string().optional(),
  status: z.enum(["true", "false"]).optional(),
  featured: z.enum(["true", "false"]).optional(),
  sort: z.enum(["title", "category", "status", "isFeatured", "downloadCount", "fileType", "createdAt"])
    .optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const createDownloadSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  fileSize: z.number().int().nonnegative().optional().nullable(),
  fileType: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  isFeatured: z.boolean().optional().default(false),
  status: z.boolean().optional().default(true),
});

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const parsed = listQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { page, pageSize, search, category, status, featured, sort, order } = parsed.data;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) where.category = category;
    if (status !== undefined) where.status = status === "true";
    if (featured !== undefined) where.isFeatured = featured === "true";

    const [downloads, total] = await Promise.all([
      prisma.download.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.download.count({ where }),
    ]);

    return NextResponse.json({
      downloads,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error("[DOWNLOADS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch downloads" },
      { status: 500 },
    );
  }
}, "downloads:manage");

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------

export const POST = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = createDownloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { title, description, fileUrl, fileSize, fileType, category, icon, isFeatured, status } =
      parsed.data;

    const download = await prisma.download.create({
      data: {
        title,
        description,
        fileUrl,
        fileSize,
        fileType,
        category,
        icon,
        isFeatured,
        status,
      },
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
          action: "CREATE",
          resource: "Download",
          resourceId: download.id,
          details: { title: download.title },
        },
      })
      .catch((err: unknown) => console.error("[AUDIT_FAILED]", err));

    return NextResponse.json({ download }, { status: 201 });
  } catch (error) {
    console.error("[DOWNLOADS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create download" },
      { status: 500 },
    );
  }
}, "downloads:manage");
