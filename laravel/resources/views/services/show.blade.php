<x-app-layout>
    <x-slot name="title">{{ $service->seo_title ?? $service->title }}</x-slot>

    @php
        $benefits = is_array($service->benefits) ? $service->benefits : [];
        $outcomes = is_array($service->business_outcomes) ? $service->business_outcomes : [];
        $techs = $service->technologies ?? collect();
        $industries = $service->industries ?? collect();
    @endphp

    <x-sections.command-band
        eyebrow="SYNOVAINFO // SERVICE"
        :title="$service->title"
        :subtitle="$service->short_description"
        :accent="$service->category ?? 'enterprise-capability'"
    />

    <section id="service-detail" class="bg-canvas min-h-screen py-16 md:py-20">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            <!-- Body -->
            <div class="max-w-3xl mx-auto">
                @if($service->full_description)
                    <div class="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-abyss-900 prose-p:text-abyss-900/75 prose-p:leading-relaxed">
                        {!! $service->full_description !!}
                    </div>
                @endif

                @if(count($benefits) > 0)
                    <div class="mt-12 reveal">
                        <h2 class="font-display text-2xl font-extrabold text-abyss-900 mb-6 flex items-center gap-3 heading-flourish">
                            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-50 text-ember-600">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            Key Benefits
                        </h2>
                        <ul class="space-y-4">
                            @foreach($benefits as $b)
                                <li class="flex items-start gap-3 text-abyss-900/70 leading-relaxed">
                                    <svg class="h-5 w-5 text-ember-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{{ $b }}</span>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                @if(count($outcomes) >= 3)
                    <div class="mt-12 grid grid-cols-3 gap-4 border-y border-abyss-900/10 py-6 text-center reveal">
                        <div>
                            <div class="text-lg font-extrabold text-ember-600">{{ $outcomes[0] }}</div>
                            <div class="eyebrow text-abyss-900/50 mt-0.5">Financial ROI</div>
                        </div>
                        <div>
                            <div class="text-lg font-extrabold text-ember-600">{{ $outcomes[1] }}</div>
                            <div class="eyebrow text-abyss-900/50 mt-0.5">Velocity Boost</div>
                        </div>
                        <div>
                            <div class="text-lg font-extrabold text-ember-600">{{ $outcomes[2] }}</div>
                            <div class="eyebrow text-abyss-900/50 mt-0.5">SLA Target</div>
                        </div>
                    </div>
                @endif

                @if($techs->count() > 0)
                    <div class="mt-12 reveal">
                        <p class="eyebrow text-abyss-900/50 mb-3">Technology Stack</p>
                        <div class="flex flex-wrap gap-2">
                            @foreach($techs as $tech)
                                <span class="rounded-full bg-surface border border-surface-border px-3 py-1 text-xs font-bold text-ink-muted font-mono">{{ $tech->name }}</span>
                            @endforeach
                        </div>
                    </div>
                @endif

                @if($industries->count() > 0)
                    <div class="mt-12 reveal">
                        <p class="eyebrow text-abyss-900/50 mb-3">Industries Served</p>
                        <div class="flex flex-wrap gap-2">
                            @foreach($industries as $ind)
                                <a href="{{ route('industries.show', $ind->slug) }}" class="rounded-full bg-abyss-900 px-3 py-1 text-xs font-bold text-white hover:bg-ember-600 transition-colors">
                                    {{ $ind->name }}
                                </a>
                            @endforeach
                        </div>
                    </div>
                @endif

                <!-- CTA -->
                <div class="relative overflow-hidden mt-14 rounded-3xl bg-abyss-900 p-10 text-center reveal">
                    <div class="absolute inset-0 bg-grid opacity-40" aria-hidden="true"></div>
                    <div class="relative">
                        <h3 class="font-display text-2xl font-extrabold text-white mb-3">Request a Technical Blueprint</h3>
                        <p class="text-white/50 mb-8 max-w-xl mx-auto">Talk to our architects about {{ $service->title }} for your enterprise.</p>
                        <a href="{{ route('contact') }}" class="inline-flex items-center gap-2 rounded-full bg-ember-500 px-8 py-3.5 text-sm font-bold text-white hover:bg-ember-600 transition-all shadow-ember hover:-translate-y-0.5">
                            Start the Conversation
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</x-app-layout>
