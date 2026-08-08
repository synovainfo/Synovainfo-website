<section class="relative py-20 md:py-28 bg-canvas" aria-label="Clients and partners">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="eyebrow text-ink-faint text-center mb-14">Trusted by category leaders worldwide</p>
    </div>

    <div class="marquee-mask overflow-hidden" aria-hidden="true">
        <div class="marquee-track items-center gap-16 px-8">
            @foreach (array_merge(
                ['client-aether', 'client-cloudbase', 'client-dataflow', 'client-nexus', 'client-techcorp'],
                ['client-aether', 'client-cloudbase', 'client-dataflow', 'client-nexus', 'client-techcorp']
            ) as $logo)
                <img src="{{ asset('images/clients/' . $logo . '.svg') }}"
                     alt=""
                     class="h-10 w-auto opacity-50 saturate-0 hover:opacity-100 hover:saturate-100 transition-all duration-500"
                     loading="lazy" />
            @endforeach
        </div>
    </div>
</section>
