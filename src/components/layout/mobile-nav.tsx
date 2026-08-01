"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLinks } from "./nav-links";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

const MOBILE_SERVICE_CATEGORIES = [
  {
    title: "Core Engineering",
    items: [
      { name: "Custom Software Development", slug: "custom-software-development" },
      { name: "Web Development", slug: "web-development" },
      { name: "Mobile Applications", slug: "mobile-app-development" },
    ],
  },
  {
    title: "Cloud & AI",
    items: [
      { name: "Cloud Engineering", slug: "cloud-infrastructure-solutions" },
      { name: "AI & Machine Learning", slug: "ai-machine-learning" },
      { name: "Cybersecurity", slug: "cybersecurity" },
    ],
  },
  {
    title: "Strategy & Growth",
    items: [
      { name: "IT Consulting", slug: "it-consulting" },
      { name: "Project Management", slug: "project-management" },
      { name: "Digital Transformation", slug: "digital-transformation" },
    ],
  },
];

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
  isScrolled?: boolean;
  isLightTheme?: boolean;
}

export function MobileNav({ isOpen, onToggle, isScrolled = false, isLightTheme = false }: MobileNavProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on resize to desktop (fixing the scroll lock bug)
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        onToggle(); // automatically close if sized to desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onToggle]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onToggle();
        buttonRef.current?.focus();
      }
    };

    // Prevent body scroll when open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleTabKey);
    document.addEventListener("keydown", handleEsc);

    // Focus first element
    const timer = setTimeout(() => {
      const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      firstFocusable?.focus();
    }, 100);

    return () => {
      document.removeEventListener("keydown", handleTabKey);
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = prevOverflow;
      clearTimeout(timer);
    };
  }, [isOpen, onToggle]);

  const handleLinkClick = useCallback(() => {
    onToggle();
  }, [onToggle]);

  // Overlay variants
  const overlayVariants = {
    closed: {
      x: "100%",
      transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] as const },
    },
    open: {
      x: 0,
      transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] as const },
    },
  };

  // Link stagger variants
  const staggerVariants = {
    closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
    open: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
  };

  const linkVariants = {
    closed: { opacity: 0, x: 40 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        ref={buttonRef}
        onClick={onToggle}
        className={cn(
          "relative z-[60] flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
          isScrolled || isLightTheme
            ? "text-corporate-navy hover:bg-slate-100"
            : "text-white hover:bg-white/10"
        )}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <div className="flex w-5 flex-col items-center gap-1.5">
          <motion.span
            animate={isOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
            className="block h-[2px] w-5 rounded-full bg-current"
            transition={{ duration: 0.2 }}
          />
          <motion.span
            animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
            className="block h-[2px] w-5 rounded-full bg-current"
            transition={{ duration: 0.15 }}
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
            className="block h-[2px] w-5 rounded-full bg-current"
            transition={{ duration: 0.2 }}
          />
        </div>
      </button>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={cn(
              "fixed inset-0 z-50 flex flex-col",
              isLightTheme
                ? "bg-white/95 backdrop-blur-xl"
                : "bg-corporate-navy-dark/98 backdrop-blur-xl",
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Top bar inside overlay */}
<div className={cn(
                "flex items-center justify-between px-5 pt-4 pb-2",
                isLightTheme ? "border-b border-slate-200" : "border-b border-white/10"
              )}>
                <Logo size="md" variant={isLightTheme ? "dark" : "light"} href="/" />
                <button
                  onClick={onToggle}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                    isLightTheme ? "hover:bg-slate-100" : "dark:hover:bg-white/10"
                  )}
                  aria-label="Close menu"
                >
                  <X className={cn("h-5 w-5", isLightTheme ? "text-corporate-navy" : "text-white")} />
              </button>
            </div>

            {/* Nav links */}
            <motion.div
              variants={staggerVariants}
              initial="closed"
              animate="open"
              className="flex-1 overflow-y-auto px-5 py-6"
            >
              <motion.div variants={linkVariants}>
                <NavLinks
                  variant="mobile"
                  onItemClick={handleLinkClick}
                  className="mb-8"
                  isLightTheme={isLightTheme}
                />
              </motion.div>

              <motion.div
                variants={linkVariants}
                className="border-t border-slate-200 pt-6 dark:border-white/10"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-corporate-gold dark:text-corporate-gold">
                      Popular services
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                      Quick access to the services enterprise teams request most.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {MOBILE_SERVICE_CATEGORIES.map((category) => (
                    <div key={category.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950">
                      <h4 className="text-sm font-semibold text-corporate-navy dark:text-white mb-3">
                        {category.title}
                      </h4>
                      <div className="grid gap-2">
                        {category.items.map((item) => (
                          <Link
                            key={item.slug}
                            href={`/services/${item.slug}`}
                            onClick={handleLinkClick}
                            className="rounded-2xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-corporate-gold dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-corporate-gold"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              variants={linkVariants}
              className="border-t border-slate-200 px-5 py-5 dark:border-white/10"
            >
              <Link
                href="/contact"
                onClick={handleLinkClick}
                className="flex w-full items-center justify-center rounded-xl bg-corporate-gold px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-corporate-gold-dark hover:shadow-lg hover:shadow-corporate-gold/25"
              >
                Let&apos;s Talk
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
