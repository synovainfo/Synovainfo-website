// =============================================================================
// Media library helpers — file upload, image dimension detection, type helpers
// =============================================================================

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// ---------------------------------------------------------------------------
// Directory helpers
// ---------------------------------------------------------------------------

export async function ensureUploadDir(): Promise<void> {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch {
    // directory already exists
  }
}

// ---------------------------------------------------------------------------
// Filename helpers
// ---------------------------------------------------------------------------

export function generateFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const base = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const timestamp = Date.now();
  const uniqueId = uuidv4().slice(0, 8);
  return `${base}-${timestamp}-${uniqueId}${ext}`;
}

// ---------------------------------------------------------------------------
// File I/O
// ---------------------------------------------------------------------------

export async function saveFile(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  await ensureUploadDir();
  const filePath = path.join(UPLOAD_DIR, filename);
  await writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

// ---------------------------------------------------------------------------
// Image dimension detection (basic — no sharp dependency)
// ---------------------------------------------------------------------------

export function getImageDimensions(
  buffer: Buffer,
): { width: number; height: number } | null {
  try {
    // PNG
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
      };
    }

    // JPEG
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        if (
          marker === 0xc0 ||
          marker === 0xc1 ||
          marker === 0xc2
        ) {
          return {
            height: buffer.readUInt16BE(offset + 5),
            width: buffer.readUInt16BE(offset + 7),
          };
        }
        const length = buffer.readUInt16BE(offset + 2);
        offset += length + 2;
      }
    }

    // GIF
    if (
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46
    ) {
      return {
        width: buffer.readUInt16LE(6),
        height: buffer.readUInt16LE(8),
      };
    }

    // WebP
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    ) {
      const isLossy = buffer[12] === 0x56 && buffer[13] === 0x50;
      if (isLossy) {
        const bits = buffer.readUInt32LE(20);
        return {
          width: (bits & 0x3fff) + 1,
          height: ((bits >> 16) & 0x3fff) + 1,
        };
      }
      const bits = buffer.readUInt32LE(24);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 16) & 0x3fff) + 1,
      };
    }

    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// MIME / type helpers
// ---------------------------------------------------------------------------

export type MediaTypeLabel = "IMAGE" | "SVG" | "VIDEO" | "PDF" | "DOCUMENT";

export function getMediaType(mimeType: string): MediaTypeLabel {
  if (mimeType === "image/svg+xml") return "SVG";
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (mimeType === "application/pdf") return "PDF";
  return "DOCUMENT";
}

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
  "application/pdf",
  "video/mp4",
  "video/webm",
  "video/ogg",
];

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
