<x-app-layout>
    <x-slot name="title">Solutions</x-slot>
    <x-slot name="description">Purpose-built enterprise solution blueprints combining cloud-native, AI, data, and security engineering for measurable business outcomes.</x-slot>

    <x-sections.command-band
        eyebrow="SYNOVAINFOTECH // SOLUTIONS"
        title="Architectures That Move Enterprises"
        subtitle="Purpose-built solution blueprints combining cloud-native, AI, data, and security engineering."
        accent="solution-blueprints"
    />

    <section id="solutions" class="bg-canvas py-20 min-h-screen">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            @if($solutions->count() === 0)
                <div class="text-center py-24 reveal">
                    <p class="text-2xl font-display font-bold text-abyss-900/40 mb-4">No solutions published yet.</p>
                    <p class="text-abyss-900/50">Our solution library is being curated — check back soon.</p>
                </div>
            @else
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    @foreach($solutions as $solution)
                        <a href="{{ route('solutions.show', $solution->slug) }}" class="group relative overflow-hidden rounded-3xl border border-surface-border bg-surface p-8 md:p-10 shadow-sm transition-all duration-300 hover:border-ember-500/40 hover:shadow-xl card-lift reveal">
                            <div class="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ember-500/5 group-hover:bg-ember-500/10 transition-colors" aria-hidden="true"></div>
                            <div class="relative">
                                <div class="flex items-center justify-between mb-6">
                                    <div class="bg-ember-50 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:bg-ember-100 transition-colors">
                                        <svg class="w-7 h-7 text-ember-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <svg class="h-5 w-5 text-abyss-900/30 group-hover:text-ember-500 transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                                <span class="inline-block rounded-full bg-abyss-900 px-3 py-1 eyebrow text-white mb-4">
                                    Enterprise Solution
                                </span>
                                <h2 class="font-display text-2xl font-extrabold text-abyss-900 leading-tight mb-3 group-hover:text-ember-600 transition-colors">
                                    {{ $solution->title }}
                                </h2>
                                <p class="text-abyss-900/60 leading-relaxed mb-6">
                                    {{ $solution->short_description }}
                                </p>
                                @if(is_array($solution->features) && count($solution->features) > 0)
                                    <div class="flex flex-wrap gap-2">
                                        @foreach(array_slice($solution->features, 0, 3) as $b)
                                            <span class="rounded-lg bg-canvas border border-abyss-900/10 px-3 py-1 text-xs font-semibold text-abyss-900/60">{{ $b }}</span>
                                        @endforeach
                                    </div>
                                @endif
                            </div>
                        </a>
                    @endforeach
                </div>
            @endif
        </div>
    </section>
</x-app-layout>
