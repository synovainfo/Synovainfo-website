@props([
    'email' => 'contact@synovainfo.com',
    'phone' => '+91 (020) 2683-1122',
    'badge' => 'Contact Us',
    'title' => 'Ready to Transform Your Enterprise?',
    'subtitle' => 'Get in touch with our architecture team to discuss your next strategic initiative.',
    'address' => "Fl-24, Trish Manor, Kondhwa Kd,\nnr Kausar Baug, Pune,\nMaharashtra 411048, India"
])

<section id="contact" class="py-24 bg-surface-muted">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="mb-16 text-center">
            <span class="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 rounded-full">
                {{ $badge }}
            </span>
            <h2 class="text-3xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight mb-4">
                {{ $title }}
            </h2>
            <p class="text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
                {{ $subtitle }}
            </p>
        </div>

        <div class="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <!-- Left Column: Form (3/5) -->
            <div class="lg:col-span-3">
                <div class="card-surface p-6 sm:p-8">
                    <form action="{{ route('contact.submit') }}" method="POST" class="space-y-6">
                        @csrf
                        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label for="first_name" class="block text-sm font-medium text-ink mb-1.5">First Name</label>
                                <input type="text" name="first_name" id="first_name" required class="field-input">
                            </div>
                            <div>
                                <label for="last_name" class="block text-sm font-medium text-ink mb-1.5">Last Name</label>
                                <input type="text" name="last_name" id="last_name" required class="field-input">
                            </div>
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-medium text-ink mb-1.5">Work Email</label>
                            <input type="email" name="email" id="email" required class="field-input">
                        </div>

                        <div>
                            <label for="company" class="block text-sm font-medium text-ink mb-1.5">Company (Optional)</label>
                            <input type="text" name="company" id="company" class="field-input">
                        </div>

                        <div>
                            <label for="subject" class="block text-sm font-medium text-ink mb-1.5">Subject</label>
                            <input type="text" name="subject" id="subject" required class="field-input">
                        </div>

                        <div>
                            <label for="message" class="block text-sm font-medium text-ink mb-1.5">Message</label>
                            <textarea id="message" name="message" rows="4" required class="field-input"></textarea>
                        </div>

                        <button type="submit" class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors uppercase tracking-wider">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

            <!-- Right Column: Company Info + Professional Image (2/5) -->
            <div class="lg:col-span-2">
                <!-- Professional office photography -->
                <div class="relative mb-8 overflow-hidden rounded-2xl border border-surface-border shadow-lg">
                    <img
                        src="{{ asset('images/contact/office-building.webp') }}"
                        alt="Synovainfo Infotech office headquarters in Pune, India"
                        class="h-64 w-full object-cover"
                        loading="lazy"
                        width="640"
                        height="400"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-abyss-950/80 via-transparent to-transparent" aria-hidden="true"></div>
                    <div class="absolute bottom-4 left-4 right-4">
                        <p class="text-xs font-bold uppercase tracking-widest text-orange-400">Pune, India</p>
                        <p class="text-sm font-semibold text-white">Enterprise Technology HQ</p>
                    </div>
                </div>

                <!-- Info Cards -->
                <div class="space-y-4">
                    <!-- Address -->
                    <a href="https://maps.google.com/?q=Trish+Manor+Kondhwa+Pune" target="_blank" class="block group card-surface card-lift p-5 hover:border-orange-500/30">
                        <div class="flex items-start gap-4">
                            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition-colors duration-300 group-hover:bg-orange-100 group-hover:text-orange-700">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-faint">Office Address</p>
                                @foreach(explode("\n", $address) as $line)
                                    <p class="text-sm leading-relaxed text-ink">{{ $line }}</p>
                                @endforeach
                            </div>
                        </div>
                    </a>

                    <!-- Email -->
                    <a href="mailto:{{ $email }}" class="block group card-surface card-lift p-5 hover:border-orange-500/30">
                        <div class="flex items-start gap-4">
                            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition-colors duration-300 group-hover:bg-orange-100 group-hover:text-orange-700">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-faint">Email Us</p>
                                <p class="text-sm leading-relaxed text-ink">{{ $email }}</p>
                            </div>
                        </div>
                    </a>

                    <!-- Phone -->
                    <a href="tel:{{ str_replace(' ', '', $phone) }}" class="block group card-surface card-lift p-5 hover:border-orange-500/30">
                        <div class="flex items-start gap-4">
                            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition-colors duration-300 group-hover:bg-orange-100 group-hover:text-orange-700">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-faint">Call Us</p>
                                <p class="text-sm leading-relaxed text-ink">{{ $phone }}</p>
                            </div>
                        </div>
                    </a>
                </div>

                <p class="mt-6 text-center text-xs text-ink-faint">
                    We typically respond within 24 business hours.
                </p>
            </div>
        </div>
    </div>
</section>
