'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldCheck, Cookie, Settings, Check, X } from 'lucide-react'

export interface CookiePreferences {
  necessary: boolean // Always true
  analytics: boolean
  marketing: boolean
}

const STORAGE_KEY = 'synova_cookie_consent_v2'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false, // Default DENY
    marketing: false, // Default DENY
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) {
        // No consent saved yet - show banner, default deny enforced
        setIsVisible(true)
      } else {
        const parsed = JSON.parse(saved) as CookiePreferences
        setPreferences(parsed)
        // If analytics approved, initialize analytics scripts safely here
        if (parsed.analytics) {
          // Analytics script gate trigger
        }
      }
    } catch (e) {
      setIsVisible(true)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
      setPreferences(prefs)
      setIsVisible(false)
      setShowDetails(false)
    } catch (e) {
      setIsVisible(false)
    }
  }

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    savePreferences(allAccepted)
  }

  const handleRejectAll = () => {
    const allRejected: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    savePreferences(allRejected)
  }

  if (!isVisible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Privacy & Cookie Preferences"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 md:bottom-6 md:left-6 md:right-auto"
    >
      {!showDetails ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3 max-w-xl">
            <Cookie className="mt-1 h-5 w-5 shrink-0 text-[var(--color-accent-blue)]" />
            <div className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
              <p className="font-semibold text-[var(--color-text)]">
                Privacy & Data Governance Notice
              </p>
              <p className="mt-1">
                We use cookies and telemetry to optimize platform performance and measure visitor intent. Non-essential tracking scripts are gated and strictly disabled until you explicitly accept. Learn more in our{' '}
                <Link href="/privacy" className="text-[var(--color-accent-blue)] underline font-medium">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowDetails(true)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3 py-2 text-xs font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-text-secondary)]"
            >
              <Settings className="inline-block mr-1 h-3.5 w-3.5" />
              Customize
            </button>
            <button
              onClick={handleRejectAll}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-xs font-semibold text-[var(--color-text)] transition-colors hover:bg-zinc-800"
            >
              Reject Optional
            </button>
            <button
              onClick={handleAcceptAll}
              className="rounded-lg bg-[var(--color-accent-blue)] px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-blue-600"
            >
              Accept All
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <h3 className="font-heading text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--color-accent-blue)]" />
              Manage Preference Settings
            </h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text)]"
              aria-label="Close settings"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Necessary */}
            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <div>
                <span className="font-bold text-[var(--color-text)]">Strictly Necessary</span>
                <p className="text-[11px] text-[var(--color-text-tertiary)]">Required for site security, session handling, and CSRF defense.</p>
              </div>
              <span className="rounded bg-[var(--color-accent-blue)]/10 px-2 py-0.5 font-mono text-[10px] text-[var(--color-accent-blue)] font-bold">
                Always Active
              </span>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <div>
                <span className="font-bold text-[var(--color-text)]">Performance & Analytics Telemetry</span>
                <p className="text-[11px] text-[var(--color-text-tertiary)]">Allows aggregate usage metrics to improve page response times.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]"
              />
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <div>
                <span className="font-bold text-[var(--color-text)]">Campaign Attribution & Personalization</span>
                <p className="text-[11px] text-[var(--color-text-tertiary)]">Personalizes executive content based on enterprise sector intent.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
            <button
              onClick={() => savePreferences(preferences)}
              className="rounded-lg bg-[var(--color-accent-blue)] px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-blue-600"
            >
              Save Custom Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
