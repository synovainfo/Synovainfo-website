import { gsap, EASE, prefersReducedMotion } from "../lib/gsap";
import { getLenis } from "../lib/lenis";

export interface TransitionEls {
  curtain: HTMLElement;
  curtainLabel?: HTMLElement;
}

/**
 * Plays a curtain wipe (used by the preloader on first load and between
 * navigations). `from === true` covers the viewport; `from === false`
 * lifts it away.
 */
export function playCurtain(
  els: TransitionEls,
  from: boolean,
  duration = 0.8,
): Promise<void> {
  if (prefersReducedMotion()) {
    gsap.set(els.curtain, { yPercent: from ? 0 : -100, opacity: from ? 1 : 0 });
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    gsap.to(els.curtain, {
      yPercent: from ? 0 : -100,
      duration,
      ease: EASE.expoInOut,
      onComplete: resolve,
    });
  });
}

/** Smooth scroll to a section id, closing any open menu first. */
export function navigateToSection(id: string): void {
  const lenis = getLenis();
  const target = document.querySelector(id);
  if (!target) return;

  if (lenis) {
    lenis.scrollTo(target as HTMLElement, { duration: 1.5, offset: 0 });
  } else {
    (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }
}
