'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  SendHorizonal,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'

/* ── Data ─────────────────────────────────────────────────────── */

const COMPANY_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Solutions Blueprint', href: '/solutions' },
  { label: 'Technology Stack', href: '/technologies' },
  { label: 'Engagement Models', href: '/engagement-models' },
  { label: 'Partners & Alliances', href: '/partners' },
  { label: 'Press Room', href: '/press' },
  { label: 'Events & Webinars', href: '/events' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact Us', href: '/contact' },
] as const

const SERVICE_LINKS = [
  { label: 'Custom Software Development', slug: 'custom-software-development' },
  { label: 'Web Development', slug: 'web-development' },
  { label: 'Mobile Apps', slug: 'mobile-app-development' },
  { label: 'Cloud Solutions', slug: 'cloud-infrastructure-solutions' },
  { label: 'AI/ML', slug: 'ai-machine-learning' },
  { label: 'IT Consulting', slug: 'it-consulting' },
] as const

const INDUSTRY_LINKS = [
  { label: 'Manufacturing', slug: 'manufacturing' },
  { label: 'Healthcare', slug: 'healthcare' },
  { label: 'Retail & E-Commerce', slug: 'retail-e-commerce' },
  { label: 'Logistics & Supply Chain', slug: 'logistics-supply-chain' },
  { label: 'Finance & Insurance', slug: 'finance-insurance' },
  { label: 'Education', slug: 'education' },
] as const

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@synovainfo.com',
    href: 'mailto:contact@synovainfo.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 20 4850 1234',
    href: 'tel:+912048501234',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: 'Pune, Maharashtra, India',
    href: '' as const,
  },
] as const

interface SocialLink {
  label: string
  href: string
  icon: React.ReactNode
}

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/privacy' },
  { label: 'HTML Sitemap', href: '/sitemap' },
] as const

/* ── Sub-components ───────────────────────────────────────────── */

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-corporate-gold">
      {children}
    </h3>
  )
}

/* ── Footer Component ─────────────────────────────────────────── */

