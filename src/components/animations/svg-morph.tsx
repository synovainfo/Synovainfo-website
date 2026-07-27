'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SvgMorphPath {
  /** SVG path `d` attribute */
  path: string;
  /** Optional fill colour (default: currentColor) */
  fill?: string;
  /** Optional stroke colour (default: none) */
  stroke?: string;
  /** Optional stroke width */
  strokeWidth?: number;
}

export interface SvgMorphProps {
  /** Array of path definitions to morph between */
  paths: SvgMorphPath[];
  /** SVG viewBox string (default: '0 0 100 100') */
  viewBox?: string;
  /** Width / height in CSS units (default: '64px') */
  size?: string;
  /** Animation duration in seconds (default: 0.6) */
  duration?: number;
  /** Custom easing curve (default: [0.25, 0.1, 0.25, 1]) */
  ease?: [number, number, number, number];
  /** Optional label for accessibility (default: 'Morphing shape') */
  ariaLabel?: string;
  /** Additional wrapper classes */
  className?: string;
  /** Optional child content to render inside a trigger wrapper */
  children?: ReactNode;
  /** Whether morphing is active (controlled mode) */
  active?: boolean;
  /** Callback when morph completes */
  onMorphComplete?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * SVG shape morphing animation component.
 *
 * Morphs between multiple SVG path definitions on hover (or controlled via
 * `active` prop).  Uses Framer Motion's `animate` to interpolate the `d`
 * attribute.  Disables animation when `prefers-reduced-motion: reduce` is
 * active (renders the first path statically).
 */
export function SvgMorph({
  paths,
  viewBox = '0 0 100 100',
  size = '64px',
  duration = 0.6,
  ease = [0.25, 0.1, 0.25, 1],
  ariaLabel = 'Morphing shape',
  className,
  children,
  active: controlledActive,
  onMorphComplete,
}: SvgMorphProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  // Derive current index: hover toggles between 0 and 1 unless more paths
  // are provided, then sequential cycle through all.
  const isActive = controlledActive ?? hovered;
  const morphIndex = isActive ? Math.min(1, paths.length - 1) : 0;
  const currentPath = paths[morphIndex];

  // Build the `d` attribute for the static / transition path
  const pathData = paths.map((p) => p.path);

  // -----------------------------------------------------------------------
  // Reduced motion — render first shape statically
  // -----------------------------------------------------------------------
  if (prefersReducedMotion) {
    return (
      <svg
        viewBox={viewBox}
        width={size}
        height={size}
        className={cn('overflow-visible', className)}
        aria-label={ariaLabel}
        role="img"
      >
        <path
          d={paths[0].path}
          fill={paths[0].fill ?? 'currentColor'}
          stroke={paths[0].stroke ?? 'none'}
          strokeWidth={paths[0].strokeWidth ?? 0}
        />
      </svg>
    );
  }

  return (
    <div
      className={cn('inline-flex items-center justify-center', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.svg
        viewBox={viewBox}
        width={size}
        height={size}
        aria-label={ariaLabel}
        role="img"
        className="overflow-visible"
      >
        <motion.path
          d={currentPath.path}
          fill={currentPath.fill ?? 'currentColor'}
          stroke={currentPath.stroke ?? 'none'}
          strokeWidth={currentPath.strokeWidth ?? 0}
          animate={{ d: pathData[morphIndex] }}
          transition={{ duration, ease, type: 'tween' }}
          onAnimationComplete={onMorphComplete}
        />
      </motion.svg>
      {children}
    </div>
  );
}
