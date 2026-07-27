"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { NavLinks } from "./nav-links";
import { MegaMenu } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const servicesRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { scrollY } = useScroll();

  // Scroll detection - hide on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = lastScrollY.current;
    setIsScrolled(latest > 50);

    if (latest > prev && latest > 100 && !mobileOpen) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }

    lastScrollY.current = latest;
  });

  // Re-show header immediately when mobile menu opens
  useEffect(() => {
    if (mobileOpen) {
      const id = setTimeout(() => setIsHidden(false), 0);
      return () => clearTimeout(id);
    }
  }, [mobileOpen]);

  // Close mega menu on scroll
  useEffect(() => {
    const unsubscribe = scrollY.on("change", () => {
      if (megaOpen) setMegaOpen(false);
    });
    return () => unsubscribe();
  }, [scrollY, megaOpen]);

  // Mega menu hover management
  const handleServicesMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaOpen(true);
  }, []);

  const handleServicesMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setMegaOpen(false);
    }, 150);
  }, []);

  const handleMegaClose = useCallback(() => {
    setMegaOpen(false);
  }, []);

  const handleMobileToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass-header"
            : "bg-transparent",
          isHidden ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4 md:h-20">
            {/* Logo */}
            <Logo variant={"dark"} />

            {/* Desktop navigation - center */}
            <nav className="hidden md:flex md:items-center md:gap-1" aria-label="Main navigation">
              {/* Services with mega menu */}
              <div
                className="relative"
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                <button
                  ref={servicesRef}
                  onClick={() => setMegaOpen((prev) => !prev)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    megaOpen
                      ? "text-corporate-navy bg-corporate-gold/10"
                      : "text-[var(--color-text-secondary)] hover:text-corporate-navy",
                  )}
                  aria-expanded={megaOpen}
                  aria-haspopup="true"
                  aria-controls="mega-menu-services"
                >
                  Services
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={cn(
                      "transition-transform duration-200",
                      megaOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  id="mega-menu-services"
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <MegaMenu
                    isOpen={megaOpen}
                    onClose={handleMegaClose}
                    triggerRef={servicesRef}
                  />
                </div>
              </div>

              <NavLinks variant="desktop" />
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <ThemeToggle />

              {/* Desktop CTA */}
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center justify-center rounded-xl bg-[var(--color-corporate-navy)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-corporate-gold)] hover:text-[var(--color-corporate-navy)] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                aria-label="Contact us to discuss enterprise technology solutions"
              >
                Contact Us
              </Link>

              {/* Mobile nav toggle */}
              <MobileNav isOpen={mobileOpen} onToggle={handleMobileToggle} />
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent layout shift */}
      <div className="h-16 md:h-20" />
    </>
  );
}
