"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  hasMega?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Services", href: "#services", hasMega: true },
  { label: "Industries", href: "#industries" },
  { label: "Technologies", href: "#technologies" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
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
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.replace("#", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        // Get the section with the highest intersection ratio
        let maxRatio = 0;
        let maxId = "";

        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxId = entry.target.id;
          }
        }

        if (maxId) {
          setActiveSection(maxId);
        }
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    // Observe all section elements
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      onItemClick?.();
    },
    [onItemClick],
  );

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
          const isActive = activeSection === item.href.replace("#", "");

          return (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={cn(
                  "relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  variant === "desktop"
                    ? "hover:text-zinc-900 dark:hover:text-white"
                    : "text-2xl font-semibold text-zinc-800 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white",
                  isActive
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400",
                )}
                aria-current={isActive ? "true" : undefined}
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
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-zinc-900 dark:bg-white" />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { NAV_ITEMS };
