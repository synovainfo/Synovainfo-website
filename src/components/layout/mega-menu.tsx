"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Code2,
  Monitor,
  Smartphone,
  Cloud,
  Brain,
  Users,
  KanbanSquare,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface ServiceItem {
  name: string;
  description: string;
  icon: React.ReactNode;
  slug: string;
  badge?: string;
}

interface ServiceCategory {
  title: string;
  items: ServiceItem[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    title: "Core Engineering",
    items: [
      {
        name: "Custom Software",
        description: "Build secure, scalable systems tailored to enterprise workflows.",
        icon: <Code2 className="h-5 w-5" />,
        slug: "custom-software",
        badge: "Core",
      },
      {
        name: "Software Customization",
        description: "Extend and customize existing enterprise platforms.",
        icon: <Sparkles className="h-5 w-5" />,
        slug: "software-customization",
      },
      {
        name: "Mobile App Development",
        description: "Deliver enterprise mobility with secure native applications.",
        icon: <Smartphone className="h-5 w-5" />,
        slug: "mobile-app-development",
      },
    ],
  },
  {
    title: "Innovation & Support",
    items: [
      {
        name: "VR Development",
        description: "Immersive virtual reality solutions for training and visualization.",
        icon: <Monitor className="h-5 w-5" />,
        slug: "vr-development",
        badge: "Emerging",
      },
      {
        name: "Support & Maintenance",
        description: "24/7 proactive monitoring and legacy system support.",
        icon: <Shield className="h-5 w-5" />,
        slug: "support-maintenance",
      },
    ],
  },
];

const SOLUTION_CATEGORIES: ServiceCategory[] = [
  {
    title: "Operations & Assets",
    items: [
      {
        name: "Asset Management",
        description: "Track and optimize physical and digital assets across the enterprise.",
        icon: <Monitor className="h-5 w-5" />,
        slug: "asset-management",
      },
      {
        name: "IT Asset Management",
        description: "Comprehensive lifecycle management for IT infrastructure.",
        icon: <Cloud className="h-5 w-5" />,
        slug: "it-asset-management",
      },
      {
        name: "Logistics Management",
        description: "Streamline supply chain and global logistics tracking.",
        icon: <KanbanSquare className="h-5 w-5" />,
        slug: "logistics-management",
      },
    ],
  },
  {
    title: "Enterprise Processes",
    items: [
      {
        name: "Workflow Approval",
        description: "Automate complex business routing and multi-stage approvals.",
        icon: <Users className="h-5 w-5" />,
        slug: "workflow-approval",
      },
      {
        name: "Quality Management",
        description: "Ensure compliance and product quality through automated checks.",
        icon: <Shield className="h-5 w-5" />,
        slug: "quality-management",
      },
      {
        name: "Smart Procurement",
        description: "Intelligent vendor selection and procurement automation.",
        icon: <Brain className="h-5 w-5" />,
        slug: "smart-procurement",
      },
    ],
  },
  {
    title: "HR & Compliance",
    items: [
      {
        name: "HR Resume Screening",
        description: "AI-driven talent acquisition and automated resume parsing.",
        icon: <Users className="h-5 w-5" />,
        slug: "hr-resume-screening",
      },
      {
        name: "Recruitment Management",
        description: "End-to-end recruitment lifecycle and candidate tracking.",
        icon: <KanbanSquare className="h-5 w-5" />,
        slug: "recruitment-management",
      },
      {
        name: "Software Licensing",
        description: "Centralized tracking of enterprise software compliance.",
        icon: <Shield className="h-5 w-5" />,
        slug: "software-licensing",
      },
    ],
  },
];

