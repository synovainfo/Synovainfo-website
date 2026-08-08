import { gsap, EASE, TIMING, prefersReducedMotion } from './gsap-core';

/**
 * Curtain reveal: dark veil clipped away, image settles from 1.15 → 1,
 * then a gentle scrub parallax keeps it alive while scrolling through.
 */
export function curtainImageReveal(wrapper, img, overlay, vars = {}) {
  if (prefersReducedMotion()) {
    gsap.set([img, overlay], { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, y: 0 });
    return () => {};
  }

  const ctx = gsap.context(() => {
    const trigger = vars.trigger ?? wrapper;

    const tl = gsap.timeline({
      scrollTrigger: { trigger, start: vars.start ?? 'top 82%', once: true },
    });

    if (overlay) {
      tl.fromTo(
        overlay,
        { clipPath: 'inset(0% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 100% 0%)', duration: TIMING.image, ease: EASE.expoInOut },
      );
    }

    tl.fromTo(img, { scale: 1.15 }, { scale: 1, duration: TIMING.image, ease: EASE.power3 }, '-=0.9');

    const parallax = gsap.fromTo(
      img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger,
          start: 'top bottom',
          end: 'bottom top',
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

/** Simple scale-settle reveal for non-hero imagery. */
export function settleImageReveal(wrapper, img, vars = {}) {
  if (prefersReducedMotion()) {
    gsap.set(img, { opacity: 1, scale: 1 });
    return () => {};
  }

  const ctx = gsap.context(() => {
    const tween = gsap.fromTo(
      img,
      { opacity: 0, scale: 1.1 },
      {
        opacity: 1,
        scale: 1,
        duration: TIMING.image,
        ease: EASE.power3,
        scrollTrigger: {
          trigger: vars.trigger ?? wrapper,
          start: vars.start ?? 'top 85%',
          once: true,
        },
      },
    );
    return () => tween.kill();
  });

  return () => ctx.revert();
}
