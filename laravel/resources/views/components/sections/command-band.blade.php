@props([
    'eyebrow' => 'SYNOVAINFOTECH // ENTERPRISE SYSTEMS',
    'title' => 'Page Title',
    'subtitle' => null,
    'accent' => 'engineered',
])

<section class="relative overflow-hidden bg-abyss-900 text-white">
    <!-- Grid texture -->
    <div class="absolute inset-0 bg-grid opacity-60" aria-hidden="true"></div>

    <!-- Orbital rings (the site's differentiation anchor) -->
    <svg class="absolute -right-24 -top-24 h-[34rem] w-[34rem] opacity-40 pointer-events-none" viewBox="0 0 600 600" fill="none" aria-hidden="true">
        <circle cx="300" cy="300" r="240" stroke="#f97316" stroke-opacity="0.35" stroke-width="1" stroke-dasharray="4 8" />
        <circle cx="300" cy="300" r="180" stroke="#22d3ee" stroke-opacity="0.25" stroke-width="1" />
        <circle cx="300" cy="300" r="120" stroke="#f97316" stroke-opacity="0.45" stroke-width="1.5" />
        <circle cx="300" cy="300" r="60" fill="#f97316" fill-opacity="0.08" />
        <circle cx="300" cy="300" r="8" fill="#f97316" />
        <circle cx="540" cy="60" r="5" fill="#22d3ee" />
        <circle cx="480" cy="300" r="5" fill="#f97316" />
        <circle cx="60" cy="120" r="4" fill="#60a5fa" />
        <path d="M540 60 L480 300 M300 300 L60 120" stroke="#f97316" stroke-opacity="0.2" stroke-width="0.75" />
    </svg>

    <!-- Bottom fade into the page canvas (theme-aware) -->
    <div class="absolute bottom-0 left-0 right-0 h-24 pointer-events-none band-fade" aria-hidden="true"></div>

    <div class="relative max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-20 md:pt-28 md:pb-24">
        <p class="eyebrow text-ember-400 mb-5 reveal">{{ $eyebrow }}</p>
        <h1 class="font-display font-extrabold uppercase tracking-tight text-[clamp(1.9rem,4.5vw,3.4rem)] leading-[1.05] text-white max-w-4xl reveal">
            {{ $title }}<span class="text-ember-500">.</span>
        </h1>
        @if($subtitle)
            <p class="mt-6 text-[clamp(0.9rem,1.1vw,1.05rem)] text-white/60 max-w-2xl leading-relaxed reveal">
                {{ $subtitle }}
            </p>
        @endif
        <p class="mt-8 eyebrow text-white/30">
            <span class="text-ember-500/70">//</span> {{ $accent }}
        </p>
    </div>
</section>
