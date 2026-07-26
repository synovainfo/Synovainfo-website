// =============================================================================
// Database Backup Utility
// - Creates, lists, downloads, and restores PostgreSQL backups
// - Uses pg_dump/psql when available, falls back to prisma $queryRaw
// - Tracks backup state via the Backup model in Prisma
// =============================================================================

import { exec } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

import { prisma } from "@/lib/prisma";
import { createChildLogger } from "@/lib/logger";

const execAsync = promisify(exec);
const log = createChildLogger("backup");

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const BACKUP_DIR = resolve(
  process.env.BACKUP_DIR ?? "./backups",
);

const DATABASE_URL = process.env.DATABASE_URL ?? "";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface BackupRecord {
  id: string;
  filename: string;
  size: number | null;
  status: string;
  createdAt: Date;
}

export interface CreateBackupResult {
  id: string;
  url: string;
  size: number;
}

// -----------------------------------------------------------------------------
// Internal helpers
// -----------------------------------------------------------------------------

function ensureBackupDir(): void {
  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

function generateFilename(): string {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  return `synova-backup-${ts}.sql`;
}

function fileUrlFor(filename: string): string {
  return `/backups/${filename}`;
}

async function hasTool(tool: "pg_dump" | "psql"): Promise<boolean> {
  try {
    await execAsync(`${tool} --version`, { timeout: 5_000 });
    return true;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// Backup strategies
// -----------------------------------------------------------------------------

/**
 * Primary strategy: use pg_dump for a full SQL dump.
 * Produces a plain-format SQL file.
 */
async function dumpViaPgDump(filePath: string): Promise<number> {
  const args = [
    `"${DATABASE_URL}"`,
    `--file="${filePath}"`,
    "--format=plain",
    "--no-owner",
    "--no-acl",
    "--no-comments",
  ].join(" ");

  await execAsync(`pg_dump ${args}`, { timeout: 300_000 });

  return statSync(filePath).size;
}

/**
 * Fallback strategy: use prisma.$queryRawUnsafe to export each table.
 * Used when pg_dump is not available on the system.
 */
async function dumpViaQueryRaw(filePath: string): Promise<number> {
  const tables = await prisma.$queryRawUnsafe<
    { table_name: string }[]
  >(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_type = 'BASE TABLE'
       AND table_name != '_prisma_migrations'
     ORDER BY table_name`,
  );

  const lines: string[] = [
    `-- Synova Backup — ${new Date().toISOString()}`,
    `-- Generated via prisma $queryRaw fallback`,
    "",
    "BEGIN;",
    "",
  ];

  for (const { table_name } of tables) {
    try {
      const rows = await prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(`SELECT * FROM "${table_name}"`);

      if (rows.length === 0) {
        log.debug({ table: table_name }, "Skipping empty table");
        continue;
      }

      const columns = Object.keys(rows[0]!);
      const columnList = columns.map((c) => `"${c}"`).join(", ");

      for (const row of rows) {
        const values = columns.map((col) => {
          const val = row[col];
          if (val === null || val === undefined) return "NULL";
          if (typeof val === "number") return String(val);
          if (typeof val === "boolean") return val ? "true" : "false";
          if (val instanceof Date) return `'${val.toISOString()}'`;
          return `'${String(val).replace(/'/g, "''")}'`;
        });
        lines.push(
          `INSERT INTO "${table_name}" (${columnList}) VALUES (${values.join(", ")});`,
        );
      }

      log.debug({ table: table_name, rows: rows.length }, "Table exported");
    } catch (err) {
      log.warn(
        { table: table_name, err: String(err) },
        "Failed to export table via $queryRaw; skipping",
      );
    }
  }

  lines.push("", "COMMIT;", "");

  writeFileSync(filePath, lines.join("\n"), "utf-8");
  return statSync(filePath).size;
}

/**
 * Restore fallback: execute stored INSERT statements via $executeRawUnsafe.
 * Used when psql is not available.
 */
