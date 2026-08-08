<!DOCTYPE html>
<html
    lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    data-theme="light"
    class="scroll-smooth"
>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- ── Day / Dark theme bootstrap (runs before paint → no flash) ──
         Mirrors the Next.js app: `data-theme` + `.dark` class, persisted
         in localStorage with system-preference fallback. --}}
    <script>
        (function () {
            try {
                var t = localStorage.getItem('synova-theme');
                if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', t);
                document.documentElement.classList.toggle('dark', t === 'dark');
            } catch (e) {}
        })();
    </script>

    {{-- ── Page-transition cover (runs before first paint → no flash) ──
         When the previous page set the sessionStorage flag, repaint the same
         dark cover immediately so the new page loads hidden behind it; the
         page-transition module then lifts it to reveal the content. Skipped
         for reduced-motion users. Inline critical styles guarantee the cover
         is painted even before app.css applies. --}}
    <script>
        (function () {
            try {
                if (!sessionStorage.getItem('synova-pt')) return;
                sessionStorage.removeItem('synova-pt');
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                var c = document.createElement('div');
                c.id = 'pt-cover';
                c.setAttribute('aria-hidden', 'true');
                c.style.cssText = 'position:fixed;inset:0;z-index:150;background:#030a16;clip-path:inset(0 0 0 0);will-change:clip-path;';
                (document.body || document.documentElement).appendChild(c);
            } catch (e) {}
        })();
    </script>

    @php
        // Slots are pre-escaped by their source views; render once, raw, to avoid double-encoding.
        $pageTitle = ($title ?? config('app.name')) . (isset($title) ? ' | ' . config('app.name') : '');
    @endphp
    <title>{!! $pageTitle !!}</title>

    {{-- ── SEO Meta ── --}}
    <meta name="description" content="{{ $description ?? 'Synovainfo Infotech engineers mission-critical enterprise platforms — cloud-native architecture, AI-driven automation, and zero-trust security for global organizations.' }}">
    <meta name="keywords" content="{{ $keywords ?? 'enterprise software, cloud architecture, digital transformation, AI engineering, cybersecurity, Synovainfo Infotech, Pune, multi-cloud, zero trust' }}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="author" content="Synovainfo Infotech Private Limited">
    <link rel="canonical" href="{{ url()->current() }}">

    {{-- ── OpenGraph ── --}}
    <meta property="og:site_name" content="{{ config('app.name') }}">
    <meta property="og:type" content="{{ $ogType ?? 'website' }}">
    <meta property="og:title" content="{!! $pageTitle !!}">
    <meta property="og:description" content="{{ $description ?? 'Synovainfo Infotech engineers mission-critical enterprise platforms for global organizations.' }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:locale" content="en_US">
    <meta property="og:image" content="{{ asset($ogImage ?? 'images/global/og-default.webp') }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="{{ config('app.name') }} — Enterprise Technology Solutions">

    {{-- ── Twitter Card ── --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{!! $pageTitle !!}">
    <meta name="twitter:description" content="{{ $description ?? 'Synovainfo Infotech engineers mission-critical enterprise platforms for global organizations.' }}">
    <meta name="twitter:image" content="{{ asset($ogImage ?? 'images/global/og-default.webp') }}">

    {{-- ── Theme color (browser chrome) ── --}}
    <meta name="theme-color" content="#f6f8fb" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#071324" media="(prefers-color-scheme: dark)">

    {{-- ── Icons ── --}}
    <link rel="icon" type="image/svg+xml" href="{{ asset('images/global/favicon.svg') }}">
    <link rel="apple-touch-icon" href="{{ asset('images/global/apple-touch-icon.svg') }}">

    {{-- ── Fonts: Instrument Sans (body), Outfit (display), JetBrains Mono (technical) ── --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

    {{-- ── Structured data: Organization + WebSite (static, site-wide) ── --}}
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "{{ url('/') }}#organization",
                "name": "Synovainfo Infotech Private Limited",
                "url": "{{ url('/') }}",
                "logo": {
                    "@type": "ImageObject",
                    "url": "{{ asset('images/global/synova-logo-dark.svg') }}"
                },
                "description": "Enterprise architecture, cloud-native engineering, AI systems, and cybersecurity for global organizations.",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Fl-24, Trish Manor, Kondhwa Kd, nr Kausar Baug",
                    "addressLocality": "Pune",
                    "addressRegion": "Maharashtra",
                    "postalCode": "411048",
                    "addressCountry": "IN"
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-020-2683-1122",
                    "contactType": "sales",
                    "email": "contact@synovainfo.com",
                    "availableLanguage": ["en"]
                }
            },
            {
                "@type": "WebSite",
                "@id": "{{ url('/') }}#website",
                "url": "{{ url('/') }}",
                "name": "Synovainfo Infotech",
                "publisher": { "@id": "{{ url('/') }}#organization" }
            }
        ]
    }
    </script>
    @stack('jsonld')

    <!-- Vite (module scripts must register Alpine components before Alpine starts) -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Alpine.js plugins + core (loads after the module so the alpine:init listener is already attached) -->
    <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/collapse@3.13.3/dist/cdn.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js"></script>
