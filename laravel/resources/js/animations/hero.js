import { gsap, EASE, prefersReducedMotion } from './gsap-core';

/**
 * Hero entrance — runs after the preloader curtain lifts.
 * eyebrow → headline mask + char stagger → copy → CTAs → visual → scroll hint.
 */
export function initHero() {
  const hero = document.getElementById('premium-hero');
  if (!hero) return () => {};

  if (prefersReducedMotion()) {
    gsap.set(hero.querySelectorAll('[data-hero-anim]'), { opacity: 1, y: 0 });
    return () => {};
  }

  const eyebrow = hero.querySelector('[data-hero-anim="eyebrow"]');
  const headlineLines = hero.querySelectorAll('.hero-headline .split-line-inner');
  const headlineChars = hero.querySelectorAll('.hero-headline .split-char');
  const copy = hero.querySelector('[data-hero-anim="copy"]');
  const ctaPrimary = hero.querySelector('[data-hero-anim="cta-primary"]');
  const ctaSecondary = hero.querySelector('[data-hero-anim="cta-secondary"]');
  const visual = hero.querySelector('[data-hero-anim="visual"]');
  const scrollHint = hero.querySelector('[data-hero-anim="scroll-hint"]');
  const background = hero.querySelector('[data-hero-anim="background"]');

  const tl = gsap.timeline({ defaults: { ease: EASE.expo } });

  if (eyebrow) tl.fromTo(eyebrow, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.1 });

  if (headlineLines.length) {
    tl.fromTo(
      headlineLines,
      { yPercent: 115 },
      { yPercent: 0, duration: 1.1, stagger: 0.09 },
      '-=0.3',
    );
    if (headlineChars.length) {
      tl.fromTo(
        headlineChars,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.016, ease: EASE.power3 },
        '-=0.85',
      );
    }
  }

  if (copy) tl.fromTo(copy, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.55');
  if (ctaPrimary)
    tl.fromTo(ctaPrimary, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.6');
  if (ctaSecondary)
    tl.fromTo(ctaSecondary, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.45');
  if (visual)
    tl.fromTo(visual, { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: EASE.expoInOut }, '-=0.9');
  if (scrollHint) tl.fromTo(scrollHint, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.5');
  if (background) tl.fromTo(background, { y: 40, opacity: 0.4 }, { y: 0, opacity: 1, duration: 1.6, ease: 'none' }, 0);

  return () => tl.kill();
}
