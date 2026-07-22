import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    const [totalPages, activeServices, newLeads, blogPosts, mediaFiles, formSubmissions] =
      await Promise.all([
        prisma.page.count({ where: { deletedAt: null } }),
        prisma.service.count({ where: { status: true, deletedAt: null } }),
        prisma.lead.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
        prisma.blogPost.count({ where: { deletedAt: null } }),
        prisma.media.count({ where: { deletedAt: null } }),
        prisma.formSubmission.count(),
      ]);

    const [recentContacts, recentAuditLogs] = await Promise.all([
      prisma.contact.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          company: true,
          email: true,
          service: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          action: true,
          resource: true,
          resourceId: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalPages,
        activeServices,
        newLeads,
        blogPosts,
        mediaFiles,
        formSubmissions,
      },
      recentContacts,
      recentAuditLogs,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 },
    );
  }
}
