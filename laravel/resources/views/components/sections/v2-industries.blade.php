@php
    $industries = [
        "Manufacturing",
        "Healthcare",
        "Finance",
        "Retail",
        "Logistics",
        "Education",
        "Government",
        "Telecom"
    ];
@endphp

<section class="py-24 bg-slate-900 border-y border-slate-800">
    <div class="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
            <p class="text-xs font-bold uppercase tracking-[0.25em] text-orange-500 mb-4">Chapter 3: Industry Atlas</p>
            <h2 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
                Domain decisions shape the architecture before implementation begins.
            </h2>
            <p class="text-lg text-slate-400 leading-relaxed max-w-xl">
                Compliance rules, uptime expectations, field workflows, integration dependencies, and data quality thresholds become design constraints.
            </p>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4" aria-label="Industry hub map">
            @foreach($industries as $industry)
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-center text-center hover:bg-slate-800 hover:border-orange-500/50 transition-colors cursor-default group">
                    <span class="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                        {{ $industry }}
                    </span>
                </div>
            @endforeach
        </div>
    </div>
</section>
