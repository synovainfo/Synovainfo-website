'use client';

import { type ReactNode, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CardStackCard {
  /** Unique identifier */
  id: string;
  /** Card title */
  title: string;
  /** Card description or body content */
  description: string;
  /** Optional image URL */
  image?: string;
  /** Accent colour (CSS colour value) used for card border/glow */
  accentColor?: string;
  /** Optional background colour override */
  bgColor?: string;
}

export interface CardStackProps {
  /** Array of cards to display in the stack */
  cards: CardStackCard[];
  /** Additional wrapper classes */
  className?: string;
  /** Card className override */
  cardClassName?: string;
  /** Fan-out offset in px between cards (default: 40) */
  stackOffset?: number;
  /** Base rotation for alternating card tilt (default: 3) */
  rotateBase?: number;
  /** Overlap offset in px for collapsed state (default: 60) */
  overlap?: number;
  /** Custom render function for card content */
  renderCard?: (card: CardStackCard) => ReactNode;
}

// ---------------------------------------------------------------------------
// Default card renderer
// ---------------------------------------------------------------------------

function DefaultCardContent({ card }: { card: CardStackCard }) {
  return (
    <>
      {card.image && (
        <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
          <img
            src={card.image}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          {card.title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {card.description}
        </p>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * 3D perspective card stack with scroll-triggered fan-out animation.
 *
 * Cards stack vertically with overlap in their collapsed state.  When the
 * container scrolls into view they fan out with staggered 3D transforms.
 * Collapses gracefully on mobile.  Respects `prefers-reduced-motion: reduce`
 * by rendering cards in a simple vertical list.
 */
export function CardStack({
  cards,
  className,
  cardClassName,
  stackOffset = 40,
  rotateBase = 3,
  overlap = 60,
  renderCard,
}: CardStackProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, {
    once: true,
    margin: '-100px',
  });

  // -----------------------------------------------------------------------
  // Reduced motion — simple vertical list
  // -----------------------------------------------------------------------
  if (prefersReducedMotion) {
    return (
      <div
        ref={containerRef}
        className={cn('flex flex-col gap-4', className)}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={cn(
              'overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]',
              cardClassName,
            )}
            style={{
              borderColor: card.accentColor ?? 'var(--color-border)',
            }}
          >
            {renderCard ? renderCard(card) : <DefaultCardContent card={card} />}
          </div>
        ))}
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Animated stack
  // -----------------------------------------------------------------------

  const total = cards.length;
  // Calculate total stack height so the container reserves space
  const stackHeight = overlap + (total - 1) * overlap;

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ height: prefersReducedMotion ? undefined : stackHeight }}
    >
      {cards.map((card, i) => {
        // Fan-out: each card translates down and slightly rotates
        // In collapsed state cards overlap; in fan-out they spread apart
        const isLast = i === total - 1;

        // Collapsed position (all stacked at top)
        const collapsedY = i * (overlap * 0.5); // tighter overlap
        // Fanned-out position (spread with stackOffset between each)
        const expandedY = i * stackOffset;

        // Subtle alternating rotation for a hand-laid feel
        const rotation = (i % 2 === 0 ? 1 : -1) * rotateBase * (1 - i / total);

        // Each card gets a slightly larger z-index as it goes higher (visual layering)
        const zIndex = total - i;

        return (
          <motion.div
            key={card.id}
            className={cn(
              'absolute left-0 right-0 overflow-hidden rounded-xl border',
              'bg-[var(--color-surface)] shadow-lg',
              'backface-visible',
              cardClassName,
            )}
            style={{
              zIndex,
              transformStyle: 'preserve-3d',
              borderColor: card.accentColor ?? 'var(--color-border)',
              boxShadow: card.accentColor
                ? `0 4px 24px -4px ${card.accentColor}22`
                : undefined,
              backgroundColor: card.bgColor ?? 'var(--color-surface)',
            }}
            initial={{
              y: collapsedY,
              rotateX: 0,
              rotateZ: 0,
              scale: 1,
            }}
            animate={
              inView
                ? {
                    y: expandedY,
                    rotateX: 0,
                    rotateZ: rotation,
                    scale: 0.98 - i * 0.015,
                    transition: {
                      type: 'spring',
                      stiffness: 80,
                      damping: 18,
                      delay: i * 0.1,
                    },
                  }
                : {
                    y: collapsedY,
                    rotateX: 0,
                    rotateZ: 0,
                    scale: 1,
                  }
            }
            whileHover={
              isLast
                ? {
                    y: expandedY - 8,
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 300, damping: 20 },
                  }
                : undefined
            }
          >
            {renderCard ? renderCard(card) : <DefaultCardContent card={card} />}

            {/* Accent gradient top-border line */}
            {card.accentColor && (
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${card.accentColor}, transparent)`,
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
