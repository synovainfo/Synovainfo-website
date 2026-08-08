import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger, Observer);

// Expose for Alpine components (e.g. the testimonial carousel) and debugging.
if (typeof window !== 'undefined') {
  window.gsap = gsap;
}

export { gsap, ScrollTrigger, Observer };

/** Shared premium easing presets. */
export const EASE = {
  expo: 'expo.out',
  expoInOut: 'expo.inOut',
  power3: 'power3.out',
  power4: 'power4.out',
  circ: 'circ.out',
};

/** Consistent timing vocabulary — luxury through motion, never spam. */
export const TIMING = {
  micro: 0.3,
  button: 0.45,
  reveal: 0.9,
  image: 1.2,
  heroStep: 0.8,
};

/** True when the user prefers reduced motion. */
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
