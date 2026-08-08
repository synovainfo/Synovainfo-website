import { gsap, prefersReducedMotion } from "../lib/gsap";

/**
 * Attach a magnetic pull to an element. The element drifts toward the
 * cursor within a bounded radius and springs back on leave.
 */
export function magnetic(el: HTMLElement, strength = 0.4): () => void {
  if (prefersReducedMotion() || !window.matchMedia("(hover: hover)").matches) {
    return () => {};
  }

  const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

  const onMove = (e: MouseEvent) => {
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

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);

  return () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
    gsap.set(el, { x: 0, y: 0 });
  };
}
