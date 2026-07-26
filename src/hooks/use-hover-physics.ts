'use client';

import { useReducedMotion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HoverPhysicsOptions {
  /** Rotation intensity multiplier (default: 8) — higher = more tilt */
  intensity?: number;
  /** Perspective value in px (default: 1000) — lower = more dramatic */
  perspective?: number;
  /** Smoothing factor 0-1 (default: 0.15) — lower = more lag */
  lerpFactor?: number;
}

export interface HoverPhysicsTransform {
  rotateX: string;
  rotateY: string;
  translateZ: string;
  transformPerspective: string;
  transformStyle: 'preserve-3d';
  willChange: 'transform';
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Physics-based hover effect hook.
 *
 * Binds to `onMouseMove` / `onMouseLeave` on a target element and returns a
 * React `style` object with smooth-lerped 3D transforms.  Disables itself
 * when `prefers-reduced-motion: reduce` is active.
 *
 * @example
 * ```tsx
 * const hoverRef = useRef<HTMLDivElement>(null);
 * const style = useHoverPhysics(hoverRef, { intensity: 10, perspective: 800 });
 *
 * return <div ref={hoverRef} style={style}>...</div>;
 * ```
 */
export function useHoverPhysics<T extends HTMLElement = HTMLDivElement>(
  ref: React.RefObject<T | null>,
  options: HoverPhysicsOptions = {},
): {
  onMouseMove: (e: React.MouseEvent<T>) => void;
  onMouseLeave: () => void;
  style: HoverPhysicsTransform;
} {
  const prefersReducedMotion = useReducedMotion();

  const {
    intensity = 8,
    perspective = 1000,
    lerpFactor = 0.15,
  } = options;

  // Track current lerp target (raw mouse position 0-1)
  const targetX = useRef(0.5);
  const targetY = useRef(0.5);
  // Track current lerp value (smoothly approaches target)
  const currentX = useRef(0.5);
  const currentY = useRef(0.5);

  const rafId = useRef<number | null>(null);

  // Stable transform state — we mutate this to avoid re-renders on every RAF
  const [tick, setTick] = useState(0);

  // -----------------------------------------------------------------------
  // RAF loop — smooth lerp toward target
  // -----------------------------------------------------------------------
  const animate = useCallback(() => {
    currentX.current += (targetX.current - currentX.current) * lerpFactor;
    currentY.current += (targetY.current - currentY.current) * lerpFactor;

    // Stop RAF when close enough to avoid wasteful frames
    const dx = Math.abs(targetX.current - currentX.current);
    const dy = Math.abs(targetY.current - currentY.current);

    setTick((n) => n + 1);

    if (dx > 0.001 || dy > 0.001) {
      rafId.current = requestAnimationFrame(animate);
    } else {
      currentX.current = targetX.current;
      currentY.current = targetY.current;
      rafId.current = null;
    }
  }, [lerpFactor]);

  // -----------------------------------------------------------------------
  // Event handlers
  // -----------------------------------------------------------------------

  const onMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      if (prefersReducedMotion) return;

      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      targetX.current = (e.clientX - rect.left) / rect.width;
      targetY.current = (e.clientY - rect.top) / rect.height;

      // Start RAF loop if not already running
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(animate);
      }
    },
    [prefersReducedMotion, ref, animate],
  );

  const onMouseLeave = useCallback(() => {
    if (prefersReducedMotion) return;

    // Spring back to centre
    targetX.current = 0.5;
    targetY.current = 0.5;

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(animate);
    }
  }, [prefersReducedMotion, animate]);

  // -----------------------------------------------------------------------
  // Derive transform from current lerp values
  // -----------------------------------------------------------------------
  // We trigger a re-render only when tick changes (RAF loop) so React stays
  // in sync.  This is intentional: we want React to apply the style each
  // frame so the GPU has the latest values.
  const x = currentX.current;
  const y = currentY.current;

  // Map 0-1 to rotate range: (-intensity) to (+intensity)
  const rotY = (x - 0.5) * 2 * intensity;  // -intensity .. +intensity
  const rotX = (y - 0.5) * -2 * intensity;
  const tz = intensity * 4;

  // Make TS happy — tick is "used" via this read
  void tick;

  if (prefersReducedMotion) {
    return {
      onMouseMove,
      onMouseLeave,
      style: {
        rotateX: '0deg',
        rotateY: '0deg',
        translateZ: '0px',
        transformPerspective: `${perspective}px`,
        transformStyle: 'preserve-3d' as const,
        willChange: 'transform',
      },
    };
  }

  return {
    onMouseMove,
    onMouseLeave,
    style: {
      rotateX: `${rotX.toFixed(1)}deg`,
      rotateY: `${rotY.toFixed(1)}deg`,
      translateZ: `${tz.toFixed(0)}px`,
      transformPerspective: `${perspective}px`,
      transformStyle: 'preserve-3d' as const,
      willChange: 'transform',
    },
  };
}
