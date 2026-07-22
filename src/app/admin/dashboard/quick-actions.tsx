"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  FileText,
  PenSquare,
  Mail,
  Download,
  type LucideIcon,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

const ACTIONS: QuickAction[] = [
  {
    label: "New Page",
    href: "/admin/pages/new",
    icon: FileText,
    description: "Create a new website page",
  },
  {
    label: "New Blog Post",
    href: "/admin/blog/new",
    icon: PenSquare,
    description: "Write and publish a blog post",
  },
  {
    label: "View Contacts",
    href: "/admin/contacts",
    icon: Mail,
    description: "Browse recent inquiries",
  },
  {
    label: "Export Leads",
    href: "/admin/leads",
    icon: Download,
    description: "Download lead data",
  },
];

// ─── Quick Actions ───────────────────────────────────────────────────

export function QuickActions() {
  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-300",
        "border-zinc-200/80 dark:border-white/5",
        "bg-white/80 backdrop-blur-xl dark:bg-[#0A0F1A]/95",
        "p-5",
      )}
    >
      <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "group flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all duration-200",
                "border-zinc-200/60 dark:border-white/5",
                "hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-md hover:bg-blue-50/50",
                "dark:hover:border-blue-400/20 dark:hover:bg-blue-500/5",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                  "group-hover:bg-blue-100 group-hover:text-blue-600",
                  "dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <span className="block text-sm font-medium text-zinc-900 dark:text-white">
                  {action.label}
                </span>
                <span className="mt-0.5 block text-xs text-zinc-400 dark:text-zinc-500">
                  {action.description}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
