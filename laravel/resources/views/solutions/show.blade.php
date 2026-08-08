<x-app-layout>
    <x-slot name="title">{{ $solution->seo_title ?? $solution->title }}</x-slot>

    @php
        $features = is_array($solution->features) ? $solution->features : [];
        $benefits = is_array($solution->benefits) ? $solution->benefits : [];
    @endphp

    <x-sections.command-band
        eyebrow="SYNOVAINFO // SOLUTION"
        :title="$solution->title"
        :subtitle="$solution->short_description"
        accent="solution-blueprint"
    />

    <section id="solution-detail" class="bg-canvas min-h-screen py-16 md:py-20">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            <!-- Body -->
            <div class="max-w-3xl mx-auto">
                <div class="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-abyss-900 prose-p:text-abyss-900/75 prose-p:leading-relaxed">
                    {!! $solution->full_description ?? '<p>Enterprise solution overview.</p>' !!}
                </div>

                @if(count($features) > 0)
                    <div class="mt-12 reveal">
                        <h2 class="font-display text-2xl font-extrabold text-abyss-900 mb-6 flex items-center gap-3 heading-flourish">
                            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-50 text-ember-600">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </span>
                            Architecture Highlights
                        </h2>
                        <ul class="space-y-4">
                            @foreach($features as $f)
                                <li class="flex items-start gap-3 text-abyss-900/70 leading-relaxed">
                                    <svg class="h-5 w-5 text-ember-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{{ $f }}</span>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                @if(count($benefits) > 0)
                    <div class="mt-12 reveal">
                        <h2 class="font-display text-2xl font-extrabold text-abyss-900 mb-6 flex items-center gap-3 heading-flourish">
                            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-50 text-ember-600">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </span>
                            Business Challenges Solved
                        </h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            @foreach($benefits as $b)
                                <div class="flex items-center gap-3 rounded-xl border border-surface-border bg-surface px-4 py-3 shadow-sm">
                                    <span class="h-2 w-2 rounded-full bg-ember-500 shrink-0"></span>
                                    <span class="text-sm font-medium text-abyss-900/70">{{ $b }}</span>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif

                <!-- CTA -->
                <div class="relative overflow-hidden mt-14 rounded-3xl bg-abyss-900 p-10 text-center reveal">
                    <div class="absolute inset-0 bg-grid opacity-40" aria-hidden="true"></div>
                    <div class="relative">
                        <h3 class="font-display text-2xl font-extrabold text-white mb-3">Ready to Deploy This Blueprint?</h3>
                        <p class="text-white/50 mb-8 max-w-xl mx-auto">Talk to our architects about adapting this solution to your enterprise.</p>
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
