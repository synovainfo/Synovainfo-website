'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageSquareShare,
} from 'lucide-react'
import { z } from 'zod'
import { cn } from '@/lib/utils'

/* ── Types ─────────────────────────────────────────────────────────── */

interface ServiceOption {
  id: string
  title: string
}

interface ContactFormProps {
  services: ServiceOption[]
  contactInfo: Record<string, string> | null
}

/* ── Schema ────────────────────────────────────────────────────────── */

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .max(20, 'Phone number is too long')
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .max(100, 'Company name is too long')
    .optional()
    .or(z.literal('')),
  service: z.string().max(100).optional().or(z.literal('')),
  budget: z.string().max(50).optional().or(z.literal('')),
  timeline: z.string().max(50).optional().or(z.literal('')),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message is too long'),
  website: z.string().max(0).optional(), // honeypot
})

type ContactFormData = z.infer<typeof contactSchema>

/* ── Constants ─────────────────────────────────────────────────────── */

const BUDGET_OPTIONS = [
  'Less than $10K',
  '$10K – $25K',
  '$25K – $50K',
  '$50K – $100K',
  '$100K+',
]

const TIMELINE_OPTIONS = ['ASAP', '1–3 months', '3–6 months', 'Not sure']

/* ── Social icon resolver ──────────────────────────────────────────── */

function SocialIcon({ platform }: { platform: string }) {
  const iconClass = 'h-5 w-5'
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    case 'twitter':
    case 'x':
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    default:
      return <Globe className={iconClass} />
  }
}

/* ── Contact Info Card ─────────────────────────────────────────────── */

function ContactInfoCard({ info }: { info: Record<string, string> }) {
  const items: { icon: React.ReactNode; label: string; value: string; href?: string }[] = []

  if (info.address) {
    items.push({
      icon: <MapPin className="h-5 w-5" aria-hidden="true" />,
      label: 'Address',
      value: info.address,
    })
  }

  if (info.phone) {
    items.push({
      icon: <Phone className="h-5 w-5" aria-hidden="true" />,
      label: 'Phone',
      value: info.phone,
      href: `tel:${info.phone}`,
    })
  }

  if (info.email) {
    items.push({
      icon: <Mail className="h-5 w-5" aria-hidden="true" />,
      label: 'Email',
      value: info.email,
      href: `mailto:${info.email}`,
    })
  }

  // Parse social links — stored as comma-separated "platform:url" pairs
  const socialLinks: { platform: string; url: string }[] = []
  if (info.social) {
    const parts = info.social.split(',')
    for (const part of parts) {
      const [platform, url] = part.trim().split(':')
      if (platform && url) {
        socialLinks.push({ platform, url })
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="font-heading text-2xl font-bold text-[var(--color-text)]">
          Get in Touch
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Have a project in mind? We&apos;d love to hear about it. Send us a
          message and we&apos;ll get back to you within 24 hours.
        </p>
      </div>

      {/* Contact details */}
      <div className="space-y-5">
        {items.map((item) => {
          const content = (
            <div className="flex items-start gap-3" key={item.label}>
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]">
                {item.icon}
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-0.5 block text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent-blue)]"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-0.5 text-sm font-medium text-[var(--color-text)]">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          )
          return content
        })}
      </div>

      {/* Social links */}
      {socialLinks.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Follow Us
          </p>
          <div className="flex gap-3">
            {socialLinks.map(({ platform, url }) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${platform}`}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue)] hover:shadow-sm"
              >
                <SocialIcon platform={platform} />
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

/* ── Form Field Wrapper ────────────────────────────────────────────── */

interface FieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

function Field({ label, required, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[var(--color-text)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--color-accent-blue)]">*</span>}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

/* ── Input / Select shared styles ──────────────────────────────────── */

const inputClass =
  'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-all duration-200 focus:border-[var(--color-accent-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]/20'

/* ── Main Component ────────────────────────────────────────────────── */

export function ContactForm({ services, contactInfo }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      budget: '',
      timeline: '',
      message: '',
      website: '',
    },
  })

  async function onSubmit(data: ContactFormData) {
    setStatus('loading')
    setErrorMessage(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  /* ── Success State ── */

  if (status === 'success') {
    return (
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-lg text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-text)]">
              Message Sent Successfully!
            </h2>
            <p className="mt-3 text-[var(--color-text-secondary)]">
              Thank you for reaching out. Our team will review your message and
              get back to you within 24 hours.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-blue)] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[var(--color-accent-blue)]/90 hover:shadow-md"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Send Another Message
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  /* ── Form ── */

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h1 className="font-heading text-3xl font-bold text-[var(--color-text)] md:text-4xl lg:text-5xl">
            Let&apos;s Start a Conversation
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--color-text-secondary)] md:text-lg">
            Tell us about your project, and we&apos;ll help you turn your vision
            into reality.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* ── Form Column ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div
              className={cn(
                'rounded-2xl border border-[var(--glass-border)] p-6 shadow-[var(--glass-shadow)] backdrop-blur-[var(--glass-blur)] sm:p-8',
                'bg-[var(--glass-bg)]',
              )}
            >
              {/* Error banner */}
              {status === 'error' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* Honeypot - visually hidden */}
                <div className="absolute left-[-9999px]" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register('website')}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" required error={errors.name?.message}>
                    <input
                      type="text"
                      placeholder="John Doe"
                      {...register('name')}
                      className={inputClass}
                      aria-invalid={!!errors.name}
                    />
                  </Field>

                  <Field label="Email" required error={errors.email?.message}>
                    <input
                      type="email"
                      placeholder="john@company.com"
                      {...register('email')}
                      className={inputClass}
                      aria-invalid={!!errors.email}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone" error={errors.phone?.message}>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      {...register('phone')}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Company" error={errors.company?.message}>
                    <input
                      type="text"
                      placeholder="Company Inc."
                      {...register('company')}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Service">
                    <select {...register('service')} className={inputClass} defaultValue="">
                      <option value="" disabled>
                        Select a service
                      </option>
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Budget">
                    <select {...register('budget')} className={inputClass} defaultValue="">
                      <option value="" disabled>
                        Select budget range
                      </option>
                      {BUDGET_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Timeline">
                  <select {...register('timeline')} className={inputClass} defaultValue="">
                    <option value="" disabled>
                      Select timeline
                    </option>
                    {TIMELINE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Message" required error={errors.message?.message}>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your project, goals, and how we can help..."
                    {...register('message')}
                    className={cn(inputClass, 'resize-y min-h-[120px]')}
                    aria-invalid={!!errors.message}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200',
                    'bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/90 hover:shadow-md',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                  )}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* ── Contact Info Column ── */}
          <div className="lg:col-span-2">
            {contactInfo ? (
              <ContactInfoCard info={contactInfo} />
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[var(--color-text)]">
                    Get in Touch
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    Have a project in mind? We&apos;d love to hear about it.
                    Send us a message and we&apos;ll get back to you within 24
                    hours.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
