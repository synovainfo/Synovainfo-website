import { gsap, ScrollTrigger, EASE, TIMING, prefersReducedMotion } from "../lib/gsap";

/**
 * Reveal a split element's chars/words on scroll with a stagger.
 * Expects the element to already be split (see useSplitText hook).
 */
export function revealSplitOnScroll(el: HTMLElement, chars: HTMLElement[], vars?: {
  trigger?: Element | null;
  start?: string;
  stagger?: number;
}): () => void {
  if (prefersReducedMotion()) {
    gsap.set(chars, { opacity: 1 });
    return () => {};
  }

  const ctx = gsap.context(() => {
    gsap.set(chars, { opacity: 0.14, yPercent: 0 });
    const tween = gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: EASE.power3,
      stagger: vars?.stagger ?? 0.012,
      scrollTrigger: {
        trigger: vars?.trigger ?? el,
        start: vars?.start ?? "top 82%",
        once: true,
      },
    });
    return () => tween.kill();
  });

  return () => ctx.revert();
}

/** Progressive statement: words fade in as the headline enters, emphasis handled via markup. */
export function revealStatement(el: HTMLElement, words: HTMLElement[], vars?: {
  trigger?: Element | null;
  start?: string;
}): () => void {
  if (prefersReducedMotion()) {
    gsap.set(words, { opacity: 1 });
    return () => {};
  }

  const ctx = gsap.context(() => {
    gsap.set(words, { opacity: 0.12 });
    const tween = gsap.to(words, {
      opacity: 1,
      duration: 0.6,
      ease: "none",
      stagger: 0.035,
      scrollTrigger: {
        trigger: vars?.trigger ?? el,
        start: vars?.start ?? "top 75%",
        end: "bottom 60%",
        scrub: 0.6,
      },
    });
    return () => tween.kill();
  });

  return () => ctx.revert();
}

/** Masked line reveal (element must already have .split-line-inner spans). */
export function revealLinesOnScroll(inners: HTMLElement[], vars?: {
  trigger?: Element | null;
  start?: string;
  stagger?: number;
  y?: number;
}): () => void {
  if (prefersReducedMotion()) {
    gsap.set(inners, { yPercent: 0 });
    return () => {};
  }

  const ctx = gsap.context(() => {
    gsap.set(inners, { yPercent: 115 });
    const tween = gsap.to(inners, {
      yPercent: 0,
      duration: 1,
      ease: EASE.expo,
      stagger: vars?.stagger ?? 0.1,
      scrollTrigger: {
        trigger: vars?.trigger ?? inners[0]?.parentElement,
        start: vars?.start ?? "top 85%",
        once: true,
      },
    });
    return () => tween.kill();
  });

  return () => ctx.revert();
}

export { TIMING };
