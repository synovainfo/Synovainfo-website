"use client";

import { Suspense, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LogIn, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Zod schema — email (valid, required), password (required), remember (bool)
// ---------------------------------------------------------------------------

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Card skeleton shown while useSearchParams resolves
// ---------------------------------------------------------------------------

function LoginFormSkeleton() {
  return (
    <div
      className={cn(
        "card-entrance relative w-full max-w-md",
        "rounded-2xl border border-[var(--glass-border)]",
        "bg-[var(--glass-bg)] backdrop-blur-xl",
        "shadow-[var(--glass-shadow)]",
        "p-8 sm:p-10",
      )}
      aria-label="Loading login form"
    >
      <div className="mb-8 text-center">
        <div className="mx-auto mb-2 h-8 w-48 animate-pulse rounded-md bg-[var(--color-surface-tertiary)]" />
        <div className="mx-auto h-4 w-64 animate-pulse rounded-md bg-[var(--color-surface-tertiary)]" />
      </div>
      <div className="space-y-5">
        <div className="h-[72px] animate-pulse rounded-xl bg-[var(--color-surface-tertiary)]" />
        <div className="h-[72px] animate-pulse rounded-xl bg-[var(--color-surface-tertiary)]" />
        <div className="h-5 w-28 animate-pulse rounded bg-[var(--color-surface-tertiary)]" />
        <div className="h-[56px] animate-pulse rounded-xl bg-[var(--color-accent-blue)]/30" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LoginForm (public) — wraps the inner form in Suspense for useSearchParams
// ---------------------------------------------------------------------------

export function LoginForm() {
  return (
    <>
      <style>{`
        @keyframes fade-scale-in {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .card-entrance {
          animation: fade-scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginFormInner />
      </Suspense>
    </>
  );
}

// ---------------------------------------------------------------------------
// LoginFormInner — actual form logic (uses useSearchParams)
// ---------------------------------------------------------------------------

function LoginFormInner() {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl =
    searchParams.get("callbackUrl") ?? "/admin/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      setAuthError(null);

      try {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
          callbackUrl,
        });

        if (!result) {
          setAuthError("An unexpected error occurred. Please try again.");
          return;
        }

        if (result.error) {
          setAuthError("Invalid email or password. Please try again.");
          return;
        }

        if (result.ok || result.url) {
          router.push(callbackUrl);
        }
      } catch {
        setAuthError("A network error occurred. Please check your connection.");
      }
    },
    [callbackUrl, router],
  );

  return (
    <>
      <div
        className={cn(
          "card-entrance relative w-full max-w-md",
          "rounded-2xl border border-[var(--glass-border)]",
          "bg-[var(--glass-bg)] backdrop-blur-xl",
          "shadow-[var(--glass-shadow)]",
          "p-8 sm:p-10",
        )}
        role="region"
        aria-label="Admin login form"
      >
        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Sign in to the Synova Infotech admin dashboard
          </p>
        </div>

        {/* ── Auth error banner ── */}
        {authError && (
          <div
            className="mb-6 flex items-center gap-3 rounded-xl border border-red-400/30 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
            <span>{authError}</span>
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* ── Email field ── */}
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
            >
              Email Address
            </label>
            <input
              {...register("email")}
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="admin@synovainfotech.com"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={cn(
                "w-full rounded-xl border px-4 py-3.5",
                "bg-[var(--glass-bg)] backdrop-blur-xl",
                "text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]",
                "text-base",
                "transition-all duration-300",
                "focus:outline-none",
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                  : "border-[var(--glass-border)] focus:border-[var(--color-accent-blue)]/50 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]",
              )}
            />
            {errors.email?.message && (
              <p
                id="email-error"
                className="mt-1.5 text-xs text-red-500"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* ── Password field ── */}
          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
            >
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={cn(
                  "w-full rounded-xl border px-4 py-3.5 pr-12",
                  "bg-[var(--glass-bg)] backdrop-blur-xl",
                  "text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]",
                  "text-base",
                  "transition-all duration-300",
                  "focus:outline-none",
                  errors.password
                    ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                    : "border-[var(--glass-border)] focus:border-[var(--color-accent-blue)]/50 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]",
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={cn(
                  "absolute right-3.5 top-1/2 -translate-y-1/2",
                  "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]",
                  "transition-colors rounded-sm",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]",
                )}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden />
                )}
              </button>
            </div>
            {errors.password?.message && (
              <p
                id="password-error"
                className="mt-1.5 text-xs text-red-500"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* ── Remember me checkbox ── */}
          <div className="flex items-center gap-2">
            <input
              {...register("remember")}
              id="login-remember"
              type="checkbox"
              className={cn(
                "h-4 w-4 rounded",
                "border-[var(--glass-border)]",
                "text-[var(--color-accent-blue)]",
                "focus:ring-[var(--color-accent-blue)] focus:ring-2 focus:ring-offset-1",
              )}
            />
            <label
              htmlFor="login-remember"
              className="select-none text-sm text-[var(--color-text-secondary)]"
            >
              Remember me
            </label>
          </div>

          {/* ── Submit button ── */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden",
              "rounded-xl px-8 py-4 text-base font-semibold",
              "transition-all duration-300 ease-out",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]",
              isSubmitting
                ? "cursor-not-allowed bg-[var(--color-accent-blue)]/70 text-white/70"
                : "bg-[var(--color-accent-blue)] text-white hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)] active:scale-[0.98]",
            )}
          >
            {/* Hover shine effect */}
            <span
              className={cn(
                "pointer-events-none absolute inset-0 -translate-x-full",
                "bg-gradient-to-r from-transparent via-white/10 to-transparent",
                "transition-transform duration-700",
                !isSubmitting && "group-hover:translate-x-full",
              )}
              aria-hidden
            />

            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                Signing in…
              </>
            ) : (
              <>
                <LogIn
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
