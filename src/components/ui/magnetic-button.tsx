"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  glow?: boolean;
}

export function MagneticButton({ children, className, strength = 40, glow = true, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) / (width / strength));
    y.set((clientY - centerY) / (height / strength));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-xl font-semibold transition-all duration-300",
        "bg-[var(--color-corporate-navy)] text-white hover:bg-[var(--color-corporate-gold)] hover:text-[var(--color-corporate-navy)]",
        "dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200",
        className
      )}
      {...props}
    >
      {glow && (
        <motion.div
          className="absolute inset-0 z-0 bg-gradient-to-r from-[var(--color-corporate-gold)] to-yellow-200 opacity-0 blur-xl transition-opacity duration-300 dark:from-white dark:to-zinc-300 pointer-events-none"
          animate={{ opacity: isHovered ? 0.3 : 0 }}
        />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
        {children}
      </span>
    </motion.button>
  );
}
