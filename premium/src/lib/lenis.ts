import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

let lenis: Lenis | null = null;

/** Create (or return) the Lenis instance wired into GSAP's ticker. */
export function initLenis(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (lenis) return lenis;
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function destroyLenis(): void {
  lenis?.destroy();
  lenis = null;
}

/** Smooth-scroll to an anchor (used by the nav + CTAs). */
export function scrollToTarget(target: string | number): void {
  const l = getLenis();
  if (l) {
    l.scrollTo(target, { duration: 1.4 });
  } else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}
