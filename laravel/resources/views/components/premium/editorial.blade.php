<section class="relative py-28 md:py-40 bg-abyss-950 text-white overflow-hidden" aria-label="Our Service Approach">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="mb-20 max-w-3xl">
            <p class="eyebrow text-ember-500 mb-6 tracking-widest uppercase text-sm font-semibold">05 — Our service approach</p>
            <h2 class="premium-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.2]">
                A structured, client-focused methodology — from first conversation to long-term partnership.
            </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            @foreach(config('content.service_approach', []) as $step)
                <div class="relative bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/10 transition-colors duration-300">
                    <div class="text-3xl font-bold text-ember-500 mb-6 font-mono">{{ str_pad($step['number'], 2, '0', STR_PAD_LEFT) }}</div>
                    <h3 class="text-xl font-semibold mb-4">{{ $step['title'] }}</h3>
                    <p class="text-sm text-white/60 leading-relaxed">{{ $step['description'] }}</p>
                    
                    @if(!$loop->last)
                        <div class="hidden lg:block absolute -right-3 top-1/2 w-6 h-px bg-white/20"></div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
    
    <div class="absolute inset-0 bg-grid opacity-20" aria-hidden="true"></div>
    <div class="absolute -bottom-40 right-0 w-[40rem] h-[40rem] rounded-full opacity-20 pointer-events-none" style="background: radial-gradient(circle, var(--color-ember-500) 0%, transparent 60%);"></div>
</section>
