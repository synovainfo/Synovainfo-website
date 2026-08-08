import { gsap, EASE, TIMING } from "../lib/gsap";

export interface HeroAnimElements {
  hero: HTMLElement;
  eyebrow: HTMLElement;
  headlineLines: HTMLSpanElement[]; // masked line inners
  headlineChars?: HTMLElement[];
  copy: HTMLElement;
  ctaPrimary: HTMLElement;
  ctaSecondary: HTMLElement;
  visual: HTMLElement;
  scrollHint: HTMLElement;
  background: HTMLElement;
}

/**
 * The hero entrance. Runs after the preloader's curtain lifts.
 * Order: eyebrow → headline (mask + char stagger) → copy → CTAs →
 * visual scale → scroll hint → background settle.
 */
export function animateHero(el: HeroAnimElements, onComplete?: () => void): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: EASE.expo }, onComplete });

  tl.fromTo(
    el.eyebrow,
    { y: 24, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, delay: 0.05 },
  );

  // Headline: each masked line rises, characters stagger within.
  if (el.headlineLines.length) {
    tl.fromTo(
      el.headlineLines,
      { yPercent: 110 },
      { yPercent: 0, duration: 1.1, stagger: 0.09 },
      "-=0.35",
    );
    if (el.headlineChars?.length) {
      tl.fromTo(
        el.headlineChars,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.016, ease: EASE.power3 },
        "-=0.9",
      );
    }
  }

  tl.fromTo(
    el.copy,
    { y: 28, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9 },
    "-=0.6",
  );

  tl.fromTo(
    [el.ctaPrimary, el.ctaSecondary],
    { y: 24, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
    "-=0.6",
  );

  tl.fromTo(
    el.visual,
    { scale: 1.08, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1.4, ease: EASE.expoInOut },
    "-=0.9",
  );

  tl.fromTo(
    el.scrollHint,
    { opacity: 0 },
    { opacity: 1, duration: 0.6 },
    "-=0.5",
  );

  // Background settles to a gentle parallax drift.
  tl.fromTo(
    el.background,
    { y: 40, opacity: 0.4 },
    { y: 0, opacity: 1, duration: 1.6, ease: "none" },
    0,
  );

  return tl;
}
