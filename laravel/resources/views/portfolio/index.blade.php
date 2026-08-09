<x-app-layout>
    <x-slot name="title">Portfolio</x-slot>
    <x-slot name="description">A curated portfolio of mission-critical systems engineered for global enterprises — cloud platforms, AI pipelines, and secure digital products.</x-slot>

    <x-sections.command-band
        eyebrow="SYNOVAINFOTECH // DEPLOYMENTS"
        title="Enterprise Deployments That Speak"
        subtitle="A curated portfolio of mission-critical systems engineered for global enterprises."
        accent="delivered-systems"
    />

    <section id="portfolio" class="bg-canvas py-20 min-h-screen">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            @if($portfolios->count() === 0)
                <div class="text-center py-24 reveal">
                    <p class="text-2xl font-display font-bold text-abyss-900/40 mb-4">No projects published yet.</p>
                    <p class="text-abyss-900/50">Our portfolio is being curated — check back soon.</p>
                </div>
            @else
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    @foreach($portfolios as $item)
                        <a href="{{ route('portfolio.show', $item->slug) }}" class="group overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-sm transition-all duration-300 hover:border-ember-500/40 hover:shadow-xl card-lift reveal">
                            <div class="relative h-52 bg-abyss-900 overflow-hidden">
                                @if($item->featured_image)
                                    <img src="{{ asset($item->featured_image) }}" alt="{{ $item->title }}" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                @else
                                    <div class="absolute inset-0 bg-gradient-to-br from-ember-500/15 via-transparent to-transparent"></div>
                                    <div class="absolute inset-0 bg-grid opacity-25"></div>
                                @endif
                                @if($item->category)
                                    <span class="absolute top-4 left-4 inline-block rounded-full bg-white/90 backdrop-blur px-3 py-1 eyebrow text-abyss-900">
                                        {{ $item->category }}
                                    </span>
                                @endif
                            </div>
                            <div class="p-6">
                                <h3 class="font-display text-lg font-bold text-abyss-900 mb-1 group-hover:text-ember-600 transition-colors">{{ $item->title }}</h3>
                                @if($item->client_name)
                                    <p class="text-xs font-semibold text-abyss-900/50 mb-3 font-mono">{{ $item->client_name }}</p>
                                @endif
                                <p class="text-sm text-abyss-900/60 line-clamp-2">{{ $item->description }}</p>
                            </div>
                        </a>
                    @endforeach
                </div>

                @if($portfolios->hasPages())
                    <div class="mt-16 flex justify-center">
                        {{ $portfolios->links() }}
                    </div>
                @endif
            @endif
        </div>
    </section>
</x-app-layout>
