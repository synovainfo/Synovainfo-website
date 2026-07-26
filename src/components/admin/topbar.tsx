"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/providers/theme-provider";
import { useSidebar } from "./admin-shell";
import { cn } from "@/lib/utils";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Circle,
} from "lucide-react";

// ─── Topbar ────────────────────────────────────────────────────────

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toggleMobile } = useSidebar();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Simulating unread notifications

  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuDropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuDropdownRef.current &&
        !userMenuDropdownRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuDropdownRef, notifRef]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showUserMenu) {
          setShowUserMenu(false);
          userMenuButtonRef.current?.focus();
        }
        setShowNotifications(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showUserMenu, userMenuButtonRef]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: "/admin/login" });
  }, []);

  // Keyboard shortcut: Cmd/Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when search is open on mobile
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  // Keyboard navigation for user menu
  useEffect(() => {
    if (!showUserMenu || !userMenuDropdownRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const focusableElements = Array.from(
        userMenuDropdownRef.current?.querySelectorAll(
          'a[role="menuitem"], button[role="menuitem"]'
        ) || []
      ) as HTMLElement[];
      const activeElement = document.activeElement as HTMLElement;
      const activeIndex = focusableElements.indexOf(activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (activeIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          (activeIndex - 1 + focusableElements.length) % focusableElements.length;
        focusableElements[prevIndex].focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        focusableElements[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
      } else if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          if (activeIndex === 0 || activeIndex === -1) {
            userMenuButtonRef.current?.focus();
            setShowUserMenu(false);
          } else {
            focusableElements[activeIndex - 1].focus();
          }
        } else {
          if (activeIndex === focusableElements.length - 1) {
            userMenuButtonRef.current?.focus();
            setShowUserMenu(false);
          } else {
            focusableElements[activeIndex + 1].focus();
          }
        }
      }
    };

    userMenuDropdownRef.current.addEventListener("keydown", handleKeyDown);
    // Focus the first item when the menu opens
    const firstItem = userMenuDropdownRef.current.querySelector(
      'a[role="menuitem"], button[role="menuitem"]'
    ) as HTMLElement;
    firstItem?.focus();

    return () => {
      userMenuDropdownRef.current?.removeEventListener("keydown", handleKeyDown);
    };
  }, [showUserMenu]);

  const isDark = theme === "dark";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b px-4 md:px-6",
        "border-[var(--color-border-light)] dark:border-white/5",
        "bg-white/70 backdrop-blur-xl dark:bg-[#0A0F1A]/80",
      )}
    >
      {/* ── Mobile menu toggle ─────────────────────────────────── */}
      <button
        onClick={toggleMobile}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-300 lg:hidden"
        aria-label="Toggle navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* ── Search bar ─────────────────────────────────────────── */}
      <div className="relative hidden flex-1 sm:block md:max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          aria-hidden="true"
        />
        <input
          ref={searchRef}
          type="search"
          placeholder="Search anything... (⌘K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setSearchOpen(false)}
          className={cn(
            "h-9 w-full rounded-lg border bg-transparent pl-9 pr-3 text-sm outline-none transition-all duration-200",
            "border-[var(--color-border)] dark:border-white/10",
            "text-[var(--color-text)] placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
            "focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30",
          )}
          aria-label="Search admin panel"
        />
      </div>

      {/* ── Mobile search toggle ───────────────────────────────── */}
      <button
        onClick={() => setSearchOpen(!searchOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-300 sm:hidden"
        aria-label="Toggle search"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* ── Spacer ─────────────────────────────────────────────── */}
      <div className="flex-1 sm:hidden" />

      {/* ── Theme toggle ───────────────────────────────────────── */}
      <button
        onClick={toggleTheme}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
          "text-zinc-500 hover:bg-white/10 hover:text-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-200",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
        )}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <Sun className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      {/* ── Notifications ──────────────────────────────────────── */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
            "text-zinc-500 hover:bg-white/10 hover:text-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-200",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
          )}
          aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ""}`}
          aria-expanded={showNotifications}
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          {/* Unread badge */}
          <span className="absolute right-2 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
        </button>

        {/* Notification dropdown */}
        {showNotifications && (
          <div
            className={cn(
              "absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border shadow-xl",
              "border-[var(--color-border)] dark:border-white/10",
              "bg-white backdrop-blur-xl dark:bg-[#0F1420]/95",
            )}
          >
            <div className="border-b border-[var(--color-border-light)] px-4 py-3 dark:border-white/5">
              <p className="text-sm font-semibold text-[var(--color-text)] dark:text-white">
                Notifications
              </p>
            </div>
            <div className="p-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              <Bell className="mx-auto mb-2 h-8 w-8 opacity-40" aria-hidden="true" />
              <p>No new notifications</p>
            </div>
          </div>
        )}
      </div>

      {/* ── User menu ──────────────────────────────────────────── */}
      <div className="relative">
        <button
          ref={userMenuButtonRef}
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
            "hover:bg-white/10",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
          )}
          aria-label="User menu"
          aria-expanded={showUserMenu}
          aria-haspopup="menu"
        >
          {/* Avatar */}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-400">
            {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U"}
          </span>

          {/* Name (hidden on small screens) */}
          <span className="hidden max-w-[120px] truncate text-sm font-medium text-[var(--color-text)] dark:text-white md:block">
            {user?.name ?? user?.email ?? "User"}
          </span>

          <ChevronDown
            className={cn(
              "hidden h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 md:block",
              showUserMenu && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>

        {/* Dropdown */}
        {showUserMenu && (
          <div
            ref={userMenuDropdownRef}
            role="menu"
            tabIndex={-1}
            className={cn(
              "absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border shadow-xl",
              "border-[var(--color-border)] dark:border-white/10",
              "bg-white backdrop-blur-xl dark:bg-[#0F1420]/95",
            )}
          >
            {/* User info */}
            <div className="border-b border-[var(--color-border-light)] px-4 py-3 dark:border-white/5">
              <p className="text-sm font-medium text-[var(--color-text)] dark:text-white">
                {user?.name ?? "User"}
              </p>
              <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                {user?.email ?? ""}
              </p>
            </div>

            {/* Menu items */}
            <div className="p-1.5">
              <Link
                href="/admin/profile"
                onClick={() => setShowUserMenu(false)}
                role="menuitem"
                tabIndex={0}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5",
                )}
              >
                <User className="h-4 w-4" aria-hidden="true" />
                Profile
              </Link>
              <Link
                href="/admin/settings"
                onClick={() => setShowUserMenu(false)}
                role="menuitem"
                tabIndex={0}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5",
                )}
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                Settings
              </Link>
              <hr className="my-1 border-[var(--color-border-light)] dark:border-white/5" />
              <button
                onClick={handleSignOut}
                role="menuitem"
                tabIndex={0}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10",
                )}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile search overlay ──────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#070D16] sm:hidden">
          <div className="flex items-center gap-3 border-b border-[var(--color-border-light)] p-4 dark:border-white/5">
            <Search
              className="h-5 w-5 shrink-0 text-zinc-400"
              aria-hidden="true"
            />
            <input
              autoFocus
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-sm outline-none text-[var(--color-text)] placeholder:text-zinc-400"
              aria-label="Search admin panel"
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-500/10"
            >
              Cancel
            </button>
          </div>
          <div className="flex-1 p-4 text-center text-sm text-zinc-500">
            {searchQuery.length > 0 ? (
              <p>No results for &quot;{searchQuery}&quot;</p>
            ) : (
              <p>Type to start searching</p>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
