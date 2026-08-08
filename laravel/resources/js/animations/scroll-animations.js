import { gsap, ScrollTrigger, Observer, EASE, prefersReducedMotion } from './gsap-core';
import { splitText } from './split-text';

/** Count-up numbers with a proxy object tween, using data-target attributes. */
export function animateCounters(scope) {
  const els = Array.from(scope.querySelectorAll('[data-count]'));
  if (!els.length) return () => {};

  if (prefersReducedMotion()) {
    els.forEach((el) => {
      el.textContent = el.getAttribute('data-count') + (el.dataset.suffix ?? '');
    });
    return () => {};
  }

  const ctx = gsap.context(() => {
    const tween = gsap.fromTo(
      els,
      { innerText: 0 },
      {
        innerText: (i) => Number(els[i].getAttribute('data-count')) || 0,
        duration: 2.2,
        ease: EASE.expo,
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: scope,
          start: 'top 80%',
          once: true,
        },
        onUpdate: function () {
          els.forEach((el) => {
            const current = Number(el.textContent.replace(/[^0-9.-]/g, '')) || 0;
            el.textContent = Math.round(current).toLocaleString('en-US') + (el.dataset.suffix ?? '');
          });
        },
      },
    );
    return () => tween.kill();
  });

  return () => ctx.revert();
}

/**
 * Pinned horizontal case-study track driven by vertical scroll.
 * Rebuilds on resize; falls back to natural stacking on small screens
 * (handled by the caller checking matchMedia before invoking).
 */
export function horizontalPin(section, track) {
  if (prefersReducedMotion()) return () => {};

  const ctx = gsap.context(() => {
    const getDistance = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -Math.max(0, getDistance()),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + (getDistance() + window.innerHeight),
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

/**
 * Mobile/tablet case-study carousel — GSAP Observer drag-to-swipe with
 * velocity snap and progress dots. Activated only below the desktop pin
 * breakpoint; the caller gates this with gsap.matchMedia.
 */
export function caseCarousel(section, track, dotsWrap) {
  if (prefersReducedMotion()) return () => {};

  const slides = Array.from(track.children).filter((el) => el.tagName === 'ARTICLE');
  if (slides.length < 2) return () => {};

  // Horizontal swipe layout (overrides the stacked mobile default via CSS).
  track.classList.add('js-carousel');

  // Build progress dots (kept in sync with the slide count).
  const dots = [];
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'carousel-dot';
      btn.setAttribute('aria-label', `Go to case study ${i + 1}`);
      btn.dataset.dot = String(i);
      dotsWrap.appendChild(btn);
      dots.push(btn);
    });
  }

  let index = 0;
  let x = 0;

  const step = () =>
    slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth;
  const maxX = () => Math.max(0, track.scrollWidth - window.innerWidth);

  const applyX = (v, animate = false) => {
    x = gsap.utils.clamp(-maxX(), 0)(v);
    if (animate) {
      gsap.to(track, { x, duration: 0.65, ease: 'power3.out', overwrite: 'auto' });
    } else {
      gsap.set(track, { x });
    }
  };

  const updateDots = () => {
    dots.forEach((d, i) => {
      const active = i === index;
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-current', active ? 'true' : 'false');
    });
  };

  const goTo = (i, animate = true) => {
    index = gsap.utils.clamp(0, slides.length - 1)(i);
    applyX(-index * step(), animate);
    updateDots();
  };

  const dotHandlers = dots.map((d, i) => () => goTo(i));
  dots.forEach((d, i) => d.addEventListener('click', dotHandlers[i]));

  // Drag-to-swipe with velocity snap. pan-y lets vertical page scrolling
  // pass through while horizontal drags are captured by Observer.
  const observer = Observer.create({
    target: track,
    type: 'touch,pointer',
    touchAction: 'pan-y',
    dragMinimum: 5,
    tolerance: 10,
    onPress: () => {
      gsap.killTweensOf(track);
      x = gsap.getProperty(track, 'x') || 0;
    },
    onDrag: (self) => applyX(x + self.deltaX),
    onStop: (self) => {
      // Project the release position with a touch of inertia, then snap to
      // the nearest slide. velocityX is in px/s, so a flick naturally moves
      // an extra slide while a slow drag lands on the closest one.
      const s = step();
      const projected = x + self.velocityX * 0.12;
      goTo(Math.round(-projected / s));
    },
  });

  const onResize = () => {
    gsap.killTweensOf(track);
    goTo(index, false);
  };
  window.addEventListener('resize', onResize);

  updateDots();

  return () => {
    observer.kill();
    window.removeEventListener('resize', onResize);
    dots.forEach((d, i) => d.removeEventListener('click', dotHandlers[i]));
    if (dotsWrap) dotsWrap.innerHTML = '';
    track.classList.remove('js-carousel');
    // Kill any in-flight snap tween before clearing the transform so it
    // can't re-apply its x after teardown.
    gsap.killTweensOf(track);
    gsap.set(track, { x: 0, clearProps: 'x' });
  };
}

/** Batch fade+rise reveal for cards and grids. */
export function batchReveal(scope, vars = {}) {
  const els = Array.from(scope.querySelectorAll('[data-reveal]'));
  if (!els.length) return () => {};

  if (prefersReducedMotion()) {
    gsap.set(els, { opacity: 1, y: 0 });
    return () => {};
  }

  const ctx = gsap.context(() => {
    const tween = gsap.fromTo(
      els,
      { opacity: 0, y: vars.y ?? 36 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: EASE.power3,
        stagger: vars.stagger ?? 0.1,
        scrollTrigger: {
          trigger: scope,
          start: vars.start ?? 'top 82%',
          once: true,
        },
      },
    );
    return () => tween.kill();
  });

  return () => ctx.revert();
}

/** Split-heading reveal helper used by every section heading. */
export function initSectionHeadings(scope) {
  const cleanups = [];

  scope.querySelectorAll('[data-split]').forEach((el) => {
    cleanups.push(revealSplitChars(el));
  });

  return () => cleanups.forEach((c) => c());
}

function revealSplitChars(el) {
  const split = splitText(el);
  if (prefersReducedMotion()) {
    gsap.set(split.chars, { opacity: 1 });
    return () => split.revert();
  }
  const tween = gsap.fromTo(
    split.chars,
    { opacity: 0.12, y: 14 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: EASE.power3,
      stagger: 0.014,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    },
  );
  return () => {
    tween.kill();
    split.revert();
  };
}
