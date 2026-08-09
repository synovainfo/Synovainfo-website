<x-app-layout>
    <x-slot name="title">Careers</x-slot>
    <x-slot name="description">Join Synova Infotech Infotech — engineering careers in enterprise software, cloud platforms, AI systems, and cybersecurity. Pune & remote roles.</x-slot>

    @php
        $mappedPositions = $careers->map(function($career) {
            $type = is_object($career->type) ? $career->type->value : $career->type;
            return [
                'id' => $career->slug,
                'title' => $career->title,
                'department' => $career->department ?? 'Engineering',
                'location' => $career->location ?? 'Pune / Remote',
                'type' => strtolower($type ?? 'remote'),
                'description' => $career->description ?? 'Join our elite team of engineers.',
            ];
        })->toArray();

        // Ensure we have JSON encoded positions for Alpine.js
        $positionsJson = json_encode($mappedPositions);
    @endphp

    <section id="careers" class="bg-abyss-950 p-0 overflow-hidden min-h-screen">
        <div class="grid grid-cols-1 lg:grid-cols-2 h-auto lg:h-[92vh]">

            <!-- Left: Sticky Image & Intro -->
            <div class="relative h-[50vh] lg:h-full w-full">
                <img
                    src="{{ asset('images/home/enterprise-office.png') }}"
                    alt="Synova Infotech Enterprise Engineering Team"
                    class="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div class="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-abyss-950 via-abyss-950/90 to-abyss-950/20"></div>

                <div class="absolute inset-0 p-8 lg:p-16 flex flex-col justify-end lg:justify-center">
                    <p class="eyebrow text-ember-400 mb-6">SYNOVAINFOTECH // CAREERS</p>
                    <h2 class="font-display text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
                        Engineer <br />
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-ember-400 to-ember-600">
                            What's Next.
                        </span>
                    </h2>
                    <p class="text-lg text-white/60 max-w-md leading-relaxed">
                        We don't hire employees. We recruit elite technical architects, designers, and systems engineers to build the infrastructure of tomorrow's Fortune 500.
                    </p>
                    <p class="mt-8 eyebrow text-white/30"><span class="text-ember-500/70">//</span> people-and-culture</p>
                </div>
            </div>

            <!-- Right: Scrollable Accordion -->
            <div x-data="{ openId: 'sse', positions: {{ $positionsJson }} }" class="flex flex-col h-full bg-canvas p-8 lg:p-16 lg:overflow-y-auto">
                <div class="flex items-center justify-between mb-8 pb-4 border-b border-abyss-900/10">
                    <h3 class="font-display text-xl font-bold text-abyss-900">
                        Open Architecture Roles
                    </h3>
                    <span class="text-sm font-semibold text-abyss-900/50 font-mono">
                        {{ count($mappedPositions) }} POSITIONS
                    </span>
                </div>

                <div class="flex flex-col gap-4">
                    @foreach($mappedPositions as $position)
                        <div
                            :class="openId === '{{ $position['id'] }}' ? 'bg-surface border-ember-500/50 shadow-ember' : 'bg-surface border-surface-border hover:border-ember-500/40 cursor-pointer'"
                            class="rounded-2xl border transition-all duration-300 overflow-hidden card-lift"
                        >
                            <!-- Accordion Header -->
                            <div
                                @click="openId = openId === '{{ $position['id'] }}' ? null : '{{ $position['id'] }}'"
                                class="p-6 flex items-center justify-between"
                            >
                                <div>
                                    <h4 :class="openId === '{{ $position['id'] }}' ? 'text-ember-600' : 'text-abyss-900'" class="font-display text-lg font-bold mb-2 transition-colors">
                                        {{ $position['title'] }}
                                    </h4>
                                    <div class="flex items-center gap-4 text-xs font-semibold text-abyss-900/50 uppercase tracking-widest">
                                        <span class="flex items-center gap-1.5">
                                            <svg class="h-3.5 w-3.5 text-ember-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {{ $position['department'] }}
                                        </span>
                                        <span class="flex items-center gap-1.5">
                                            <svg class="h-3.5 w-3.5 text-ember-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {{ $position['location'] }}
                                        </span>
                                    </div>
                                </div>

                                <div class="flex items-center gap-4">
                                    <div class="hidden sm:block">
                                        @if($position['type'] === 'remote')
                                            <span class="inline-block rounded-full px-3 py-1 eyebrow bg-ember-500/10 text-ember-600">Remote</span>
                                        @elseif($position['type'] === 'hybrid')
                                            <span class="inline-block rounded-full px-3 py-1 eyebrow bg-abyss-900/10 text-abyss-900">Hybrid</span>
                                        @else
                                            <span class="inline-block rounded-full px-3 py-1 eyebrow bg-abyss-900/10 text-abyss-900">Onsite</span>
                                        @endif
                                    </div>
                                    <div :class="openId === '{{ $position['id'] }}' ? 'bg-ember-500/10 text-ember-500 rotate-180' : 'bg-abyss-900/5 text-abyss-900/40'" class="h-10 w-10 rounded-full flex items-center justify-center transition-transform duration-300">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Accordion Body -->
                            <div x-show="openId === '{{ $position['id'] }}'" x-collapse x-cloak>
                                <div class="px-6 pb-6 pt-2 border-t border-abyss-900/10">
                                    <p class="text-sm text-abyss-900/60 leading-relaxed mb-6">
                                        {{ $position['description'] }}
                                    </p>
                                    <a
                                        href="{{ route('contact') }}?position={{ urlencode($position['title']) }}"
                                        class="inline-flex items-center gap-2 rounded-xl bg-ember-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-ember-600 shadow-ember hover:scale-[1.02] active:scale-95"
                                    >
                                        Apply for Role
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

        </div>
    </section>
</x-app-layout>
