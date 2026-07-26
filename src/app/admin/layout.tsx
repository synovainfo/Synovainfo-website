import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import type { ReactNode } from "react";

// ─── Metadata ──────────────────────────────────────────────────────

export const metadata = {
  title: {
    template: "%s — Synova Admin",
    default: "Dashboard — Synova Admin",
  },
  description:
    "Synova Infotech enterprise admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

// ─── Admin Layout ──────────────────────────────────────────────────

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Server-side auth check (second layer — middleware already guards edge)
  const session = await auth();

  if (!session?.user) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
