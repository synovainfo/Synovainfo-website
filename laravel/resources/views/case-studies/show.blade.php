<x-app-layout>
    <x-slot name="title">{{ $caseStudy->seo_title ?? $caseStudy->title }}</x-slot>

    @php
        $metrics = is_array($caseStudy->metrics) ? $caseStudy->metrics : [];
        $metricItems = collect($metrics)->filter(fn($m) => is_array($m) && (isset($m['value']) || isset($m['label'])))->values();
        if ($metricItems->count() < 3) {
            $metricItems = collect([
                ['metric' => 'Operational Efficiency', 'value' => '+35%'],
                ['metric' => 'Unplanned Downtime', 'value' => '-60%'],
                ['metric' => 'ROI', 'value' => '3.2x in 18 months'],
            ]);
        }
        $techStack = is_array($caseStudy->tech_stack) && count($caseStudy->tech_stack) > 0 ? $caseStudy->tech_stack : ['Java', 'Spring Boot', 'React', 'AWS'];
    @endphp

    <x-sections.command-band
        eyebrow="SYNOVAINFOTECH // CASE STUDY"
        :title="$caseStudy->title"
        :subtitle="$caseStudy->client_name ? 'Client · ' . $caseStudy->client_name : null"
        :accent="$caseStudy->industry ?? 'enterprise-impact'"
    />

    <section id="case-study-detail" class="bg-canvas min-h-screen py-16 md:py-20">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            @if($caseStudy->featured_image)
                <div class="max-w-5xl mx-auto mb-14 reveal">
                    <img src="{{ asset($caseStudy->featured_image) }}" alt="{{ $caseStudy->title }}" class="w-full rounded-3xl border border-abyss-900/10 shadow-xl object-cover max-h-[420px]" loading="lazy">
                </div>
            @endif

            <!-- Metrics -->
            <div class="relative overflow-hidden max-w-5xl mx-auto mb-14 grid grid-cols-3 gap-4 bg-abyss-900 p-8 rounded-3xl text-center reveal">
                <div class="absolute inset-0 bg-grid opacity-40 pointer-events-none" aria-hidden="true"></div>
                @foreach($metricItems->take(3) as $m)
                    <div class="relative {{ !$loop->first ? 'border-l border-white/10' : '' }}">
                        <div class="text-2xl md:text-4xl font-extrabold text-white mb-1">{{ $m['value'] ?? $m['label'] ?? '' }}</div>
                        <div class="text-[9px] font-bold tracking-widest text-ember-400 uppercase">{{ $m['metric'] ?? 'Impact' }}</div>
                    </div>
                @endforeach
            </div>

            <!-- Challenge / Solution -->
            <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
                <div class="rounded-3xl border border-abyss-900/10 bg-white p-8 shadow-sm card-lift reveal">
                    <h2 class="eyebrow text-ember-600 flex items-center gap-2 mb-5">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.024-.833-2.794 0L5.206 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        The Challenge
                    </h2>
                    <p class="text-abyss-900/70 leading-relaxed">{{ $caseStudy->challenge }}</p>
                </div>
                <div class="rounded-3xl border border-abyss-900/10 bg-white p-8 shadow-sm card-lift reveal">
                    <h2 class="eyebrow text-ember-600 flex items-center gap-2 mb-5">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        Engineered Solution
                    </h2>
                    <p class="text-abyss-900/70 leading-relaxed">{{ $caseStudy->solution }}</p>
                </div>
            </div>

            <!-- Summary -->
            @if($caseStudy->summary)
                <div class="max-w-5xl mx-auto mb-14 rounded-3xl border border-ember-500/20 bg-ember-50/60 p-8 reveal">
                    <h2 class="eyebrow text-ember-600 mb-3">Executive Summary</h2>
                    <p class="text-abyss-900/70 leading-relaxed">{{ $caseStudy->summary }}</p>
                </div>
            @endif

            <!-- Tech Stack + CTA -->
            <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-abyss-900/10 pt-10">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="eyebrow text-abyss-900/50 mr-1">Tech Stack:</span>
                    @foreach($techStack as $t)
                        <span class="px-3 py-1 rounded-full bg-white border border-abyss-900/10 eyebrow text-abyss-900/60 uppercase">{{ $t }}</span>
                    @endforeach
                </div>
                <a href="{{ route('contact') }}" class="shrink-0 inline-flex items-center gap-2 rounded-full bg-ember-500 px-8 py-3.5 text-xs font-bold text-white hover:bg-ember-600 transition-all shadow-ember hover:-translate-y-0.5">
                    Request Similar Architecture
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </div>
        </div>
    </section>
</x-app-layout>
