<x-app-layout>
    <x-slot name="title">{{ $seo['title'] ?? 'Our Approach — Enterprise Architecture Methodology' }}</x-slot>
    <x-slot name="description">{{ $seo['description'] ?? 'Discover Synovainfo\'s disciplined enterprise engineering methodology: architecture-first design, governed delivery, and measurable business outcomes across four phases — Discover, Design, Engineer, Operate.' }}</x-slot>
    @if(!empty($seo['keywords']))
        <x-slot name="keywords">{{ $seo['keywords'] }}</x-slot>
    @endif

    @push('jsonld')
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "{{ url('/approach') }}#webpage",
        "url": "{{ url('/approach') }}",
        "name": "Our Approach — Enterprise Architecture Methodology",
        "description": "Synovainfo delivers enterprise transformation through a four-phase methodology: Discover, Design, Engineer, Operate.",
        "isPartOf": { "@id": "{{ url('/') }}#website" },
        "inLanguage": "en"
    }
    </script>
    @endpush

    <x-sections.command-band
        eyebrow="SYNOVAINFO // ENTERPRISE STRATEGY"
        title="The Discipline Behind Every Engagement"
        subtitle="A four-phase delivery methodology that turns enterprise ambition into governed, measurable, mission-critical systems — without the ambiguity most transformation programs inherit."
        accent="strategic-blueprint"
    />

    {{-- Phase strip — horizontal numbered rail on desktop, stacked on mobile --}}
    <section id="approach" class="bg-canvas py-20 min-h-screen">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">

            {{-- Lead statement --}}
            <div class="grid gap-10 lg:grid-cols-12 mb-20 reveal">
                <div class="lg:col-span-5">
                    <p class="eyebrow text-ember-600 mb-4">THE CONVICTION</p>
                    <h2 class="font-display text-3xl md:text-4xl font-extrabold text-abyss-900 leading-tight">
                        Every great system starts as a <span class="text-ember-500">defensible decision.</span>
                    </h2>
                </div>
                <div class="lg:col-span-7">
                    <p class="text-lg text-abyss-900/60 leading-relaxed mb-6">
                        We do not prototype our way to production. Each engagement moves through four
                        deliberately sequenced phases, each with explicit artifacts, review gates, and
                        acceptance criteria — so risk is retired early and every stakeholder knows
                        exactly where the program stands.
                    </p>
                    <p class="text-abyss-900/50 leading-relaxed">
                        The methodology is not a slide deck. It is the operating contract between your
                        business outcomes and the engineering organization that must deliver them.
                    </p>
                </div>
            </div>

            {{-- Four phases --}}
            @php
                $phases = [
                    [
                        'no' => '01',
                        'name' => 'Discover',
                        'tagline' => 'Clarity before commitment',
                        'desc' => 'We map your operating reality before proposing architecture. Discovery converts ambiguity into a defensible baseline.',
                        'items' => ['Current-state & legacy assessment', 'Stakeholder & capability mapping', 'Constraint, risk & dependency inventory', 'Business-outcome definition & prioritization'],
                    ],
                    [
                        'no' => '02',
                        'name' => 'Design',
                        'tagline' => 'Architecture-first, documented, owned',
                        'desc' => 'Every engagement begins with a defensible architecture — reviewed by engineering leadership and owned by a named architect.',
                        'items' => ['Reference architecture & ADRs', 'Target-state blueprint & roadmap', 'Security & compliance design', 'Cost model & FinOps baseline'],
                    ],
                    [
                        'no' => '03',
                        'name' => 'Engineer',
                        'tagline' => 'Governed, incremental delivery',
                        'desc' => 'We ship in small, verifiable increments. Continuous integration, automated verification, and a single source of truth for requirements, design, and risk.',
                        'items' => ['Incremental releases & CI/CD', 'Automated testing & observability', 'Zero-downtime migration patterns', 'Technical debt & quality gates'],
                    ],
                    [
                        'no' => '04',
                        'name' => 'Operate',
                        'tagline' => 'Held to the SLAs we design',
                        'desc' => 'We hold ourselves to the same uptime and performance standards we write into your architecture — with auditability baked in.',
                        'items' => ['24×7 platform operations', 'SLO/SLA monitoring & reporting', 'Continuous security & compliance', 'Business-impact analytics'],
                    ],
                ];
            @endphp

            <div class="grid gap-6 lg:grid-cols-2">
                @foreach($phases as $phase)
                    <div class="group relative overflow-hidden rounded-3xl border border-surface-border bg-surface p-8 md:p-10 shadow-sm transition-all duration-300 hover:border-ember-500/40 hover:shadow-xl card-lift reveal">
                        <div class="absolute -right-6 -top-8 font-display text-[7rem] font-black leading-none text-abyss-900/5 select-none pointer-events-none group-hover:text-ember-500/10 transition-colors duration-500" aria-hidden="true">
                            {{ $phase['no'] }}
                        </div>
                        <div class="relative">
                            <div class="flex items-center gap-3 mb-5">
                                <span class="inline-flex items-center rounded-full bg-ember-50 border border-ember-500/20 px-3 py-1 eyebrow text-ember-600">
                                    PHASE {{ $phase['no'] }}
                                </span>
                            </div>
                            <h3 class="font-display text-2xl md:text-3xl font-extrabold text-abyss-900 mb-2">
                                {{ $phase['name'] }}
                            </h3>
                            <p class="eyebrow text-abyss-900/40 mb-4">{{ $phase['tagline'] }}</p>
                            <p class="text-abyss-900/60 leading-relaxed mb-6">{{ $phase['desc'] }}</p>
                            <ul class="space-y-2.5 border-t border-abyss-900/10 pt-5">
                                @foreach($phase['items'] as $item)
                                    <li class="flex items-start gap-3 text-sm text-abyss-900/70">
                                        <svg class="h-4 w-4 text-ember-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {{ $item }}
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                @endforeach
            </div>

            {{-- Governance principles --}}
            <div class="mt-20 reveal">
                <div class="flex items-center gap-3 mb-8">
                    <span class="h-8 w-1 rounded-full bg-gradient-to-b from-ember-400 to-ember-600"></span>
                    <h2 class="font-display text-2xl md:text-3xl font-extrabold text-abyss-900">
                        The Governance Layer
                    </h2>
                </div>
                <div class="grid gap-5 md:grid-cols-3">
                    @foreach([
                        ['Architecture review boards', 'Every phase passes an independent architecture review before work advances — no skipped gates, no silent scope drift.', 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'],
                        ['Single source of truth', 'Requirements, design decisions, and risk live in one governed system — auditable from kickoff to steady-state operations.', 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'],
                        ['Measured outcomes', 'We hold ourselves to the same SLAs we design — uptime, throughput, and business impact you can audit.', 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'],
                    ] as [$title, $body, $icon])
                        <div class="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm transition-all duration-300 hover:border-ember-500/40 hover:shadow-lg card-lift">
                            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-50 text-ember-600 mb-4">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{ $icon }}" />
                                </svg>
                            </div>
                            <h3 class="font-display font-bold text-abyss-900 mb-2">{{ $title }}</h3>
                            <p class="text-sm text-abyss-900/55 leading-relaxed">{{ $body }}</p>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- CTA --}}
            <div class="relative overflow-hidden mt-16 rounded-3xl bg-abyss-900 p-10 md:p-14 text-center reveal">
                <div class="absolute inset-0 bg-grid opacity-40" aria-hidden="true"></div>
                <div class="relative">
                    <p class="eyebrow text-ember-400 mb-4">START WITH DISCOVERY</p>
                    <h3 class="font-display text-2xl md:text-3xl font-extrabold text-white mb-4 max-w-2xl mx-auto">
                        Bring your roadmap, your risk register, or your unanswered question.
                    </h3>
                    <p class="text-white/50 mb-8 max-w-xl mx-auto">Our architects will tell you honestly what it takes — starting with a structured discovery session.</p>
                    <a href="{{ route('contact') }}" class="inline-flex items-center gap-2 rounded-full bg-ember-500 px-8 py-3.5 text-sm font-bold text-white hover:bg-ember-600 transition-all shadow-ember hover:-translate-y-0.5">
                        Book a Discovery Session
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </section>
</x-app-layout>
