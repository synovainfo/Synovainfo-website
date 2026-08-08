<x-app-layout>
    <x-slot name="title">Technologies</x-slot>
    <x-slot name="description">Our engineering stack: frontend & UI, backend microservices, data platforms, cloud infrastructure, and AI & machine learning tooling.</x-slot>

    @php
        $categoryLabels = [
            'frontend' => 'Frontend & UI Engineering',
            'backend' => 'Backend & Microservices',
            'database' => 'Data & Databases',
            'cloud' => 'Cloud & Infrastructure',
            'ai' => 'AI & Machine Learning',
        ];
    @endphp

    <x-sections.command-band
        eyebrow="SYNOVAINFO // TECHNOLOGY STACK"
        title="Engineering With the Best Tools in Class"
        subtitle="The modern technology arsenal our architects use to deliver enterprise-grade systems."
        accent="weaponized-technology"
    />

    <section id="technologies" class="bg-canvas py-20 min-h-screen">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            @if($technologies->count() === 0)
                <div class="text-center py-24 reveal">
                    <p class="text-2xl font-display font-bold text-abyss-900/40 mb-4">No technologies listed yet.</p>
                    <p class="text-abyss-900/50">Our stack is being documented — check back soon.</p>
                </div>
            @else
                @foreach($technologies as $category => $items)
                    <div class="mb-16 reveal">
                        <h2 class="font-display text-2xl font-extrabold text-abyss-900 mb-8 flex items-center gap-3">
                            <span class="h-8 w-1 rounded-full bg-gradient-to-b from-ember-400 to-ember-600"></span>
                            {{ $categoryLabels[$category] ?? ucwords(str_replace('_', ' ', $category)) }}
                            <span class="text-sm font-bold text-abyss-900/40 font-mono">({{ $items->count() }})</span>
                        </h2>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            @foreach($items as $tech)
                                <div class="group rounded-2xl border border-surface-border bg-surface p-5 shadow-sm transition-all duration-300 hover:border-ember-500/40 hover:shadow-xl card-lift">
                                    <div class="flex items-center gap-3 mb-3">
                                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember-50 text-ember-600 group-hover:bg-ember-100 transition-colors">
                                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                        </div>
                                        <div class="min-w-0">
                                            <h3 class="font-display font-bold text-abyss-900 text-sm truncate">{{ $tech->name }}</h3>
                                            @if($tech->proficiency_level > 0)
                                                <div class="flex items-center gap-1 mt-0.5">
                                                    @for($i = 1; $i <= 5; $i++)
                                                        <span class="h-1 w-3 rounded-full {{ $i <= $tech->proficiency_level ? 'bg-ember-500' : 'bg-abyss-900/10' }}"></span>
                                                    @endfor
                                                </div>
                                            @endif
                                        </div>
                                    </div>
                                    <p class="text-xs text-abyss-900/50 leading-relaxed">{{ $tech->description }}</p>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endforeach
            @endif
        </div>
    </section>
</x-app-layout>
