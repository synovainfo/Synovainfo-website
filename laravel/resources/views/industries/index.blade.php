<x-app-layout>
    <x-slot name="title">Industries</x-slot>
    <x-slot name="description">Domain-specific technology solutions for manufacturing, healthcare, finance, retail, logistics, education, government, and telecom enterprises.</x-slot>

    @php
        $regionalHubs = [
            [
                'id' => 'india-hq',
                'name' => 'India & Global HQ (Pune)',
                'type' => 'Core R&D & Engineering Hub',
                'metrics' => '1,200+ Engineers • 24/7 Operations',
                'compliance' => 'ISO 27001 • CMMI Level 5',
                'sectors' => ['Banking & Fintech', 'Smart Manufacturing', 'Healthcare Tech', 'Automotive & EV'],
            ],
            [
                'id' => 'north-america',
                'name' => 'North America Delivery Hub',
                'type' => 'Enterprise Solutions & Client Architecture',
                'metrics' => 'Sub-5ms Latency • Fortune 500 Partners',
                'compliance' => 'SOC 2 Type II • HIPAA Ready',
                'sectors' => ['Financial Services', 'Retail & E-Commerce', 'Logistics & Supply Chain'],
            ],
            [
                'id' => 'emea',
                'name' => 'EMEA & UK Operations',
                'type' => 'Cloud Mesh & Security Governance',
                'metrics' => 'Multi-Region Failover • 99.999% SLA',
                'compliance' => 'GDPR Compliant • Cyber Essentials',
                'sectors' => ['Pharma & Life Sciences', 'Energy & Utilities', 'Telecommunications'],
            ],
            [
                'id' => 'apac',
                'name' => 'Asia Pacific Hub (Singapore)',
                'type' => 'Edge WAN & Logistics Acceleration',
                'metrics' => 'Sub-10ms Anycast • 24/7 Managed Support',
                'compliance' => 'MAS TRM Guidelines Compliant',
                'sectors' => ['Global Logistics', 'Supply Chain Automation', 'Cross-Border Payments'],
            ],
        ];

        // This would typically come from the controller via DB
        $allIndustries = $industries ?? [];
    @endphp

    <x-sections.command-band
        eyebrow="SYNOVAINFO // GLOBAL FOOTPRINT"
        title="Engineering Excellence Across Key Industries"
        subtitle="Specialized architecture hubs delivering measurable outcomes across North America, EMEA, and Asia Pacific."
        accent="global-delivery-network"
    />

    <section id="industries" class="bg-canvas text-abyss-900 py-20 min-h-screen">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            <div x-data="{ activeHubId: 'india-hq' }" class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 my-8 items-center max-w-6xl mx-auto">
                <!-- Left Interactive World Map -->
                <div class="group reveal">
                    <div class="relative rounded-3xl border border-surface-border bg-surface p-4 md:p-6 shadow-lg shadow-abyss-950/5 overflow-hidden">
                        <img
                            src="{{ asset('images/home/realistic/global-delivery-map.jpg') }}"
                            alt="Synovainfo Global Delivery Network Map"
                            class="w-full h-auto object-contain rounded-xl"
                            loading="lazy"
                        />
                    </div>
                </div>

                <!-- Right Regional Telemetry Hub Details -->
                <div class="space-y-4 reveal">
                    <p class="eyebrow text-ember-600 mb-2">
                        Select Regional Hub
                    </p>

                    <div class="space-y-2.5">
                        @foreach($regionalHubs as $hub)
                            <button
                                @click="activeHubId = '{{ $hub['id'] }}'"
                                :class="activeHubId === '{{ $hub['id'] }}' ? 'border-ember-500 bg-surface shadow-ember' : 'border-surface-border bg-surface hover:border-ember-500/50 hover:shadow-md hover:bg-ember-500/5'"
                                class="w-full text-left p-4 rounded-2xl border transition-all duration-300"
                            >
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-bold text-abyss-900 flex items-center gap-2">
                                        <svg :class="activeHubId === '{{ $hub['id'] }}' ? 'text-ember-500' : 'text-abyss-900/40'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {{ $hub['name'] }}
                                    </span>
                                    <svg x-show="activeHubId === '{{ $hub['id'] }}'" class="h-4 w-4 text-ember-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                    <svg x-show="activeHubId !== '{{ $hub['id'] }}'" class="h-4 w-4 text-abyss-900/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div class="text-xs text-abyss-900/50 mt-1 font-medium">{{ $hub['type'] }}</div>
                            </button>
                        @endforeach
                    </div>

                    <!-- Active Hub Telemetry Card -->
                    @foreach($regionalHubs as $hub)
                        <div x-show="activeHubId === '{{ $hub['id'] }}'" x-cloak class="mt-6 rounded-2xl border border-surface-border bg-surface p-5 space-y-3 shadow-sm">
                            <div class="flex items-center gap-2">
                                <svg class="h-4 w-4 text-ember-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                <div class="eyebrow text-abyss-900">
                                    Live Hub SLA Metrics & Compliance
                                </div>
                            </div>
                            <div class="text-xs font-bold text-abyss-900">{{ $hub['metrics'] }}</div>
                            <div class="text-xs text-abyss-900/50">Governance: <span class="text-abyss-900 font-bold">{{ $hub['compliance'] }}</span></div>

                            <div class="pt-2 border-t border-abyss-900/10">
                                <div class="eyebrow text-abyss-900/40 mb-1.5">Primary Sectors</div>
                                <div class="flex flex-wrap gap-1.5">
                                    @foreach($hub['sectors'] as $s)
                                        <span class="rounded-md bg-canvas border border-abyss-900/10 px-2.5 py-0.5 text-[11px] font-bold text-abyss-900/70">
                                            {{ $s }}
                                        </span>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <!-- Industry Expertise — Horizontal scrollable metric cards -->
            @if(count($allIndustries) > 0)
                <div class="mt-24 max-w-7xl mx-auto">
                    <div class="mb-10 reveal">
                        <h3 class="font-display text-2xl font-bold text-abyss-900 mb-2 heading-flourish">Sector Performance Benchmarks</h3>
                        <p class="text-abyss-900/50">Verified engineering outcomes across our core industry verticals.</p>
                    </div>

                    <div class="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-thin">
                        @foreach($allIndustries as $industry)
                            <div class="snap-start shrink-0 w-[300px] bg-surface border border-surface-border hover:border-ember-500/50 hover:shadow-xl p-6 rounded-2xl transition-all duration-300 group cursor-pointer card-lift" onclick="window.location.href='{{ route('industries.show', $industry->slug) }}'">
                                <div class="flex items-center justify-between mb-6">
                                    <div class="bg-ember-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-ember-100 transition-colors">
                                        <svg class="w-6 h-6 text-ember-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <span class="eyebrow text-ember-600">Live</span>
                                </div>
                                <h4 class="font-display text-xl font-bold text-abyss-900 mb-2">{{ $industry->name }}</h4>
                                <p class="text-abyss-900/50 text-sm leading-relaxed mb-6 line-clamp-2">
                                    {{ $industry->description ?? 'Enterprise Industry' }}
                                </p>
                                <div class="border-t border-abyss-900/10 pt-4">
                                    <div class="flex items-center justify-between mb-3">
                                        <span class="eyebrow text-abyss-900/40">Capability Score</span>
                                        <span class="text-sm font-bold text-ember-600">94/100</span>
                                    </div>
                                    <div class="w-full h-1.5 rounded-full bg-abyss-900/10 overflow-hidden">
                                        <div class="h-full w-[94%] rounded-full bg-gradient-to-r from-ember-400 to-ember-600"></div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif

        </div>
    </section>
</x-app-layout>
