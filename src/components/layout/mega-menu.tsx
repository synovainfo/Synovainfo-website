"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Code2,
  Monitor,
  Smartphone,
  Cloud,
  Brain,
  Cpu,
  Link2,
  Users,
  KanbanSquare,
  Server,
  BugPlay,
  LifeBuoy,
  ArrowRight,
  LineChart,
  Shield,
  Palette,
  Building2,
} from "lucide-react";

interface ServiceItem {
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface ServiceCategory {
  title: string;
  items: ServiceItem[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    title: "Development",
    items: [
      { name: "Custom Software Dev", description: "Tailored solutions for your unique business needs", icon: <Code2 className="h-5 w-5" /> },
      { name: "Web Development", description: "Modern, scalable web applications", icon: <Monitor className="h-5 w-5" /> },
      { name: "Mobile Apps", description: "Native & cross-platform mobile experiences", icon: <Smartphone className="h-5 w-5" /> },
      { name: "Cloud Solutions", description: "Scalable cloud infrastructure & migration", icon: <Cloud className="h-5 w-5" /> },
      { name: "AI/ML", description: "Intelligent automation & predictive analytics", icon: <Brain className="h-5 w-5" /> },
      { name: "IoT", description: "Connected devices & smart systems", icon: <Cpu className="h-5 w-5" /> },
      { name: "Blockchain", description: "Distributed ledger & smart contracts", icon: <Link2 className="h-5 w-5" /> },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "IT Consulting", description: "Strategic technology advisory services", icon: <Users className="h-5 w-5" /> },
      { name: "Project Management", description: "End-to-end project delivery excellence", icon: <KanbanSquare className="h-5 w-5" /> },
      { name: "Infrastructure Mgmt", description: "Reliable IT infrastructure operations", icon: <Server className="h-5 w-5" /> },
      { name: "QA Testing", description: "Comprehensive quality assurance & testing", icon: <BugPlay className="h-5 w-5" /> },
      { name: "Support & Maintenance", description: "24/7 technical support & system upkeep", icon: <LifeBuoy className="h-5 w-5" /> },
    ],
  },
  {
    title: "Solutions",
    items: [
      { name: "Digital Transformation", description: "End-to-end digital modernization", icon: <ArrowRight className="h-5 w-5" /> },
      { name: "Enterprise Solutions", description: "Large-scale enterprise systems", icon: <Building2 className="h-5 w-5" /> },
      { name: "Data Analytics", description: "Actionable insights from your data", icon: <LineChart className="h-5 w-5" /> },
      { name: "Cybersecurity", description: "Protect your digital assets", icon: <Shield className="h-5 w-5" /> },
      { name: "UI/UX Design", description: "Human-centered design experiences", icon: <Palette className="h-5 w-5" /> },
    ],
  },
];

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MegaMenu({ isOpen, onClose, triggerRef }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    },
    [onClose, triggerRef],
  );

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    // Delay to prevent immediate close on trigger click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  // Trap focus when open
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="glass-mega absolute left-1/2 top-full mt-2 w-[720px] -translate-x-1/2 rounded-2xl p-1 origin-top"
          role="menu"
          aria-label="Services menu"
          onKeyDown={handleKeyDown}
        >
          <div className="flex gap-1">
            {/* Category tabs */}
            <div className="flex w-44 flex-col gap-0.5 p-2">
              {SERVICE_CATEGORIES.map((category, index) => (
                <button
                  key={category.title}
                  onClick={() => setActiveCategory(index)}
                  onMouseEnter={() => setActiveCategory(index)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200",
                    activeCategory === index
                      ? "bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200",
                  )}
                  role="menuitem"
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-md transition-colors",
                      activeCategory === index
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                        : "bg-zinc-100 text-zinc-500 dark:bg-white/5 dark:text-zinc-400",
                    )}
                  >
                    {category.items[0]?.icon}
                  </span>
                  <span>{category.title}</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="my-2 w-px bg-zinc-200 dark:bg-white/10" />

            {/* Category items */}
            <div className="flex-1 p-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="mb-2 px-3 py-1">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      {SERVICE_CATEGORIES[activeCategory].title}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-0.5">
                    {SERVICE_CATEGORIES[activeCategory].items.map((item) => (
                      <a
                        key={item.name}
                        href="#services"
                        className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-white/5"
                        role="menuitem"
                        onClick={() => onClose()}
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-400 dark:group-hover:bg-white/10">
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {item.name}
                          </div>
                          <div className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                            {item.description}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-100 px-4 py-2.5 dark:border-white/5">
            <a
              href="#services"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              role="menuitem"
              onClick={() => onClose()}
            >
              View all services
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
