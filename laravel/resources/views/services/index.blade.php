<x-app-layout>
    <x-slot name="title">Services</x-slot>
    <x-slot name="description">Enterprise software engineering, cloud & DevOps, AI and data systems, and cybersecurity services engineered for mission-critical scale.</x-slot>

    @php
        $keynoteServices = $services->take(4)->map(function($service) {
            $benefits = is_array($service->benefits) && count($service->benefits) > 0 
                ? array_slice($service->benefits, 0, 3) 
                : [
                    'Tailored to your exact business processes',
                    'Enterprise-grade security baked in from day one',
                    'Cloud-native architecture that scales horizontally'
                ];
                
            $outcomes = is_array($service->business_outcomes) && count($service->business_outcomes) >= 3
                ? $service->business_outcomes
                : ['3.2x ROI in 18 Months', '+40% Release Cadence', '99.999% Availability'];

            return [
                'id' => $service->slug,
                'title' => $service->title,
                'tagline' => $service->category ?? 'Enterprise Solutions',
                'description' => $service->short_description ?? 'Mission-critical enterprise architecture.',
                'svgAsset' => 'images/home/realistic/microservices-topology.jpg',
                'benefits' => $benefits,
                'outcomes' => [
                    'roi' => $outcomes[0],
                    'velocity' => $outcomes[1],
                    'uptime' => $outcomes[2],
                ],
                'techPills' => ['React', 'Node.js', 'PostgreSQL', 'Docker'],
            ];
        });

        $allServices = $services ?? [];
    @endphp

    <x-sections.command-band
        eyebrow="SYNOVAINFOTECH // ENTERPRISE CAPABILITIES"
        title="Mission-Critical Solutions"
        subtitle="Architected for Fortune 500 enterprises requiring security, scalability, and measurable ROI."
        accent="service-architecture"
    />

    <section id="services" class="py-20 bg-canvas min-h-screen">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">

            <div x-data="{ activeIdx: 0 }">
                <!-- Corporate Tab Bar -->
                <div class="flex flex-wrap justify-center gap-3 my-10 max-w-4xl mx-auto">
                    @foreach($keynoteServices as $idx => $service)
                        <button
                            @click="activeIdx = {{ $idx }}"
                            :class="activeIdx === {{ $idx }} ? 'bg-ember-500 text-white shadow-ember scale-105' : 'border border-surface-border bg-surface text-ink-muted hover:text-ink hover:border-ember-500/40'"
                            class="eyebrow px-5 py-2.5 rounded-full transition-all duration-300"
                        >
                            {{ $service['title'] }}
                        </button>
                    @endforeach
                </div>

                <!-- Corporate Panel -->
                <div class="max-w-6xl mx-auto rounded-3xl border border-surface-border bg-surface p-6 md:p-12 shadow-xl overflow-hidden transition-colors hover:border-ember-500/50 min-h-[500px]">
                    
                    @foreach($keynoteServices as $idx => $service)
                        <div x-show="activeIdx === {{ $idx }}" 
                             x-transition:enter="transition ease-out duration-300"
                             x-transition:enter-start="opacity-0 translate-y-4"
                             x-transition:enter-end="opacity-100 translate-y-0"
                             x-cloak
                             class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            
                            <!-- Left Content Column -->
                            <div class="lg:col-span-6 space-y-6">
                                <span class="inline-flex items-center gap-2 eyebrow text-ember-600">
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    {{ $service['tagline'] }}
                                </span>
                                <h3 class="font-display text-3xl font-extrabold md:text-4xl text-abyss-900 leading-tight">
                                    {{ $service['title'] }}
                                </h3>
                                <p class="text-sm text-abyss-900/60 leading-relaxed">
                                    {{ $service['description'] }}
                                </p>

                                <!-- Quantified Business Outcomes -->
                                <div class="grid grid-cols-3 gap-3 border-y border-abyss-900/10 py-4 text-center my-6">
                                    <div>
                                        <div class="text-lg font-extrabold text-ember-600">{{ $service['outcomes']['roi'] }}</div>
                                        <div class="eyebrow text-abyss-900/50 mt-0.5">Financial ROI</div>
                                    </div>
                                    <div>
                                        <div class="text-lg font-extrabold text-ember-600">{{ $service['outcomes']['velocity'] }}</div>
                                        <div class="eyebrow text-abyss-900/50 mt-0.5">Velocity Boost</div>
                                    </div>
                                    <div>
                                        <div class="text-lg font-extrabold text-ember-600">{{ $service['outcomes']['uptime'] }}</div>
                                        <div class="eyebrow text-abyss-900/50 mt-0.5">SLA Target</div>
                                    </div>
                                </div>

                                <!-- Milestones -->
                                <div class="space-y-2.5">
                                    @foreach($service['benefits'] as $benefit)
                                        <div class="flex items-start gap-3 text-sm font-medium text-abyss-900/70">
                                            <svg class="h-5 w-5 text-ember-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{{ $benefit }}</span>
                                        </div>
                                    @endforeach
                                </div>

                                <!-- Tech Pills -->
                                <div class="flex flex-wrap gap-2 pt-4">
                                    @foreach($service['techPills'] as $tech)
                                        <span class="rounded-lg bg-canvas border border-abyss-900/10 px-3 py-1 text-xs font-mono font-bold text-abyss-900/70">
                                            {{ $tech }}
                                        </span>
                                    @endforeach
                                </div>

                                <div class="pt-6">
                                    <a href="{{ route('contact') }}" class="inline-flex items-center gap-2 rounded-xl bg-ember-500 px-6 py-3 text-sm font-bold text-white hover:bg-ember-600 transition-all shadow-ember hover:-translate-y-0.5">
                                        Request Technical Blueprint 
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <!-- Right Service Image -->
                            <div class="lg:col-span-6 flex justify-center">
                                <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-abyss-900/10 bg-canvas p-2 shadow-xl transition-shadow hover:ring-1 hover:ring-ember-500/40">
                                    <img src="{{ asset($service['svgAsset']) }}" alt="{{ $service['title'] }}" class="w-full h-full object-cover rounded-xl" loading="lazy">
                                </div>
                            </div>
                        </div>
                    @endforeach

                </div>
            </div>

            <!-- Comprehensive Service Matrix -->
            @if(count($allServices) > 0)
                <div class="mt-24 max-w-7xl mx-auto reveal">
                    <div class="mb-10">
                        <h3 class="font-display text-2xl font-bold text-abyss-900 mb-2 heading-flourish">Service Architecture Matrix</h3>
                        <p class="text-abyss-900/50">Complete portfolio of enterprise-grade engineering capabilities.</p>
                    </div>
                    <div class="overflow-x-auto rounded-2xl border border-surface-border bg-surface shadow-sm">
                        <table class="w-full min-w-[640px] border-collapse">
                            <thead>
                                <tr class="border-b-2 border-ember-600 bg-abyss-900 text-white">
                                    <th class="text-left eyebrow p-5">Service Domain</th>
                                    <th class="text-left eyebrow p-5">Delivery Model</th>
                                    <th class="text-left eyebrow p-5">Compliance</th>
                                    <th class="text-right eyebrow p-5">Avg. ROI</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($allServices as $s)
                                    <tr class="border-b border-abyss-900/10 hover:bg-ember-50 transition-colors group cursor-pointer" onclick="window.location.href = '{{ route('services.show', $s->slug) }}'">
                                        <td class="p-5">
                                            <div class="flex items-center gap-3">
                                                <div class="bg-ember-100 w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-ember-200 transition-colors shrink-0">
                                                    <svg class="w-5 h-5 text-ember-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <span class="text-sm font-bold text-abyss-900">{{ $s->title }}</span>
                                                    <p class="text-[11px] text-abyss-900/50 mt-0.5 line-clamp-1">{{ $s->short_description ?? 'Enterprise Service' }}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="p-5">
                                            <span class="text-xs font-medium text-abyss-900/60">Agile / Scrum</span>
                                        </td>
                                        <td class="p-5">
                                            <span class="inline-flex rounded-full bg-ember-100 px-2.5 py-0.5 text-[11px] font-bold text-ember-700">ISO 27001</span>
                                        </td>
                                        <td class="p-5 text-right">
                                            <span class="text-sm font-bold text-abyss-900">3.2x</span>
                                            <span class="text-[10px] text-abyss-900/50 ml-1">avg</span>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            @endif

        </div>
    </section>
</x-app-layout>
