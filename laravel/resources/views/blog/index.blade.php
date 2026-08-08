<x-app-layout>
    <x-slot name="title">Insights</x-slot>
    <x-slot name="description">Architectural whitepapers, industry benchmarks, and engineering insights from Synovainfo principal architects on cloud, AI, security, and transformation.</x-slot>

    <x-sections.command-band
        eyebrow="SYNOVAINFO // THOUGHT LEADERSHIP"
        title="Engineering the Future of Enterprise Tech"
        subtitle="Perspectives on cloud architecture, AI, security, and digital transformation from Synovainfo's principal architects."
        accent="insights-and-research"
    />

    <section id="blog" class="bg-canvas py-20 min-h-screen">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            <!-- Category Filter -->
            @if($categories->count() > 0)
                <div class="flex flex-wrap justify-center gap-2 mb-12 reveal">
                    <a
                        href="{{ route('blog.index') }}"
                        class="eyebrow px-5 py-2.5 rounded-full transition-all duration-300 {{ !request('category') ? 'bg-ember-500 text-white shadow-ember' : 'border border-surface-border bg-surface text-ink-muted hover:text-ink hover:border-ember-500/50' }}"
                    >
                        All
                    </a>
                    @foreach($categories as $cat)
                        <a
                            href="{{ route('blog.index', ['category' => $cat->slug]) }}"
                            class="eyebrow px-5 py-2.5 rounded-full transition-all duration-300 {{ request('category') === $cat->slug ? 'bg-ember-500 text-white shadow-ember' : 'border border-surface-border bg-surface text-ink-muted hover:text-ink hover:border-ember-500/50' }}"
                        >
                            {{ $cat->name }}
                        </a>
                    @endforeach
                </div>
            @endif

            @if($posts->count() === 0)
                <div class="text-center py-24 reveal">
                    <p class="text-2xl font-display font-bold text-abyss-900/40 mb-4">No insights published yet.</p>
                    <p class="text-abyss-900/50">Check back soon — our architects are drafting new perspectives.</p>
                </div>
            @else
                <!-- Featured Post -->
                @if(!request('category') && $posts->onFirstPage())
                    <article class="mb-16 group overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-sm transition-all hover:border-ember-500/40 hover:shadow-xl card-lift reveal">
                        <a href="{{ route('blog.show', $posts->first()->slug) }}" class="block lg:grid lg:grid-cols-2">
                            <div class="relative min-h-[280px] bg-abyss-900 overflow-hidden">
                                @if($posts->first()->featured_image)
                                    <img src="{{ asset($posts->first()->featured_image) }}" alt="{{ $posts->first()->title }}" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                @else
                                    <div class="absolute inset-0 bg-gradient-to-br from-ember-500/20 via-transparent to-transparent"></div>
                                    <div class="absolute inset-0 bg-grid opacity-30"></div>
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <svg class="w-16 h-16 text-ember-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                @endif
                                <span class="absolute top-5 left-5 inline-block rounded-full bg-ember-500 px-3 py-1 eyebrow text-white">
                                    Featured
                                </span>
                            </div>
                            <div class="p-8 md:p-12 flex flex-col justify-center">
                                <div class="flex items-center gap-3 mb-4">
                                    @if($posts->first()->category)
                                        <span class="inline-flex items-center rounded-full bg-ember-50 border border-ember-500/20 px-3 py-1 eyebrow text-ember-600">
                                            {{ $posts->first()->category->name }}
                                        </span>
                                    @endif
                                    <span class="text-xs text-abyss-900/50 font-mono">
                                        {{ $posts->first()->published_at?->format('M j, Y') }}
                                    </span>
                                </div>
                                <h3 class="text-2xl md:text-3xl font-display font-extrabold text-abyss-900 leading-tight mb-4 group-hover:text-ember-600 transition-colors">
                                    {{ $posts->first()->title }}
                                </h3>
                                <p class="text-abyss-900/60 leading-relaxed mb-6">
                                    {{ $posts->first()->excerpt }}
                                </p>
                                <div class="flex items-center gap-3">
                                    @if($posts->first()->author)
                                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-abyss-900 text-white text-xs font-bold">
                                            {{ collect(explode(' ', $posts->first()->author->name))->map(fn($w) => strtoupper(substr($w, 0, 1)))->take(2)->join('') }}
                                        </div>
                                        <span class="text-sm font-semibold text-abyss-900/80">{{ $posts->first()->author->name }}</span>
                                    @endif
                                    <span class="ml-auto inline-flex items-center gap-2 text-sm font-bold text-ember-600">
                                        Read Article
                                        <svg class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </a>
                    </article>
                @endif

                <!-- Post Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    @foreach($posts as $idx => $post)
                        @if(!request('category') && $posts->onFirstPage() && $idx === 0)
                            @continue
                        @endif
                        <article class="group flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-sm transition-all duration-300 hover:border-ember-500/40 hover:shadow-xl card-lift reveal">
                            <a href="{{ route('blog.show', $post->slug) }}" class="flex flex-col h-full">
                                <div class="relative h-48 bg-abyss-900 overflow-hidden">
                                    @if($post->featured_image)
                                        <img src="{{ asset($post->featured_image) }}" alt="{{ $post->title }}" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                    @else
                                        <div class="absolute inset-0 bg-gradient-to-br from-ember-500/15 via-transparent to-transparent"></div>
                                        <div class="absolute inset-0 bg-grid opacity-25"></div>
                                    @endif
                                </div>
                                <div class="p-6 flex flex-col flex-1">
                                    <div class="flex items-center gap-3 mb-3">
                                        @if($post->category)
                                            <span class="inline-flex items-center rounded-full bg-ember-50 border border-ember-500/20 px-2.5 py-0.5 eyebrow text-ember-600">
                                                {{ $post->category->name }}
                                            </span>
                                        @endif
                                        <span class="text-[11px] text-abyss-900/50 font-mono">
                                            {{ $post->published_at?->format('M j, Y') }}
                                        </span>
                                    </div>
                                    <h3 class="text-lg font-display font-bold text-abyss-900 leading-snug mb-2 group-hover:text-ember-600 transition-colors">
                                        {{ $post->title }}
                                    </h3>
                                    <p class="text-sm text-abyss-900/60 leading-relaxed mb-4 line-clamp-3">
                                        {{ $post->excerpt }}
                                    </p>
                                    <div class="mt-auto flex items-center justify-between pt-4 border-t border-abyss-900/10">
                                        @if($post->author)
                                            <span class="text-xs font-semibold text-abyss-900/50">{{ $post->author->name }}</span>
                                        @endif
                                        <span class="text-xs font-bold text-ember-600 inline-flex items-center gap-1">
                                            Read
                                            <svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </article>
                    @endforeach
                </div>

                <!-- Pagination -->
                @if($posts->hasPages())
                    <div class="mt-16 flex justify-center">
                        {{ $posts->links() }}
                    </div>
                @endif
            @endif
        </div>
    </section>
</x-app-layout>
