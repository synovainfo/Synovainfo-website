import { gsap, ScrollTrigger, EASE, prefersReducedMotion } from "../lib/gsap";

/** Count up numbers when the stats section enters the viewport. */
export function animateCounters(
  elements: HTMLElement[],
  getTarget: (el: HTMLElement) => number,
  vars?: { trigger?: Element | null; start?: string; suffix?: (el: HTMLElement) => string },
): () => void {
  if (prefersReducedMotion()) {
    elements.forEach((el) => {
      el.textContent = String(getTarget(el)) + (vars?.suffix?.(el) ?? "");
    });
    return () => {};
  }

  const ctx = gsap.context(() => {
    const tween = gsap.fromTo(
      elements,
      { innerText: 0 },
      {
        innerText: (i) => getTarget(elements[i]),
        duration: 2.2,
        ease: EASE.expo,
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: vars?.trigger ?? elements[0]?.parentElement,
          start: vars?.start ?? "top 80%",
          once: true,
        },
        onUpdate: function () {
          elements.forEach((el, i) => {
            const val = Math.round(Number((el as HTMLElement & { _gsap?: string }).innerText) || 0);
            void val;
            const current = (el.textContent || "").replace(/[^0-9.-]/g, "");
            const num = Math.round(Number(current));
            void num;
            el.textContent =
              el.getAttribute("data-target") + (vars?.suffix?.(el) ?? "");
          });
        },
      } as gsap.TweenVars,
    );
    return () => tween.kill();
  });

  return () => ctx.revert();
}

/** Pinned horizontal case-study track driven by vertical scroll. */
export function horizontalPin(vars: {
  section: HTMLElement;
  track: HTMLElement;
  distance?: number;
}): () => void {
  if (prefersReducedMotion()) return () => {};

  const ctx = gsap.context(() => {
    const distance = vars.distance ?? (() => vars.track.scrollWidth - window.innerWidth)();
    const tween = gsap.to(vars.track, {
      x: () => -Math.max(0, distance),
      ease: "none",
      scrollTrigger: {
        trigger: vars.section,
        start: "top top",
        end: () => "+=" + (distance + window.innerHeight),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    return () => tween.kill();
  });

  return () => ctx.revert();
}

/** Generic batch reveal for elements that should fade+rise together. */
export function batchReveal(elements: HTMLElement[], vars?: {
  trigger?: Element | null;
  start?: string;
  stagger?: number;
  y?: number;
}): () => void {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return () => {};
  }

  const ctx = gsap.context(() => {
    const tween = gsap.fromTo(
      elements,
      { opacity: 0, y: vars?.y ?? 36 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: EASE.power3,
        stagger: vars?.stagger ?? 0.1,
        scrollTrigger: {
          trigger: vars?.trigger ?? elements[0]?.parentElement,
          start: vars?.start ?? "top 82%",
          once: true,
        },
      },
    );
    return () => tween.kill();
  });

  return () => ctx.revert();
}
