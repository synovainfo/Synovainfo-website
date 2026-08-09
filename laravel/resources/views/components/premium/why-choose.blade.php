<section class="relative py-24 md:py-32 bg-canvas border-t border-ink/5 dark:border-white/5" aria-label="Why choose Synova Infotech">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
            <p class="eyebrow text-ember-500 mb-6 tracking-widest uppercase text-sm font-semibold">Why choose Synova Infotech</p>
            <h2 class="premium-display text-[clamp(2rem,3vw,2.5rem)] text-ink leading-[1.35] max-w-3xl mx-auto">
                A partnership built on trust, scale, and practical innovation.
            </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
            @foreach(config('content.why_choose', []) as $point)
                <div class="bg-surface-1 border border-ink/5 dark:border-white/5 rounded-2xl p-8 text-center shadow-sm">
                    <h3 class="text-xl font-bold text-ink mb-4">{{ $point['title'] }}</h3>
                    <p class="text-sm text-ink-muted leading-relaxed">{{ $point['description'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
