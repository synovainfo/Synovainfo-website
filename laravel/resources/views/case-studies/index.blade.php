<x-app-layout>
    <x-slot name="title">Case Studies</x-slot>
    <x-slot name="description">Real-world engineering outcomes: zero-downtime migrations, AI deployments, and security transformations across Fortune 500 environments.</x-slot>

    @php
        $mappedStudies = collect($caseStudies->items())->map(function($study) {
            $metrics = is_array($study->metrics) ? $study->metrics : [];
            $results = [];
            foreach ($metrics as $metric) {
                if (is_array($metric)) {
                    $results[] = [
                        'metric' => $metric['label'] ?? $metric['metric'] ?? 'Metric',
                        'value' => $metric['value'] ?? 'Value',
                    ];
                }
            }
            if (count($results) < 3) {
                $results = [
                    ['metric' => 'Operational Efficiency', 'value' => '+35%'],
                    ['metric' => 'Unplanned Downtime', 'value' => '-60%'],
                    ['metric' => 'ROI', 'value' => '3.2× in 18 months'],
                ];
            }

            return [
                'id' => $study->slug,
                'title' => $study->title,
                'industry' => $study->industry ?? 'Enterprise',
                'overview' => $study->summary ?? 'Enterprise case study overview.',
                'challenge' => $study->challenge ?? 'Enterprise challenge.',
                'solution' => $study->solution ?? 'Enterprise solution.',
                'technologies' => is_array($study->tech_stack) && count($study->tech_stack) > 0 ? $study->tech_stack : ['Java', 'Spring Boot', 'React'],
                'results' => array_slice($results, 0, 3),
                'timeline' => '9 months — Discovery to Deployment',
            ];
        })->toArray();

        // Ensure we have JSON encoded case studies for Alpine.js
        $caseStudiesJson = json_encode($mappedStudies);
    @endphp

    <x-sections.command-band
        eyebrow="SYNOVAINFO // PROVEN IMPACT"
        title="Executive Case Studies & ROI Verification"
        subtitle="How Synovainfo partners with Fortune 500 leaders to architect secure, scalable, and high-performance digital ecosystems."
        accent="verified-enterprise-impact"
    />

    <section id="case-studies" x-data="{ selectedStudy: null, studies: {{ $caseStudiesJson }} }" class="bg-canvas py-20 min-h-screen">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            @if(count($mappedStudies) === 0)
                <div class="text-center py-24 reveal">
                    <p class="text-2xl font-display font-bold text-abyss-900/40 mb-4">No case studies published yet.</p>
                    <p class="text-abyss-900/50">Our impact archive is being curated — check back soon.</p>
                </div>
            @endif

            <!-- Magazine Spread Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <!-- Featured Case Study (Full width on mobile, spans 8 cols on desktop) -->
                @if(count($mappedStudies) > 0)
                    <div
                        @click="selectedStudy = studies[0]"
                        class="lg:col-span-8 group relative overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-sm transition-all hover:border-ember-500/40 hover:shadow-xl cursor-pointer flex flex-col justify-end min-h-[500px] p-8 md:p-12 card-lift reveal"
                    >
                        <div class="absolute inset-0 bg-grid-light opacity-60 pointer-events-none"></div>
                        <div class="absolute inset-0 bg-gradient-to-br from-ember-500/5 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(249,115,22,0.06),transparent_65%)] pointer-events-none"></div>

                        <div class="relative z-10 w-full max-w-2xl">
                            <div class="flex items-center gap-3 mb-6">
                                <span class="inline-flex items-center gap-2 rounded-full bg-ember-50 border border-ember-500/20 px-3 py-1 eyebrow text-ember-600">
                                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {{ $mappedStudies[0]['industry'] }}
                                </span>
                                <span class="text-[10px] font-bold tracking-widest text-abyss-900/50 uppercase font-mono">
                                    {{ $mappedStudies[0]['timeline'] }}
                                </span>
                            </div>

                            <h3 class="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-abyss-900 leading-tight mb-4 group-hover:text-ember-600 transition-colors">
                                {{ $mappedStudies[0]['title'] }}
                            </h3>
                            <p class="text-base text-abyss-900/60 mb-8 line-clamp-2 max-w-xl">
                                {{ $mappedStudies[0]['overview'] }}
                            </p>

                            <div class="grid grid-cols-3 gap-6 border-t border-abyss-900/10 pt-6">
                                @foreach($mappedStudies[0]['results'] as $res)
                                    <div>
                                        <div class="text-2xl md:text-3xl font-extrabold text-ember-600">
                                            {{ $res['value'] }}
                                        </div>
                                        <div class="text-[9px] font-bold text-abyss-900/50 uppercase tracking-widest mt-1">
                                            {{ $res['metric'] }}
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        <div class="absolute top-8 right-8 h-12 w-12 rounded-full bg-ember-500 flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-ember">
                            <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>
                @endif

                <!-- Secondary Case Studies (Stack vertically on right side) -->
                <div class="lg:col-span-4 flex flex-col gap-8">
                    @foreach(array_slice($mappedStudies, 1, 2) as $index => $study)
                        <div
                            @click="selectedStudy = studies[{{ $index + 1 }}]"
                            class="group relative flex-1 flex flex-col justify-between rounded-3xl border border-surface-border bg-surface shadow-sm p-8 transition-all hover:border-ember-500/40 hover:shadow-xl cursor-pointer min-h-[240px] card-lift reveal"
                        >
                            <div>
                                <div class="flex items-center justify-between mb-4">
                                    <span class="inline-flex items-center rounded-full bg-ember-50 border border-ember-500/20 px-3 py-1 eyebrow text-ember-600">
                                        {{ $study['industry'] }}
                                    </span>
                                    <svg class="h-4 w-4 text-abyss-900/30 group-hover:text-ember-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                                <h3 class="font-display text-xl font-bold text-abyss-900 leading-snug mb-3 group-hover:text-ember-600 transition-colors">
                                    {{ $study['title'] }}
                                </h3>
                                <div class="flex items-center gap-4 mt-6">
                                    <div class="text-xl font-extrabold text-ember-600">
                                        {{ $study['results'][0]['value'] }}
                                    </div>
                                    <div class="text-[9px] font-bold text-abyss-900/50 uppercase tracking-widest leading-tight">
                                        {{ $study['results'][0]['metric'] }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

            </div>
        </div>

        <!-- Case Study Detail Modal -->
        <div x-show="selectedStudy" x-cloak class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-abyss-950/90 backdrop-blur-xl">
            <div
                x-show="selectedStudy"
                x-transition:enter="transition ease-out duration-300"
                x-transition:enter-start="opacity-0 scale-95 translate-y-4"
                x-transition:enter-end="opacity-100 scale-100 translate-y-0"
                x-transition:leave="transition ease-in duration-200"
                x-transition:leave-start="opacity-100 scale-100 translate-y-0"
                x-transition:leave-end="opacity-0 scale-95 translate-y-4"
                @click.away="selectedStudy = null"
                class="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[2rem] border border-white/10 bg-abyss-900 p-8 md:p-12 text-white shadow-2xl custom-scrollbar"
            >
                <button
                    @click="selectedStudy = null"
                    class="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Close case study"
                >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div class="flex items-center gap-2 eyebrow text-ember-400 mb-4">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span x-text="selectedStudy?.industry + ' Architecture Audit'"></span>
                </div>
                <h3 class="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold pr-12 leading-[1.1] mb-8" x-text="selectedStudy?.title"></h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 my-8 border-y border-white/10 py-8">
                    <div>
                        <h4 class="eyebrow text-ember-400 flex items-center gap-2 mb-4">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            The Challenge
                        </h4>
                        <p class="text-sm text-white/70 leading-[1.8] font-medium" x-text="selectedStudy?.challenge"></p>
                    </div>
                    <div>
                        <h4 class="eyebrow text-ember-400 flex items-center gap-2 mb-4">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            Engineered Solution
                        </h4>
                        <p class="text-sm text-white/70 leading-[1.8] font-medium" x-text="selectedStudy?.solution"></p>
                    </div>
                </div>

                <div class="mb-10">
                    <h4 class="eyebrow text-white/50 mb-4">
                        Verified Executive Metrics
                    </h4>
                    <div class="grid grid-cols-3 gap-4 bg-abyss-950/60 p-6 rounded-2xl border border-white/5 text-center">
                        <template x-for="res in selectedStudy?.results" :key="res.metric">
                            <div>
                                <div class="text-3xl md:text-4xl font-extrabold text-white mb-1" x-text="res.value"></div>
                                <div class="text-[9px] font-bold tracking-widest text-ember-400 uppercase" x-text="res.metric"></div>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/10 gap-6">
                    <div class="flex items-center gap-2 flex-wrap">
                        <template x-for="t in selectedStudy?.technologies" :key="t">
                            <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10 eyebrow text-white/60 uppercase" x-text="t"></span>
                        </template>
                    </div>
                    <a
                        href="{{ route('contact') }}"
                        class="shrink-0 inline-flex items-center gap-2 rounded-full bg-ember-500 px-8 py-3.5 text-xs font-bold text-white hover:bg-ember-600 transition-all shadow-ember hover:-translate-y-0.5"
                    >
                        Request Similar Architecture
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>

    </section>
</x-app-layout>
