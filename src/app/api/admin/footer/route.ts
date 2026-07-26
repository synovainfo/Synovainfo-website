// =============================================================================
// GET /api/admin/footer — get the active footer with columns and links
// PUT /api/admin/footer — update footer (bulk replace columns + links)
// Permission: pages:manage
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/authorization";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().optional().nullable(),
  label: z.string().optional().nullable(),
});

const footerLinkSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Link label is required").max(200),
  url: z.string().max(500).optional().nullable(),
  target: z.enum(["_self", "_blank"]).optional().default("_self"),
  order: z.number().int().optional().default(0),
});

const footerColumnSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(200).optional().nullable(),
  width: z.number().int().min(1).max(4).optional().default(3),
  order: z.number().int().optional().default(0),
  links: z.array(footerLinkSchema).optional().default([]),
});

const updateFooterSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  columns: z.array(footerColumnSchema).optional(),
  copyright: z.string().max(500).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Get the first (or default) footer record. Creates one if none exist.
 */
async function getOrCreateFooter() {
  let footer = await prisma.footer.findFirst({
    orderBy: { createdAt: "asc" },
    include: {
      columns: {
        orderBy: { order: "asc" },
        include: {
          links: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!footer) {
    footer = await prisma.footer.create({
      data: { name: "Default Footer" },
      include: {
        columns: {
          orderBy: { order: "asc" },
          include: { links: { orderBy: { order: "asc" } } },
        },
      },
    });
  }

  return footer;
}

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET = withPermission(async () => {
  try {
    const footer = await getOrCreateFooter();

    // Build response with a "socialLinks" and "copyright" that are stored
    // as settings in the Setting model for now (since Footer model has no
    // socialLinks/copyright fields directly — they could be added to schema
    // but we're told not to modify schema. Instead we store them as settings.)
    const socialLinksSetting = await prisma.setting.findUnique({
      where: { key: "footer_social_links" },
    });
    const copyrightSetting = await prisma.setting.findUnique({
      where: { key: "footer_copyright" },
    });

    let socialLinks: Array<{
      platform: string;
      url: string;
      icon: string | null;
      label: string | null;
    }> = [];
    let copyright = "{year} Synova Infotech. All rights reserved.";

    if (socialLinksSetting?.value) {
      try {
        const parsed = JSON.parse(socialLinksSetting.value);
        if (Array.isArray(parsed)) socialLinks = parsed;
      } catch {
        // ignore parse errors
      }
    }

    if (copyrightSetting?.value) {
      copyright = copyrightSetting.value;
    }

    return NextResponse.json({
      footer,
      socialLinks,
      copyright,
    });
  } catch (error) {
    console.error("[FOOTER_GET]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch footer",
      },
      { status: 500 },
    );
  }
}, "pages:manage");

// ---------------------------------------------------------------------------
// PUT
// ---------------------------------------------------------------------------

export const PUT = withPermission(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = updateFooterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const footer = await getOrCreateFooter();
    const { columns, copyright, socialLinks, name } = parsed.data;

    // Update footer name if provided
    if (name) {
      await prisma.footer.update({
        where: { id: footer.id },
        data: { name },
      });
    }

    // Bulk replace columns and their links
    if (columns) {
      await prisma.$transaction(async (tx) => {
        // Delete existing links for all columns
        const existingColumns = await tx.footerColumn.findMany({
          where: { footerId: footer.id },
          select: { id: true },
        });
        for (const col of existingColumns) {
          await tx.footerLink.deleteMany({
            where: { footerColumnId: col.id },
          });
        }

        // Delete existing columns
        await tx.footerColumn.deleteMany({
          where: { footerId: footer.id },
        });

        // Create new columns with links
        for (const col of columns) {
          const created = await tx.footerColumn.create({
            data: {
              footerId: footer.id,
              title: col.title ?? null,
              width: col.width ?? 3,
              order: col.order ?? 0,
            },
          });

          if (col.links && col.links.length > 0) {
            for (const link of col.links) {
              await tx.footerLink.create({
                data: {
                  footerColumnId: created.id,
                  label: link.label,
                  url: link.url ?? null,
                  target: link.target ?? "_self",
                  order: link.order ?? 0,
                },
              });
            }
          }
        }
      });
    }

    // Save social links and copyright as settings
    if (socialLinks) {
      await prisma.setting.upsert({
        where: { key: "footer_social_links" },
        update: { value: JSON.stringify(socialLinks) },
        create: {
          key: "footer_social_links",
          value: JSON.stringify(socialLinks),
          type: "json",
          description: "Footer social media links",
        },
      });
    }

    if (copyright !== undefined) {
      await prisma.setting.upsert({
        where: { key: "footer_copyright" },
        update: { value: copyright },
        create: {
          key: "footer_copyright",
          value: copyright ?? "",
          type: "string",
          description: "Footer copyright text",
        },
      });
    }

    // Return updated footer
    const updated = await prisma.footer.findUnique({
      where: { id: footer.id },
      include: {
        columns: {
          orderBy: { order: "asc" },
          include: { links: { orderBy: { order: "asc" } } },
        },
      },
    });

    const updatedSocialLinksSetting = await prisma.setting.findUnique({
      where: { key: "footer_social_links" },
    });
    const updatedCopyrightSetting = await prisma.setting.findUnique({
      where: { key: "footer_copyright" },
    });

    let updatedSocialLinks: Array<{
      platform: string;
      url: string;
      icon: string | null;
      label: string | null;
    }> = [];
    let updatedCopyright = "{year} Synova Infotech. All rights reserved.";

    if (updatedSocialLinksSetting?.value) {
      try {
        const parsed = JSON.parse(updatedSocialLinksSetting.value);
        if (Array.isArray(parsed)) updatedSocialLinks = parsed;
      } catch {
        // ignore
      }
    }
    if (updatedCopyrightSetting?.value) {
      updatedCopyright = updatedCopyrightSetting.value;
    }

    return NextResponse.json({
      footer: updated,
      socialLinks: updatedSocialLinks,
      copyright: updatedCopyright,
    });
  } catch (error) {
    console.error("[FOOTER_PUT]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to update footer",
      },
      { status: 500 },
    );
  }
}, "pages:manage");
