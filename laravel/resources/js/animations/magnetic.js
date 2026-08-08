import { gsap, prefersReducedMotion } from './gsap-core';

/** Magnetic pull on an element; springs back on leave. */
export function magnetic(el, strength = 0.35) {
  if (prefersReducedMotion() || !window.matchMedia('(hover: hover)').matches) {
    return () => {};
  }

  const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

  const onMove = (e) => {
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    xTo(relX * strength);
    yTo(relY * strength);
  };

  const onLeave = () => {
    xTo(0);
    yTo(0);
  };

  el.addEventListener('mousemove', onMove, { passive: true });
  el.addEventListener('mouseleave', onLeave);

  return () => {
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
    gsap.set(el, { x: 0, y: 0 });
  };
}

/** Apply magnetic to every element with [data-magnetic]. */
export function initMagnetic() {
  const els = Array.from(document.querySelectorAll('[data-magnetic]'));
  const cleanups = els.map((el) => magnetic(el, Number(el.dataset.magnetic) || 0.35));
  return () => cleanups.forEach((c) => c());
}
