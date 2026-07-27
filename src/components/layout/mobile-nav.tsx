"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, Search, ChevronRight, Moon, Sun, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLinks } from "./nav-links";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { MagneticButton } from "@/components/ui/magnetic-button";

const MOBILE_SERVICES = [
  {
    title: "Featured Services",
    items: [
      { name: "Enterprise Architecture", slug: "enterprise-solutions" },
      { name: "Digital Transformation", slug: "digital-transformation" },
      { name: "Cloud Infrastructure", slug: "cloud-infrastructure-solutions" },
      { name: "Cybersecurity Ops", slug: "cybersecurity" },
    ],
  },
  {
    title: "Industries",
    items: [
      { name: "Financial Services", slug: "financial-services" },
      { name: "Healthcare & Life Sciences", slug: "healthcare" },
      { name: "Retail & E-commerce", slug: "retail" },
      { name: "Manufacturing", slug: "manufacturing" },
    ],
  },
];

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
  onSearchToggle: () => void;
}

export function MobileNav({ isOpen, onToggle, onSearchToggle }: MobileNavProps) {
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { theme, setTheme } = useTheme();

  // Close on resize to desktop
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        onToggle(); 
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

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleTabKey);
    document.addEventListener("keydown", handleEsc);

    const timer = setTimeout(() => {
      const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
        'button:not([disabled])',
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

  const handleSearchClick = () => {
    onToggle();
    setTimeout(() => {
      onSearchToggle();
    }, 300);
  };

  // Variants
  const overlayVariants: Variants = {
    closed: { opacity: 0, scale: 0.98, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] as any } },
    open: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as any } },
  };

  const staggerVariants: Variants = {
    closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
    open: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as any } },
  };

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        ref={buttonRef}
        onClick={onToggle}
        className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-white/10"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <div className="flex w-5 flex-col items-center gap-1.5">
          <motion.span
            animate={isOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
            className="block h-[2px] w-5 rounded-full bg-zinc-800 dark:bg-zinc-200"
            transition={{ duration: 0.3, ease: "backOut" }}
          />
          <motion.span
            animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
            className="block h-[2px] w-5 rounded-full bg-zinc-800 dark:bg-zinc-200"
            transition={{ duration: 0.2 }}
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
            className="block h-[2px] w-5 rounded-full bg-zinc-800 dark:bg-zinc-200"
            transition={{ duration: 0.3, ease: "backOut" }}
          />
        </div>
      </button>

      {/* Full-screen immersive overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-50 flex flex-col bg-white/90 backdrop-blur-2xl dark:bg-black/90"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Top bar inside overlay */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <Logo variant="dark" />
              <button
                onClick={onToggle}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 transition-transform hover:scale-105 active:scale-95"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-zinc-900 dark:text-white" />
              </button>
            </div>

            {/* Nav content */}
            <motion.div
              variants={staggerVariants}
              initial="closed"
              animate="open"
              className="flex-1 overflow-y-auto px-6 py-6 pb-32"
            >
              {/* Primary Links */}
              <motion.div variants={itemVariants} className="mb-8">
                <NavLinks
                  variant="mobile"
                  onItemClick={handleLinkClick}
                  className="mb-8"
                />
              </motion.div>

              {/* Services Accordion */}
              <motion.div variants={itemVariants} className="border-t border-zinc-200/50 pt-8 dark:border-white/10">
                <button
                  onClick={() => setServicesExpanded(!servicesExpanded)}
                  className="group flex w-full items-center justify-between text-left"
                  aria-expanded={servicesExpanded}
                >
                  <span className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    Explore Solutions
                  </span>
                  <motion.div
                    animate={{ rotate: servicesExpanded ? 90 : 0 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 group-hover:bg-zinc-200 dark:bg-zinc-900 dark:group-hover:bg-zinc-800"
                  >
                    <ChevronRight className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {servicesExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 pb-4 space-y-8">
                        {MOBILE_SERVICES.map((cat) => (
                          <div key={cat.title}>
                            <h4 className="mb-4 text-base font-semibold text-zinc-900 dark:text-white">
                              {cat.title}
                            </h4>
                            <ul className="space-y-3">
                              {cat.items.map((item) => (
                                <li key={item.name}>
                                  <Link
                                    href={`/services/${item.slug}`}
                                    onClick={handleLinkClick}
                                    className="block text-lg font-medium text-zinc-600 transition-colors hover:text-[var(--color-corporate-navy)] dark:text-zinc-400 dark:hover:text-white"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Utility Links */}
              <motion.div variants={itemVariants} className="mt-10 grid grid-cols-2 gap-4 border-t border-zinc-200/50 pt-8 dark:border-white/10">
                <button
                  onClick={handleSearchClick}
                  className="flex items-center gap-3 rounded-xl bg-zinc-100 p-4 text-left transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <Search className="h-5 w-5 text-[var(--color-corporate-navy)] dark:text-white" />
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">Search</span>
                </button>
                
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-3 rounded-xl bg-zinc-100 p-4 text-left transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-[var(--color-corporate-gold)]" />
                  ) : (
                    <Moon className="h-5 w-5 text-[var(--color-corporate-navy)]" />
                  )}
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </span>
                </button>
              </motion.div>
            </motion.div>

            {/* Bottom Sticky Action Area */}
            <motion.div
              variants={itemVariants}
              className="absolute bottom-0 left-0 right-0 border-t border-zinc-200/80 bg-white/80 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-black/80"
            >
              <MagneticButton
                onClick={() => {
                  handleLinkClick();
                  // Router push will happen via NextLink conceptually, but MagneticButton is a button.
                  // We can wrap it in Link or just use router.
                  window.location.href = "/contact";
                }}
                className="w-full py-4 text-lg"
              >
                Schedule Consultation <ArrowRight className="h-5 w-5" />
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
