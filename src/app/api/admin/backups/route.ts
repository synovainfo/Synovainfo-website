// =============================================================================
// GET / POST /api/admin/backups — list and create backups
// Permission: settings:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// GET — list all backups
// ---------------------------------------------------------------------------

export const GET = withPermission(async () => {
  try {
    const backups = await prisma.backup.findMany({
      orderBy: { createdAt: "desc" },
    });

    const data = backups.map((b) => ({
      id: b.id,
      filename: b.filename,
      fileSize: b.fileSize,
      type: b.type,
      status: b.status,
      fileUrl: b.fileUrl,
      startedAt: b.startedAt?.toISOString() ?? null,
      completedAt: b.completedAt?.toISOString() ?? null,
      createdAt: b.createdAt.toISOString(),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[BACKUPS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch backups" },
      { status: 500 },
    );
  }
}, "settings:manage");

// ---------------------------------------------------------------------------
// POST — create a new backup (stub: records intent, actual backup is async)
// ---------------------------------------------------------------------------

export const POST = withPermission(async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `synova-backup-${timestamp}.sql`;

    const backup = await prisma.backup.create({
      data: {
        filename,
        type: "manual",
        status: "RUNNING",
        startedAt: new Date(),
        fileSize: 0,
      },
    });

    // In production, a background job would run the actual backup.
    // For now, simulate completion after a short delay (fire-and-forget).
    simulateBackupCompletion(backup.id);

    return NextResponse.json(
      {
        data: {
          id: backup.id,
          filename: backup.filename,
          fileSize: backup.fileSize,
          type: backup.type,
          status: backup.status,
          fileUrl: backup.fileUrl,
          startedAt: backup.startedAt?.toISOString() ?? null,
          completedAt: backup.completedAt?.toISOString() ?? null,
          createdAt: backup.createdAt.toISOString(),
        },
        message: "Backup has been started",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[BACKUPS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create backup" },
      { status: 500 },
    );
  }
}, "settings:manage");

// ---------------------------------------------------------------------------
// Simulate backup completion (in production, replace with a queue worker)
// ---------------------------------------------------------------------------

async function simulateBackupCompletion(backupId: string): Promise<void> {
  try {
    // Simulate 3-8 second delay
    const delay = 3000 + Math.random() * 5000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    await prisma.backup.update({
      where: { id: backupId },
      data: {
        status: "COMPLETED",
        fileSize: Math.floor(Math.random() * 50_000_000) + 1_000_000,
        completedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("[BACKUP_SIMULATION]", error);
    // Mark as failed if update fails
    try {
      await prisma.backup.update({
        where: { id: backupId },
        data: { status: "FAILED" },
      });
    } catch {
      // Ignore double-failure
    }
  }
}
