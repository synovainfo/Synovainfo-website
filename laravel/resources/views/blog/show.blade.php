<x-app-layout>
    <x-slot name="title">{{ $post->seo_title ?? $post->title }}</x-slot>

    @php
        $words = collect(explode(' ', $post->author->name ?? 'Synovainfo'))->map(fn($w) => strtoupper(substr($w, 0, 1)))->take(2)->join('');
    @endphp

    <article class="bg-canvas min-h-screen">
        <!-- Command band -->
        <section class="relative overflow-hidden bg-abyss-900 text-white">
            <div class="absolute inset-0 bg-grid opacity-60" aria-hidden="true"></div>
            <div class="absolute -right-20 -top-20 h-96 w-96 rounded-full opacity-30 pointer-events-none"
                style="background: radial-gradient(circle, rgba(249,115,22,0.35) 0%, transparent 65%);" aria-hidden="true"></div>
            <div class="relative max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-12 md:pt-28 md:pb-16">
                <nav class="mb-8" aria-label="Breadcrumb">
                    <ol class="flex items-center gap-2 text-sm">
                        <li><a href="{{ route('home') }}" class="text-white/50 hover:text-ember-400 transition-colors">Home</a></li>
                        <li aria-hidden="true" class="text-white/30">/</li>
                        <li><a href="{{ route('blog.index') }}" class="text-white/50 hover:text-ember-400 transition-colors">Insights</a></li>
                        <li aria-hidden="true" class="text-white/30">/</li>
                        <li class="text-white/80 truncate max-w-[240px]" aria-current="page">{{ $post->title }}</li>
                    </ol>
                </nav>
                <p class="eyebrow text-ember-400 mb-5 reveal">SYNOVAINFO // ENTERPRISE INSIGHTS</p>
                <h1 class="font-display font-extrabold tracking-tight text-[clamp(1.7rem,4vw,3rem)] leading-[1.1] text-white max-w-4xl reveal">
                    {{ $post->title }}<span class="text-ember-500">.</span>
                </h1>
                <div class="mt-8 flex flex-wrap items-center gap-4 reveal">
                    @if($post->author)
                        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-ember-500 text-white text-sm font-bold">
                            {{ $words }}
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-white">{{ $post->author->name }}</p>
                            <p class="text-xs text-white/50 font-mono">{{ $post->published_at?->format('F j, Y') }}</p>
                        </div>
                    @endif
                    @if($post->category)
                        <span class="ml-auto inline-flex items-center rounded-full border border-ember-500/40 bg-ember-500/10 px-4 py-1.5 eyebrow text-ember-400">
                            {{ $post->category->name }}
                        </span>
                    @endif
                </div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                style="background: linear-gradient(to top, #f6f8fb 0%, transparent 100%);" aria-hidden="true"></div>
        </section>

        @if($post->featured_image)
            <div class="max-w-5xl mx-auto px-6 lg:px-12 -mt-8 mb-12 relative z-10 reveal">
                <img src="{{ asset($post->featured_image) }}" alt="{{ $post->title }}" class="w-full rounded-3xl border border-abyss-900/10 shadow-xl object-cover max-h-[480px]" loading="lazy">
            </div>
        @endif

        <!-- Post Body -->
        <div class="max-w-3xl mx-auto px-6 lg:px-12 pb-16">
            <div class="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-abyss-900 prose-h2:mt-12 prose-h3:mt-8 prose-p:leading-relaxed prose-p:text-abyss-900/75 prose-a:text-ember-600 prose-a:font-semibold prose-img:rounded-2xl prose-pre:bg-abyss-900 prose-pre:rounded-xl prose-blockquote:border-ember-500 prose-blockquote:text-abyss-900/60 prose-strong:text-abyss-900">
                {!! $post->content !!}
            </div>

            <!-- Tags -->
            @if($post->tags->count() > 0)
                <div class="mt-12 pt-8 border-t border-abyss-900/10 flex flex-wrap gap-2">
                    @foreach($post->tags as $tag)
                        <span class="rounded-full bg-surface border border-surface-border px-3 py-1 text-xs font-semibold text-ink-muted font-mono">
                            #{{ $tag->name }}
                        </span>
                    @endforeach
                </div>
            @endif

            <!-- CTA -->
            <div class="relative overflow-hidden mt-14 rounded-3xl bg-abyss-900 p-10 text-center reveal">
                <div class="absolute inset-0 bg-grid opacity-40" aria-hidden="true"></div>
                <div class="relative">
                    <h3 class="font-display text-2xl font-extrabold text-white mb-3">Ready to Engineer Your Enterprise Advantage?</h3>
                    <p class="text-white/50 mb-8 max-w-xl mx-auto">Talk to our architects about how Synovainfo's platform engineering can accelerate your digital transformation.</p>
                    <a href="{{ route('contact') }}" class="inline-flex items-center gap-2 rounded-full bg-ember-500 px-8 py-3.5 text-sm font-bold text-white hover:bg-ember-600 transition-all shadow-ember hover:-translate-y-0.5">
                        Start the Conversation
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>

            <!-- Back -->
            <div class="mt-10 text-center">
                <a href="{{ route('blog.index') }}" class="inline-flex items-center gap-2 text-sm font-semibold text-abyss-900/50 hover:text-ember-600 transition-colors">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to all insights
                </a>
            </div>
        </div>
    </article>
</x-app-layout>
