'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AuroraBackgroundProps {
  className?: string;
}

/**
 * Animated aurora borealis background effect using CSS gradients and keyframe animations.
 * GPU-accelerated — only animates transform and opacity.
 * Respects `prefers-reduced-motion` (renders nothing when reduced).
 */
export function AuroraBackground({ className }: AuroraBackgroundProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) return null;

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {/* Orb 1 — large, slow, blue-tinted */}
      <div className="aurora-orb aurora-orb-1" />

      {/* Orb 2 — medium, cyan-tinted, offset bottom-left */}
      <div className="aurora-orb aurora-orb-2" />

      {/* Orb 3 — smaller, purple-tinted, centred */}
      <div className="aurora-orb aurora-orb-3" />
    </div>
  );
}