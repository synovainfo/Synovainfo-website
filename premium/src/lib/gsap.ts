import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Standard premium easing presets used across the site. */
export const EASE = {
  expo: "expo.out",
  expoInOut: "expo.inOut",
  power3: "power3.out",
  power4: "power4.out",
  circ: "circ.out",
} as const;

/** Shared duration vocabulary — "luxury through motion", not motion spam. */
export const TIMING = {
  micro: 0.3,
  button: 0.45,
  reveal: 0.9,
  image: 1.2,
  heroStep: 0.8,
} as const;

/**
 * Returns true when the user prefers reduced motion. Consumed by every
 * animation module so the experience degrades gracefully and stays usable.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
