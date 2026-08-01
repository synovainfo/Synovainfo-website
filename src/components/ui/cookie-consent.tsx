'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldCheck, Cookie, Settings, X } from 'lucide-react'

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
    } catch {
      setIsVisible(true)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
      setPreferences(prefs)
      setIsVisible(false)
      setShowDetails(false)
    } catch {
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
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[var(--color-corporate-navy-dark)] p-6 shadow-2xl transition-all duration-300 md:bottom-6 md:left-6 md:right-auto"
    >
      {!showDetails ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3 max-w-xl">
            <Cookie className="mt-1 h-5 w-5 shrink-0 text-[var(--color-corporate-gold)]" />
            <div className="text-xs leading-relaxed text-white/70">
              <p className="font-semibold text-white">
                Privacy & Data Governance Notice
              </p>
              <p className="mt-1">
                We use cookies and telemetry to optimize platform performance and measure visitor intent. Non-essential tracking scripts are gated and strictly disabled until you explicitly accept. Learn more in our{' '}
                <Link href="/privacy" className="text-[var(--color-corporate-gold)] underline font-medium hover:text-[var(--color-corporate-gold-dark)]">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowDetails(true)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Settings className="inline-block mr-1 h-3.5 w-3.5" />
              Customize
            </button>
            <button
              onClick={handleRejectAll}
              className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              Reject Optional
            </button>
            <button
              onClick={handleAcceptAll}
              className="rounded-lg bg-[var(--color-corporate-gold)] px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[var(--color-corporate-gold-dark)]"
            >
              Accept All
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--color-corporate-gold)]" />
              Manage Preference Settings
            </h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-white/50 hover:text-[var(--color-corporate-gold)]"
              aria-label="Close settings"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Necessary */}
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
              <div>
                <span className="font-bold text-white">Strictly Necessary</span>
                <p className="text-[11px] text-white/50">Required for site security, session handling, and CSRF defense.</p>
              </div>
              <span className="rounded bg-[var(--color-corporate-gold)]/10 px-2 py-0.5 font-mono text-[10px] text-[var(--color-corporate-gold)] font-bold">
                Always Active
              </span>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
              <div>
                <span className="font-bold text-white">Performance & Analytics Telemetry</span>
                <p className="text-[11px] text-white/50">Allows aggregate usage metrics to improve page response times.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="h-4 w-4 rounded border-white/25 bg-transparent text-[var(--color-corporate-gold)] focus:ring-[var(--color-corporate-gold)]"
              />
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
              <div>
                <span className="font-bold text-white">Campaign Attribution & Personalization</span>
                <p className="text-[11px] text-white/50">Personalizes executive content based on enterprise sector intent.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                className="h-4 w-4 rounded border-white/25 bg-transparent text-[var(--color-corporate-gold)] focus:ring-[var(--color-corporate-gold)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => savePreferences(preferences)}
              className="rounded-lg bg-[var(--color-corporate-gold)] px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[var(--color-corporate-gold-dark)]"
            >
              Save Custom Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
