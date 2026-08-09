@props([
    'eyebrow' => 'ENTERPRISE ARCHITECTURE & CLOUD TRANSFORMATION',
    'headline' => 'ARCHITECTING NEXT-GENERATION DIGITAL PARADIGMS',
    'description' => 'Synova Infotech empowers global enterprises to unlock synergistic value and achieve unprecedented operational agility. We orchestrate secure, scalable, and mission-critical technological ecosystems designed to dominate market complexities and accelerate digital transformation.',
    'ctaLabel' => 'Explore Capabilities',
    'ctaHref' => '/services',
    'cardTag' => '[ 2026 ]',
    'cardHeadlinePrefix' => 'Securing',
    'cardHeadlineAccent' => 'Global',
    'cardHeadlineSuffix' => 'Operations',
    'cardDescription' => 'Delivering 99.999% uptime for enterprise clients worldwide.'
])

<section
    aria-label="Synova Infotech hero"
    class="relative w-full min-h-screen bg-abyss text-white overflow-hidden select-none"
    x-data="{
        initHls() {
            const video = this.$refs.video;
            const src = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
            }
        }
    }"
    x-init="
        if (typeof Hls === 'undefined') {
            let script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
            script.onload = () => initHls();
            document.head.appendChild(script);
        } else {
            initHls();
        }
    "
>
    <!-- Liquid glass card styling -->
    <style>
        .synova-liquid-glass-card {
            position: relative;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.01);
            background-blend-mode: luminosity;
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
            border-radius: 16px;
        }

        .synova-liquid-glass-card::before {
            content: "";
            position: absolute;
            inset: 0;
            padding: 1.4px;
            border-radius: 16px;
            background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.2) 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
        }
    </style>

    <!-- Background video (HLS stream at 60% opacity) -->
    <div aria-hidden="true" class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
            x-ref="video"
            class="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
            autoplay
            muted
            loop
            playsinline
        ></video>
    </div>

    <!-- Left-to-right readability gradient -->
    <div
        aria-hidden="true"
        class="absolute inset-0 pointer-events-none z-10"
        style="background: linear-gradient(to right, #070b0a 0%, rgba(7, 11, 10, 0.85) 35%, rgba(7, 11, 10, 0.4) 65%, transparent 100%);"
    ></div>

    <!-- Bottom-up readability gradient -->
    <div
        aria-hidden="true"
        class="absolute inset-0 pointer-events-none z-10"
        style="background: linear-gradient(to top, #070b0a 0%, rgba(7, 11, 10, 0.6) 50%, transparent 100%);"
    ></div>

    <!-- Vertical grid lines (desktop only) -->
    <div aria-hidden="true" class="absolute inset-0 hidden md:block pointer-events-none z-10">
        <div class="absolute top-0 bottom-0 left-[25%] w-px bg-white/10"></div>
        <div class="absolute top-0 bottom-0 left-[50%] w-px bg-white/10"></div>
        <div class="absolute top-0 bottom-0 left-[75%] w-px bg-white/10"></div>
    </div>

    <!-- Central glow (SVG ellipse, 25px Gaussian blur, 25% opacity) -->
    <div aria-hidden="true" class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl pointer-events-none z-10 overflow-hidden opacity-25">
        <svg viewBox="0 0 1000 400" class="w-full h-auto" preserveAspectRatio="none">
            <defs>
                <filter id="synova-hero-glow-blur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="25" />
                </filter>
            </defs>
            <ellipse cx="500" cy="60" rx="450" ry="140" fill="#F97316" filter="url(#synova-hero-glow-blur)" />
        </svg>
    </div>

    <!-- Hero content -->
    <div class="relative z-20 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col justify-center items-start min-h-screen">
        <!-- Liquid glass trust card -->
        <div class="transform translate-y-[-50px] mb-2">
            <div class="synova-liquid-glass-card p-5 flex flex-col justify-between">
                <span class="text-[14px] font-mono text-white/60">
                    {{ $cardTag }}
                </span>
                <p class="text-[18px] font-normal text-white leading-snug">
                    {{ $cardHeadlinePrefix }}
                    <span class="font-serif italic text-[20px]">
                        {{ $cardHeadlineAccent }}
                    </span>
                    {{ $cardHeadlineSuffix }}
                </p>
                <p class="text-[11px] text-white/50 leading-relaxed">
                    {{ $cardDescription }}
                </p>
            </div>
        </div>

        <div class="max-w-4xl">
            <!-- Eyebrow -->
            <p class="font-bold text-[11px] uppercase tracking-widest text-orange-500 mb-4">
                {{ $eyebrow }}
            </p>

            <!-- Main headline -->
            <h1 class="font-sans font-extrabold uppercase tracking-tight text-[40px] sm:text-[56px] md:text-[72px] leading-[1.05] text-white mb-6">
                {{ $headline }}
                <span class="text-orange-500">.</span>
            </h1>

            <!-- Description -->
            <p class="font-sans text-[14px] text-white/70 max-w-[512px] leading-relaxed mb-10">
                {{ $description }}
            </p>

            <!-- Primary CTA -->
            <a href="{{ $ctaHref }}" aria-label="{{ $ctaLabel }}" class="inline-flex items-center gap-3 bg-orange-500 text-white rounded-full uppercase font-bold text-sm tracking-wider px-8 py-4 transition-transform duration-300 hover:scale-105 shadow-lg shadow-orange-500/20 group">
                <span>{{ $ctaLabel }}</span>
                <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </a>
        </div>
    </div>
</section>
