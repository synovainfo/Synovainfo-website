'use client'

import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id: externalId, ...props }, ref) => {
    const autoId = useId()
    const inputId = externalId ?? autoId
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText && !error ? `${inputId}-helper` : undefined

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={errorId ?? helperId}
          className={cn(
            'block w-full rounded-xl border px-4 py-2.5 text-sm',
            'bg-[var(--color-surface)] text-[var(--color-text)]',
            'placeholder:text-[var(--color-text-tertiary)]',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]/30 focus:border-[var(--color-accent-blue)]',
            error
              ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
              : 'border-[var(--color-border)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          {...props}
        />

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-xs text-red-500"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={helperId}
            className="mt-1.5 text-xs text-[var(--color-text-tertiary)]"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
