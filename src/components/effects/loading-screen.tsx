'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Logo } from '@/components/ui/logo';

interface LoadingScreenProps {
  children: ReactNode;
  /** Minimum display time in ms (default: 1500) */
  minDisplayTime?: number;
}

/**
 * Premium loading screen that shows on initial page load.
 * Displays an animated logo with a progress bar, then exits with a scale+fade transition.
 * Minimum display time is configurable via `minDisplayTime`.
 */
export function LoadingScreen({
  children,
  minDisplayTime = 1500,
}: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const startTime = performance.now();

    // Simulate progress — ramps from 0 → ~90% quickly, then waits
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        // Fast ramp to 60%, then slow approach to 90%
        const increment = prev < 60 ? 8 : 2;
        return Math.min(prev + increment, 90);
      });
    }, 120);

    // Wait for the page to be fully loaded
    const handleLoad = () => {
      setProgress(100);

      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    };

    if (document.readyState === 'complete') {
      // Page already loaded — just wait for minDisplayTime
      const elapsed = performance.now() - startTime;
      setProgress(100);
      const remaining = Math.max(0, minDisplayTime - elapsed);
      setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearInterval(progressInterval);
      window.removeEventListener('load', handleLoad);
    };
  }, [minDisplayTime]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading-screen"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--color-surface)]"
            exit={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, scale: 1.05 }
            }
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Animated logo */}
            <motion.div
              initial={
                prefersReducedMotion ? undefined : { opacity: 0, scale: 0.8 }
              }
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <Logo size="xl" animated />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="mt-4 text-sm tracking-[0.2em] text-[var(--color-text-tertiary)]"
              initial={
                prefersReducedMotion ? undefined : { opacity: 0, y: 8 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Engineering Excellence
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-[var(--color-border-light)]"
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <motion.div
                className="h-full rounded-full bg-[var(--color-accent-blue)]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content — hidden while loading */}
      <div
        className={isLoading ? 'invisible' : undefined}
        aria-hidden={isLoading}
      >
        {children}
      </div>
    </>
  );
}