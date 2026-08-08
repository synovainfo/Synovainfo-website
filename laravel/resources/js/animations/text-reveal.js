import { gsap, ScrollTrigger, EASE, prefersReducedMotion } from './gsap-core';

/** Reveal split chars/words on scroll with a stagger (once). */
export function revealSplitOnScroll(el, chars, vars = {}) {
  if (prefersReducedMotion()) {
    gsap.set(chars, { opacity: 1 });
    return () => {};
  }

  const ctx = gsap.context(() => {
    gsap.set(chars, { opacity: 0.14 });
    const tween = gsap.to(chars, {
      opacity: 1,
      duration: 0.8,
      ease: EASE.power3,
      stagger: vars.stagger ?? 0.012,
      scrollTrigger: {
        trigger: vars.trigger ?? el,
        start: vars.start ?? 'top 82%',
        once: true,
      },
    });
    return () => tween.kill();
  });

  return () => ctx.revert();
}

/** Progressive statement: words step to full opacity as you scroll (scrubbed). */
export function revealStatement(el, words, vars = {}) {
  if (prefersReducedMotion()) {
    gsap.set(words, { opacity: 1 });
    return () => {};
  }

  const ctx = gsap.context(() => {
    gsap.set(words, { opacity: 0.12 });
    const tween = gsap.to(words, {
      opacity: 1,
      duration: 0.6,
      ease: 'none',
      stagger: 0.035,
      scrollTrigger: {
        trigger: vars.trigger ?? el,
        start: vars.start ?? 'top 75%',
        end: 'bottom 60%',
        scrub: 0.6,
      },
    });
    return () => tween.kill();
  });

  return () => ctx.revert();
}

/** Masked line reveal (element already carries .split-line-inner spans). */
export function revealLinesOnScroll(inners, vars = {}) {
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
      stagger: vars.stagger ?? 0.1,
      scrollTrigger: {
        trigger: vars.trigger ?? inners[0]?.parentElement,
        start: vars.start ?? 'top 85%',
        once: true,
      },
    });
    return () => tween.kill();
  });

  return () => ctx.revert();
}
