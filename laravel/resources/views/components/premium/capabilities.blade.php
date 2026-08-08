<section id="capabilities" class="relative py-24 md:py-32 bg-canvas" aria-label="Capabilities">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-end justify-between gap-8 mb-14">
            <div>
                <p class="eyebrow text-ember-500 mb-6">03 — Capabilities</p>
                <h2 class="premium-display text-[clamp(2rem,4.4vw,3.9rem)] text-ink leading-[1.05]">
                    Each capability is an operating system <span class="premium-serif text-ember-500">for business change.</span>
                </h2>
            </div>
            <p class="max-w-sm text-ink-muted text-sm leading-relaxed" data-reveal>
                Five disciplines, one integrated delivery model — from strategy through
                design, engineering, and operation.
            </p>
        </div>

        <div data-batch class="border-b rule">
            @foreach ([
                ['01', 'Strategy & Architecture', 'Enterprise architecture, platform strategy, and technology roadmaps aligned to business outcomes.', 'images/home/architecture-blueprint.svg', 'strategy'],
                ['02', 'Cloud & Platform Engineering', 'Multi-cloud infrastructure, Kubernetes at scale, and resilient platform operations.', 'images/services/service-cloud-native.svg', 'cloud'],
                ['03', 'Product Design & Experience', 'Design systems, research, and experience engineering for enterprise products.', 'images/services/service-custom-software.svg', 'design'],
                ['04', 'AI & Data Engineering', 'ML pipelines, LLM integration, and governed data platforms that drive decisions.', 'images/services/service-enterprise-ai.svg', 'ai'],
                ['05', 'Security & Compliance', 'Zero-trust architecture, continuous compliance, and incident readiness.', 'images/services/service-cybersecurity.svg', 'security'],
            ] as [$index, $title, $desc, $icon, $tag])
                <a href="{{ route('services.index') }}" class="service-row group block" aria-label="{{ $title }}">
                    <span class="service-bg" aria-hidden="true"></span>
                    <span class="service-line" aria-hidden="true"></span>
                    <div class="service-body">
                        <span class="service-index mono-num text-sm text-ink-faint transition-colors">{{ $index }}</span>
                        <div class="flex flex-wrap items-baseline justify-between gap-4">
                            <h3 class="service-title premium-display text-[clamp(1.4rem,3vw,2.4rem)] text-ink transition-colors">{{ $title }}</h3>
                            <span class="service-tag eyebrow text-ink-faint transition-colors">{{ $tag }}</span>
                        </div>
                        <svg class="service-arrow h-6 w-6 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </div>
                    <div class="service-desc-wrap">
                        <div class="pb-8">
                            <div class="flex items-start gap-6">
                                <img src="{{ asset($icon) }}" alt="" class="h-10 w-10 shrink-0 hidden sm:block" loading="lazy" />
                                <p class="service-desc max-w-xl text-sm text-ink-muted leading-relaxed transition-colors">{{ $desc }}</p>
                            </div>
                        </div>
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</section>
