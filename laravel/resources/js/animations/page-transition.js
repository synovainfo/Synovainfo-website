import { gsap, EASE, prefersReducedMotion } from './gsap-core';

/**
 * MPA page transitions for the Laravel site.
 *
 * Pattern (works with full server-side reloads):
 *  1. Internal link click → a full-screen cover wipes across (left→right).
 *  2. Once fully covered, set a sessionStorage flag and navigate.
 *  3. A tiny inline script in <head> (see layouts/app.blade.php) repaints the
 *     cover BEFORE first paint if the flag is present — no flash of content.
 *  4. This module finds that cover and lifts it upward to reveal the new page,
 *     dispatching `synova:page-reveal` so the premium hero can start under the
 *     curtain instead of running its own preloader.
 *
 * Reduced motion: nothing is intercepted and no cover is painted — links
 * navigate natively and content is immediately visible.
 */

const STORAGE_KEY = 'synova-pt';

/** Routes where a curtain would be noise (auth/admin/pagination-ish). */
const SKIP_PATH = /\/(admin|login|logout|register|password|verify|two-factor|impersonate|horizon|telescope)(\/|$)/;

/* ── Race-safe reveal coordinator ─────────────────────────────────────
   The premium hero boots asynchronously (it waits for web fonts), so it may
   miss the reveal event. Expose a tiny pub/sub that resolves immediately
   when the reveal already happened. */
const state = (window.__synovaPT ??= { revealed: false, arrived: false, waiters: [] });

function markRevealed() {
  if (state.revealed) return;
  state.revealed = true;
  state.waiters.forEach((fn) => fn());
  state.waiters = [];
  window.dispatchEvent(new CustomEvent('synova:page-reveal'));
}

/** Subscribe to the incoming-page reveal. Fires immediately if already done. */
export function onPageReveal(fn) {
  if (state.revealed) {
    fn();
    return () => {};
  }
  state.waiters.push(fn);
  return () => {
    state.waiters = state.waiters.filter((w) => w !== fn);
  };
}

/* ── Overlay DOM ────────────────────────────────────────────────────── */
let overlay = null;
let isTransitioning = false;

function buildOverlay() {
  if (overlay && overlay.isConnected) return overlay;
  overlay = document.createElement('div');
  overlay.className = 'pt-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="pt-grid" aria-hidden="true"></div>
    <div class="pt-bar" aria-hidden="true"></div>
    <div class="pt-brand" aria-hidden="true">SYNOVAINFO<span class="pt-dot">.</span></div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

/* ── Click interception (outgoing) ──────────────────────────────────── */
function isInternalLink(a) {
  const href = a.getAttribute('href') || '';
  if (!href) return false;
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
      href.startsWith('javascript:') || href.startsWith('data:')) return false;
  if (a.target && a.target !== '_self') return false;
  if (a.hasAttribute('download')) return false;
  if (a.hasAttribute('data-no-transition')) return false;

  let url;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  if (SKIP_PATH.test(url.pathname)) return false;
  // Same page (incl. anchor and query pagination) → let the browser handle it.
  if (url.pathname === window.location.pathname) return false;
  return true;
}

function sweepOut(url) {
  const el = buildOverlay();
  const bar = el.querySelector('.pt-bar');
  const brand = el.querySelector('.pt-brand');

  gsap.killTweensOf([el, bar, brand]);
  gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
  gsap.set([bar, brand], { opacity: 0 });

  const tl = gsap.timeline({
    defaults: { ease: EASE.expoInOut },
    onComplete: () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch (e) {}
      isTransitioning = false;
      window.location.assign(url);
    },
  });

  // Wipe across left→right, brand rides the leading edge, bar tracks progress.
  tl.to(el, { clipPath: 'inset(0 0% 0 0)', duration: 0.42 }, 0)
    .to(brand, { opacity: 1, duration: 0.16, ease: 'power2.out' }, 0.1)
    .to(bar, { scaleX: 1, duration: 0.42 }, 0)
    .to([brand, bar], { opacity: 0, duration: 0.1 }, '>-0.06')
    .to(el, { backgroundColor: '#030a16', duration: 0.05 }, '<');
}

function onClick(e) {
  if (prefersReducedMotion()) return;
  if (isTransitioning) return;
  if (e.defaultPrevented) return;
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  const a = e.target.closest('a');
  if (!a || !isInternalLink(a)) return;

  e.preventDefault();
  isTransitioning = true;
  sweepOut(a.href);
}

/* ── Incoming reveal ────────────────────────────────────────────────── */
function handleIncoming() {
  const cover = document.getElementById('pt-cover');
  if (!cover) return;

  // Record arrival durably — the cover is removed shortly after, but the
  // premium module boots on document.fonts.ready (async) and must know we
  // arrived behind the curtain even if that resolves later.
  state.arrived = true;

  // Enrich the head-painted cover with the same accents as the outgoing
  // overlay so the incoming curtain is visually continuous.
  cover.classList.add('pt-overlay');
  cover.insertAdjacentHTML(
    'afterbegin',
    '<div class="pt-grid" aria-hidden="true"></div><div class="pt-brand" aria-hidden="true">SYNOVAINFO<span class="pt-dot">.</span></div><div class="pt-bar" aria-hidden="true"></div>',
  );
  const bar = cover.querySelector('.pt-bar');

  if (prefersReducedMotion()) {
    cover.remove();
    markRevealed();
    return;
  }

  // The cover is already fully painted (inline styles from <head>); lift it
  // upward — content reveals from the bottom, curtain rises off the top.
  // The ember progress bar shrinks 1 → 0 as the curtain lifts.
  const tl = gsap.timeline({ defaults: { ease: EASE.expoInOut } });
  tl.call(() => markRevealed(), null, 0)
    .fromTo(bar, { scaleX: 1 }, { scaleX: 0, duration: 0.5 }, 0)
    .to(cover, { clipPath: 'inset(0 0 100% 0)', duration: 0.5 }, 0)
    .call(() => cover.remove());
}

/** Boot page transitions. Safe to call once per page load. */
export function initPageTransitions() {
  handleIncoming();
  document.addEventListener('click', onClick, { passive: false });

  return () => {
    document.removeEventListener('click', onClick);
  };
}
