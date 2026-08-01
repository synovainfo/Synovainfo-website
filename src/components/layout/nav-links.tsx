"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  subItems?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Solutions", href: "/solutions", hasDropdown: true },
  {
    label: "Services",
    href: "/services",
    hasDropdown: true,
    subItems: [
      { label: "Custom Software", href: "/services/custom-software-development" },
      { label: "AI & Machine Learning", href: "/services/ai-machine-learning" },
      { label: "Cloud Engineering", href: "/services/cloud-infrastructure-solutions" },
      { label: "Cybersecurity", href: "/services/cybersecurity" },
      { label: "Web Applications", href: "/services/web-development" },
      { label: "Mobile Applications", href: "/services/mobile-app-development" },
    ],
  },
  { label: "Industries", href: "/industries", hasDropdown: true, subItems: [
    { label: "Financial Services & Fintech", href: "/industries/financial-services" },
    { label: "Healthcare & Life Sciences", href: "/industries/healthcare" },
    { label: "Manufacturing & Supply Chain", href: "/industries/manufacturing" },
    { label: "Retail & E-commerce", href: "/industries/retail" },
  ] },
  {
    label: "Resources",
    href: "/resources",
    hasDropdown: true,
    subItems: [
      { label: "Blog", href: "/blog" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Insights", href: "/insights" },
      { label: "Architecture", href: "/architecture" },
    ],
  },
  {
    label: "Company",
    href: "/about",
    hasDropdown: true,
    subItems: [
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Press", href: "/press" },
    ],
  },
];

interface NavLinksProps {
  className?: string;
  variant?: "desktop" | "mobile";
  onItemClick?: () => void;
  onMegaMenuHover?: (category: string) => void;
  onMegaMenuLeave?: () => void;
  activeMegaMenu?: string | null;
  isScrolled?: boolean;
  isLightTheme?: boolean;
  megaMenuTriggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export function NavLinks({
  className,
  variant = "desktop",
  onItemClick,
  onMegaMenuHover,
  onMegaMenuLeave,
  activeMegaMenu,
  isScrolled = false,
  isLightTheme = false,
  megaMenuTriggerRef,
}: NavLinksProps) {
  const pathname = usePathname();
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  return (
    <nav className={cn(className)} aria-label="Main Navigation">
      <ul
        className={cn(
          "flex items-center",
          variant === "desktop"
            ? "flex-row space-x-10" // 2.5rem spacing between nav items
            : "flex-col space-y-4 w-full"
        )}
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== "/");

          const isMenuOpen = activeMegaMenu === item.label;

          // Desktop: all items with hasDropdown use the mega menu
          if (item.hasDropdown && variant === "desktop") {
            return (
              <li
                key={item.label}
                className="relative group py-6 -my-6"
                onMouseEnter={() => onMegaMenuHover?.(item.label)}
                onMouseLeave={onMegaMenuLeave}
              >
                <button
                  ref={isMenuOpen ? megaMenuTriggerRef : undefined}
                  onClick={() => onMegaMenuHover?.(item.label)}
                  className={cn(
                    "group relative inline-flex items-center gap-1.5 py-2 text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-gold focus-visible:ring-offset-2 rounded-md min-h-[44px] min-w-[44px] px-1",
                    isScrolled ? "focus-visible:ring-offset-white" : "focus-visible:ring-offset-slate-900",
                    isActive || isMenuOpen
                      ? "text-corporate-gold"
                      : isScrolled || isLightTheme
                        ? "text-corporate-navy hover:text-corporate-gold"
                        : "text-white hover:text-corporate-gold"
                  )}
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                  aria-controls="mega-menu"
                  aria-label={`${item.label} menu`}
                >
                  <span className="relative py-1">
                    {item.label}
                    <span
                      className={cn(
                        "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-corporate-gold rounded-full transition-all duration-300 ease-out",
                        isMenuOpen ? "w-full" : "w-0 group-hover:w-full"
                      )}
                    />
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-300 text-slate-400 group-hover:text-corporate-gold",
                      isMenuOpen && "rotate-180 text-corporate-gold"
                    )}
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          }

          return (
            <li key={item.label} className="relative group">
              <div className="w-full">
                <Link
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "group relative inline-flex items-center text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-gold focus-visible:ring-offset-2 rounded-md min-h-[44px] px-1",
                    isScrolled ? "focus-visible:ring-offset-white" : "focus-visible:ring-offset-slate-900",
                    variant === "desktop"
                      ? isActive
                        ? "text-corporate-gold"
                        : isScrolled || isLightTheme
                          ? "text-corporate-navy hover:text-corporate-gold"
                          : "text-white hover:text-corporate-gold"
                      : "text-2xl font-medium text-corporate-navy hover:text-corporate-gold py-3 w-full border-b border-slate-200"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="relative py-1">
                    {item.label}
                    {variant === "desktop" && (
                      <>
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-corporate-gold rounded-full group-hover:w-full transition-all duration-300 ease-out" />
                        {isActive && (
                          <motion.span
                            layoutId="activeNavIndicator"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-corporate-gold rounded-full"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </span>
                </Link>

                {/* Mobile: render collapsible sub-items when present */}
                {variant === "mobile" && item.subItems && item.subItems.length > 0 && (
                  <div className="mt-2">
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      aria-expanded={mobileExpanded === item.label}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <span className="sr-only">Toggle {item.label} sub-menu</span>
                      <ChevronDown className={cn("w-4 h-4 transition-transform", mobileExpanded === item.label && "rotate-180")} />
                      <span className="text-xs uppercase tracking-wider">More</span>
                    </button>

                    {mobileExpanded === item.label && (
                      <ul className="mt-2 space-y-2 pl-4">
                        {item.subItems.map((sub) => (
                          <li key={sub.href}>
                            <Link href={sub.href} onClick={onItemClick} className="block text-base text-slate-700 dark:text-slate-200">
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { NAV_ITEMS };
