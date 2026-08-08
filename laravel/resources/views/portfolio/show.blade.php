<x-app-layout>
    <x-slot name="title">{{ $portfolio->seo_title ?? $portfolio->title }}</x-slot>

    @php
        $techStack = is_array($portfolio->tech_stack) ? $portfolio->tech_stack : [];
        $gallery = is_array($portfolio->gallery) ? $portfolio->gallery : [];
    @endphp

    <x-sections.command-band
        eyebrow="SYNOVAINFO // PORTFOLIO"
        :title="$portfolio->title"
        :subtitle="$portfolio->client_name ? 'Client · ' . $portfolio->client_name : null"
        :accent="$portfolio->category ?? 'delivered-system'"
    />

    <section id="portfolio-detail" class="bg-canvas min-h-screen py-16 md:py-20">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            @if($portfolio->featured_image)
                <div class="max-w-5xl mx-auto mb-12 reveal">
                    <img src="{{ asset($portfolio->featured_image) }}" alt="{{ $portfolio->title }}" class="w-full rounded-3xl border border-abyss-900/10 shadow-xl object-cover max-h-[440px]" loading="lazy">
                </div>
            @endif

            <div class="max-w-3xl mx-auto">
                <div class="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-abyss-900 prose-p:text-abyss-900/75 prose-p:leading-relaxed">
                    {!! $portfolio->description ?? '<p>Enterprise project details.</p>' !!}
                </div>

                @if(count($gallery) > 0)
                    <div class="mt-12 grid grid-cols-2 gap-4">
                        @foreach($gallery as $img)
                            <img src="{{ asset($img) }}" alt="" class="w-full rounded-2xl border border-abyss-900/10 object-cover aspect-[4/3]" loading="lazy">
                        @endforeach
                    </div>
                @endif

                @if(count($techStack) > 0)
                    <div class="mt-12 pt-8 border-t border-abyss-900/10">
                        <p class="eyebrow text-abyss-900/50 mb-3">Tech Stack</p>
                        <div class="flex flex-wrap gap-2">
                            @foreach($techStack as $t)
                                <span class="rounded-full bg-surface border border-surface-border px-3 py-1 text-xs font-bold text-ink-muted font-mono">{{ $t }}</span>
                            @endforeach
                        </div>
                    </div>
                @endif

                <div class="mt-12 flex flex-col sm:flex-row gap-4">
                    @if($portfolio->project_url)
                        <a href="{{ $portfolio->project_url }}" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 rounded-full bg-abyss-900 px-8 py-3.5 text-sm font-bold text-white hover:bg-abyss-800 transition-colors">
                            Visit Project
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    @endif
                    <a href="{{ route('contact') }}" class="inline-flex items-center justify-center gap-2 rounded-full bg-ember-500 px-8 py-3.5 text-sm font-bold text-white hover:bg-ember-600 transition-all shadow-ember hover:-translate-y-0.5">
                        Build Something Similar
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </section>
</x-app-layout>
