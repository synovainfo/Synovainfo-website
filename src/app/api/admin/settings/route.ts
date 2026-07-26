// =============================================================================
// GET/PUT /api/admin/settings — global key-value settings store
// Permission: settings:manage (SUPER_ADMIN, ADMIN)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseValue(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function stringifyValue(value: unknown): string {
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const VALID_HEX = /^#[0-9a-fA-F]{6}$/;
const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_FONTS = ["Inter", "Plus Jakarta Sans", "Manrope"];

function validateSetting(key: string, value: unknown): string | null {
  switch (key) {
    case "general.siteName":
      if (typeof value !== "string" || value.trim().length < 1)
        return "Site name is required";
      if (value.length > 100)
        return "Site name must be 100 characters or less";
      return null;

    case "general.siteDescription":
      if (typeof value !== "string") return null; // optional
      if (value.length > 500)
        return "Site description must be 500 characters or less";
      return null;

    case "general.contactEmail":
      if (typeof value !== "string" || value.length === 0) return null;
      if (!VALID_EMAIL.test(value))
        return "Please enter a valid email address";
      return null;

    case "theme.primaryColor":
    case "theme.accentColor":
      if (typeof value !== "string" || !VALID_HEX.test(value))
        return "Must be a valid hex color (e.g., #2563EB)";
      return null;

    case "theme.fontFamily":
      if (!ALLOWED_FONTS.includes(value as string))
        return `Must be one of: ${ALLOWED_FONTS.join(", ")}`;
      return null;

    case "theme.borderRadius": {
      const num = Number(value);
      if (isNaN(num) || num < 0 || num > 24)
        return "Border radius must be between 0 and 24";
      return null;
    }

    case "theme.defaultTheme":
      if (value !== "light" && value !== "dark")
        return "Must be either 'light' or 'dark'";
      return null;

    case "email.fromAddress":
      if (typeof value !== "string" || value.length === 0) return null;
      if (!VALID_EMAIL.test(value))
        return "Please enter a valid email address";
      return null;

    default:
      return null; // unknown keys pass through
  }
}

// ---------------------------------------------------------------------------
// GET — return all settings as a key-value map
// ---------------------------------------------------------------------------

export const GET = withPermission(async () => {
  try {
    const rows = await prisma.setting.findMany();

    const settings: Record<string, unknown> = {};
    for (const row of rows) {
      settings[row.key] = parseValue(row.value);
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}, "settings:manage");

// ---------------------------------------------------------------------------
// PUT — update settings (accepts partial key-value object)
// ---------------------------------------------------------------------------

export const PUT = withPermission(async (request: NextRequest) => {
  try {
    const body: Record<string, unknown> = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Request body must be a non-array object" },
        { status: 400 },
      );
    }

    // Validate each key
    const fieldErrors: Record<string, string> = {};
    for (const [key, value] of Object.entries(body)) {
      const err = validateSetting(key, value);
      if (err) fieldErrors[key] = err;
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "One or more settings have invalid values",
          fields: fieldErrors,
        },
        { status: 400 },
      );
    }

    // Upsert each setting
    for (const [key, value] of Object.entries(body)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: stringifyValue(value) },
        create: { key, value: stringifyValue(value) },
      });
    }

    // Return full updated set
    const rows = await prisma.setting.findMany();
    const settings: Record<string, unknown> = {};
    for (const row of rows) {
      settings[row.key] = parseValue(row.value);
    }

    return NextResponse.json({
      settings,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("[SETTINGS_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update settings" },
      { status: 500 },
    );
  }
}, "settings:manage");
