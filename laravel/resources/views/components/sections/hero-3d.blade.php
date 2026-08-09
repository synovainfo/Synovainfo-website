@props([
    'eyebrow' => 'ENTERPRISE PLATFORM ENGINEERING & DIGITAL INFRASTRUCTURE',
    'headline' => 'BUILDING THE NEXT GENERATION OF ENTERPRISE TECHNOLOGY',
    'description' => 'Synova Infotech engineers mission-critical digital ecosystems for global enterprises — combining cloud-native architecture, AI-driven automation, and zero-trust security to deliver unmatched operational resilience.',
    'ctaLabel' => 'Explore Capabilities',
    'ctaHref' => '/services',
])

{{--
    Synova Infotech 3D Enterprise Hero
    ==========================
    Full-screen hero section with a procedural Three.js orbital network
    visualization rendered on a transparent canvas behind the content.
    Uses Alpine.js for lifecycle management and dynamic import for code-splitting.

    Mobile and no-WebGL devices receive the same brand content overlaid on
    a static gradient background — no breakage, just graceful degradation.
--}}
<section
    x-data="synovaThreeHero"
    x-init="initThree"
    x-on:destroy="destroy"
    aria-label="Synova Infotech enterprise hero"
    class="relative w-full min-h-screen bg-abyss text-white overflow-hidden select-none"
>
    <!-- ── WebGL Canvas (rendered by Three.js) ── -->
    <canvas
        x-ref="canvas"
        x-show="!loading && hasWebGL && !isMobile"
        class="absolute inset-0 w-full h-full z-10 pointer-events-none"
        aria-hidden="true"
    ></canvas>

    <!-- ── Loading / Fallback gradient background ── -->
    <div
        aria-hidden="true"
        class="absolute inset-0 z-0"
        :class="!loading && (hasWebGL && !isMobile) ? 'opacity-0' : 'opacity-100'"
        style="background: radial-gradient(ellipse 80% 70% at 20% 20%, rgba(249,115,22,0.12) 0%, transparent 60%),
                     radial-gradient(ellipse 60% 60% at 80% 80%, rgba(37,99,235,0.10) 0%, transparent 50%),
                     linear-gradient(160deg, #071324 0%, #0E2440 50%, #1E3A5F 100%); transition: opacity 0.8s ease;"
    ></div>

    <!-- ── Grid pattern overlay ── -->
    <div
        aria-hidden="true"
        class="absolute inset-0 z-10 pointer-events-none opacity-15"
        style="background-image: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
               background-size: 64px 64px;
               mask-image: linear-gradient(to bottom, #000 0%, transparent 85%);"
    ></div>

    <!-- ── Loading state ── -->
    <div
        x-show="loading"
        x-cloak
        class="absolute inset-0 z-30 flex items-center justify-center"
        aria-label="Loading 3D visualization"
    >
        <div class="flex flex-col items-center gap-4">
            <div class="w-8 h-8 border-2 border-transparent border-t-orange-500 border-r-orange-500 rounded-full animate-spin"></div>
            <span class="text-xs text-white/40 font-mono tracking-wider">INITIALIZING 3D ENGINE</span>
        </div>
    </div>

    <!-- ── Hero content overlay ── -->
    <div class="relative z-20 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col justify-center items-start min-h-screen">
        <!-- Eyebrow -->
        <p class="font-bold text-[11px] uppercase tracking-[0.2em] text-orange-500 mb-5">
            {{ $eyebrow }}
        </p>

        <!-- Main headline -->
        <h1 class="font-sans font-extrabold uppercase tracking-tight text-[clamp(2rem,6vw,4.5rem)] leading-[1.05] text-white max-w-4xl">
            {{ $headline }}
            <span class="text-orange-500">.</span>
        </h1>

        <!-- Description -->
        <p class="text-[clamp(0.8125rem,1.1vw,1.05rem)] text-white/65 max-w-[520px] leading-relaxed mt-6">
            {{ $description }}
        </p>

        <!-- Primary CTA -->
        <div class="mt-10 flex flex-wrap items-center gap-4">
            <a
                href="{{ $ctaHref }}"
                aria-label="{{ $ctaLabel }}"
                class="inline-flex items-center gap-3 bg-orange-500 text-white rounded-full uppercase font-bold text-sm tracking-wider px-8 py-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25 active:scale-100 focus-visible:outline-2 focus-visible:outline-orange-400 focus-visible:outline-offset-4"
            >
                <span>{{ $ctaLabel }}</span>
                <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </a>

            <!-- Secondary link -->
            <a
                href="{{ route('contact') }}"
                class="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-2 py-2 border-b border-transparent hover:border-white/20"
            >
                Talk to an Engineer
                <span aria-hidden="true">&rarr;</span>
            </a>
        </div>
    </div>

    <!-- ── Bottom fade gradient ── -->
    <div
        aria-hidden="true"
        class="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none"
        style="background: linear-gradient(to top, #071324 0%, transparent 100%)"
    ></div>

    <style>
        [x-cloak] { display: none !important; }
    </style>
</section>