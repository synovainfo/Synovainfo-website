"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLinks } from "./nav-links";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

const MOBILE_SERVICES = [
  {
    title: "Development",
    items: [
      { name: "Custom Software Dev", slug: "custom-software-development" },
      { name: "Web Development", slug: "web-development" },
      { name: "Mobile Apps", slug: "mobile-app-development" },
      { name: "Cloud Solutions", slug: "cloud-infrastructure-solutions" },
      { name: "AI/ML", slug: "ai-machine-learning" },
      { name: "IoT", slug: "internet-of-things" },
      { name: "Blockchain", slug: "blockchain-solutions" },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "IT Consulting", slug: "it-consulting" },
      { name: "Project Management", slug: "project-management" },
      { name: "Infrastructure Mgmt", slug: "infrastructure-management" },
      { name: "QA Testing", slug: "qa-testing" },
      { name: "Support & Maintenance", slug: "support-maintenance" },
    ],
  },
  {
    title: "Solutions",
    items: [
      { name: "Digital Transformation", slug: "digital-transformation" },
      { name: "Enterprise Solutions", slug: "enterprise-solutions" },
      { name: "Data Analytics", slug: "data-analytics" },
      { name: "Cybersecurity", slug: "cybersecurity" },
      { name: "UI/UX Design", slug: "ui-ux-design" },
    ],
  },
];

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileNav({ isOpen, onToggle }: MobileNavProps) {
  const [servicesExpanded, setServicesExpanded] = useState(false);
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
        className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-white/10"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <div className="flex w-5 flex-col items-center gap-1.5">
          <motion.span
            animate={isOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
            className="block h-[2px] w-5 rounded-full bg-zinc-800 dark:bg-zinc-200"
            transition={{ duration: 0.2 }}
          />
          <motion.span
            animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
            className="block h-[2px] w-5 rounded-full bg-zinc-800 dark:bg-zinc-200"
            transition={{ duration: 0.15 }}
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
            className="block h-[2px] w-5 rounded-full bg-zinc-800 dark:bg-zinc-200"
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
              "bg-white/95 backdrop-blur-xl dark:bg-zinc-950/98",
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Top bar inside overlay */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <Logo variant="dark" />
              <button
                onClick={onToggle}
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
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
                />
              </motion.div>

              {/* Services accordion on mobile */}
              <motion.div variants={linkVariants} className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                <button
                  onClick={() => setServicesExpanded(!servicesExpanded)}
                  className="flex w-full items-center justify-between text-left"
                  aria-expanded={servicesExpanded}
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Our Services
                  </span>
                  <motion.svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    animate={{ rotate: servicesExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-zinc-400"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {servicesExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pb-2 space-y-5">
                        {MOBILE_SERVICES.map((cat) => (
                          <div key={cat.title}>
                            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                              {cat.title}
                            </h4>
                            <ul className="space-y-1">
                              {cat.items.map((item) => (
                                <li key={item.name}>
                                  <Link
                                    href={`/services/${item.slug}`}
                                    onClick={handleLinkClick}
                                    className="block rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200"
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
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              variants={linkVariants}
              className="border-t border-zinc-100 px-5 py-5 dark:border-zinc-800"
            >
              <Link
                href="/contact"
                onClick={handleLinkClick}
                className="flex w-full items-center justify-center rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
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
