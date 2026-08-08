import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap-core';
import { initLenis } from './lenis';
import { initCursor } from './cursor';
import { initPreloader } from './preloader';
import { initHero } from './hero';
import { parallax } from './parallax';
import { curtainImageReveal } from './image-reveal';
import { revealLinesOnScroll } from './text-reveal';
import { initMagnetic } from './magnetic';
import { animateCounters, horizontalPin, caseCarousel, batchReveal } from './scroll-animations';
import { splitText, splitLines } from './split-text';
import { onPageReveal } from './page-transition';

/**
 * Boot the premium experience. Idempotent — safe to call once per page load.
 * All ScrollTriggers are created inside gsap.context scoped to the experience
 * root so a single revert() tears everything down.
 */
export function initPremiumExperience() {
  const root = document.getElementById('premium-experience');
  if (!root) return () => {};

  let domCleanups = [];

  // Smooth scroll + cursor (both no-op under reduced motion / touch).
  const stopLenis = initLenis();
  const stopCursor = initCursor();

  const ctx = gsap.context(() => {
    // ── Preloader → hero ─────────────────────────────────────────────
    // If we arrived behind the page-transition curtain, skip the standalone
    // preloader and start the hero as the curtain lifts instead. Uses the
    // durable flag set by page-transition (the cover DOM node is removed
    // shortly after the lift, so we can't rely on its presence here).
    const arrivedViaTransition = window.__synovaPT?.arrived === true;

    if (arrivedViaTransition) {
      const preloaderEl = document.getElementById('preloader');
      preloaderEl?.remove();
      document.documentElement.classList.remove('preload-lock');
      const unsubscribe = onPageReveal(() => {
        const stopHero = initHero();
        domCleanups.push(() => stopHero?.());
      });
      domCleanups.push(unsubscribe);
    } else {
      initPreloader({
        onDone: () => {
          const stopHero = initHero();
          domCleanups.push(() => stopHero?.());
        },
      });
    }

    // ── Statements with scrub word reveals ───────────────────────────
    root.querySelectorAll('[data-statement]').forEach((el) => {
      const split = splitLines(el);
      const tween = gsap.fromTo(
        split.lineInners,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 78%', once: true },
        },
      );
      domCleanups.push(() => {
        tween.kill();
        split.revert();
      });
    });

    // ── About split headline ─────────────────────────────────────────
    root.querySelectorAll('[data-split-headline]').forEach((el) => {
      const split = splitText(el);
      gsap.set(split.chars, { opacity: 0.12 });
      const tween = gsap.to(split.chars, {
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.01,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
      domCleanups.push(() => {
        tween.kill();
        split.revert();
      });
    });

    // ── Image curtain reveals ────────────────────────────────────────
    root.querySelectorAll('[data-curtain]').forEach((wrap) => {
      const img = wrap.querySelector('img');
      const overlay = wrap.querySelector('.curtain-overlay');
      if (!img) return;
      domCleanups.push(curtainImageReveal(wrap, img, overlay));
    });

    // ── Scrub parallax ───────────────────────────────────────────────
    root.querySelectorAll('[data-parallax]').forEach((el) => {
      domCleanups.push(
        parallax(el, {
          amount: Number(el.dataset.parallax) || 6,
          trigger: el.closest('section') ?? el.parentElement,
        }),
      );
    });

    // ── Stats counters ───────────────────────────────────────────────
    root.querySelectorAll('[data-counters]').forEach((scope) => {
      domCleanups.push(animateCounters(scope));
    });

    // ── Batch reveals (cards, grids) ─────────────────────────────────
    root.querySelectorAll('[data-batch]').forEach((scope) => {
      domCleanups.push(batchReveal(scope));
    });

    // ── Case studies: pinned horizontal rail (desktop / fine pointer)
    //    or swipeable drag carousel with progress dots (everything else).
    //    matchMedia handles both states — each callback RETURNS its cleanup
    //    so gsap.matchMedia tears it down when the breakpoint changes.
    const caseStudies = gsap.matchMedia();
    caseStudies.add('(min-width: 1024px) and (hover: hover)', () => {
      const cleanups = [];
      root.querySelectorAll('[data-horizontal]').forEach((section) => {
        const track = section.querySelector('[data-horizontal-track]');
        if (!track) return;
        cleanups.push(horizontalPin(section, track));
      });
      return () => cleanups.forEach((stop) => stop?.());
    });
    // Covers phones/tablets AND large touch surfaces (e.g. iPad Pro in
    // landscape ≥1024px reports hover:none, so the pin never applies).
    caseStudies.add('(max-width: 1023.98px), (hover: none)', () => {
      const cleanups = [];
      root.querySelectorAll('[data-horizontal]').forEach((section) => {
        const track = section.querySelector('[data-horizontal-track]');
        const dotsWrap = section.querySelector('[data-carousel-dots]');
        if (!track) return;
        cleanups.push(caseCarousel(section, track, dotsWrap));
      });
      return () => cleanups.forEach((stop) => stop?.());
    });
    domCleanups.push(() => caseStudies.revert());

    // ── Magnetic CTAs ────────────────────────────────────────────────
    domCleanups.push(initMagnetic());

    // ── Hero scroll-linked fade (background + hint drift) ────────────
    if (!prefersReducedMotion()) {
      const hero = document.getElementById('premium-hero');
      if (hero) {
        const visual = hero.querySelector('[data-hero-anim="visual"]');
        if (visual) {
          gsap.to(visual, {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
          });
        }
      }
    }
  }, root);

  return () => {
    ctx.revert();
    domCleanups.forEach((fn) => fn?.());
    stopLenis?.();
    stopCursor?.();
  };
}

// Auto-boot once the DOM is ready (if the experience root exists).
// Wait for web fonts so text-splitting measures correct line breaks.
if (typeof window !== 'undefined') {
  const boot = () => {
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => initPremiumExperience());
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
