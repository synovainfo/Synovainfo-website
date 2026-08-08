@php
    $services = [
        [
            'name' => 'Enterprise Software',
            'icon' => 'images/services/service-icon-software.svg',
            'impact' => 'Replace brittle workflows with secure, maintainable operating platforms.',
            'architecture' => ['Domain modeling', 'API gateway', 'Role-based workflows', 'Observability'],
        ],
        [
            'name' => 'Cloud & DevOps',
            'icon' => 'images/services/service-icon-cloud.svg',
            'impact' => 'Modernize infrastructure with reproducible environments and governed delivery.',
            'architecture' => ['IaC', 'CI/CD', 'Container platforms', 'Release governance'],
        ],
        [
            'name' => 'AI & Data Systems',
            'icon' => 'images/services/service-icon-data.svg',
            'impact' => 'Operationalize AI where it improves decisions, automation, and productivity.',
            'architecture' => ['Data contracts', 'Model governance', 'Human review', 'Audit trails'],
        ],
        [
            'name' => 'Cybersecurity',
            'icon' => 'images/services/service-icon-security.svg',
            'impact' => 'Reduce risk through secure-by-design architecture and continuous controls.',
            'architecture' => ['Threat modeling', 'RBAC', 'Secure SDLC', 'Incident readiness'],
        ],
    ];
@endphp

<section class="py-24 bg-surface">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="mb-16 max-w-3xl">
            <p class="text-xs font-bold uppercase tracking-[0.25em] text-orange-500 mb-4">Chapter 2: Service Architecture</p>
            <h2 class="text-3xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
                Each capability is designed as an operating system for business change.
            </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            @foreach($services as $index => $service)
                <article class="card-surface card-lift p-8 hover:border-orange-500/30 group">
                    <div class="flex items-start justify-between mb-6">
                        <div class="flex h-16 w-16 items-center justify-center rounded-xl bg-abyss-900 dark:bg-white/5 border border-abyss-900/10 dark:border-white/10 p-3 transition-colors duration-300 group-hover:border-orange-500/40">
                            <img
                                src="{{ asset($service['icon']) }}"
                                alt="{{ $service['name'] }} icon"
                                class="h-9 w-9 object-contain"
                                loading="lazy"
                                width="36"
                                height="36"
                            />
                        </div>
                        <span class="font-display text-5xl font-black text-surface-border-strong group-hover:text-orange-500/40 transition-colors">
                            {{ str_pad($index + 1, 2, '0', STR_PAD_LEFT) }}
                        </span>
                    </div>
                    <div class="mb-8">
                        <h3 class="text-2xl font-bold text-ink mb-3">{{ $service['name'] }}</h3>
                        <p class="text-ink-muted leading-relaxed">{{ $service['impact'] }}</p>
                    </div>
                    <ul class="space-y-3 border-t border-surface-border pt-6">
                        @foreach($service['architecture'] as $item)
                            <li class="flex items-center text-sm font-semibold text-ink-muted">
                                <svg class="w-5 h-5 text-orange-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {{ $item }}
                            </li>
                        @endforeach
                    </ul>
                </article>
            @endforeach
        </div>
    </div>
</section>
