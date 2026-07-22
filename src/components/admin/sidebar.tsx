"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "./admin-shell";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Building2,
  PenSquare,
  HelpCircle,
  Image,
  Mail,
  Users,
  Newspaper,
  Search,
  Menu,
  Settings,
  Shield,
  ClipboardList,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// ─── Navigation Data ───────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroupConfig {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroupConfig[] = [
  {
    label: "Dashboard",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { label: "Pages", href: "/admin/pages", icon: FileText },
      { label: "Services", href: "/admin/services", icon: Briefcase },
      { label: "Industries", href: "/admin/industries", icon: Building2 },
      { label: "Blog", href: "/admin/blog", icon: PenSquare },
      { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
    ],
  },
  {
    label: "Media",
    items: [{ label: "Media Library", href: "/admin/media", icon: Image }],
  },
  {
    label: "Operations",
    items: [
      { label: "Contacts", href: "/admin/contacts", icon: Mail },
      { label: "Leads", href: "/admin/leads", icon: Users },
      { label: "Newsletter", href: "/admin/newsletter", icon: Newspaper },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "SEO", href: "/admin/seo", icon: Search },
      { label: "Menus", href: "/admin/menus", icon: Menu },
      { label: "System", href: "/admin/system", icon: Settings },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Users", href: "/admin/users", icon: Shield },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
    ],
  },
];

// ─── Single Nav Item ───────────────────────────────────────────────

function NavItemRow({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const Icon = item.icon;

  const isActive =
    pathname === item.href ||
    (item.href !== "/admin" && pathname.startsWith(item.href + "/"));

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
        isActive
          ? "border-l-2 border-blue-500 bg-blue-500/10 text-blue-400"
          : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-200",
        collapsed ? "justify-center border-l-0 px-2" : "px-3",
      )}
      title={collapsed ? item.label : undefined}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className={cn("h-5 w-5 shrink-0", isActive && "text-blue-400")}
        aria-hidden="true"
      />
      {!collapsed && <span>{item.label}</span>}
      {collapsed && isActive && (
        <span
          className="absolute right-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-500"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggleCollapsed, closeMobile } =
    useSidebar();

  // Auto-expand the group containing active path; first group if none active
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      for (const group of NAV_GROUPS) {
        for (const item of group.items) {
          if (
            pathname === item.href ||
            (item.href !== "/admin" &&
              pathname.startsWith(item.href + "/"))
          ) {
            initial[group.label] = true;
            break;
          }
        }
      }
      // Default: expand first group if no active match
      if (Object.keys(initial).length === 0 && NAV_GROUPS.length > 0) {
        initial[NAV_GROUPS[0].label] = true;
      }
      return initial;
    },
  );

  const toggleGroup = useCallback((label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col",
          "border-r border-[var(--color-border-light)] dark:border-white/5",
          "bg-white/80 backdrop-blur-2xl dark:bg-[#0A0F1A]/95",
          "transition-all duration-300 ease-in-out lg:static lg:z-auto",
          isCollapsed ? "w-16" : "w-60",
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
        role="navigation"
        aria-label="Admin navigation"
      >
        {/* ── Header / Logo ─────────────────────────────────────── */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-[var(--color-border-light)] dark:border-white/5",
            isCollapsed ? "justify-center" : "px-4",
          )}
        >
          {isCollapsed ? (
            <Link
              href="/admin"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white"
              aria-label="Synova Admin Dashboard"
            >
              S
            </Link>
          ) : (
            <div className="flex w-full items-center justify-between">
              <Link
                href="/admin"
                className="flex items-center gap-2"
              >
                <span className="text-lg font-bold tracking-tight text-[var(--color-text)] dark:text-white">
                  Synova
                </span>
                <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                  Admin
                </span>
              </Link>
              {/* Mobile close button */}
              <button
                onClick={closeMobile}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/10 hover:text-zinc-300 lg:hidden"
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Navigation ────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 scrollbar-thin">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-3">
              {/* Group header button */}
              <button
                onClick={() => toggleGroup(group.label)}
                className={cn(
                  "flex w-full items-center rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest",
                  "text-zinc-400 dark:text-zinc-600",
                  "hover:text-zinc-500 dark:hover:text-zinc-400",
                  "transition-colors duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500",
                  isCollapsed && "justify-center px-2",
                )}
                aria-expanded={expandedGroups[group.label] ?? false}
              >
                {!isCollapsed ? (
                  <>
                    <span className="flex-1 text-left">{group.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        expandedGroups[group.label] && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  <span className="sr-only">{group.label}</span>
                )}
              </button>

              {/* Group items */}
              {(isCollapsed || expandedGroups[group.label]) && (
                <div className={cn("mt-0.5", isCollapsed ? "space-y-1" : "space-y-0.5")}>
                  {group.items.map((item) => (
                    <NavItemRow
                      key={item.href}
                      item={item}
                      collapsed={isCollapsed}
                      onNavigate={closeMobile}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ── Collapse toggle (desktop only) ────────────────────── */}
        <div className="hidden shrink-0 border-t border-[var(--color-border-light)] p-2 dark:border-white/5 lg:block">
          <button
            onClick={toggleCollapsed}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium",
              "text-zinc-500 dark:text-zinc-500",
              "hover:bg-white/5 hover:text-zinc-400 dark:hover:text-zinc-300",
              "transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500",
              isCollapsed ? "justify-center px-2" : "px-3",
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
