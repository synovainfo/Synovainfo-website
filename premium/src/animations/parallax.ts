import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";

/** Scrub-parallax an element against its section, skipping when reduced motion. */
export function parallax(el: HTMLElement, vars?: {
  amount?: number; // yPercent travel
  trigger?: Element | null;
  start?: string;
  end?: string;
  scrub?: number;
}): () => void {
  if (prefersReducedMotion()) return () => {};

  const ctx = gsap.context(() => {
    const tween = gsap.fromTo(
      el,
      { yPercent: -(vars?.amount ?? 6) },
      {
        yPercent: vars?.amount ?? 6,
        ease: "none",
        scrollTrigger: {
          trigger: vars?.trigger ?? el.parentElement ?? el,
          start: vars?.start ?? "top bottom",
          end: vars?.end ?? "bottom top",
          scrub: vars?.scrub ?? 0.6,
        },
      },
    );
    return () => tween.kill();
  });

  return () => ctx.revert();
}

/** Two-layer parallax with independent depths for mouse drift (desktop only). */
export function parallaxLayers(container: HTMLElement, layers: HTMLElement[]): () => void {
  if (prefersReducedMotion() || !window.matchMedia("(hover: hover)").matches) {
    return () => {};
  }

  const xTo = gsap.quickTo(container, "x", { duration: 0.8, ease: "power3.out" });

  const onMove = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    layers.forEach((layer, i) => {
      const depth = (i + 1) * 14;
      gsap.to(layer, {
        x: cx * depth,
        y: cy * depth,
        duration: 1.1,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
    void xTo;
  };

  const onLeave = () => {
    layers.forEach((layer) => gsap.to(layer, { x: 0, y: 0, duration: 1.2, ease: "power3.out" }));
  };

  container.addEventListener("mousemove", onMove);
  container.addEventListener("mouseleave", onLeave);

  return () => {
    container.removeEventListener("mousemove", onMove);
    container.removeEventListener("mouseleave", onLeave);
  };
}
