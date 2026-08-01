"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useTransition,
} from "react";
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { NavLinks } from "./nav-links";
import { MegaMenu } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/components/providers/theme-provider";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────
   Quick-search suggestions
───────────────────────────────────────────────────────────────────── */
const QUICK_LINKS = [
  { label: "Cloud Infrastructure", href: "/services/cloud-infrastructure-solutions" },
  { label: "AI & Machine Learning", href: "/services/ai-machine-learning" },
  { label: "Digital Transformation", href: "/services/digital-transformation" },
  { label: "Contact Sales", href: "/contact" },
];

/* ─────────────────────────────────────────────────────────────────────
   SearchBar — Expands from icon, collapses on Escape / outside click
───────────────────────────────────────────────────────────────────── */
function SearchBar({
  onClose,
  open,
  isScrolled,
  isLightTheme,
}: {
  onClose: () => void;
  open: boolean;
  isScrolled: boolean;
  isLightTheme: boolean;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Auto-focus on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Escape key closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setQuery("");
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Click outside closes
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setQuery("");
        onClose();
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      });
      setQuery("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={wrapperRef}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-14 top-1/2 -translate-y-1/2 overflow-hidden z-10"
        >
          <form
            onSubmit={handleSubmit}
            className={cn(
              "flex items-center rounded-full px-4 h-10 transition-colors duration-300",
              isScrolled || isLightTheme
                ? "bg-white border border-slate-200 shadow-sm"
                : "bg-white/10 border border-white/20 backdrop-blur-md"
            )}
          >
            <Search className="h-4 w-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, solutions..."
              className={cn(
                "flex-1 bg-transparent text-sm outline-none ml-2 min-w-0 transition-colors duration-300",
                isScrolled || isLightTheme
                  ? "text-corporate-navy placeholder:text-slate-400"
                  : "text-white placeholder:text-slate-500"
              )}
              aria-label="Search site content"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className={cn(
                  "transition-colors ml-1",
                  isScrolled ? "text-slate-400 hover:text-corporate-gold" : "text-slate-400 hover:text-white"
                )}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          {/* Quick suggestions dropdown */}
          {!query && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-white border border-slate-200 py-2 shadow-xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 px-4 py-1.5">
                Quick links
              </p>
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => { setQuery(""); onClose(); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-corporate-navy hover:text-corporate-gold hover:bg-corporate-gold/5 transition-colors"
                >
                  <ArrowRight className="h-3.5 w-3.5 opacity-50" />
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Header
───────────────────────────────────────────────────────────────────── */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCompact, setIsCompact] = useState(false); // shrink on scroll
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const headerBackground = isLightTheme
    ? "bg-white border-b border-slate-200 shadow-sm"
    : "bg-corporate-navy-dark border-b border-slate-900/40 shadow-sm";
  const headerTextClasses = isLightTheme
    ? "text-corporate-navy hover:text-corporate-gold"
    : "text-white hover:text-corporate-gold";
  const megaMenuRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();
  const pathname = usePathname();

  // Scroll detection — shrink padding when the page is scrolled
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
    setIsCompact(latest > 80);
    lastScrollY.current = latest;
  });

  // Close mega menu on scroll
  useEffect(() => {
    const unsub = scrollY.on("change", () => {
      if (activeMegaMenu) setActiveMegaMenu(null);
    });
    return () => unsub();
  }, [scrollY, activeMegaMenu]);

  // Close search and mega menu on route change
  useEffect(() => {
    setSearchOpen(false);
    setActiveMegaMenu(null);
  }, [pathname]);

  // Ctrl/Cmd+K opens search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleMegaMenuEnter = useCallback((category: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMegaMenu(category);
  }, []);

  const handleMegaMenuLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveMegaMenu(null), 400);
  }, []);

  const handleMegaClose = useCallback(() => setActiveMegaMenu(null), []);
  const handleMobileToggle = useCallback(() => setMobileOpen((v) => !v), []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Skip to main content — accessible keyboard nav */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-corporate-gold focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg focus:outline-none transition-all"
      >
        Skip to main content
      </a>

      {/* ── Main Header ───────────────────────────────────────────────── */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transform-gpu will-change-transform transition-[background-color,border-color,box-shadow] duration-300 backdrop-blur-md",
          headerBackground,
          "translate-y-0"
        )}
        style={{
          transition: "background-color 0.3s ease, border-color 0.3s ease",
        }}
        role="banner"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Dynamic padding: 1.5rem default, shrinks to 1rem when scrolled past 80px */}
          <div
            className={cn(
              "flex items-center justify-between gap-6 transition-all duration-300",
              isCompact ? "h-16" : "h-20 md:h-24"
            )}
          >
            {/* ── Logo ── */}
            <div className="flex-shrink-0">
              <Logo
                variant={isLightTheme ? "dark" : "light"}
                size={isCompact ? "sm" : "md"}
                href="/"
                animated={false}
              />
            </div>

            {/* ── Desktop Navigation ── */}
            <nav
              className="hidden md:flex md:items-center md:gap-0 flex-1 justify-center"
              aria-label="Primary navigation"
            >
              <div
                className="relative"
                onMouseEnter={() => { if (activeMegaMenu) handleMegaMenuEnter(activeMegaMenu) }}
                onMouseLeave={handleMegaMenuLeave}
              >
                <NavLinks
                  variant="desktop"
                  onMegaMenuHover={handleMegaMenuEnter}
                  onMegaMenuLeave={handleMegaMenuLeave}
                  activeMegaMenu={activeMegaMenu}
                  isScrolled={isScrolled}
                  isLightTheme={isLightTheme}
                  megaMenuTriggerRef={megaMenuRef}
                />

                {/* Mega Menu dropdown panel */}
                <div
                  id="mega-menu"
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-6"
                  onMouseEnter={() => { if (activeMegaMenu) handleMegaMenuEnter(activeMegaMenu) }}
                  onMouseLeave={handleMegaMenuLeave}
                >
                  <MegaMenu
                    activeCategory={activeMegaMenu}
                    onClose={handleMegaClose}
                    triggerRef={megaMenuRef}
                  />
                </div>
              </div>
            </nav>

            {/* ── Right Section ── */}
            <div className="flex items-center gap-2 relative flex-shrink-0">
              {/* Search — expandable input on icon click */}
              <div className="relative flex items-center">
                <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} isScrolled={isScrolled} isLightTheme={isLightTheme} />
                <button
                  onClick={() => setSearchOpen((v) => !v)}
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-gold focus-visible:ring-offset-2",
                    isScrolled || isLightTheme ? "focus-visible:ring-offset-white" : "focus-visible:ring-offset-slate-900",
                    searchOpen
                      ? "bg-corporate-gold/15 text-corporate-gold"
                      : headerTextClasses
                  )}
                  aria-label={searchOpen ? "Close search" : "Open search (Ctrl+K)"}
                  aria-expanded={searchOpen}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={searchOpen ? "close" : "search"}
                      initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center"
                    >
                      {searchOpen ? (
                        <X className="h-5 w-5" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Desktop CTA — ITHPL Orange "Contact Us" button with ripple class */}
              <Link
                href="/contact"
                className={cn(
                  "hidden md:inline-flex items-center justify-center gap-2 rounded-full text-sm font-bold text-white uppercase tracking-wide",
                  "bg-corporate-gold hover:bg-corporate-gold-dark px-5 py-2.5",
                  "hover:shadow-lg hover:shadow-corporate-gold/25 hover:scale-105 active:scale-[0.97]",
                  "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-gold focus-visible:ring-offset-2",
                  isScrolled ? "focus-visible:ring-offset-white" : "focus-visible:ring-offset-slate-900",
                  "btn-ripple min-h-[44px]"
                )}
                aria-label="Contact Synova Infotech to discuss enterprise technology solutions"
              >
                <span>Contact Us</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              {/* Mobile nav toggle */}
              <MobileNav isOpen={mobileOpen} onToggle={handleMobileToggle} isScrolled={isScrolled} isLightTheme={isLightTheme} />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Spacer — prevents layout shift under the fixed header */}
      <div aria-hidden="true" className={cn("transition-all duration-300", isCompact ? "h-16" : "h-20 md:h-24")} />
    </>
  );
}
