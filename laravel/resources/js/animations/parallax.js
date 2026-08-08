import { gsap, prefersReducedMotion } from './gsap-core';

/** Scrub-parallax an element against its section. */
export function parallax(el, vars = {}) {
  if (prefersReducedMotion()) return () => {};

  const ctx = gsap.context(() => {
    const tween = gsap.fromTo(
      el,
      { yPercent: -(vars.amount ?? 6) },
      {
        yPercent: vars.amount ?? 6,
        ease: 'none',
        scrollTrigger: {
          trigger: vars.trigger ?? el.parentElement ?? el,
          start: vars.start ?? 'top bottom',
          end: vars.end ?? 'bottom top',
          scrub: vars.scrub ?? 0.6,
        },
      },
    );
    return () => tween.kill();
  });

  return () => ctx.revert();
}

/** Mouse-drift layers with independent depths (desktop only). */
export function parallaxLayers(container, layers) {
  if (prefersReducedMotion() || !window.matchMedia('(hover: hover)').matches) {
    return () => {};
  }

  const onMove = (e) => {
    const rect = container.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    layers.forEach((layer, i) => {
      const depth = (i + 1) * 14;
      gsap.to(layer, {
        x: cx * depth,
        y: cy * depth,
        duration: 1.1,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  };

  const onLeave = () => {
    layers.forEach((layer) => gsap.to(layer, { x: 0, y: 0, duration: 1.2, ease: 'power3.out' }));
  };

  container.addEventListener('mousemove', onMove, { passive: true });
  container.addEventListener('mouseleave', onLeave);

  return () => {
    container.removeEventListener('mousemove', onMove);
    container.removeEventListener('mouseleave', onLeave);
  };
}
