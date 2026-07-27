"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  ArrowRight, 
  Terminal, 
  Cloud, 
  Shield, 
  Settings, 
  Workflow, 
  Cpu, 
  Briefcase, 
  ChevronRight,
  MonitorPlay,
  LineChart
} from "lucide-react";

const MENU_SECTIONS = [
  {
    id: "services",
    title: "Featured Services",
    icon: <Settings className="h-4 w-4" />,
    items: [
      { name: "Enterprise Architecture", slug: "/services/enterprise-solutions", desc: "Scalable system design", icon: <Workflow className="h-4 w-4" /> },
      { name: "Digital Transformation", slug: "/services/digital-transformation", desc: "End-to-end modernization", icon: <MonitorPlay className="h-4 w-4" /> },
      { name: "Cloud Infrastructure", slug: "/services/cloud-infrastructure-solutions", desc: "AWS, Azure & GCP", icon: <Cloud className="h-4 w-4" /> },
      { name: "Cybersecurity Ops", slug: "/services/cybersecurity", desc: "Zero-trust implementation", icon: <Shield className="h-4 w-4" /> },
    ],
    featured: {
      type: "case-study",
      title: "Global FinTech Scale-up",
      subtitle: "Case Study",
      desc: "How we re-architected a legacy monolith into a microservices ecosystem, processing $2B+ daily.",
      link: "/case-studies/fintech-scaleup"
    }
  },
  {
    id: "industries",
    title: "Industry Solutions",
    icon: <Briefcase className="h-4 w-4" />,
    items: [
      { name: "Financial Services", slug: "/industries/financial-services", desc: "Banking & Capital Markets", icon: <LineChart className="h-4 w-4" /> },
      { name: "Healthcare & Life Sciences", slug: "/industries/healthcare", desc: "Compliant health tech", icon: <Settings className="h-4 w-4" /> },
      { name: "Retail & E-commerce", slug: "/industries/retail", desc: "Omnichannel experiences", icon: <Settings className="h-4 w-4" /> },
      { name: "Manufacturing", slug: "/industries/manufacturing", desc: "Industry 4.0 & IoT", icon: <Cpu className="h-4 w-4" /> },
    ],
    featured: {
      type: "diagram",
      title: "Industry 4.0 Architecture",
      subtitle: "Reference Architecture",
      desc: "Explore our real-time factory floor IoT data processing reference architecture.",
      icon: <Workflow className="h-16 w-16 text-[var(--color-corporate-gold)] opacity-50" />,
      link: "/industries/manufacturing"
    }
  },
  {
    id: "technologies",
    title: "Technologies",
    icon: <Cpu className="h-4 w-4" />,
    items: [
      { name: "Cloud & DevOps", slug: "/technologies#cloud", desc: "Kubernetes, Terraform, CI/CD", icon: <Cloud className="h-4 w-4" /> },
      { name: "Data & AI", slug: "/technologies#database", desc: "Machine Learning, LLMs, Spark", icon: <Cpu className="h-4 w-4" /> },
      { name: "Frontend & Mobile", slug: "/technologies#frontend", desc: "React, Next.js, React Native", icon: <MonitorPlay className="h-4 w-4" /> },
      { name: "Backend Systems", slug: "/technologies#backend", desc: "Node.js, Go, Python, Java", icon: <Terminal className="h-4 w-4" /> },
    ],
    featured: {
      type: "cta",
      title: "Evaluate Your Tech Stack",
      subtitle: "Advisory Services",
      desc: "Schedule a comprehensive technical audit with our Principal Engineers.",
      link: "/contact"
    }
  }
];

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MegaMenu({ isOpen, onClose, triggerRef }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

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

  const activeData = MENU_SECTIONS[activeSection];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute left-1/2 top-[calc(100%+16px)] w-[900px] -translate-x-1/2 rounded-2xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/70"
          role="menu"
          aria-label="Services menu"
          onKeyDown={handleKeyDown}
          onMouseLeave={onClose}
        >
          {/* Header of mega menu */}
          <div className="border-b border-zinc-200/50 bg-white/50 px-6 py-4 dark:border-white/10 dark:bg-zinc-900/50 flex items-center justify-between rounded-t-2xl">
             <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[var(--color-corporate-navy)] dark:text-[var(--color-corporate-gold)]" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">Enterprise Capabilities</h2>
             </div>
             <p className="text-xs text-zinc-500 dark:text-zinc-400">Discover our Fortune 500 technology solutions</p>
          </div>

          <div className="flex h-[420px]">
            {/* Column 1: Categories */}
            <div className="w-[240px] border-r border-zinc-200/50 p-4 dark:border-white/10 flex flex-col gap-1">
              <div className="mb-4 px-3 pt-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Explore
                </span>
              </div>
              {MENU_SECTIONS.map((section, idx) => (
                <button
                  key={section.id}
                  onMouseEnter={() => setActiveSection(idx)}
                  onFocus={() => setActiveSection(idx)}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 text-left",
                    activeSection === idx
                      ? "bg-white text-[var(--color-corporate-navy)] shadow-sm dark:bg-zinc-900/80 dark:text-white"
                      : "text-zinc-600 hover:bg-zinc-100/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200"
                  )}
                  role="menuitem"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                      activeSection === idx
                        ? "bg-[var(--color-corporate-navy)]/5 text-[var(--color-corporate-navy)] dark:bg-white/10 dark:text-white"
                        : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700"
                    )}>
                      {section.icon}
                    </span>
                    {section.title}
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-transform",
                    activeSection === idx ? "translate-x-1 opacity-100" : "opacity-0 -translate-x-2"
                  )} />
                </button>
              ))}
            </div>

            {/* Column 2: Items */}
            <div className="w-[340px] border-r border-zinc-200/50 p-6 dark:border-white/10 bg-white/40 dark:bg-black/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-full flex-col"
                >
                  <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                    {activeData.title}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {activeData.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.slug}
                        className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white dark:hover:bg-zinc-900/80"
                        onClick={onClose}
                        role="menuitem"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition-colors group-hover:bg-[var(--color-corporate-gold)]/20 group-hover:text-[var(--color-corporate-navy)] dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-[var(--color-corporate-gold)]/20 dark:group-hover:text-[var(--color-corporate-gold)]">
                          {item.icon}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-zinc-900 group-hover:text-[var(--color-corporate-navy)] dark:text-zinc-100 dark:group-hover:text-white transition-colors">
                            {item.name}
                          </div>
                          <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            {item.desc}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Column 3: Featured Content */}
            <div className="flex-1 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-zinc-900 p-6 text-white dark:bg-zinc-900"
                >
                  {/* Decorative background gradient */}
                  <div className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-800 to-black opacity-50" />
                  <div className="absolute -right-20 -top-20 z-0 h-40 w-40 rounded-full bg-[var(--color-corporate-gold)] opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40" />

                  <div className="relative z-10">
                    <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-zinc-300">
                      {activeData.featured.subtitle}
                    </span>
                    <h4 className="mt-4 text-xl font-bold leading-tight text-white">
                      {activeData.featured.title}
                    </h4>
                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                      {activeData.featured.desc}
                    </p>
                  </div>

                  {activeData.featured.type === "diagram" && (
                    <div className="relative z-10 my-4 flex items-center justify-center">
                      {activeData.featured.icon}
                    </div>
                  )}

                  <div className="relative z-10 mt-6">
                    <Link
                      href={activeData.featured.link}
                      onClick={onClose}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-corporate-gold)] transition-colors hover:text-white"
                    >
                      Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Footer of mega menu */}
          <div className="border-t border-zinc-200/50 bg-zinc-50/50 px-6 py-4 dark:border-white/10 dark:bg-black/20 flex items-center justify-between rounded-b-2xl">
             <span className="text-xs text-zinc-500 dark:text-zinc-400">Need immediate assistance?</span>
             <Link 
               href="/contact" 
               onClick={onClose}
               className="text-sm font-semibold text-[var(--color-corporate-navy)] hover:text-[var(--color-corporate-gold)] dark:text-white dark:hover:text-zinc-300 transition-colors"
             >
               Talk to our experts &rarr;
             </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
