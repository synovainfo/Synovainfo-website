<x-app-layout>
    <x-slot name="title">{{ $seo['title'] ?? 'Architecture — Mission-Critical Platform Design' }}</x-slot>
    <x-slot name="description">{{ $seo['description'] ?? 'Explore how Synova Infotech designs mission-critical, AI-native multi-cloud architectures — zero-downtime migration, event-driven patterns, and zero-trust security baked into every reference stack.' }}</x-slot>
    @if(!empty($seo['keywords']))
        <x-slot name="keywords">{{ $seo['keywords'] }}</x-slot>
    @endif

    @push('jsonld')
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "{{ url('/architecture') }}#webpage",
        "url": "{{ url('/architecture') }}",
        "name": "Architecture — Mission-Critical Platform Design",
        "description": "Synova Infotech designs mission-critical, AI-native multi-cloud architectures with zero-trust security and zero-downtime migration patterns.",
        "isPartOf": { "@id": "{{ url('/') }}#website" },
        "inLanguage": "en"
    }
    </script>
    @endpush

    <x-sections.command-band
        eyebrow="SYNOVAINFOTECH // ENTERPRISE ARCHITECTURE"
        title="Architecture That Survives Contact With Reality"
        subtitle="Reference-grade design for mission-critical platforms — patterns, practices, and stacks validated in production across payments, healthcare, energy, and logistics."
        accent="reference-architecture"
    />

    <section id="architecture" class="bg-canvas py-20 min-h-screen">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">

            {{-- Lead statement --}}
            <div class="grid gap-10 lg:grid-cols-12 mb-20 reveal">
                <div class="lg:col-span-5">
                    <p class="eyebrow text-ember-600 mb-4">THE STANDARD</p>
                    <h2 class="font-display text-3xl md:text-4xl font-extrabold text-abyss-900 leading-tight">
                        Designed for <span class="text-ember-500">uptime, throughput, and trust</span> — from day one.
                    </h2>
                </div>
                <div class="lg:col-span-7">
                    <p class="text-lg text-abyss-900/60 leading-relaxed mb-6">
                        Our architects design platforms the way a civil engineer designs a bridge:
                        every component has a load rating, a failure mode, and a retirement path.
                        The patterns below are the load-bearing elements of every reference
                        architecture we deliver.
                    </p>
                    <p class="text-abyss-900/50 leading-relaxed">
                        Each pattern is paired with the operational practices that keep it honest
                        in production — observability, chaos readiness, and continuous compliance.
                    </p>
                </div>
            </div>

            {{-- Architecture practices --}}
            <div class="flex items-center gap-3 mb-8 reveal">
                <span class="h-8 w-1 rounded-full bg-gradient-to-b from-ember-400 to-ember-600"></span>
                <h2 class="font-display text-2xl md:text-3xl font-extrabold text-abyss-900">
                    Engineering Practices
                </h2>
            </div>
            <div class="grid gap-5 md:grid-cols-3 mb-20">
                @foreach([
                    ['Zero-downtime migration', 'Strangler-fig and blue/green patterns that retire legacy systems without a single unplanned minute — proven across payments cores and clinical platforms.', 'M13 10V3L4 14h7v7l9-11h-7z'],
                    ['Zero-trust security', 'Identity perimeters, mTLS everywhere, and secrets management with hardware security modules — security embedded in the pipeline, not bolted on after.', 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'],
                    ['Observability-first', 'Metrics, traces, and logs as first-class deliverables — SLOs defined before the first deploy, with error budgets owned by the team.', 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'],
                    ['Infrastructure as Code', 'Every environment — from sandbox to production — is declared in Terraform or Pulumi, reviewed, and policy-checked before it exists.', 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'],
                    ['Event-driven by default', 'Systems communicate through immutable event streams with replay and audit capability — the backbone of real-time payments and grid telemetry.', 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'],
                    ['Chaos-ready resilience', 'Failure injection is a scheduled practice, not an incident response. Every dependency has a documented degradation strategy.', 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'],
                ] as [$title, $body, $icon])
                    <div class="group rounded-2xl border border-surface-border bg-surface p-6 shadow-sm transition-all duration-300 hover:border-ember-500/40 hover:shadow-lg card-lift reveal">
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-50 text-ember-600 group-hover:bg-ember-100 transition-colors mb-4">                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{ $icon }}" />
                                </svg>
                        </div>
                        <h3 class="font-display font-bold text-abyss-900 mb-2">{{ $title }}</h3>
                        <p class="text-sm text-abyss-900/55 leading-relaxed">{{ $body }}</p>
                    </div>
                @endforeach
            </div>

            {{-- Reference patterns -- numbered rows --}}
            <div class="flex items-center gap-3 mb-8 reveal">
                <span class="h-8 w-1 rounded-full bg-gradient-to-b from-ember-400 to-ember-600"></span>
                <h2 class="font-display text-2xl md:text-3xl font-extrabold text-abyss-900">
                    Reference Patterns
                </h2>
            </div>

            @php
                $patterns = [
                    [
                        'no' => '01',
                        'name' => 'Event-Driven Core',
                        'use' => 'Payments · Telemetry · Ordering',
                        'desc' => 'A distributed, replayable event backbone with exactly-once semantics and regional replication — the foundation for real-time transaction processing.',
                        'tags' => ['Kafka', 'Event Sourcing', 'CQRS', 'Outbox'],
                    ],
                    [
                        'no' => '02',
                        'name' => 'Mesh Microservices',
                        'use' => 'Platforms · APIs · Product suites',
                        'desc' => 'Service-mesh-managed microservices with mTLS, circuit breaking, and canary release — autonomy for teams, control for the platform.',
                        'tags' => ['Kubernetes', 'Istio', 'gRPC', 'OpenTelemetry'],
                    ],
                    [
                        'no' => '03',
                        'name' => 'Data Mesh & Lakehouse',
                        'use' => 'Analytics · ML · Governance',
                        'desc' => 'Federated data products with automated lineage, column-level encryption, and feature-store integration for governed AI at scale.',
                        'tags' => ['Iceberg', 'dbt', 'Airflow', 'Feast'],
                    ],
                    [
                        'no' => '04',
                        'name' => 'Zero-Trust Perimeter',
                        'use' => 'Regulated industries · Multi-tenant SaaS',
                        'desc' => 'Identity-first access with continuous verification, microsegmentation, and security posture enforced as code across every environment.',
                        'tags' => ['Zero Trust', 'OIDC', 'SPIFFE', 'Vault'],
                    ],
                    [
                        'no' => '05',
                        'name' => 'Edge & IoT Fabric',
                        'use' => 'Energy · Logistics · Manufacturing',
                        'desc' => 'Edge gateways, device twins, and over-the-air update pipelines streaming telemetry from tens of thousands of endpoints into the platform.',
                        'tags' => ['MQTT', 'Edge Compute', 'Device Twins', 'OTA'],
                    ],
                    [
                        'no' => '06',
                        'name' => 'AI-Native Platform',
                        'use' => 'Intelligent workflows · Copilots',
                        'desc' => 'LLM orchestration over governed retrieval — vector pipelines, semantic access control, and human-in-the-loop review for enterprise AI.',
                        'tags' => ['RAG', 'pgvector', 'Guardrails', 'Evals'],
                    ],
                ];
            @endphp

            <div class="space-y-4">
                @foreach($patterns as $pattern)
                    <div class="group grid gap-6 lg:grid-cols-12 rounded-2xl border border-surface-border bg-surface p-6 md:p-8 shadow-sm transition-all duration-300 hover:border-ember-500/40 hover:shadow-lg card-lift reveal">
                        <div class="lg:col-span-2 flex items-start gap-4 lg:block">
                            <span class="font-display text-4xl font-black text-abyss-900/15 group-hover:text-ember-500/40 transition-colors">{{ $pattern['no'] }}</span>
                            <span class="lg:hidden eyebrow text-ember-600 mt-2">{{ $pattern['use'] }}</span>
                        </div>
                        <div class="lg:col-span-6">
                            <h3 class="font-display text-xl md:text-2xl font-extrabold text-abyss-900 mb-2">{{ $pattern['name'] }}</h3>
                            <p class="text-sm text-abyss-900/55 leading-relaxed max-w-2xl">{{ $pattern['desc'] }}</p>
                        </div>
                        <div class="lg:col-span-4 lg:text-right">
                            <p class="hidden lg:block eyebrow text-ember-600 mb-3">{{ $pattern['use'] }}</p>
                            <div class="flex flex-wrap gap-2 lg:justify-end">
                                @foreach($pattern['tags'] as $tag)
                                    <span class="rounded-full border border-abyss-900/10 bg-canvas px-3 py-1 text-xs font-medium text-abyss-900/60">{{ $tag }}</span>
                                @endforeach
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            {{-- Reference stacks --}}
            <div class="mt-20 reveal">
                <div class="flex items-center gap-3 mb-8">
                    <span class="h-8 w-1 rounded-full bg-gradient-to-b from-ember-400 to-ember-600"></span>
                    <h2 class="font-display text-2xl md:text-3xl font-extrabold text-abyss-900">
                        Reference Stacks
                    </h2>
                </div>
                <div class="grid gap-5 md:grid-cols-2">
                    @foreach([
                        ['Cloud-Native Delivery', ['AWS / Azure / GCP', 'Kubernetes + Terraform', 'GitHub Actions + ArgoCD', 'OpenTelemetry + Grafana'], 'The default operating model — containerized, declarative, and observable from commit to canary.'],
                        ['Data & AI Engineering', ['PostgreSQL / Iceberg', 'Kafka + Airflow', 'pgvector / Qdrant', 'MLflow + Guardrails'], 'Petabyte-scale pipelines feeding governed models — lineage and encryption through every stage.'],
                        ['Secure Enterprise Edge', ['Zero Trust + SPIFFE', 'Vault + HSM', 'MQTT / Edge Gateways', 'mTLS Service Mesh'], 'For regulated and distributed environments where trust is a hard requirement, not a feature.'],
                        ['Legacy Modernization', ['Strangler Fig + BFF', 'API Gateway + Async API', 'Blue/Green + Canary', 'Contract Testing'], 'Retire monoliths and mainframes incrementally, keeping every transaction safe through the transition.'],
                    ] as [$name, $components, $note])
                        <div class="rounded-2xl border border-surface-border bg-surface p-6 md:p-8 shadow-sm transition-all duration-300 hover:border-ember-500/40 hover:shadow-xl card-lift">
                            <h3 class="font-display text-xl font-extrabold text-abyss-900 mb-1">{{ $name }}</h3>
                            <p class="text-sm text-abyss-900/50 mb-5">{{ $note }}</p>
                            <div class="grid grid-cols-2 gap-2">
                                @foreach($components as $c)
                                    <span class="rounded-lg border border-abyss-900/10 bg-canvas px-3 py-2 text-xs font-medium text-abyss-900/60">{{ $c }}</span>
                                @endforeach
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- CTA --}}
            <div class="relative overflow-hidden mt-16 rounded-3xl bg-abyss-900 p-10 md:p-14 text-center reveal">
                <div class="absolute inset-0 bg-grid opacity-40" aria-hidden="true"></div>
                <div class="relative">
                    <p class="eyebrow text-ember-400 mb-4">ARCHITECTURE REVIEW</p>
                    <h3 class="font-display text-2xl md:text-3xl font-extrabold text-white mb-4 max-w-2xl mx-auto">
                        Have an architecture that needs a second opinion?
                    </h3>
                    <p class="text-white/50 mb-8 max-w-xl mx-auto">Our architects review existing platforms and blueprints — honest assessment, no sales theater.</p>
                    <a href="{{ route('contact') }}" class="inline-flex items-center gap-2 rounded-full bg-ember-500 px-8 py-3.5 text-sm font-bold text-white hover:bg-ember-600 transition-all shadow-ember hover:-translate-y-0.5">
                        Request an Architecture Review
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </section>
</x-app-layout>
