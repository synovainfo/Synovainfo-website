import { gsap, EASE, prefersReducedMotion } from './gsap-core';

/**
 * Runs the premium load sequence:
 *  1. logo mark path draw
 *  2. mono counter 0 → 100
 *  3. thin progress bar
 *  4. curtain lifts to reveal the hero
 *
 * Resolves when the curtain has fully cleared the viewport so the hero
 * animation can start. Skips cleanly under reduced motion.
 */
export function initPreloader({ onDone }) {
  const preloader = document.getElementById('preloader');
  if (!preloader) {
    onDone?.();
    return () => {};
  }

  if (prefersReducedMotion()) {
    preloader.style.display = 'none';
    onDone?.();
    return () => {};
  }

  const mark = preloader.querySelector('.preloader-mark path');
  const count = preloader.querySelector('.preloader-count');
  const fill = preloader.querySelector('.preloader-bar-fill');
  const panel = preloader.querySelector('.preloader-panel');

  const counter = { value: 0 };

  const tl = gsap.timeline({
    defaults: { ease: EASE.expo },
    onComplete: () => {
      // Curtain has fully lifted — remove the preloader from the DOM and
      // release the body scroll lock so the page is interactive again.
      preloader.remove();
      document.documentElement.classList.remove('preload-lock');
      onDone?.();
    },
  });

  // Lock body scroll while the sequence plays so the page behind the
  // curtain cannot be scrolled mid-load.
  document.documentElement.classList.add('preload-lock');
  tl.set(panel, { opacity: 1 });

  if (mark) {
    const length = mark.getTotalLength();
    gsap.set(mark, { strokeDasharray: length, strokeDashoffset: length });
    tl.to(mark, { strokeDashoffset: 0, duration: 1.1, ease: EASE.expoInOut }, 0.15);
  }

  tl.to(
    counter,
    {
      value: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (count) count.textContent = String(Math.round(counter.value)).padStart(3, '0');
        if (fill) fill.style.transform = `scaleX(${counter.value / 100})`;
      },
    },
    0.1,
  );

  // Curtain lift — reveal the hero beneath.
  tl.to(
    preloader,
    {
      yPercent: -100,
      duration: 0.9,
      ease: EASE.expoInOut,
    },
    '+=0.15',
  );

  return () => {
    tl.kill();
    preloader.remove();
  };
}
