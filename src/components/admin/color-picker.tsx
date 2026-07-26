// =============================================================================
// ColorPicker — reusable hex color picker with preset swatches
// =============================================================================
"use client";

import { useState, useCallback, useId } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ColorPickerProps {
  /** Current hex color value (e.g., "#2563EB") */
  value: string;
  /** Called when the color changes */
  onChange: (color: string) => void;
  /** Label displayed above the picker */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Preset color swatches (defaults to a curated palette) */
  presets?: string[];
  /** Disable the picker */
  disabled?: boolean;
  /** Additional wrapper classes */
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

// ---------------------------------------------------------------------------
// Default presets (6 curated colors)
// ---------------------------------------------------------------------------

const DEFAULT_PRESETS = [
  "#2563EB", // Blue 600
  "#7C3AED", // Violet 600
  "#DC2626", // Red 600
  "#059669", // Emerald 600
  "#D97706", // Amber 600
  "#0891B2", // Cyan 600
  "#0F172A", // Slate 900
  "#475569", // Slate 600
];

// ---------------------------------------------------------------------------
// ColorPicker
// ---------------------------------------------------------------------------

export function ColorPicker({
  value,
  onChange,
  label,
  error,
  presets = DEFAULT_PRESETS,
  disabled = false,
  className,
  size = "md",
}: ColorPickerProps) {
  const [focused, setFocused] = useState(false);
  const inputId = useId();
  const errorId = useId();

  const isValidHex = /^#[0-9a-fA-F]{6}$/.test(value);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value;
      // Auto-prepend # if missing
      if (raw.length > 0 && !raw.startsWith("#")) {
        raw = "#" + raw;
      }
      // Only allow valid hex characters
      if (/^#[0-9a-fA-F]{0,6}$/.test(raw)) {
        onChange(raw.toUpperCase());
      }
    },
    [onChange],
  );

  const sizeStyles = {
    sm: { preview: "h-8 w-8", input: "text-sm py-1.5", swatch: "h-5 w-5" },
    md: { preview: "h-10 w-10", input: "text-sm py-2", swatch: "h-6 w-6" },
    lg: { preview: "h-12 w-12", input: "text-base py-2.5", swatch: "h-7 w-7" },
  };

  const s = sizeStyles[size];

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--color-text)]"
        >
          {label}
        </label>
      )}

      {/* Input row */}
      <div className="flex items-center gap-3">
        {/* Color preview */}
        <div
          className={cn(
            "shrink-0 rounded-lg border-2 transition-all duration-200",
            focused && !error
              ? "border-[var(--color-accent-blue)] shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
              : error
                ? "border-red-400"
                : "border-[var(--glass-border)]",
          )}
          style={{
            backgroundColor: isValidHex ? value : "transparent",
          }}
          aria-hidden="true"
        >
          <div className={cn(s.preview, "rounded-lg")} />
        </div>

        {/* Hex input */}
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
            #
          </span>
          <input
            id={inputId}
            type="text"
            maxLength={7}
            value={value.replace("#", "")}
            onChange={handleInputChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            placeholder="2563EB"
            className={cn(
              "w-full rounded-lg border bg-[var(--glass-bg)] pl-7 pr-3",
              "text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]",
              "transition-all duration-200",
              "focus:outline-none",
              s.input,
              focused && !error
                ? "border-[var(--color-accent-blue)]/50 shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                : error
                  ? "border-red-400"
                  : "border-[var(--glass-border)]",
              disabled && "cursor-not-allowed opacity-60",
            )}
          />
        </div>
      </div>

      {/* Preset swatches */}
      <div className="flex flex-wrap gap-2">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            disabled={disabled}
            onClick={() => onChange(color)}
            title={color}
            aria-label={`Select color ${color}`}
            className={cn(
              "rounded-full transition-all duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]",
              s.swatch,
              value.toUpperCase() === color.toUpperCase()
                ? "ring-2 ring-[var(--color-accent-blue)] ring-offset-2 ring-offset-[var(--color-surface)] dark:ring-offset-zinc-900"
                : "hover:scale-110 hover:shadow-md",
              disabled && "cursor-not-allowed opacity-50",
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <p id={errorId} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
