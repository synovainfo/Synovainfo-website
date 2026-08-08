import { gsap, ScrollTrigger, EASE, TIMING, prefersReducedMotion } from "../lib/gsap";

export interface ImageRevealEls {
  wrapper: HTMLElement; // overflow hidden mask
  img: HTMLElement;
  overlay?: HTMLElement; // optional dark veil
}

/**
 * Curtain reveal: the image sits inside an overflow-hidden wrapper, a
 * veil is clipped away with a clip-path, then the image settles from a
 * subtle zoom to 1. Includes gentle parallax while scrolling through.
 */
export function curtainImageReveal(els: ImageRevealEls, vars?: {
  trigger?: Element | null;
  start?: string;
}): () => void {
  if (prefersReducedMotion()) {
    gsap.set([els.img, els.overlay], { clipPath: "inset(0% 0% 0% 0%)", scale: 1, y: 0 });
    return () => {};
  }

  const ctx = gsap.context(() => {
    const trigger = vars?.trigger ?? els.wrapper;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: vars?.start ?? "top 82%",
        once: true,
      },
    });

    if (els.overlay) {
      tl.fromTo(
        els.overlay,
        { clipPath: "inset(0% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 100% 0%)", duration: TIMING.image, ease: EASE.expoInOut },
      );
    }

    tl.fromTo(
      els.img,
      { scale: 1.15 },
      { scale: 1, duration: TIMING.image, ease: EASE.power3 },
      "-=0.9",
    );

    // Gentle parallax after reveal (skipped when reduced motion).
    const parallax = gsap.fromTo(
      els.img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      },
    );

    return () => {
      tl.kill();
      parallax.kill();
    };
  });

  return () => ctx.revert();
}

/** Simple settle reveal for non-hero imagery. */
export function settleImageReveal(els: ImageRevealEls, vars?: {
  trigger?: Element | null;
  start?: string;
}): () => void {
  if (prefersReducedMotion()) {
    gsap.set(els.img, { opacity: 1, scale: 1 });
    return () => {};
  }

  const ctx = gsap.context(() => {
    const tween = gsap.fromTo(
      els.img,
      { opacity: 0, scale: 1.1 },
      {
        opacity: 1,
        scale: 1,
        duration: TIMING.image,
        ease: EASE.power3,
        scrollTrigger: {
          trigger: vars?.trigger ?? els.wrapper,
          start: vars?.start ?? "top 85%",
          once: true,
        },
      },
    );
    return () => tween.kill();
  });

  return () => ctx.revert();
}
