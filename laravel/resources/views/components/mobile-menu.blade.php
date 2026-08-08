{{-- Mobile menu: hamburger button + full-screen slide-in panel (mobile only).
    Mirrors the Next.js `mobile-nav.tsx`: hamburger morphs to X, panel slides in
    from the right, body scroll locks while open, Esc / link click / resize to
    desktop close it. Uses the theme's semantic tokens so it adapts to day/dark. --}}
<div
    x-data="{ open: false }"
    x-init="$watch('open', (v) => { document.body.style.overflow = v ? 'hidden' : ''; })"
    class="md:hidden"
>
    {{-- Hamburger button — morphs into an X when open --}}
    <button
        type="button"
        @click="open = !open"
        :aria-expanded="open"
        aria-controls="mobile-menu"
        :aria-label="open ? 'Close menu' : 'Open menu'"
        class="relative z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-abyss-900/10 dark:border-white/15 bg-white/60 dark:bg-white/5 text-ink dark:text-white transition-all duration-300 hover:border-ember-500/50 hover:text-ember-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-abyss-900"
    >
        <div class="flex w-5 flex-col items-center gap-[5px]" aria-hidden="true">
            <span
                class="block h-[2px] w-5 rounded-full bg-current transition-all duration-300"
                :class="open ? 'translate-y-[7px] rotate-45' : ''"
            ></span>
            <span
                class="block h-[2px] w-5 rounded-full bg-current transition-all duration-300"
                :class="open ? 'opacity-0' : ''"
            ></span>
            <span
                class="block h-[2px] w-5 rounded-full bg-current transition-all duration-300"
                :class="open ? '-translate-y-[7px] -rotate-45' : ''"
            ></span>
        </div>
    </button>

    {{-- Full-screen slide-in panel --}}
    <div
        id="mobile-menu"
        x-cloak
        x-show="open"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="translate-x-full"
        x-transition:enter-end="translate-x-0"
        x-transition:leave="transition ease-in duration-200"
        x-transition:leave-start="translate-x-0"
        x-transition:leave-end="translate-x-full"
        @keydown.escape.window="open = false"
        @resize.window="window.innerWidth >= 768 && (open = false)"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        class="fixed inset-0 z-50 flex flex-col bg-canvas/95 backdrop-blur-xl"
    >
        {{-- Top bar: logo + close --}}
        <div class="flex items-center justify-between px-5 pt-4 pb-2 border-b border-surface-border">
            <a href="{{ route('home') }}" @click="open = false" class="font-display font-extrabold text-2xl tracking-tight text-ink">
                SYNOVAINFO<span class="text-ember-500">.</span>
            </a>
            <button
                type="button"
                @click="open = false"
                aria-label="Close menu"
                class="flex h-10 w-10 items-center justify-center rounded-full border border-abyss-900/10 dark:border-white/15 text-ink dark:text-white transition-colors hover:border-ember-500/50 hover:text-ember-500"
            >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {{-- Nav links --}}
        <div class="flex-1 overflow-y-auto px-5 py-6">
            <p class="eyebrow text-ink-faint mb-4">Navigate</p>
            <nav aria-label="Mobile navigation" class="space-y-1">
                @foreach ([
                    ['about', 'About'],
                    ['services.index', 'Services'],
                    ['industries.index', 'Industries'],
                    ['case_studies.index', 'Case Studies'],
                    ['blog.index', 'Insights'],
                ] as [$route, $label])
                    <a
                        href="{{ route($route) }}"
                        @click="open = false"
                        class="group flex items-center justify-between border-b border-surface-border py-4 transition-colors"
                    >
                        <span class="font-display text-2xl font-semibold text-ink transition-colors group-hover:text-ember-500">
                            {{ $label }}
                        </span>
                        <svg class="h-5 w-5 text-ink-faint transition-all group-hover:translate-x-1 group-hover:text-ember-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </a>
                @endforeach
            </nav>

            {{-- Secondary links --}}
            <div class="mt-6 grid grid-cols-2 gap-3">
                @foreach ([
                    ['technologies.index', 'Technologies'],
                    ['solutions.index', 'Solutions'],
                    ['approach', 'Our Approach'],
                    ['architecture', 'Architecture'],
                    ['portfolio.index', 'Portfolio'],
                    ['careers.index', 'Careers'],
                ] as [$route, $label])
                    <a
                        href="{{ route($route) }}"
                        @click="open = false"
                        class="card-surface px-4 py-3 text-sm font-medium text-ink-muted transition-colors hover:text-ember-500 hover:border-ember-500/40"
                    >
                        {{ $label }}
                    </a>
                @endforeach
            </div>
        </div>

        {{-- Bottom CTA --}}
        <div class="border-t border-surface-border px-5 py-5">
            <a
                href="{{ route('contact') }}"
                @click="open = false"
                class="flex w-full items-center justify-center gap-2 rounded-full bg-ember-500 px-6 py-3.5 text-sm font-semibold text-white shadow-ember transition-all hover:bg-ember-600 hover:shadow-lg active:scale-[0.98]"
            >
                Let's Talk
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </a>
        </div>
    </div>
</div>
