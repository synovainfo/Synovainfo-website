<x-app-layout>
    <x-slot name="title">{{ $career->title }}</x-slot>

    @php
        $type = is_object($career->type) ? $career->type->value : $career->type;
        $typeLabel = match (strtoupper($type ?? 'FULL_TIME')) {
            'PART_TIME' => 'Part Time',
            'CONTRACT' => 'Contract',
            'REMOTE' => 'Remote',
            default => 'Full Time',
        };
        $requirements = is_array($career->requirements) ? $career->requirements : [];
        $benefits = is_array($career->benefits) ? $career->benefits : [];
    @endphp

    <x-sections.command-band
        eyebrow="SYNOVAINFOTECH // CAREERS"
        :title="$career->title"
        :subtitle="$career->department ? $career->department . ' · ' . ($career->location ?? 'Pune / Remote') : null"
        accent="open-architecture-role"
    />

    <section id="career-detail" class="bg-canvas min-h-screen py-16 md:py-20">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <!-- Left: Job Details -->
                <div class="lg:col-span-2">
                    <!-- Header Card -->
                    <div class="rounded-3xl border border-surface-border bg-surface p-8 md:p-10 shadow-sm mb-8 reveal">
                        <div class="flex flex-wrap items-start justify-between gap-6 mb-6">
                            <div>
                                <span class="inline-flex items-center rounded-full bg-ember-50 border border-ember-500/20 px-3 py-1 eyebrow text-ember-600 mb-4">
                                    {{ $career->department ?? 'Engineering' }}
                                </span>
                                <h1 class="font-display text-3xl md:text-4xl font-extrabold text-abyss-900 tracking-tight leading-tight">
                                    {{ $career->title }}
                                </h1>
                            </div>
                            <span class="inline-block rounded-full bg-abyss-900 px-4 py-2 eyebrow text-white uppercase">
                                {{ $typeLabel }}
                            </span>
                        </div>

                        <div class="flex flex-wrap gap-6 border-y border-abyss-900/10 py-4 mb-6 text-sm text-abyss-900/60">
                            <span class="flex items-center gap-2">
                                <svg class="h-4 w-4 text-ember-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {{ $career->location ?? 'Pune / Remote' }}
                            </span>
                            @if($career->salary_min || $career->salary_max)
                                <span class="flex items-center gap-2 font-semibold text-abyss-900">
                                    <svg class="h-4 w-4 text-ember-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {{ $career->salary_min ? '$'.number_format($career->salary_min) : '' }}{{ $career->salary_min && $career->salary_max ? ' – ' : '' }}{{ $career->salary_max ? '$'.number_format($career->salary_max) : '' }}
                                </span>
                            @endif
                        </div>

                        <div class="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-abyss-900 prose-p:text-abyss-900/75 prose-p:leading-relaxed prose-li:text-abyss-900/75">
                            {!! $career->description ?? '<p>Join Synova Infotech and help us engineer the enterprise technology ecosystem of tomorrow.</p>' !!}
                        </div>
                    </div>

                    <!-- Requirements -->
                    @if(count($requirements) > 0)
                        <div class="rounded-3xl border border-surface-border bg-surface p-8 md:p-10 shadow-sm mb-8 reveal">
                            <h2 class="font-display text-2xl font-extrabold text-abyss-900 mb-6 flex items-center gap-3">
                                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-50 text-ember-600">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </span>
                                Requirements
                            </h2>
                            <ul class="space-y-4">
                                @foreach($requirements as $req)
                                    <li class="flex items-start gap-3 text-abyss-900/70 leading-relaxed">
                                        <svg class="h-5 w-5 text-ember-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{{ $req }}</span>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <!-- Benefits -->
                    @if(count($benefits) > 0)
                        <div class="rounded-3xl border border-surface-border bg-surface p-8 md:p-10 shadow-sm reveal">
                            <h2 class="font-display text-2xl font-extrabold text-abyss-900 mb-6 flex items-center gap-3">
                                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-50 text-ember-600">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                    </svg>
                                </span>
                                Benefits &amp; Perks
                            </h2>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                @foreach($benefits as $benefit)
                                    <div class="flex items-center gap-3 rounded-xl border border-abyss-900/10 bg-canvas px-4 py-3">
                                        <span class="h-2 w-2 rounded-full bg-ember-500 shrink-0"></span>
                                        <span class="text-sm font-medium text-abyss-900/70">{{ $benefit }}</span>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>

                <!-- Right: Apply Form -->
                <div class="lg:col-span-1">
                    <div class="sticky top-28 rounded-3xl border border-surface-border bg-surface p-8 shadow-sm reveal">
                        <h2 class="font-display text-xl font-extrabold text-abyss-900 mb-2">Apply for this Role</h2>
                        <p class="text-sm text-abyss-900/50 mb-6">Submit your application and our talent team will reach out.</p>

                        @if(session('success'))
                            <div class="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                                {{ session('success') }}
                            </div>
                        @endif

                        @if($errors->any())
                            <div class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                <ul class="list-disc pl-4 space-y-1">
                                    @foreach($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        <form action="{{ route('careers.apply', $career->slug) }}" method="POST" enctype="multipart/form-data" class="space-y-5">
                            @csrf
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label for="first_name" class="block eyebrow text-abyss-900/60 mb-1.5">First Name *</label>
                                    <input type="text" name="first_name" id="first_name" value="{{ old('first_name') }}" required class="w-full rounded-lg border border-abyss-900/15 bg-surface-muted px-4 py-2.5 text-sm focus:border-ember-500 focus:ring-ember-500 focus:bg-surface-raised transition-colors">
                                </div>
                                <div>
                                    <label for="last_name" class="block eyebrow text-abyss-900/60 mb-1.5">Last Name *</label>
                                    <input type="text" name="last_name" id="last_name" value="{{ old('last_name') }}" required class="w-full rounded-lg border border-abyss-900/15 bg-surface-muted px-4 py-2.5 text-sm focus:border-ember-500 focus:ring-ember-500 focus:bg-surface-raised transition-colors">
                                </div>
                            </div>

                            <div>
                                <label for="email" class="block eyebrow text-abyss-900/60 mb-1.5">Email *</label>
                                <input type="email" name="email" id="email" value="{{ old('email') }}" required class="w-full rounded-lg border border-abyss-900/15 bg-surface-muted px-4 py-2.5 text-sm focus:border-ember-500 focus:ring-ember-500 focus:bg-surface-raised transition-colors">
                            </div>

                            <div>
                                <label for="phone" class="block eyebrow text-abyss-900/60 mb-1.5">Phone</label>
                                <input type="tel" name="phone" id="phone" value="{{ old('phone') }}" class="w-full rounded-lg border border-abyss-900/15 bg-surface-muted px-4 py-2.5 text-sm focus:border-ember-500 focus:ring-ember-500 focus:bg-surface-raised transition-colors">
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label for="linkedin" class="block eyebrow text-abyss-900/60 mb-1.5">LinkedIn</label>
                                    <input type="url" name="linkedin" id="linkedin" value="{{ old('linkedin') }}" class="w-full rounded-lg border border-abyss-900/15 bg-surface-muted px-4 py-2.5 text-sm focus:border-ember-500 focus:ring-ember-500 focus:bg-surface-raised transition-colors">
                                </div>
                                <div>
                                    <label for="portfolio" class="block eyebrow text-abyss-900/60 mb-1.5">Portfolio</label>
                                    <input type="url" name="portfolio" id="portfolio" value="{{ old('portfolio') }}" class="w-full rounded-lg border border-abyss-900/15 bg-surface-muted px-4 py-2.5 text-sm focus:border-ember-500 focus:ring-ember-500 focus:bg-surface-raised transition-colors">
                                </div>
                            </div>

                            <div>
                                <label for="resume" class="block eyebrow text-abyss-900/60 mb-1.5">Resume (PDF/DOC) *</label>
                                <input type="file" name="resume" id="resume" accept=".pdf,.doc,.docx" required class="w-full rounded-lg border border-abyss-900/15 bg-canvas px-4 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-ember-500 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-ember-600 transition-colors">
                            </div>

                            <div>
                                <label for="cover_letter" class="block eyebrow text-abyss-900/60 mb-1.5">Cover Letter</label>
                                <textarea name="cover_letter" id="cover_letter" rows="4" class="w-full rounded-lg border border-abyss-900/15 bg-surface-muted px-4 py-2.5 text-sm focus:border-ember-500 focus:ring-ember-500 focus:bg-surface-raised transition-colors">{{ old('cover_letter') }}</textarea>
                            </div>

                            <button type="submit" class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ember-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-ember-600 transition-all shadow-ember hover:-translate-y-0.5">
                                Submit Application
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</x-app-layout>
