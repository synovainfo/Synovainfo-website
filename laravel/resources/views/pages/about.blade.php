<x-app-layout>
    <x-slot name="title">{{ $seo['title'] ?? 'About Us' }}</x-slot>
    <x-slot name="description">{{ $seo['description'] ?? 'Synova Infotech Infotech is a premier enterprise technology consultancy specializing in large-scale digital transformation and AI-driven capability realization for global enterprises.' }}</x-slot>
    @if(!empty($seo['keywords']))
        <x-slot name="keywords">{{ $seo['keywords'] }}</x-slot>
    @endif
    @if(!empty($seo['ogImage']))
        <x-slot name="ogImage">{{ $seo['ogImage'] }}</x-slot>
    @endif

    @push('jsonld')
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": "{{ url('/about') }}#webpage",
        "url": "{{ url('/about') }}",
        "name": "About Synova Infotech Infotech",
        "isPartOf": { "@id": "{{ url('/') }}#website" },
        "about": { "@id": "{{ url('/') }}#organization" },
        "inLanguage": "en"
    }
    </script>
    @endpush

    @php
        $content = [
            'badge' => 'About Synova Infotech Infotech',
            'title' => 'Orchestrating Digital Paradigms',
            'subtitle' => 'We are a consortium of strategic visionaries and enterprise architects dedicated to orchestrating digital transformations that drive sustainable growth, mitigate systemic risk, and redefine industry paradigms.',
            'whoWeAre' => 'Synova Infotech Infotech is a premier enterprise technology consultancy specializing in massive-scale digital transformation, custom ecosystem development, and AI-driven capability realization. Founded by industry veterans with deep expertise in global architecture, our team brings together decades of collective experience delivering mission-critical outcomes across Fortune 500 environments.',
            'vision' => 'To be the definitive strategic technology partner for global enterprises — orchestrating synergistic solutions that unlock shareholder value and create measurable, sustainable market dominance.',
            'mission' => 'Empower organizations with enterprise-grade software paradigms that combine cutting-edge agility with uncompromising architectural governance, enabling them to achieve operational excellence and hyper-scalability.',
            'incorporated' => '30 June 2026',
            'headquarters' => 'Pune, India',
            'directors' => 'Amir Khaja Baig · Tazeen Shahnawaz Shaikh · Sachin Nikam',
        ];
    @endphp

    <section id="about" class="py-24 bg-slate-50 min-h-screen">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            <!-- Header -->
            <div class="mb-16 text-center">
                <span class="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-orange-600 bg-orange-100 border border-orange-500/30 rounded-full">
                    {{ $content['badge'] }}
                </span>
                <h2 class="mx-auto mb-6 max-w-3xl text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    @php
                        $words = explode(' ', trim($content['title']));
                        $lastWord = array_pop($words);
                        $rest = implode(' ', $words);
                    @endphp
                    {{ $rest }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">{{ $lastWord }}</span>
                </h2>
                <p class="mx-auto max-w-2xl text-lg md:text-xl leading-relaxed text-slate-600">
                    {{ $content['subtitle'] }}
                </p>
            </div>

            <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <!-- Left column: content -->
                <div class="space-y-12">
                    <!-- Who We Are -->
                    <div>
                        <h3 class="mb-4 border-l-4 border-orange-500 pl-4 text-2xl font-bold text-slate-900">
                            Who We Are
                        </h3>
                        <p class="text-lg leading-relaxed text-slate-600">
                            {{ $content['whoWeAre'] }}
                        </p>
                    </div>

                    <!-- Company details — white stat cards -->
                    <div class="grid grid-cols-2 gap-6 rounded-2xl border border-surface-border bg-surface p-8 shadow-sm">
                        <div>
                            <span class="text-xs font-bold uppercase tracking-widest text-orange-600">
                                Incorporated
                            </span>
                            <p class="mt-2 text-xl font-black text-slate-900">
                                {{ $content['incorporated'] }}
                            </p>
                        </div>
                        <div>
                            <span class="text-xs font-bold uppercase tracking-widest text-orange-600">
                                Headquarters
                            </span>
                            <p class="mt-2 text-xl font-black text-slate-900">
                                {{ $content['headquarters'] }}
                            </p>
                        </div>
                        <div class="col-span-2 pt-4 border-t border-slate-100">
                            <span class="text-xs font-bold uppercase tracking-widest text-orange-600">
                                Directors
                            </span>
                            <p class="mt-2 text-xl font-black text-slate-900">
                                {{ $content['directors'] }}
                            </p>
                        </div>
                    </div>

                    <!-- Vision & Mission -->
                    <div class="grid gap-8 sm:grid-cols-2">
                        <div class="bg-surface p-6 rounded-2xl border border-surface-border shadow-sm">
                            <div class="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-6 text-orange-600">
                                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h4 class="mb-3 text-xl font-bold text-slate-900">
                                Our Vision
                            </h4>
                            <p class="text-slate-600 leading-relaxed">
                                {{ $content['vision'] }}
                            </p>
                        </div>

                        <div class="bg-surface p-6 rounded-2xl border border-surface-border shadow-sm">
                            <div class="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-6 text-orange-600">
                                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h4 class="mb-3 text-xl font-bold text-slate-900">
                                Our Mission
                            </h4>
                            <p class="text-slate-600 leading-relaxed">
                                {{ $content['mission'] }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Right column: SVG illustration in clean framed card -->
                <div class="flex items-center justify-center">
                    <div class="relative w-full max-w-lg overflow-hidden rounded-3xl border border-orange-500/20 bg-surface p-8 shadow-2xl">
                        <!-- Orange accent bar -->
                        <div class="absolute inset-x-10 top-0 h-1 rounded-b-full bg-gradient-to-r from-orange-400 to-orange-600" aria-hidden="true"></div>
                        
                        <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-full w-full">
                            <defs>
                                <radialGradient id="bgGlow" cx="50%" cy="50%" r="55%">
                                    <stop offset="0%" stop-color="#f97316" stop-opacity="0.07" />
                                    <stop offset="60%" stop-color="#0f172a" stop-opacity="0.03" />
                                    <stop offset="100%" stop-color="transparent" stop-opacity="0" />
                                </radialGradient>
                                <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stop-color="#f97316" stop-opacity="0.25" />
                                    <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
                                </radialGradient>
                                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stop-color="#0f172a" stop-opacity="0.18" />
                                    <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
                                </radialGradient>
                                <linearGradient id="gradGold" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stop-color="#f97316" />
                                    <stop offset="100%" stop-color="#fb923c" />
                                </linearGradient>
                                <linearGradient id="gradNavy" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stop-color="#0f172a" />
                                    <stop offset="100%" stop-color="#f97316" />
                                </linearGradient>
                                <linearGradient id="gradNavyDark" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stop-color="#020617" />
                                    <stop offset="100%" stop-color="#0f172a" />
                                </linearGradient>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f172a" stroke-opacity="0.04" stroke-width="0.5" />
                                </pattern>
                            </defs>

                            <rect x="0" y="0" width="600" height="500" rx="16" fill="url(#bgGlow)" />
                            <rect x="0" y="0" width="600" height="500" rx="16" fill="url(#grid)" />

                            <!-- Edges -->
                            <g stroke="#0f172a" stroke-opacity="0.25" stroke-width="1.5" stroke-linecap="round" fill="none">
                                <path d="M130 110 Q200 160 300 230" />
                                <path d="M470 85 Q400 150 300 230" />
                                <path d="M300 230 Q220 300 145 370" />
                                <path d="M300 230 Q380 310 455 385" />
                                <path d="M130 110 Q300 30 470 85" />
                                <path d="M145 370 Q300 420 455 385" />
                                <path d="M130 110 L145 370" />
                            </g>

                            <!-- Node Glows -->
                            <circle cx="130" cy="110" r="32.4" fill="url(#nodeGlow)" />
                            <circle cx="470" cy="85" r="28.8" fill="url(#nodeGlow)" />
                            <circle cx="300" cy="230" r="54" fill="url(#hubGlow)" />
                            <circle cx="145" cy="370" r="30.6" fill="url(#nodeGlow)" />
                            <circle cx="455" cy="385" r="27" fill="url(#nodeGlow)" />

                            <!-- Rings -->
                            <circle cx="300" cy="230" r="42" stroke="#f97316" stroke-opacity="0.15" stroke-width="1" fill="none" />
                            <circle cx="300" cy="230" r="52" stroke="#0f172a" stroke-opacity="0.1" stroke-width="0.8" fill="none" />

                            <!-- Nodes -->
                            <g>
                                <circle cx="130" cy="110" r="18" fill="url(#gradGold)" />
                                <circle cx="125.5" cy="105.5" r="6.3" fill="white" fill-opacity="0.25" />
                            </g>
                            <g>
                                <circle cx="470" cy="85" r="16" fill="url(#gradNavyDark)" />
                                <circle cx="466" cy="81" r="5.6" fill="white" fill-opacity="0.25" />
                            </g>
                            <g>
                                <circle cx="300" cy="230" r="30" fill="url(#gradNavy)" />
                                <circle cx="292.5" cy="222.5" r="10.5" fill="white" fill-opacity="0.25" />
                            </g>
                            <g>
                                <circle cx="145" cy="370" r="17" fill="url(#gradGold)" />
                                <circle cx="140.75" cy="365.75" r="5.95" fill="white" fill-opacity="0.25" />
                            </g>
                            <g>
                                <circle cx="455" cy="385" r="15" fill="url(#gradNavyDark)" />
                                <circle cx="451.25" cy="381.25" r="5.25" fill="white" fill-opacity="0.25" />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </section>
</x-app-layout>
