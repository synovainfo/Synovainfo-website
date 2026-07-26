'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

const containerVariants = (delay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: delay,
    },
  },
});

const wordVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export function TextReveal({
  text,
  className,
  delay = 0,
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const words = useMemo(() => text.split(' '), [text]);

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants(delay)}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordVariants}
          className="inline-block"
        >
          {word}\u00A0
        </motion.span>
      ))}
    </motion.span>
  );
}