async function restoreViaExecuteRaw(filePath: string): Promise<void> {
  const content = readFileSync(filePath, "utf-8");

  // Split on semicolons to isolate individual statements,
  // then filter out empty lines and SQL meta-statements.
  const statements = content
    .split(";")
    .map((s) => s.trim())
    .filter(
      (s) =>
        s.length > 0 &&
        !s.startsWith("--") &&
        !/^(BEGIN|COMMIT|ROLLBACK)\s*$/i.test(s),
    );

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]!;
    try {
      await prisma.$executeRawUnsafe(`${stmt};`);
    } catch (err) {
      log.error(
        { statementIndex: i, err: String(err) },
        "Restore statement failed",
      );
      throw new Error(
        `Restore failed at statement ${i + 1}/${statements.length}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

/**
 * Create a database backup.
 *
 * 1. Inserts a Backup record with status RUNNING.
 * 2. Attempts pg_dump (primary). Falls back to prisma $queryRaw if pg_dump
 *    is not available.
 * 3. Updates the record to COMPLETED on success or FAILED on error.
 */
export async function createBackup(): Promise<CreateBackupResult> {
  const filename = generateFilename();
  const url = fileUrlFor(filename);

  const record = await prisma.backup.create({
    data: {
      filename,
      status: "RUNNING",
      type: "manual",
      fileUrl: url,
      startedAt: new Date(),
    },
  });

  const filePath = join(BACKUP_DIR, filename);

  try {
    ensureBackupDir();

    const canDump = await hasTool("pg_dump");
    let fileSize: number;

    if (canDump) {
      log.info({ id: record.id }, "Starting pg_dump backup");
      fileSize = await dumpViaPgDump(filePath);
    } else {
      log.info(
        { id: record.id },
        "pg_dump not available; using prisma $queryRaw fallback for data export",
      );
      fileSize = await dumpViaQueryRaw(filePath);
    }

    await prisma.backup.update({
      where: { id: record.id },
      data: {
        status: "COMPLETED",
        fileSize,
        completedAt: new Date(),
      },
    });

    log.info({ id: record.id, size: fileSize }, "Backup completed");

    return { id: record.id, url, size: fileSize };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error({ id: record.id, err: message }, "Backup failed");

    // Mark as FAILED — swallow secondary errors to preserve the original cause
    await prisma.backup
      .update({
        where: { id: record.id },
        data: { status: "FAILED" },
      })
      .catch((updateErr) =>
        log.error(
          { id: record.id, err: String(updateErr) },
          "Failed to mark backup as FAILED",
        ),
      );

    throw new Error(`Backup failed: ${message}`);
  }
}

/**
 * List all available backups, ordered by creation date (newest first).
 */
export async function listBackups(): Promise<BackupRecord[]> {
  try {
    const backups = await prisma.backup.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        filename: true,
        fileSize: true,
        status: true,
        createdAt: true,
      },
    });

    return backups.map((b) => ({
      id: b.id,
      filename: b.filename,
      size: b.fileSize,
      status: b.status,
      createdAt: b.createdAt,
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error({ err: message }, "Failed to list backups");
    throw new Error(`Failed to list backups: ${message}`);
  }
}

/**
 * Get the download URL for a specific backup by its ID.
 */
export async function getBackupUrl(id: string): Promise<string> {
  try {
    const backup = await prisma.backup.findUnique({
      where: { id },
      select: { fileUrl: true },
    });

    if (!backup) {
      throw new Error(`Backup not found: ${id}`);
    }

    if (!backup.fileUrl) {
      throw new Error(`Backup ${id} has no file URL`);
    }

    return backup.fileUrl;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.startsWith("Backup not found") ||
        error.message.endsWith("has no file URL"))
    ) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error({ id, err: message }, "Failed to get backup URL");
    throw new Error(`Failed to get backup URL: ${message}`);
  }
}

/**
 * Restore the database from a completed backup.
 *
 * Primary path: pipes the SQL file through psql.
 * Fallback path: executes stored INSERT statements via $executeRawUnsafe.
 *
 * Updates the backup record status to RUNNING during restore,
 * then COMPLETED or FAILED.
 */
export async function restoreBackup(id: string): Promise<void> {
  let record;

  try {
    record = await prisma.backup.findUnique({ where: { id } });

    if (!record) {
      throw new Error(`Backup not found: ${id}`);
    }

    if (record.status !== "COMPLETED") {
      throw new Error(
        `Cannot restore backup with status "${record.status}"; expected COMPLETED`,
      );
    }

    const filePath = join(BACKUP_DIR, record.filename);

    if (!existsSync(filePath)) {
      throw new Error(
        `Backup file not found on disk: ${record.filename} (expected at ${filePath})`,
      );
    }

    log.info({ id, filename: record.filename }, "Starting restore");

    await prisma.backup.update({
      where: { id },
      data: { status: "RUNNING", startedAt: new Date() },
    });

    const canRestore = await hasTool("psql");

    if (canRestore) {
      await execAsync(`psql "${DATABASE_URL}" < "${filePath}"`, {
        timeout: 300_000,
      });
    } else {
      log.info(
        { id },
        "psql not available; restoring via prisma $executeRawUnsafe fallback",
      );
      await restoreViaExecuteRaw(filePath);
    }

    await prisma.backup.update({
      where: { id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    log.info({ id }, "Restore completed successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error({ id, err: message }, "Restore failed");

    if (record) {
      await prisma.backup
        .update({
          where: { id },
          data: { status: "FAILED" },
        })
        .catch((updateErr) =>
          log.error(
            { id, err: String(updateErr) },
            "Failed to mark restore as FAILED",
          ),
        );
    }

    throw new Error(`Restore failed: ${message}`);
  }
}
