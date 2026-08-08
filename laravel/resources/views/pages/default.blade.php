<x-app-layout>
    <x-slot name="title">{{ $seo['title'] ?? $page?->seo_title ?? $page?->title ?? 'Enterprise Architecture & Strategy' }}</x-slot>
    <x-slot name="description">{{ $seo['description'] ?? $page?->excerpt ?? 'Enterprise software solution architecture.' }}</x-slot>
    @if(!empty($seo['keywords']))
        <x-slot name="keywords">{{ $seo['keywords'] }}</x-slot>
    @endif
    @if(!empty($seo['ogImage']))
        <x-slot name="ogImage">{{ $seo['ogImage'] }}</x-slot>
    @endif

    <x-sections.command-band
        eyebrow="SYNOVAINFO // ENTERPRISE STRATEGY"
        :title="$page?->title ?? 'Enterprise Architecture & Strategy'"
        :subtitle="$page?->excerpt"
        accent="strategic-blueprint"
    />

    <section id="page-{{ $page?->slug ?? 'default' }}" class="bg-canvas py-16 md:py-20 min-h-screen">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            <!-- Content blocks -->
            <div class="max-w-3xl mx-auto">
                @if($page?->content && is_array($page->content) && count($page->content) > 0)
                    @foreach($page->content as $block)
                        @if(is_string($block))
                            <div class="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-abyss-900 prose-p:text-abyss-900/75 prose-p:leading-relaxed mb-10 reveal">
                                {!! $block !!}
                            </div>
                        @elseif(is_array($block))
                            @if(isset($block['heading']) || isset($block['title']))
                                <h2 class="font-display text-2xl md:text-3xl font-extrabold text-abyss-900 mb-4 mt-12 heading-flourish">
                                    {{ $block['heading'] ?? $block['title'] }}
                                </h2>
                            @endif
                            @if(isset($block['body']) || isset($block['content']) || isset($block['text']))
                                <div class="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-abyss-900 prose-p:text-abyss-900/75 prose-p:leading-relaxed mb-10 reveal">
                                    {!! $block['body'] ?? $block['content'] ?? $block['text'] !!}
                                </div>
                            @endif
                        @endif
                    @endforeach
                @else
                    <div class="prose prose-lg max-w-none prose-p:text-abyss-900/50 text-center reveal">
                        <p>Our engineering team is refining this section. Contact us directly to discuss your enterprise requirements.</p>
                    </div>
                @endif
            </div>

            <!-- CTA -->
            <div class="relative overflow-hidden mt-16 max-w-3xl mx-auto rounded-3xl bg-abyss-900 p-10 text-center reveal">
                <div class="absolute inset-0 bg-grid opacity-40" aria-hidden="true"></div>
                <div class="relative">
                    <h3 class="font-display text-2xl font-extrabold text-white mb-3">Discuss Your {{ $page?->title ?? 'Enterprise' }} Initiative</h3>
                    <p class="text-white/50 mb-8 max-w-xl mx-auto">Our team is ready to align our capabilities with your enterprise goals.</p>
                    <a href="{{ route('contact') }}" class="inline-flex items-center gap-2 rounded-full bg-ember-500 px-8 py-3.5 text-sm font-bold text-white hover:bg-ember-600 transition-all shadow-ember hover:-translate-y-0.5">
                        Talk to an Engineer
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </section>
</x-app-layout>
