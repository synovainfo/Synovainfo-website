{{-- Day / Dark theme toggle. State is owned by the `themeToggle` Alpine component
    registered in resources/js/app.js and shared via the <html data-theme> attribute. --}}
<div
    x-data="themeToggle"
    x-init="init()"
    class="relative"
>
    <button
        type="button"
        @click="toggle()"
        :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
        :title="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-abyss-900/10 dark:border-white/15 bg-white/60 dark:bg-white/5 text-ink dark:text-ember-400 transition-all duration-300 hover:border-ember-500/50 hover:text-ember-500 dark:hover:text-ember-400 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-abyss-900"
    >
        {{-- Sun — visible in light theme, click to go dark --}}
        <svg
            x-show="theme === 'light'"
            x-cloak
            class="h-5 w-5"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            aria-hidden="true"
        >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06M12 8.25a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5z" />
        </svg>
        {{-- Moon — visible in dark theme, click to go light --}}
        <svg
            x-show="theme === 'dark'"
            x-cloak
            class="h-5 w-5"
            fill="currentColor" viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
        </svg>
    </button>
</div>
