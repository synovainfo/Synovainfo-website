<x-app-layout>
    <x-slot name="title">{{ $seo['title'] ?? $page->seo_title ?? 'Enterprise Platform Engineering' }}</x-slot>
    <x-slot name="description">{{ $seo['description'] ?? 'Synova Infotech engineers mission-critical enterprise platforms — cloud-native architecture, AI-driven automation, and zero-trust security for global organizations.' }}</x-slot>
    @if(!empty($seo['keywords']))
        <x-slot name="keywords">{{ $seo['keywords'] }}</x-slot>
    @endif
    @if(!empty($seo['ogImage']))
        <x-slot name="ogImage">{{ $seo['ogImage'] }}</x-slot>
    @endif



    {{-- The premium experience root — GSAP boots when this node exists --}}
    <div id="premium-experience" class="relative">
        <x-premium.preloader />

        {{-- 1. Hero --}}
        <x-premium.hero />

        {{-- 2. Statement --}}
        <x-premium.statement />

        {{-- 3. About --}}
        <x-premium.about />

        {{-- 4. Capabilities --}}
        <x-premium.capabilities />

        {{-- 5. Case Studies --}}
        <x-premium.case-studies />

        {{-- 6. Statistics --}}
        <x-premium.stats />

        {{-- 7. Editorial story --}}
        <x-premium.editorial />

        {{-- 7b. Why Choose Synova --}}
        <x-premium.why-choose />

        {{-- 8. Testimonials --}}
        <x-premium.testimonials />

        {{-- 9. Clients --}}
        <x-premium.clients />

        {{-- 10. CTA --}}
        <x-premium.cta />
    </div>

    <!-- Dynamic Sections from Database (fallback for future CMS-driven layouts) -->
    @if($page?->sections?->isNotEmpty())
        <section class="py-16">
            <div class="max-w-7xl mx-auto px-4">
                @foreach($page->sections as $section)
                    {!! $section->content !!}
                @endforeach
            </div>
        </section>
    @endif

</x-app-layout>
