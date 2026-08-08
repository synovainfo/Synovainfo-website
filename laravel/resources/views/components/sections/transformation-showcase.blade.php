<section id="transformation-showcase" class="relative w-full overflow-hidden bg-slate-900 py-20 md:py-28">
    <!-- Muted looping background video -->
    <div class="absolute inset-0 z-0">
        <video
            autoplay
            muted
            loop
            playsinline
            preload="none"
            aria-hidden="true"
            class="h-full w-full object-cover opacity-40"
        >
            <source src="{{ asset('images/home/video-server-ai.mp4') }}" type="video/mp4" />
        </video>
        <!-- Dark navy gradient overlay keeps copy readable -->
        <div class="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/85 to-slate-950"></div>
    </div>

    <div class="relative z-10 container mx-auto px-6 lg:px-12 max-w-7xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Left Column: Content -->
            <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-white/10 bg-white/5">
                    <span class="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
                    <span class="text-xs font-semibold uppercase tracking-wider text-orange-500">
                        Chapter 1: Digital Transformation Architecture
                    </span>
                </div>

                <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6 font-outfit">
                    Engineer the <br />
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                        Impossible.
                    </span>
                </h2>

                <p class="text-lg md:text-xl text-slate-300 max-w-xl font-medium leading-relaxed mb-8">
                    We deconstruct monolithic legacy systems and architect hyper-scalable, AI-native multi-cloud ecosystems that define the next era of enterprise computing.
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div class="flex flex-col gap-2 p-4 rounded-xl border border-white/10 bg-white/[0.04] hover:border-orange-500/50 transition-colors">
                        <svg class="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span class="text-sm font-semibold text-white">Event-Driven Mesh</span>
                        <span class="text-xs text-slate-400">Zero downtime microservices.</span>
                    </div>
                    <div class="flex flex-col gap-2 p-4 rounded-xl border border-white/10 bg-white/[0.04] hover:border-orange-500/50 transition-colors">
                        <svg class="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span class="text-sm font-semibold text-white">Agentic AI Layer</span>
                        <span class="text-xs text-slate-400">Sub-50ms vector inference.</span>
                    </div>
                    <div class="flex flex-col gap-2 p-4 rounded-xl border border-white/10 bg-white/[0.04] hover:border-orange-500/50 transition-colors">
                        <svg class="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span class="text-sm font-semibold text-white">Zero-Trust Security</span>
                        <span class="text-xs text-slate-400">mTLS encrypted topologies.</span>
                    </div>
                </div>

                <a
                    href="#contact"
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 active:scale-95"
                >
                    Architect Your Future
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </div>

            <!-- Right Column: Architectural Blueprint Graphic -->
            <div class="relative">
                <div class="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-800 p-2 shadow-2xl">
                    <img
                        src="{{ asset('images/home/architecture-blueprint.svg') }}"
                        alt="Synovainfo Enterprise Architecture Blueprint"
                        width="800"
                        height="500"
                        class="w-full h-auto rounded-xl object-cover"
                        loading="lazy"
                    />
                    <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-black/70 px-4 py-2 text-xs font-semibold text-orange-500 border border-white/10">
                        <span>LIVE SYSTEM TOPOLOGY</span>
                        <span class="flex items-center gap-1.5 text-orange-500">
                            <span class="h-2 w-2 rounded-full bg-orange-500 animate-ping"></span>
                            100% OPERATIONAL
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
