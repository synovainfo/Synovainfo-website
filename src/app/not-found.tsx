import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* Geometric 404 decoration */}
      <div className="relative mb-8" aria-hidden="true">
        <div className="flex items-center gap-4">
          {/* Left diamond */}
          <div className="h-16 w-16 rotate-45 border-2 border-[var(--color-accent-blue)]/20 md:h-20 md:w-20" />
          {/* 404 text */}
          <span className="text-[120px] font-bold leading-none tracking-tight text-[var(--color-text)] md:text-[160px]">
            404
          </span>
          {/* Right diamond */}
          <div className="h-16 w-16 rotate-45 border-2 border-[var(--color-accent-cyan)]/20 md:h-20 md:w-20" />
        </div>
        {/* Subtle glow beneath */}
        <div
          className="absolute -bottom-8 left-1/2 h-20 w-3/4 -translate-x-1/2 rounded-full opacity-[0.04] blur-3xl"
          style={{ backgroundColor: "var(--color-accent-blue)" }}
        />
      </div>

      <h1 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl">
        Page Not Found
      </h1>

      <p className="mb-8 max-w-md text-base leading-relaxed text-[var(--color-text-secondary)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-[var(--color-accent-blue)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--color-accent-blue)]/20 transition-all duration-300 hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
        >
          Back to Home
        </Link>
        <Link
          href="#contact"
          className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] px-7 py-3.5 text-sm font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-accent-blue)]/30 hover:bg-[var(--color-accent-blue)]/[0.04] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
        >
          Contact Support
        </Link>
      </div>

      <p className="mt-12 text-xs text-[var(--color-text-tertiary)]">
        Error 404 &middot; Synova Infotech Private Limited
      </p>
    </div>
  );
}
