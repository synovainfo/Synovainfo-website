'use client';

import { useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MouseSpotlightProps {
  /** Radial gradient colour stops (default: accent-blue → transparent) */
  colors?: [string, string];
  /** Spotlight size in px (default: 400) */
  size?: number;
  /** Inactivity timeout in ms before fade (default: 2000). 0 = never fades. */
  inactivityTimeout?: number;
  /** Opacity at peak brightness (default: 0.25) */
  maxOpacity?: number;
  /** Additional classes for the container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Mouse-following gradient spotlight.
 *
 * Renders a single radial-gradient circle that tracks the cursor with
 * GPU-accelerated positioning (translate3d).  Fades out after a configurable
 * inactivity period and resumes on next mouse move.  Disables entirely when
 * `prefers-reduced-motion: reduce` is active.
 */
export function MouseSpotlight({
  colors = ['var(--color-accent-blue)', 'transparent'],
  size = 400,
  inactivityTimeout = 2000,
  maxOpacity = 0.25,
  className,
}: MouseSpotlightProps) {
  const prefersReducedMotion = useReducedMotion();
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Position in px (relative to container)
  const posRef = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(maxOpacity);

  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  // Track whether the mouse has entered the container at all
  const hasEntered = useRef(false);

  // -----------------------------------------------------------------------
  // RAF — flush position to the DOM
  // -----------------------------------------------------------------------
  const flushPosition = useCallback(() => {
    const el = spotlightRef.current;
    if (!el) return;

    const { x, y } = posRef.current;
    el.style.translate = `${x - size / 2}px ${y - size / 2}px`;
    rafRef.current = null;
  }, [size]);

  // -----------------------------------------------------------------------
  // Mouse handlers
  // -----------------------------------------------------------------------

  const resetInactivity = useCallback(() => {
    if (inactivityRef.current) clearTimeout(inactivityRef.current);

    if (inactivityTimeout > 0) {
      inactivityRef.current = setTimeout(() => {
        setOpacity(0);
      }, inactivityTimeout);
    }
  }, [inactivityTimeout]);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const el = spotlightRef.current?.parentElement;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      posRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Flush position on next RAF (throttle)
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(flushPosition);
      }

      if (!hasEntered.current) {
        hasEntered.current = true;
        setVisible(true);
      }

      // Fade in if currently hidden
      if (opacity === 0) {
        setOpacity(maxOpacity);
      }

      resetInactivity();
    },
    [flushPosition, maxOpacity, opacity, resetInactivity],
  );

  const handlePointerLeave = useCallback(() => {
    if (inactivityTimeout > 0) {
      setOpacity(0);
    } else {
      setVisible(false);
    }
    hasEntered.current = false;
  }, [inactivityTimeout]);

  // -----------------------------------------------------------------------
  // Bind / unbind pointer events
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = spotlightRef.current?.parentElement;
    if (!el) return;

    // We listen on the parent so the spotlight doesn't interfere with
    // pointer events on child content.
    el.addEventListener('pointermove', handlePointerMove, { passive: true });
    el.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion, handlePointerMove, handlePointerLeave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={spotlightRef}
      className={cn('pointer-events-none absolute left-0 top-0 will-change-transform', className)}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 50% 50%, ${colors[0]} 0%, ${colors[1]} 70%)`,
        opacity: visible ? opacity : 0,
        transition: 'opacity 0.6s ease',
        translate: '-9999px -9999px', // off-screen until first move
      }}
      aria-hidden="true"
    />
  );
}
