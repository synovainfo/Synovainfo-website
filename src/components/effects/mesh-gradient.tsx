'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MeshGradientProps {
  /** Array of CSS colour values (default: brand accent colours) */
  colors?: string[];
  /** Additional class names */
  className?: string;
  /** Animation speed multiplier — 1 is normal, 2 is twice as fast (default: 1) */
  speed?: number;
}

const DEFAULT_COLORS = [
  'var(--color-accent-blue)',
  'var(--color-accent-cyan)',
  'var(--color-accent-purple)',
  'var(--color-accent-emerald)',
];

/**
 * Smooth animated mesh gradient background.
 * Uses CSS custom properties and keyframe animations for GPU-accelerated transitions.
 * Respects `prefers-reduced-motion` (static gradient when reduced).
 */
export function MeshGradient({
  colors = DEFAULT_COLORS,
  className,
  speed = 1,
}: MeshGradientProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const style = {
    '--mesh-color-1': colors[0] ?? DEFAULT_COLORS[0],
    '--mesh-color-2': colors[1] ?? DEFAULT_COLORS[1],
    '--mesh-color-3': colors[2] ?? DEFAULT_COLORS[2],
    '--mesh-color-4': colors[3] ?? DEFAULT_COLORS[3],
    '--mesh-speed': speed,
  } as React.CSSProperties;

  if (reducedMotion) {
    return (
      <div
        className={cn('pointer-events-none absolute inset-0', className)}
        aria-hidden="true"
        style={{
          ...style,
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, var(--mesh-color-1) 0%, transparent 60%),
            radial-gradient(ellipse 60% 70% at 80% 20%, var(--mesh-color-2) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 50% 80%, var(--mesh-color-3) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 10% 70%, var(--mesh-color-4) 0%, transparent 60%)
          `,
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
      aria-hidden="true"
      style={style}
    >
      <div className="mesh-blob mesh-blob-1" />
      <div className="mesh-blob mesh-blob-2" />
      <div className="mesh-blob mesh-blob-3" />
      <div className="mesh-blob mesh-blob-4" />
    </div>
  );
}