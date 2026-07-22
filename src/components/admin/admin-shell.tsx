"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

// ─── Sidebar Context ────────────────────────────────────────────────

interface SidebarContextType {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within <AdminShell>");
  }
  return ctx;
}

const STORAGE_KEY = "synova-admin-sidebar-collapsed";

// ─── AdminShell ─────────────────────────────────────────────────────

export function AdminShell({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setIsCollapsed(true);
    } catch {
      // localStorage unavailable (SSR / incognito)
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // silent
      }
      return next;
    });
  }, []);

  const toggleMobile = useCallback(() => setIsMobileOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  // Close mobile sidebar on ESC key
  useEffect(() => {
    if (!isMobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isMobileOpen, closeMobile]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, isMobileOpen, toggleCollapsed, toggleMobile, closeMobile }}
    >
      <div className="flex h-screen overflow-hidden bg-[var(--color-surface)] dark:bg-[#070D16]">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main
            id="admin-main-content"
            className="flex-1 overflow-y-auto p-4 md:p-6"
            tabIndex={-1}
          >
            {/* Fade-in wrapper for route transitions */}
            <div
              className={`mx-auto w-full max-w-7xl transition-opacity duration-300 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
