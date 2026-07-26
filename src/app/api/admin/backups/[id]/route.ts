// =============================================================================
// DELETE /api/admin/backups/[id] — delete a backup record
// Permission: settings:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// DELETE — remove a backup
// ---------------------------------------------------------------------------

interface DeleteParams {
  id: string;
  [key: string]: string | string[] | undefined;
}

export const DELETE = withPermission<DeleteParams>(
  async (
    _request: NextRequest,
    context: { params: Promise<DeleteParams> },
  ) => {
    try {
      const { id } = await context.params;

      const existing = await prisma.backup.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json(
          { error: "Not Found", message: "Backup not found" },
          { status: 404 },
        );
      }

      await prisma.backup.delete({ where: { id } });

      return NextResponse.json({
        message: "Backup deleted successfully",
      });
    } catch (error) {
      console.error("[BACKUPS_DELETE]", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Failed to delete backup",
        },
        { status: 500 },
      );
    }
  },
  "settings:manage",
);
