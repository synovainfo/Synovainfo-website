'use client';

import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  duration?: number;
}

const directionVariants: Record<Direction, { initial: Record<string, number>; animate: Record<string, number> }> = {
  up: { initial: { y: 24 }, animate: { y: 0 } },
  down: { initial: { y: -24 }, animate: { y: 0 } },
  left: { initial: { x: 24 }, animate: { x: 0 } },
  right: { initial: { x: -24 }, animate: { x: 0 } },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.6,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const variant = directionVariants[direction];

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...variant.initial }}
      whileInView={{ opacity: 1, ...variant.animate }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