interface MegaMenuProps {
  activeCategory: string | null;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MegaMenu({ activeCategory, onClose, triggerRef }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const isOpen = activeCategory !== null;

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    },
    [onClose, triggerRef]
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
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  // Focus trap inside mega menu
  useEffect(() => {
    if (!isOpen) return;
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  // Dynamic Content based on Category
  const renderContent = () => {
    if (activeCategory === "Solutions") {
      return (
        <div className="grid gap-3 sm:grid-cols-3">
          {SOLUTION_CATEGORIES.map((category) => (
            <div key={category.title} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-corporate-gold">
                {category.title}
              </p>
              <div className="mt-4 space-y-2">
                {category.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/services/${item.slug}`}
                    className="flex items-start gap-3 rounded-2xl px-3 py-3 transition hover:bg-white hover:shadow-sm"
                  >
                    <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-corporate-gold">
                      {item.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeCategory === "Services") {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {SERVICE_CATEGORIES.map((category) => (
            <div key={category.title} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-corporate-gold">
                {category.title}
              </p>
              <div className="mt-4 space-y-2">
                {category.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/services/${item.slug}`}
                    className="flex items-start gap-3 rounded-2xl px-3 py-3 transition hover:bg-white hover:shadow-sm"
                  >
                    <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-corporate-gold">
                      {item.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeCategory === "Industries") {
      return (
        <div className="grid gap-6 sm:grid-cols-2 p-4">
          <div>
            <h3 className="text-lg font-bold text-corporate-navy mb-4">Target Industries</h3>
            <ul className="space-y-3">
              <li><Link href="/industries/finance" className="text-sm text-slate-600 hover:text-corporate-gold">Financial Services & Fintech</Link></li>
              <li><Link href="/industries/healthcare" className="text-sm text-slate-600 hover:text-corporate-gold">Healthcare & Life Sciences</Link></li>
              <li><Link href="/industries/manufacturing" className="text-sm text-slate-600 hover:text-corporate-gold">Manufacturing & Supply Chain</Link></li>
              <li><Link href="/industries/retail" className="text-sm text-slate-600 hover:text-corporate-gold">Retail & E-commerce</Link></li>
            </ul>
          </div>
          <div className="rounded-2xl bg-corporate-navy p-6 text-white">
            <h3 className="text-sm font-bold uppercase tracking-widest text-corporate-gold mb-2">Featured Case Study</h3>
            <p className="font-semibold text-lg mb-2">Global Bank Cloud Migration</p>
            <p className="text-sm text-white/70 mb-4">How we achieved 99.999% uptime during a legacy modernization.</p>
            <Link href="/case-studies" className="inline-flex items-center text-sm font-bold text-corporate-gold hover:text-white transition-colors">Read Case Study <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </div>
        </div>
      );
    }

    if (activeCategory === "Resources") {
      return (
        <div className="grid gap-4 sm:grid-cols-4 p-4">
          {['Blog', 'Success Stories', 'Whitepapers', 'Architecture Diagrams'].map((res) => (
             <Link key={res} href={`/${res.toLowerCase().replace(' ', '-')}`} className="block rounded-2xl p-4 bg-slate-50 hover:bg-slate-100 transition">
               <p className="font-semibold text-corporate-navy">{res}</p>
               <p className="text-xs text-slate-500 mt-1">Explore our latest {res.toLowerCase()}</p>
             </Link>
          ))}
        </div>
      );
    }

    if (activeCategory === "Company") {
      return (
        <div className="grid gap-6 sm:grid-cols-2 p-4">
          <ul className="space-y-3">
            <li><Link href="/about" className="text-sm font-semibold text-corporate-navy hover:text-corporate-gold">About Synova</Link></li>
            <li><Link href="/approach" className="text-sm font-semibold text-corporate-navy hover:text-corporate-gold">Our Approach</Link></li>
            <li><Link href="/careers" className="text-sm font-semibold text-corporate-navy hover:text-corporate-gold">Careers</Link></li>
            <li><Link href="/press" className="text-sm font-semibold text-corporate-navy hover:text-corporate-gold">Press & Media</Link></li>
          </ul>
          <div className="rounded-2xl bg-slate-50 p-6">
            <h3 className="text-sm font-bold text-corporate-navy mb-2">Global Headquarters</h3>
            <p className="text-sm text-slate-600">Pune, India</p>
            <Link href="/contact" className="mt-4 inline-block text-sm font-bold text-corporate-gold">Contact Sales &rarr;</Link>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-1/2 top-full mt-3 w-[min(100vw-2rem,800px)] -translate-x-1/2 rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_30px_90px_rgba(15,23,42,0.12)] z-50 transform-gpu origin-top"
          role="menu"
          aria-label={`${activeCategory} dropdown`}
          onKeyDown={handleKeyDown}
        >
          {renderContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
