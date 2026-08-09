<section id="premium-hero" class="relative overflow-hidden bg-canvas" aria-label="Introduction">
    {{-- Background motion layer --}}
    <div data-hero-anim="background" class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-32 -right-24 h-[34rem] w-[34rem] rounded-full opacity-[0.14]"
             style="background: radial-gradient(circle, var(--color-ember-500) 0%, transparent 62%); filter: blur(40px);"></div>
        <div class="absolute bottom-0 left-1/4 h-[26rem] w-[26rem] rounded-full opacity-[0.08]"
             style="background: radial-gradient(circle, var(--color-node-cyan) 0%, transparent 60%); filter: blur(50px);"></div>
        <div class="absolute inset-0 bg-grid-light opacity-40" style="mask-image: linear-gradient(to bottom, #000, transparent 80%);"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-10 min-h-[88svh] flex flex-col justify-end">
        <div class="grid lg:grid-cols-12 gap-12 items-end">
            <div class="lg:col-span-8">
                <p data-hero-anim="eyebrow" class="eyebrow text-ember-500 mb-6" style="opacity: 0;">
                    Enterprise Platform Engineering — Est. 1999
                </p>

                <h1 class="hero-headline premium-display text-[clamp(2.75rem,7.5vw,7rem)] text-ink">
                    Building what moves the world <span class="premium-serif text-ember-500">forward.</span>
                </h1>

                <p data-hero-anim="copy" class="mt-8 max-w-xl text-lg md:text-xl leading-relaxed text-ink-muted" style="opacity: 0;">
                    Synova Infotech engineers mission-critical platforms for the organizations
                    defining the next decade of computing — cloud-native, AI-driven,
                    secure by design.
                </p>

                <div class="mt-10 flex flex-wrap items-center gap-4">
                    <a data-hero-anim="cta-primary" data-magnetic href="{{ route('contact') }}"
                       class="btn-fill inline-flex items-center gap-3 rounded-full border border-ink px-8 py-4 text-sm font-semibold text-ink transition-colors duration-300 hover:text-white"
                       style="opacity: 0;">
                        <span class="btn-bg"></span>
                        <span class="btn-label relative">Start a conversation</span>
                        <svg class="btn-arrow h-4 w-4 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </a>
                    <a data-hero-anim="cta-secondary" href="#capabilities"
                       class="inline-flex items-center gap-2 px-2 py-2 text-sm font-medium text-ink-muted hover:text-ember-500 transition-colors"
                       style="opacity: 0;">
                        <span class="underline underline-offset-8 decoration-ember-500/60">Explore capabilities</span>
                    </a>
                </div>
            </div>

            {{-- Hero visual — premium layered editorial composition --}}
            <div class="lg:col-span-4">
                <div data-hero-anim="visual" class="relative" style="opacity: 0;">
                    <div class="case-visual rounded-2xl aspect-[4/5] max-w-sm ml-auto w-full" data-parallax="5">
                        <img src="{{ asset('images/home/hero-global-datacenter.webp') }}"
                             alt="Synova Infotech global data center operations" loading="eager" fetchpriority="high" decoding="async" />
                        <div class="case-overlay"></div>
                    </div>
                    <div class="absolute -bottom-6 -left-6 card-surface rounded-2xl px-6 py-4 hidden sm:block"
                         style="box-shadow: 0 24px 60px -20px rgb(7 19 36 / 0.35);">
                        <p class="eyebrow text-ember-500 mb-1">Global uptime</p>
                        <p class="mono-num text-3xl font-semibold text-ink">99.999%</p>
                    </div>
                </div>
            </div>
        </div>

        <div data-hero-anim="scroll-hint" class="mt-16 flex justify-between items-center" style="opacity: 0;">
            <p class="eyebrow text-ink-faint">Scroll to explore</p>
            <span class="scroll-hint text-ink-faint">Scroll</span>
        </div>
    </div>
</section>
