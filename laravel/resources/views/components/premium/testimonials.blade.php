<section class="relative py-24 md:py-32 bg-abyss-950 text-white overflow-hidden" aria-label="Testimonials">
    <div class="absolute inset-0 bg-grid opacity-20" aria-hidden="true"></div>

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="eyebrow text-ember-400 mb-10">07 — What clients say</p>

        <div
            x-data="testimonialCarousel"
            x-init="init()"
            class="testimonial-stage relative min-h-[24rem] md:min-h-[20rem]"
            role="region"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
        >
            @foreach ([
                ['home/testimonial-avatar-1.png', 'Rahul Menon', 'Chief Information Officer', 'Meridian Bank Group',
                 'Synovainfo rebuilt our payments core without a single minute of unplanned downtime. Two years on, it processes over a million transactions a minute — and it has never once let us down.'],
                ['home/testimonial-avatar-2.png', 'Sarah Whitfield', 'Chief Technology Officer', 'Aurora Health Network',
                 'Fourteen hospitals, one clinical platform, and one partner we trust completely. Their teams operate ours with a level of rigor we have not found anywhere else.'],
                ['home/testimonial-avatar-3.png', 'Daniel Okafor', 'VP, Digital Engineering', 'Vertex Energy',
                 'They took our grid telemetry from a research project to a production system across four million meters. The discipline they brought changed how we build software.'],
            ] as [$img, $name, $role, $org, $quote])
                <figure class="testimonial-slide" :class="active === {{ $loop->index }} && 'is-active'">
                    <blockquote class="premium-serif text-[clamp(1.4rem,3vw,2.4rem)] leading-[1.35] text-white max-w-3xl">
                        &ldquo;{{ $quote }}&rdquo;
                    </blockquote>
                    <figcaption class="mt-10 flex items-center gap-4">
                        <img src="{{ asset('images/' . $img) }}" alt="{{ $name }}" class="h-14 w-14 rounded-full object-cover ring-1 ring-white/20" loading="lazy" />
                        <div>
                            <p class="font-semibold text-white">{{ $name }}</p>
                            <p class="text-sm text-white/60">{{ $role }}, {{ $org }}</p>
                        </div>
                    </figcaption>
                </figure>
            @endforeach

            {{-- Progress indicators --}}
            <div class="mt-12 flex items-center gap-3" role="group" aria-label="Testimonial navigation">
                @foreach ([0, 1, 2] as $i)
                    <button
                        type="button"
                        class="h-1 rounded-full transition-all duration-500"
                        :class="active === {{ $i }} ? 'w-14 bg-ember-400' : 'w-8 bg-white/25 hover:bg-white/50'"
                        @click="go({{ $i }})"
                        :aria-label="'Show testimonial ' + ({{ $i }} + 1)"
                        :aria-current="active === {{ $i }} ? 'true' : 'false'"
                    ></button>
                @endforeach
            </div>
        </div>
    </div>
</section>
