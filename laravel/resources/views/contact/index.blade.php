<x-app-layout>
    <x-slot name="title">Contact Us</x-slot>
    <x-slot name="description">Talk to Synovainfo's enterprise architecture team about your next strategic initiative. Offices in Pune, India. We respond within 24 business hours.</x-slot>

    <x-sections.command-band
        eyebrow="SYNOVAINFO // CONTACT"
        title="Ready to Transform Your Enterprise"
        subtitle="Get in touch with our architecture team to discuss your next strategic initiative."
        accent="enterprise-consultation"
    />

    <section id="contact" class="bg-canvas py-20 min-h-screen">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            <div class="grid gap-12 lg:grid-cols-5 lg:gap-16">
                <!-- Left Column: Form (3/5) -->
                <div class="lg:col-span-3">
                    <div class="rounded-3xl border border-surface-border bg-surface p-6 shadow-sm sm:p-10 reveal">
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

                        <form action="{{ route('contact.submit') }}" method="POST" class="space-y-6">
                            @csrf
                            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label for="first_name" class="block eyebrow text-abyss-900/60 mb-2">First Name *</label>
                                    <input type="text" name="first_name" id="first_name" value="{{ old('first_name') }}" required class="mt-1 block w-full rounded-xl border-abyss-900/15 shadow-sm focus:border-ember-500 focus:ring-ember-500 sm:text-sm px-4 py-3 bg-surface-muted border focus:bg-surface-raised">
                                </div>
                                <div>
                                    <label for="last_name" class="block eyebrow text-abyss-900/60 mb-2">Last Name *</label>
                                    <input type="text" name="last_name" id="last_name" value="{{ old('last_name') }}" required class="mt-1 block w-full rounded-xl border-abyss-900/15 shadow-sm focus:border-ember-500 focus:ring-ember-500 sm:text-sm px-4 py-3 bg-surface-muted border focus:bg-surface-raised">
                                </div>
                            </div>

                            <div>
                                <label for="email" class="block eyebrow text-abyss-900/60 mb-2">Work Email *</label>
                                <input type="email" name="email" id="email" value="{{ old('email') }}" required class="mt-1 block w-full rounded-xl border-abyss-900/15 shadow-sm focus:border-ember-500 focus:ring-ember-500 sm:text-sm px-4 py-3 bg-surface-muted border focus:bg-surface-raised">
                            </div>

                            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label for="company" class="block eyebrow text-abyss-900/60 mb-2">Company (Optional)</label>
                                    <input type="text" name="company" id="company" value="{{ old('company') }}" class="mt-1 block w-full rounded-xl border-abyss-900/15 shadow-sm focus:border-ember-500 focus:ring-ember-500 sm:text-sm px-4 py-3 bg-surface-muted border focus:bg-surface-raised">
                                </div>
                                <div>
                                    <label for="phone" class="block eyebrow text-abyss-900/60 mb-2">Phone (Optional)</label>
                                    <input type="tel" name="phone" id="phone" value="{{ old('phone') }}" class="mt-1 block w-full rounded-xl border-abyss-900/15 shadow-sm focus:border-ember-500 focus:ring-ember-500 sm:text-sm px-4 py-3 bg-surface-muted border focus:bg-surface-raised">
                                </div>
                            </div>

                            <div>
                                <label for="subject" class="block eyebrow text-abyss-900/60 mb-2">Subject *</label>
                                <input type="text" name="subject" id="subject" value="{{ old('subject', request('subject')) }}" required class="mt-1 block w-full rounded-xl border-abyss-900/15 shadow-sm focus:border-ember-500 focus:ring-ember-500 sm:text-sm px-4 py-3 bg-surface-muted border focus:bg-surface-raised">
                            </div>

                            <div>
                                <label for="message" class="block eyebrow text-abyss-900/60 mb-2">Message *</label>
                                <textarea id="message" name="message" rows="5" required class="mt-1 block w-full rounded-xl border-abyss-900/15 shadow-sm focus:border-ember-500 focus:ring-ember-500 sm:text-sm px-4 py-3 bg-surface-muted border focus:bg-surface-raised">{{ old('message') }}</textarea>
                            </div>

                            <button type="submit" class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-ember-500 hover:bg-ember-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ember-500 transition-all hover:-translate-y-0.5 shadow-ember eyebrow tracking-widest">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Right Column: Company Info -->
                <div class="lg:col-span-2">
                    <div class="space-y-4">
                        <a href="https://maps.google.com/?q=Trish+Manor+Kondhwa+Pune" target="_blank" rel="noopener" class="block group relative rounded-2xl border border-surface-border bg-surface p-6 shadow-sm transition-all duration-300 hover:border-ember-500/40 hover:shadow-lg card-lift">
                            <div class="relative z-10 flex items-start gap-4">
                                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember-50 text-ember-600 transition-colors duration-300 group-hover:bg-ember-100 group-hover:text-ember-700">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="mb-1 eyebrow text-abyss-900/40">Office Address</p>
                                    <p class="text-sm leading-relaxed text-abyss-900/80">Fl-24, Trish Manor, Kondhwa Kd, nr Kausar Baug, Pune, Maharashtra 411048, India</p>
                                </div>
                            </div>
                        </a>

                        <a href="mailto:contact@synovainfo.com" class="block group relative rounded-2xl border border-surface-border bg-surface p-6 shadow-sm transition-all duration-300 hover:border-ember-500/40 hover:shadow-lg card-lift">
                            <div class="relative z-10 flex items-start gap-4">
                                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember-50 text-ember-600 transition-colors duration-300 group-hover:bg-ember-100 group-hover:text-ember-700">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="mb-1 eyebrow text-abyss-900/40">Email Us</p>
                                    <p class="text-sm leading-relaxed text-abyss-900/80 font-mono">contact@synovainfo.com</p>
                                </div>
                            </div>
                        </a>

                        <a href="tel:+9102026831122" class="block group relative rounded-2xl border border-surface-border bg-surface p-6 shadow-sm transition-all duration-300 hover:border-ember-500/40 hover:shadow-lg card-lift">
                            <div class="relative z-10 flex items-start gap-4">
                                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember-50 text-ember-600 transition-colors duration-300 group-hover:bg-ember-100 group-hover:text-ember-700">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="mb-1 eyebrow text-abyss-900/40">Call Us</p>
                                    <p class="text-sm leading-relaxed text-abyss-900/80">+91 (020) 2683-1122</p>
                                </div>
                            </div>
                        </a>
                    </div>

                    <p class="mt-6 text-center text-xs text-abyss-900/40 font-mono">
                        // we typically respond within 24 business hours
                    </p>
                </div>
            </div>
        </div>
    </section>
</x-app-layout>
