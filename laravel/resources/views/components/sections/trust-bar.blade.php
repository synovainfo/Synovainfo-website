@props([
    'partners' => [
        ['id' => '1', 'name' => 'AWS', 'role' => 'Advanced Tier'],
        ['id' => '2', 'name' => 'Microsoft Azure', 'role' => 'Gold Partner'],
        ['id' => '3', 'name' => 'Google Cloud', 'role' => 'Premier'],
        ['id' => '4', 'name' => 'Snowflake', 'role' => 'Data Partner'],
        ['id' => '5', 'name' => 'Salesforce', 'role' => 'Consulting'],
    ],
    'certifications' => [
        ['id' => '1', 'name' => 'ISO 27001'],
        ['id' => '2', 'name' => 'SOC 2 Type II']
    ]
])

<section class="relative z-20 overflow-hidden border-y border-surface-border bg-surface py-8">
    <style>
        .mask-gradient-edges {
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            animation: marquee 40s linear infinite;
        }
        .group:hover .animate-marquee {
            animation-play-state: paused;
        }
    </style>
    
    <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="text-xs font-bold uppercase tracking-[0.25em] text-orange-500 flex items-center gap-2">
            <svg class="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Technology Ecosystem
        </div>
        
        @if(count($certifications) > 0)
            <div class="flex gap-4 text-[10px] uppercase tracking-widest text-ink-faint font-semibold">
                @foreach($certifications as $i => $cert)
                    <span class="flex items-center gap-4">
                        @if($i > 0) <span aria-hidden="true">•</span> @endif
                        {{ $cert['name'] }}
                    </span>
                @endforeach
            </div>
        @endif
    </div>

    <!-- Logo Marquee -->
    @if(count($partners) > 0)
        <div class="group relative flex w-full overflow-hidden mask-gradient-edges py-2">
            <div class="flex whitespace-nowrap gap-8 pr-8 w-max animate-marquee">
                @php
                    $looped = array_merge($partners, $partners);
                @endphp
                
                @foreach($looped as $idx => $partner)
                    <div
                        aria-hidden="{{ $idx >= count($partners) ? 'true' : 'false' }}"
                        class="inline-flex items-center justify-center gap-3 rounded-2xl border border-surface-border bg-surface px-6 py-3 shadow-sm transition-all duration-500 hover:border-orange-500/60 hover:shadow-md cursor-default group/card"
                    >
                        <svg class="h-5 w-5 text-ink-faint group-hover/card:text-orange-500 transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        <span class="text-sm font-bold tracking-wide text-ink-muted group-hover/card:text-ink transition-colors duration-500">
                            {{ $partner['name'] }}
                        </span>
                        @if(!empty($partner['role']))
                            <span class="rounded-md bg-orange-50 border border-orange-500/20 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase text-orange-500">
                                {{ $partner['role'] }}
                            </span>
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
    @endif
</section>