</head>
<body class="font-sans antialiased bg-canvas text-ink selection:bg-ember-500 selection:text-white">

    <!-- Header: transparent over the premium hero, glass once scrolled. -->
    <header
        x-data="{ scrolled: false, onPremium: document.getElementById('premium-experience') !== null }"
        x-init="window.addEventListener('scroll', () => scrolled = window.scrollY > 32, { passive: true })"
        class="fixed w-full z-50 transition-all duration-500"
        :class="scrolled || !onPremium ? 'header-glass shadow-lg shadow-abyss-950/10 dark:shadow-abyss-950/40' : 'bg-transparent border-b border-transparent'"
    >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <!-- Logo -->
                <div class="shrink-0 flex items-center">
                    <a href="{{ route('home') }}" class="font-display font-extrabold text-2xl tracking-tight text-ink">
                        SYNOVAINFO<span class="text-ember-500">.</span>
                    </a>
                </div>

                <!-- Desktop Nav -->
                <nav class="hidden md:flex space-x-8">
                    <a href="{{ route('about') }}" class="text-sm font-medium text-abyss-900/70 dark:text-white/70 hover:text-ember-500 dark:hover:text-ember-400 transition-colors">About</a>
                    <a href="{{ route('services.index') }}" class="text-sm font-medium text-abyss-900/70 dark:text-white/70 hover:text-ember-500 dark:hover:text-ember-400 transition-colors">Services</a>
                    <a href="{{ route('industries.index') }}" class="text-sm font-medium text-abyss-900/70 dark:text-white/70 hover:text-ember-500 dark:hover:text-ember-400 transition-colors">Industries</a>
                    <a href="{{ route('case_studies.index') }}" class="text-sm font-medium text-abyss-900/70 dark:text-white/70 hover:text-ember-500 dark:hover:text-ember-400 transition-colors">Case Studies</a>
                    <a href="{{ route('blog.index') }}" class="text-sm font-medium text-abyss-900/70 dark:text-white/70 hover:text-ember-500 dark:hover:text-ember-400 transition-colors">Insights</a>
                </nav>

                <!-- Theme toggle + CTA -->
                <div class="hidden md:flex items-center gap-4">
                    <x-theme-toggle />
                    <a href="{{ route('contact') }}" class="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-full text-white bg-ember-500 hover:bg-ember-600 shadow-ember transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-abyss-900">
                        Let's Talk
                    </a>
                </div>

                <!-- Mobile: theme toggle + hamburger -->
                <div class="md:hidden flex items-center gap-3">
                    <x-theme-toggle />
                    <x-mobile-menu />
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main id="site-main" class="min-h-screen">
        {{ $slot }}
    </main>

    <!-- Footer: dark command band in both themes -->
    <footer class="relative bg-abyss-950 pt-20 pb-10 overflow-hidden">
        <div class="absolute inset-0 bg-grid opacity-40" aria-hidden="true"></div>
        <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full opacity-20 pointer-events-none"
             style="background: radial-gradient(circle, rgba(249,115,22,0.28) 0%, transparent 60%);" aria-hidden="true"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
                <div class="col-span-1 md:col-span-1">
                    <a href="{{ route('home') }}" class="font-display font-extrabold text-2xl tracking-tight text-white">
                        SYNOVAINFO<span class="text-ember-500">.</span>
                    </a>
                    <p class="mt-4 text-sm text-white/50 leading-relaxed">
                        Enterprise software solutions engineered for scale, security, and performance.
                    </p>
                    <div class="mt-6 flex space-x-3">
                        <a href="#" class="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-ember-500/50 hover:bg-ember-500/10 transition-all" aria-label="LinkedIn">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                        </a>
                        <a href="#" class="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-ember-500/50 hover:bg-ember-500/10 transition-all" aria-label="Twitter / X">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                    </div>
                </div>
                <div>
                    <h3 class="eyebrow text-white/40 mb-5">Company</h3>
                    <ul class="space-y-3">
                        <li><a href="{{ route('about') }}" class="text-sm text-white/60 hover:text-ember-400 transition-colors">About Us</a></li>
                        <li><a href="{{ route('careers.index') }}" class="text-sm text-white/60 hover:text-ember-400 transition-colors">Careers</a></li>
                        <li><a href="{{ route('contact') }}" class="text-sm text-white/60 hover:text-ember-400 transition-colors">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="eyebrow text-white/40 mb-5">Expertise</h3>
                    <ul class="space-y-3">
                        <li><a href="{{ route('services.index') }}" class="text-sm text-white/60 hover:text-ember-400 transition-colors">Our Services</a></li>
                        <li><a href="{{ route('technologies.index') }}" class="text-sm text-white/60 hover:text-ember-400 transition-colors">Technologies</a></li>
                        <li><a href="{{ route('solutions.index') }}" class="text-sm text-white/60 hover:text-ember-400 transition-colors">Solutions</a></li>
                        <li><a href="{{ route('approach') }}" class="text-sm text-white/60 hover:text-ember-400 transition-colors">Our Approach</a></li>
                        <li><a href="{{ route('architecture') }}" class="text-sm text-white/60 hover:text-ember-400 transition-colors">Architecture</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="eyebrow text-white/40 mb-5">Newsletter</h3>
                    <p class="text-sm text-white/50 mb-4">Get the latest insights delivered weekly.</p>
                    <form class="flex max-w-sm">
                        <label for="newsletter-email" class="sr-only">Email address</label>
                        <input id="newsletter-email" type="email" placeholder="Enter your email"
                            class="min-w-0 flex-1 bg-white/5 border border-white/10 rounded-l-lg text-white px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-ember-500/60 focus:ring-1 focus:ring-ember-500/40">
                        <button type="submit" class="bg-ember-500 text-white px-4 py-2.5 rounded-r-lg text-sm font-semibold hover:bg-ember-600 transition-colors">Subscribe</button>
                    </form>
                </div>
            </div>
            <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-sm text-white/40">
                    &copy; {{ date('Y') }} Synovainfo Infotech Private Limited. All rights reserved.
                </p>
                <p class="eyebrow text-white/25">Engineered in Pune, India</p>
            </div>
        </div>
    </footer>

    <!-- Scroll reveal -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const els = document.querySelectorAll('.reveal');
            if (!els.length) return;
            if (!('IntersectionObserver' in window)) {
                els.forEach((el) => el.classList.add('is-visible'));
                return;
            }
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });
            els.forEach((el) => io.observe(el));
        });
    </script>

    @stack('scripts')
</body>
</html>