export function Footer() {
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const year = new Date().getFullYear()

  useEffect(() => {
    fetch('/api/settings/social')
      .then((res) => res.ok ? res.json() : { socialLinks: [] })
      .then((data) => {
        if (data.socialLinks && Array.isArray(data.socialLinks)) {
          const links: SocialLink[] = data.socialLinks
            .filter((href: string) => href && href !== '#')
            .map((href: string) => {
              let icon: React.ReactNode
              let label: string

              if (href.includes('linkedin.com')) {
                icon = (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                )
                label = 'LinkedIn'
              } else if (href.includes('twitter.com') || href.includes('x.com')) {
                icon = (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )
                label = 'Twitter'
              } else if (href.includes('github.com')) {
                icon = (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                )
                label = 'GitHub'
              } else {
                icon = <span className="text-xs font-bold">{href.charAt(0).toUpperCase()}</span>
                label = 'Link'
              }

              return { label, href, icon }
            })
          setSocialLinks(links)
        }
      })
  }, [])

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterStatus('error')
      return
    }

    setIsSubmitting(true)
    setNewsletterStatus('idle')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Subscription failed')
      }

      setNewsletterStatus('success')
      setEmail('')
    } catch {
      setNewsletterStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer
      className="relative overflow-hidden border-t border-white/10 bg-navy-dark"
      role="contentinfo"
    >
      {/* Subtle top glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[800px] -translate-x-1/2 opacity-[0.06]"
        style={{
          background:
            'radial-gradient(ellipse at center, var(--color-corporate-gold) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8"
        >
          {/* ── Column 1: Brand ── (lg: 4 cols) ─────────────── */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo variant="light" size="sm" />

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-300/80">
              Pune-based IT consultancy delivering enterprise-grade custom software, cloud
              solutions, and digital transformation — engineered for scale, secured by design.
            </p>

            {/* Social links — row */}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition-all duration-200 hover:border-corporate-gold/50 hover:text-corporate-gold hover:shadow-[0_0_12px_rgba(249,115,22,0.2)]"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}

            {/* Company links */}
            <div className="mt-6">
              <ColumnHeading>Company</ColumnHeading>
              <ul className="space-y-2.5">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors duration-200 hover:text-corporate-gold"
                    >
                      <ChevronRight
                        size={12}
                        className="shrink-0 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-corporate-gold"
                        aria-hidden="true"
                      />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Column 2: Services ── (lg: 3 cols) ──────────── */}
          <div className="lg:col-span-3">
            <ColumnHeading>Services</ColumnHeading>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={`/services/${link.slug}`}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors duration-200 hover:text-corporate-gold"
                  >
                    <ChevronRight
                      size={12}
                      className="shrink-0 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-corporate-gold"
                      aria-hidden="true"
                    />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Industries ── (lg: 3 cols) ────────── */}
          <div className="lg:col-span-3">
            <ColumnHeading>Industries</ColumnHeading>
            <ul className="space-y-2.5">
              {INDUSTRY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={`/industries/${link.slug}`}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors duration-200 hover:text-corporate-gold"
                  >
                    <ChevronRight
                      size={12}
                      className="shrink-0 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-corporate-gold"
                      aria-hidden="true"
                    />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Connect ── (lg: 2 cols) ───────────── */}
          <div className="sm:col-span-2 lg:col-span-2">
            <ColumnHeading>Connect</ColumnHeading>

            {/* Contact details */}
            <ul className="space-y-3">
              {CONTACT_INFO.map((item) => {
                const Icon = item.icon
                const Wrapper = item.href ? 'a' : 'div'
                const wrapperProps = item.href
                  ? {
                      href: item.href,
                      className:
                        'group inline-flex items-center gap-3 text-sm text-slate-300 transition-colors duration-200 hover:text-corporate-gold',
                    }
                  : {
                      className:
                        'inline-flex items-center gap-3 text-sm text-slate-300',
                    }

                return (
                  <li key={item.label}>
                    <Wrapper {...wrapperProps}>
                      <Icon
                        size={16}
                        className="shrink-0 text-slate-500 group-hover:text-corporate-gold"
                        aria-hidden="true"
                      />
                      <span>{item.value}</span>
                    </Wrapper>
                  </li>
                )
              })}
            </ul>

            {/* ── Newsletter ── */}
            <div className="mt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-corporate-gold">
                Stay Updated
              </p>
              <form onSubmit={handleNewsletterSubmit} className="relative">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (newsletterStatus !== 'idle') setNewsletterStatus('idle')
                    }}
                    placeholder="Enter your email"
                    aria-label="Email for newsletter"
                    className={cn(
                      'w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200',
                      newsletterStatus === 'error'
                        ? 'border-[var(--color-compliance-red)]/60 focus:border-[var(--color-compliance-red)]'
                        : 'border-white/10 focus:border-corporate-gold/60',
                    )}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label="Subscribe"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition-all duration-200 hover:text-corporate-gold hover:bg-white/10 disabled:opacity-50"
                  >
                    <SendHorizonal size={16} aria-hidden="true" />
                  </button>
                </div>

                {newsletterStatus === 'success' && (
                  <p className="mt-2 text-xs text-[var(--color-trust-green)]">
                    Thanks for subscribing! Check your inbox.
                  </p>
                )}
                {newsletterStatus === 'error' && (
                  <p className="mt-2 text-xs text-[var(--color-compliance-red)]">
                    Please enter a valid email address.
                  </p>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Bar ────────────────────────────────────────── */}
      <div className="border-t border-white/10 bg-navy-dark">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Copyright */}
            <p className="text-xs text-slate-400">
              &copy; {year} Synova Infotech Private Limited. All rights reserved.
            </p>

            {/* Legal + corporate info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-slate-400 transition-colors duration-200 hover:text-corporate-gold"
                >
                  {link.label}
                </Link>
              ))}
              <span className="hidden text-white/20 sm:inline" aria-hidden="true">|</span>
              <span className="text-xs text-slate-400">
                CIN: <span className="font-mono text-slate-400">U62099PN2026PTC257266</span>
              </span>
              <span className="hidden text-white/20 sm:inline" aria-hidden="true">|</span>
              <span className="text-xs text-slate-400">
                ROC: <span className="font-mono text-slate-400">RoC-Pune</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
