<section data-horizontal id="work" class="relative overflow-hidden bg-abyss-950 text-white py-24 md:py-0" aria-label="Selected work">
    <div class="absolute inset-0 bg-grid opacity-30" aria-hidden="true"></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-24">
        <div class="flex flex-wrap items-end justify-between gap-8 mb-12">
            <div>
                <p class="eyebrow text-ember-400 mb-6">04 — Selected work</p>
                <h2 class="premium-display text-[clamp(2rem,4.4vw,3.9rem)] text-white leading-[1.05]">
                    Proof, <span class="premium-serif text-ember-400">at scale.</span>
                </h2>
            </div>
            <p class="max-w-sm text-white/60 text-sm leading-relaxed">
                A few of the systems our teams have engineered and operate for enterprises worldwide.
            </p>
        </div>
    </div>

    {{-- Horizontal track (desktop) / natural stack (mobile) --}}
    <div data-horizontal-track class="relative flex flex-col gap-8 md:gap-0 md:flex-row md:w-max md:items-stretch px-4 sm:px-6 lg:px-8 pb-20 md:pb-0">
        @foreach ([
            ['images/home/realistic/analytics-dashboard.jpg', 'Meridian Bank Group', 'Real-Time Payments Replatform', 'Event-driven payments core · 1.2M tx/min · 3 regions'],
            ['images/home/realistic/enterprise-cloud.jpg', 'Aurora Health Network', 'Connected Care Cloud', '14 hospitals unified on one interoperable clinical platform'],
            ['images/home/realistic/ai-pipeline.jpg', 'Vertex Energy', 'Grid Intelligence', 'Predictive load forecasting across 4M smart meters'],
            ['images/home/realistic/global-delivery-map.jpg', 'Northwind Logistics', 'Fleet Command', 'IoT telemetry platform across 30k connected assets'],
        ] as [$img, $client, $title, $meta])
            <article class="md:w-[76vw] lg:w-[64vw] md:shrink-0 md:pr-8 lg:pr-12" data-cursor="View">
                <div data-curtain class="case-visual rounded-2xl aspect-[16/10] md:aspect-[16/9]" data-parallax="4">
                    <div class="curtain-overlay"></div>
                    <img src="{{ asset($img) }}" alt="{{ $title }}" loading="lazy" />
                    <div class="case-overlay"></div>
                </div>
                <div class="mt-6 flex items-start justify-between gap-4">
                    <div>
                        <p class="eyebrow text-ember-400 mb-2">{{ $client }}</p>
                        <h3 class="premium-display text-2xl md:text-3xl text-white">{{ $title }}</h3>
                    </div>
                    <p class="hidden md:block text-xs text-white/50 max-w-[16rem] text-right leading-relaxed">{{ $meta }}</p>
                </div>
                <p class="md:hidden mt-2 text-xs text-white/50">{{ $meta }}</p>
            </article>
        @endforeach
    </div>

    {{-- Progress dots — populated by the mobile/tablet swipe carousel (JS) --}}
    <div data-carousel-dots class="relative lg:hidden" role="group" aria-label="Case study navigation"></div>
</section>
