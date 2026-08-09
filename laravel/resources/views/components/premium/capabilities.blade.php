<section id="capabilities" class="relative py-28 md:py-40 bg-surface-2" aria-label="Our Technology Ecosystem">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-20">
            <p class="eyebrow text-ember-500 mb-6 tracking-widest uppercase text-sm font-semibold">03 — Our technology ecosystem</p>
            <h2 class="premium-display text-[clamp(2.5rem,5vw,4.5rem)] text-ink leading-[1.1] max-w-4xl mb-8">
                End-to-end technology capabilities under one roof.
            </h2>
            <p class="text-ink-muted text-lg md:text-xl leading-relaxed max-w-3xl">
                From custom software to IT infrastructure, AI, and ongoing
                support — Synova consolidates the full technology stack so
                you don't have to manage multiple vendors.
            </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
            @foreach(config('content.ecosystem_groups', []) as $group)
                <div class="bg-white dark:bg-abyss-900/40 border border-ink/5 dark:border-white/5 rounded-3xl p-8 transition-transform hover:-translate-y-1 hover:shadow-xl duration-300">
                    <h3 class="text-2xl font-bold text-ink mb-4">{{ $group['title'] }}</h3>
                    <p class="text-ink-muted text-sm leading-relaxed mb-8">{{ $group['summary'] }}</p>
                    
                    <ul class="space-y-6">
                        @foreach($group['services'] as $service)
                            <li class="text-sm">
                                <strong class="block text-ink font-semibold mb-1">{{ $service['name'] }}:</strong>
                                <span class="text-ink-muted leading-relaxed block">{{ $service['description'] }}</span>
                            </li>
                        @endforeach
                    </ul>
                </div>
            @endforeach
        </div>
    </div>
</section>
