import { gsap, prefersReducedMotion } from './gsap-core';

/**
 * Custom cursor: a small ember dot + a larger ring that lags behind with
 * smooth interpolation, expands and shows a label over interactive elements.
 * Desktop / fine-pointer only — auto-disabled on touch.
 */
export function initCursor() {
  if (prefersReducedMotion()) return () => {};
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.className = 'cursor-label';
  ring.appendChild(label);

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  // Hide the native cursor only over the experience, keep it for inputs.
  document.documentElement.classList.add('has-custom-cursor');

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { ...pos };

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power2.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power2.out' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

  const onMove = (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    dotX(pos.x);
    dotY(pos.y);
    ringX(pos.x);
    ringY(pos.y);
  };

  const HOVER_SELECTOR =
    'a, button, [role="button"], .case-visual, .service-row, input, textarea, select, [data-cursor]';

  const onOver = (e) => {
    const target = e.target.closest(HOVER_SELECTOR);
    if (!target) {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
      label.textContent = '';
      ring.classList.remove('is-active');
      return;
    }

    const cursorLabel = target.getAttribute('data-cursor');
    if (cursorLabel) {
      label.textContent = cursorLabel;
      ring.classList.add('is-active');
      gsap.to(ring, { scale: 1.6, opacity: 1, duration: 0.35, ease: 'power3.out' });
    } else {
      label.textContent = '';
      ring.classList.remove('is-active');
      gsap.to(ring, { scale: 1.55, opacity: 1, duration: 0.35, ease: 'power3.out' });
    }
  };

  const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.2 });
  const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power3.out' });

  const onLeaveWindow = () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
  };
  const onEnterWindow = () => {
    gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseover', onOver, { passive: true });
  window.addEventListener('mousedown', onDown);
  window.addEventListener('mouseup', onUp);
  document.documentElement.addEventListener('mouseleave', onLeaveWindow);
  document.documentElement.addEventListener('mouseenter', onEnterWindow);

  return () => {
    window.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseover', onOver);
    window.removeEventListener('mousedown', onDown);
    window.removeEventListener('mouseup', onUp);
    document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
    document.documentElement.removeEventListener('mouseenter', onEnterWindow);
    dot.remove();
    ring.remove();
    document.documentElement.classList.remove('has-custom-cursor');
  };
}
