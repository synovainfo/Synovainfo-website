@php
    $insights = [
        [
            'id' => 'agentic-ai-architecture',
            'type' => 'Whitepaper',
            'category' => 'Artificial Intelligence',
            'title' => 'Architecting Agentic AI Workflows in High-Compliance Enterprise Infrastructure',
            'description' => 'A technical blueprint on deploying LLMs, retrieval-augmented generation (RAG), and autonomous agent networks with zero data leakage. Discover how we built an inference pipeline capable of sub-50ms responses behind strict corporate firewalls.',
            'date' => 'July 2026',
            'readTime' => '12 min read',
            'actionText' => 'Download Whitepaper (PDF)',
            'image' => 'images/blog/blog-featured-1.png',
            'alt' => 'Agentic AI architecture blueprint visualization',
            'featured' => true,
        ],
        [
            'id' => 'cloud-native-resilience',
            'type' => 'Benchmark Report',
            'category' => 'Cloud Engineering',
            'title' => '2026 Enterprise Multi-Cloud Resilience & SLO Benchmark Report',
            'description' => 'Analysis of 150+ Fortune 500 Kubernetes clusters evaluating active-active failover, service mesh security, and disaster recovery SLA metrics.',
            'date' => 'June 2026',
            'readTime' => '15 min read',
            'actionText' => 'Download Report (PDF)',
            'image' => 'images/blog/blog-featured-2.png',
            'alt' => 'Multi-cloud resilience benchmark dashboard',
            'featured' => false,
        ],
        [
            'id' => 'legacy-core-modernization',
            'type' => 'Engineering Article',
            'category' => 'Digital Transformation',
            'title' => 'Strangler Fig Pattern: Zero-Downtime Migration for Core Financial Engines',
            'description' => 'Step-by-step case study on incrementally modernizing 20-year-old COBOL and Java monoliths using Kafka CDC pipelines.',
            'date' => 'May 2026',
            'readTime' => '8 min read',
            'actionText' => 'Read Architecture Article',
            'image' => 'images/blog/blog-featured-3.png',
            'alt' => 'Legacy core modernization pipeline diagram',
            'featured' => false,
        ],
    ];

    $featuredInsight = collect($insights)->firstWhere('featured', true);
    $secondaryInsights = collect($insights)->where('featured', false)->all();

    // In Blade we can pass initialBlogs from controller, but here we define a fallback
    $blogs = $blogs ?? [];
@endphp

<section id="insights" class="py-24 bg-surface-muted">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="mb-16">
            <span class="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 rounded-full">
                Thought Leadership & Research
            </span>
            <h2 class="text-3xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight mb-4">
                Enterprise Insights & Technical Intelligence
            </h2>
            <p class="text-lg text-ink-muted max-w-2xl leading-relaxed">
                Stay ahead with architectural whitepapers, industry benchmarks, and engineering insights authored by Synovainfo principal architects.
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-12">
            <!-- Large Featured Article -->
            @if($featuredInsight)
                <div class="lg:col-span-7 group card-surface card-lift overflow-hidden hover:border-orange-500/30">
                    @if(!empty($featuredInsight['image']))
                        <div class="relative aspect-[16/9] overflow-hidden">
                            <img
                                src="{{ asset($featuredInsight['image']) }}"
                                alt="{{ $featuredInsight['alt'] }}"
                                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                                width="800"
                                height="450"
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-abyss-950/60 to-transparent" aria-hidden="true"></div>
                            <div class="absolute top-5 left-5">
                                <span class="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-orange-500/30">
                                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {{ $featuredInsight['type'] }}
                                </span>
                            </div>
                        </div>
                    @endif

                    <div class="p-8 md:p-12">
                        <div class="flex items-center gap-4 mb-6">
                            <span class="text-[11px] font-bold uppercase tracking-widest text-ink-faint">
                                {{ $featuredInsight['category'] }}
                            </span>
                        </div>

                        <h3 class="text-2xl md:text-4xl font-bold text-ink leading-[1.1] mb-6 group-hover:text-orange-600 transition-colors duration-300">
                            {{ $featuredInsight['title'] }}
                        </h3>

                        <p class="text-base md:text-lg text-ink-muted max-w-2xl leading-relaxed">
                            {{ $featuredInsight['description'] }}
                        </p>

                        <div class="mt-10 flex items-center justify-between border-t border-surface-border pt-6">
                            <div class="flex items-center gap-4">
                                <span class="text-sm font-semibold text-ink-faint">{{ $featuredInsight['date'] }}</span>
                                <span class="h-1 w-1 rounded-full bg-surface-border-strong"></span>
                                <span class="text-sm text-ink-faint flex items-center gap-1.5">
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {{ $featuredInsight['readTime'] }}
                                </span>
                            </div>
                            <a href="/resources" class="hidden md:inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline">
                                {{ $featuredInsight['actionText'] }}
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            @endif

            <!-- Stacked Secondary Articles -->
            <div class="lg:col-span-5 flex flex-col gap-6">
                @foreach($secondaryInsights as $item)
                    <div class="group flex-1 flex flex-col justify-between card-surface card-lift p-6 hover:border-orange-500/30">
                        <div class="flex gap-5">
                            @if(!empty($item['image']))
                                <div class="hidden sm:block shrink-0 overflow-hidden rounded-xl w-24 h-24 border border-surface-border">
                                    <img
                                        src="{{ asset($item['image']) }}"
                                        alt="{{ $item['alt'] }}"
                                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                        width="96"
                                        height="96"
                                    />
                                </div>
                            @endif
                            <div class="min-w-0">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="inline-flex items-center rounded-full bg-orange-50 border border-orange-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-600">
                                        {{ $item['category'] }}
                                    </span>
                                </div>
                                <h3 class="text-lg font-bold text-ink mb-2 group-hover:text-orange-600 transition-colors leading-snug">
                                    {{ $item['title'] }}
                                </h3>
                                <p class="text-sm text-ink-muted leading-relaxed line-clamp-3">
                                    {{ $item['description'] }}
                                </p>
                            </div>
                        </div>

                        <div class="mt-6 pt-4 border-t border-surface-border flex items-center justify-between">
                            <span class="text-xs font-medium text-ink-faint">{{ $item['date'] }} · {{ $item['readTime'] }}</span>
                            <a href="/resources" class="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline">
                                Read
                                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
</section>
