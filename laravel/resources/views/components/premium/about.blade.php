<section class="relative py-24 md:py-32 bg-canvas border-t rule" aria-label="About Synova">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="eyebrow text-ember-500 mb-8 tracking-widest uppercase text-sm font-semibold">02 — Who we are</p>
        <h2 data-split-headline class="premium-display text-[clamp(2rem,3vw,2.5rem)] text-ink leading-[1.35] max-w-4xl mb-8">
            {{ config('content.who_we_are') }}
        </h2>

        <p class="text-ink-muted text-lg leading-relaxed max-w-3xl mb-16" data-reveal>
            {{ config('content.overview') }}
        </p>

        <div class="grid md:grid-cols-2 gap-8" data-batch>
            <div class="bg-white dark:bg-abyss-900/50 border border-ink/10 dark:border-white/10 rounded-2xl p-8 shadow-sm">
                <h3 class="text-xl font-semibold text-ink mb-4">Our vision</h3>
                <p class="text-sm text-ink-muted leading-relaxed">
                    {{ config('content.vision') }}
                </p>
            </div>
            <div class="bg-white dark:bg-abyss-900/50 border border-ink/10 dark:border-white/10 rounded-2xl p-8 shadow-sm">
                <h3 class="text-xl font-semibold text-ink mb-4">Our mission</h3>
                <p class="text-sm text-ink-muted leading-relaxed">
                    {{ config('content.mission') }}
                </p>
            </div>
        </div>

        <div class="mt-12">
            <a data-magnetic href="{{ route('about') }}"
               class="btn-fill inline-flex items-center gap-3 rounded-full border border-ink px-8 py-4 text-sm font-semibold text-ink transition-colors duration-300 hover:text-white">
                <span class="btn-bg"></span>
                <span class="btn-label relative">More about Synova</span>
                <svg class="btn-arrow h-4 w-4 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </a>
        </div>
    </div>
</section>
