"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface NavItem {
  label: string;
  href: string;
  hasMega?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Technologies", href: "/technologies" },
  { label: "Industries", href: "/industries" },
  { label: "Engagement", href: "/engagement-models" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
];

interface NavLinksProps {
  className?: string;
  variant?: "desktop" | "mobile";
  onItemClick?: () => void;
  startIndex?: number;
  endIndex?: number;
}

export function NavLinks({
  className,
  variant = "desktop",
  onItemClick,
  startIndex,
  endIndex,
}: NavLinksProps) {
  const pathname = usePathname();

  const itemsToRender = NAV_ITEMS.slice(startIndex, endIndex);

  return (
    <ul
      className={cn(
        "flex",
        variant === "desktop"
          ? "items-center gap-1.5"
          : "flex-col gap-2",
        className
      )}
    >
      {itemsToRender.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');

        return (
          <li key={item.label}>
            <Link
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "relative inline-flex items-center rounded-lg transition-all duration-300 group overflow-hidden",
                variant === "desktop"
                  ? "px-3.5 py-2 text-sm font-medium hover:text-[var(--color-corporate-navy)] dark:hover:text-white"
                  : "px-4 py-3 text-xl font-semibold text-zinc-800 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white",
                isActive
                  ? "text-[var(--color-corporate-navy)] dark:text-white font-semibold"
                  : "text-zinc-500 dark:text-zinc-400",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Hover Background - only for desktop */}
              {variant === "desktop" && (
                <div className="absolute inset-0 z-0 scale-95 opacity-0 rounded-lg bg-zinc-100 dark:bg-white/5 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100" />
              )}
              
              <span className="relative z-10 flex items-center">
                {item.label}
                {item.hasMega && variant === "desktop" && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="ml-1.5 h-3 w-3 opacity-50 transition-transform duration-300 group-hover:translate-y-[1px]"
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
                )}
              </span>
              
              {/* Animated underline for active state */}
              {isActive && variant === "desktop" && (
                <motion.span
                  layoutId="desktop-active-nav"
                  className="absolute inset-x-3 -bottom-0 h-0.5 rounded-full bg-[var(--color-corporate-gold)] z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export { NAV_ITEMS };
