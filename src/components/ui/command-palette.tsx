"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowRight, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  { label: "Digital Transformation", href: "/services/digital-transformation", icon: <FileText className="h-4 w-4" /> },
  { label: "Cloud Infrastructure", href: "/services/cloud-infrastructure-solutions", icon: <FileText className="h-4 w-4" /> },
  { label: "Enterprise Solutions", href: "/services/enterprise-solutions", icon: <FileText className="h-4 w-4" /> },
  { label: "Contact Sales", href: "/contact", icon: <ArrowRight className="h-4 w-4" /> },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  // Handle Ctrl+K shortcut globally and trap focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        // This is handled in the parent to toggle open state
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      if (e.key === "Tab" && isOpen && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement || document.activeElement === dialogRef.current) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      const originalOverflow = document.body.style.overflow;
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden";
      
      return () => {
        document.body.style.overflow = originalOverflow;
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-zinc-900/50 backdrop-blur-sm dark:bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 pointer-events-none">
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10 pointer-events-auto flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Command Palette"
            >
              <form onSubmit={handleSearch} className="relative flex items-center px-4 border-b border-zinc-100 dark:border-zinc-800">
                <Search className="h-5 w-5 text-zinc-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search documentation, services, and more..."
                  className="flex-1 h-14 bg-transparent px-4 text-base text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
                />
                <div className="flex items-center gap-2">
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4 text-zinc-500" />
                    </button>
                  )}
                  <div className="hidden sm:flex h-6 items-center rounded bg-zinc-100 px-2 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    <Command className="h-3 w-3 mr-1" /> K
                  </div>
                </div>
              </form>

              {!query && (
                <div className="p-4">
                  <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Suggestions
                  </h3>
                  <div className="flex flex-col gap-1">
                    {SUGGESTIONS.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-zinc-500 group-hover:bg-white group-hover:text-corporate-navy dark:bg-zinc-800 dark:group-hover:bg-zinc-700 dark:group-hover:text-corporate-gold transition-colors">
                          {item.icon}
                        </div>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
