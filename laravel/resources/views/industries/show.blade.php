<x-app-layout>
    <x-slot name="title">{{ $industry->name }}</x-slot>

    @php
        $capabilities = is_array($industry->capabilities) ? $industry->capabilities : [];
    @endphp

    <x-sections.command-band
        eyebrow="SYNOVAINFOTECH // INDUSTRY"
        :title="$industry->name"
        :subtitle="$industry->description"
        accent="industry-capability-map"
    />

    <section id="industry-detail" class="bg-canvas min-h-screen py-16 md:py-20">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20">
                <div class="reveal">
                    <h2 class="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-abyss-900 leading-[1.1] mb-6 heading-flourish">
                        Sector-Specific Architecture
                    </h2>
                    <p class="text-lg text-abyss-900/60 leading-relaxed">
                        {{ $industry->description ?? 'Enterprise-grade solutions tailored to this industry.' }}
                    </p>
                </div>

                <div class="rounded-3xl border border-surface-border bg-surface p-10 shadow-lg card-lift reveal">
                    <h2 class="font-display text-xl font-extrabold text-abyss-900 mb-6 flex items-center gap-3">
                        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-50 text-ember-600">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                        Key Capabilities
                    </h2>
                    @if(count($capabilities) > 0)
                        <ul class="space-y-4">
                            @foreach($capabilities as $cap)
                                <li class="flex items-start gap-3 text-abyss-900/70 leading-relaxed">
                                    <svg class="h-5 w-5 text-ember-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span class="text-sm font-medium">{{ $cap }}</span>
                                </li>
                            @endforeach
                        </ul>
                    @else
                        <p class="text-abyss-900/50 text-sm">Capability details coming soon.</p>
                    @endif
                </div>
            </div>

            <!-- Related Services -->
            @if($industry->services->count() > 0)
                <div class="mb-16">
                    <h2 class="font-display text-2xl font-extrabold text-abyss-900 mb-8 heading-flourish">Solutions for {{ $industry->name }}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        @foreach($industry->services as $service)
                            <a href="{{ route('services.show', $service->slug) }}" class="group rounded-2xl border border-surface-border bg-surface p-6 shadow-sm transition-all duration-300 hover:border-ember-500/40 hover:shadow-xl card-lift">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="bg-ember-50 w-11 h-11 rounded-xl flex items-center justify-center group-hover:bg-ember-100 transition-colors">
                                        <svg class="w-5 h-5 text-ember-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <svg class="h-4 w-4 text-abyss-900/30 group-hover:text-ember-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                                <h3 class="font-display text-lg font-bold text-abyss-900 mb-2 group-hover:text-ember-600 transition-colors">{{ $service->title }}</h3>
                                <p class="text-sm text-abyss-900/50 line-clamp-2">{{ $service->short_description }}</p>
                            </a>
                        @endforeach
                    </div>
                </div>
            @endif

            <!-- CTA -->
            <div class="relative overflow-hidden rounded-3xl bg-abyss-900 p-10 text-center reveal">
                <div class="absolute inset-0 bg-grid opacity-40" aria-hidden="true"></div>
                <div class="relative">
                    <h3 class="font-display text-2xl font-extrabold text-white mb-3">Architect for {{ $industry->name }}</h3>
                    <p class="text-white/50 mb-8 max-w-xl mx-auto">Talk to our industry specialists about your specific enterprise requirements.</p>
                    <a href="{{ route('contact') }}" class="inline-flex items-center gap-2 rounded-full bg-ember-500 px-8 py-3.5 text-sm font-bold text-white hover:bg-ember-600 transition-all shadow-ember hover:-translate-y-0.5">
                        Start the Conversation
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </section>
</x-app-layout>
