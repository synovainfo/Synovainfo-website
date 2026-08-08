<div id="preloader" class="preloader" aria-hidden="true">
    <div class="preloader-panel flex flex-col items-center" style="opacity: 0;">
        {{-- Logo mark — drawn via stroke-dashoffset --}}
        <div class="preloader-mark mb-8">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <path d="M12 60 V18 L36 42 L60 18 V60"
                      stroke="var(--color-ember-500)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="36" cy="36" r="24" stroke="var(--color-ink)" stroke-width="1" stroke-dasharray="2 6" opacity="0.5" />
            </svg>
        </div>

        <p class="font-display font-extrabold text-2xl tracking-tight" style="color: var(--color-ink);">
            SYNOVAINFO<span class="premium-serif" style="color: var(--color-ember-500);">.</span>
        </p>

        <div class="preloader-bar" role="presentation">
            <div class="preloader-bar-fill"></div>
        </div>
        <p class="preloader-count">000</p>
    </div>
</div>
