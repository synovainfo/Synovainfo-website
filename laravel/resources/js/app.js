import './bootstrap';
import './animations/index'; // Premium GSAP experience (auto-boots when #premium-experience exists)
import { initPageTransitions } from './animations/page-transition';
import synovaThreeHero from './three/hero-component';

// MPA page transitions — sweep a cover across on internal navigation and lift
// it on the incoming page. Runs on every public layout page.
initPageTransitions();

// Alpine.js is loaded from the CDN in the layout.
// Register the 3D hero component so Blade can use x-data="synovaThreeHero".
if (window.Alpine) {
  window.Alpine.data('synovaThreeHero', synovaThreeHero);
} else {
  document.addEventListener('alpine:init', () => {
    window.Alpine.data('synovaThreeHero', synovaThreeHero);
  });
}

// Day / dark theme controller. The initial value is read from the
// <html data-theme> attribute that the inline head script sets before paint.
const themeToggle = () => ({
  theme: 'light',

  init() {
    this.theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    // Keep tabs in sync when the preference changes elsewhere.
    window.addEventListener('storage', (e) => {
      if (e.key === 'synova-theme' && e.newValue) {
        this.apply(e.newValue);
      }
    });
  },

  apply(next) {
    this.theme = next === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    document.documentElement.classList.toggle('dark', this.theme === 'dark');
    try {
      localStorage.setItem('synova-theme', this.theme);
    } catch (e) {}
  },

  toggle() {
    this.apply(this.theme === 'dark' ? 'light' : 'dark');
  },
});

if (window.Alpine) {
  window.Alpine.data('themeToggle', themeToggle);
} else {
  document.addEventListener('alpine:init', () => {
    window.Alpine.data('themeToggle', themeToggle);
  });
}

// Premium testimonial carousel — fades slides with an auto-advance timer.
const testimonialCarousel = () => ({
  active: 0,
  total: 0,
  timer: null,

  init() {
    this.slides = this.$el.querySelectorAll('.testimonial-slide');
    this.total = this.slides.length;
    this.go(0);
    this.start();
  },

  start() {
    this.stop();
    this.timer = setInterval(() => this.go((this.active + 1) % this.total), 8000);
  },

  stop() {
    if (this.timer) clearInterval(this.timer);
  },

  go(i) {
    this.stop();
    const slides = this.slides ?? this.$el.querySelectorAll('.testimonial-slide');
    slides.forEach((s, idx) => {
      s.classList.toggle('is-active', idx === i);
      if (idx === i) {
        // Entrance transition handled by CSS class swap + small GSAP nudge.
        if (window.gsap) {
          window.gsap.fromTo(s, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        }
      }
    });
    this.active = i;
    this.start();
  },
});

if (window.Alpine) {
  window.Alpine.data('testimonialCarousel', testimonialCarousel);
} else {
  document.addEventListener('alpine:init', () => {
    window.Alpine.data('testimonialCarousel', testimonialCarousel);
  });
}
