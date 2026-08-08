<section class="relative py-24 md:py-32 bg-canvas border-t rule" aria-label="About Synovainfo">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-12 gap-14 items-start">
            {{-- Left: label + statement --}}
            <div class="lg:col-span-6">
                <p class="eyebrow text-ember-500 mb-8">02 — Who we are</p>
                <h2 data-split-headline class="premium-display text-[clamp(2rem,4.4vw,3.9rem)] text-ink leading-[1.05]">
                    An engineering studio trusted by the world's most ambitious enterprises.
                </h2>
            </div>

            {{-- Right: description + supporting info + CTA --}}
            <div class="lg:col-span-5 lg:col-start-8">
                <p class="text-ink-muted text-lg leading-relaxed" data-reveal>
                    Synovainfo is a full-stack enterprise engineering partner. We design
                    and operate the platforms behind global payments, connected care,
                    intelligent energy grids, and next-generation digital banking —
                    measured in uptime, throughput, and trust.
                </p>

                <div class="mt-10 space-y-5" data-batch>
                    <div class="flex items-start gap-4">
                        <span class="eyebrow text-ember-500 mt-1 shrink-0">ISO 27001</span>
                        <p class="text-sm text-ink-muted">Information security management, certified and audited annually.</p>
                    </div>
                    <div class="flex items-start gap-4">
                        <span class="eyebrow text-ember-500 mt-1 shrink-0">SOC 2</span>
                        <p class="text-sm text-ink-muted">Type II attestation across security, availability, and confidentiality.</p>
                    </div>
                    <div class="flex items-start gap-4">
                        <span class="eyebrow text-ember-500 mt-1 shrink-0">Fortune 500</span>
                        <p class="text-sm text-ink-muted">Mission-critical programs delivered for enterprises across 40+ countries.</p>
                    </div>
                </div>

                <a data-magnetic href="{{ route('about') }}"
                   class="btn-fill mt-12 inline-flex items-center gap-3 rounded-full border border-ink px-8 py-4 text-sm font-semibold text-ink transition-colors duration-300 hover:text-white">
                    <span class="btn-bg"></span>
                    <span class="btn-label relative">More about Synovainfo</span>
                    <svg class="btn-arrow h-4 w-4 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </a>
            </div>
        </div>

        {{-- Full-width imagery strip --}}
        <div class="mt-20 grid md:grid-cols-12 gap-6">
            <div data-curtain class="case-visual rounded-2xl md:col-span-7 aspect-[16/10]">
                <div class="curtain-overlay"></div>
                <img src="{{ asset('images/about/tech-team.webp') }}" alt="Synovainfo engineering team collaborating" loading="lazy" />
                <div class="case-overlay"></div>
            </div>
            <div data-curtain class="case-visual rounded-2xl md:col-span-5 aspect-[16/10]">
                <div class="curtain-overlay"></div>
                <img src="{{ asset('images/home/enterprise-office.png') }}" alt="Enterprise delivery center" loading="lazy" />
                <div class="case-overlay"></div>
            </div>
        </div>
    </div>
</section>
