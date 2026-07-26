"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
}

export function NavLinks({
  className,
  variant = "desktop",
  onItemClick,
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className={cn(className)} aria-label="Main navigation">
      <ul
        className={cn(
          "flex",
          variant === "desktop"
            ? "items-center gap-1"
            : "flex-col gap-1",
        )}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={onItemClick}
                className={cn(
                  "relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  variant === "desktop"
                    ? "hover:text-corporate-navy dark:hover:text-white"
                    : "text-2xl font-semibold text-zinc-800 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white",
                  isActive
                    ? "text-corporate-navy dark:text-white font-semibold"
                    : "text-zinc-500 dark:text-zinc-400",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
                {item.hasMega && variant === "desktop" && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="ml-1.5 h-3 w-3 opacity-50"
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
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-corporate-gold" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { NAV_ITEMS };
