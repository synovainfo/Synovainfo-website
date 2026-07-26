'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle, SendHorizonal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { env } from '@/env'

/* ──────────────────────────────────────────────────────────────────── */
/*  Zod schema                                                         */
/* ──────────────────────────────────────────────────────────────────── */

const inquiryTypes = ['business', 'sales', 'career', 'support'] as const

const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(
      /^\+?[\d\s\-()]{7,15}$/,
      'Please enter a valid phone number (7-15 digits)',
    ),
  company: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be under 200 characters'),
  inquiryType: z.enum(inquiryTypes, {
    error: 'Please select a valid inquiry type',
  }),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be under 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be under 5000 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>

/* ──────────────────────────────────────────────────────────────────── */
/*  Inquiry type options                                                */
/* ──────────────────────────────────────────────────────────────────── */

const INQUIRY_OPTIONS: { value: ContactFormData['inquiryType']; label: string }[] = [
  { value: 'business', label: 'Business Inquiry' },
  { value: 'sales', label: 'Sales Inquiry' },
  { value: 'career', label: 'Career Opportunity' },
  { value: 'support', label: 'Technical Support' },
]

/* ──────────────────────────────────────────────────────────────────── */
/*  Form field config                                                   */
/* ──────────────────────────────────────────────────────────────────── */

type FieldConfig = {
  name: keyof ContactFormData
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea'
  placeholder: string
  required: boolean
  colSpan?: 'full'
}

const FIELDS: FieldConfig[] = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@company.com', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210', required: true },
  { name: 'company', label: 'Company', type: 'text', placeholder: 'Acme Corp', required: true },
  { name: 'inquiryType', label: 'Inquiry Type', type: 'select', placeholder: 'Select inquiry type', required: true },
  { name: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help you?', required: true, colSpan: 'full' },
  { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell us more about your requirements...', required: true, colSpan: 'full' },
]

/* ──────────────────────────────────────────────────────────────────── */
/*  Contact Form                                                        */
/* ──────────────────────────────────────────────────────────────────── */

interface ContactFormProps {
  className?: string
}

export function ContactForm({ className }: ContactFormProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      inquiryType: 'business',
    },
  })

  /* ── Listen for prefill-inquiry event from Careers ── */
  const handlePrefill = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { type: string; position?: string }
        | undefined
      if (detail?.type && inquiryTypes.includes(detail.type as ContactFormData['inquiryType'])) {
        setValue('inquiryType', detail.type as ContactFormData['inquiryType'])
      }
      if (detail?.position) {
        setValue('subject', `Application for ${detail.position}`)
      }
    },
    [setValue],
  )

  useEffect(() => {
    window.addEventListener('prefill-inquiry', handlePrefill)
    return () => window.removeEventListener('prefill-inquiry', handlePrefill)
  }, [handlePrefill])

  /* ── Submit handler ── */
  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('submitting')

    try {
      const endpoint = env.NEXT_PUBLIC_FORM_ENDPOINT
      if (!endpoint) {
        // Simulate success when no endpoint is configured
        await new Promise((resolve) => setTimeout(resolve, 1200))
      } else {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      }
      setSubmitStatus('success')
      reset()
      // Auto-dismiss success after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 6000)
    }
  }

  /* ── Render field ── */
  const renderField = (field: FieldConfig) => {
    const fieldError = errors[field.name]
    const hasError = !!fieldError

    const baseInputStyles = cn(
      'w-full rounded-xl border px-4 py-3.5',
      'bg-[var(--glass-bg)] backdrop-blur-xl',
      'text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]',
      'text-base', // 16px minimum to prevent iOS zoom on focus
      'transition-all duration-300',
      'focus:outline-none',
      hasError
        ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
        : 'border-[var(--glass-border)] focus:border-[var(--color-accent-blue)]/50 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]',
    )

    if (field.type === 'select') {
      return (
        <div className="relative">
          <select
            {...register(field.name)}
            aria-label={field.label}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${field.name}-error` : undefined}
            className={cn(
              baseInputStyles,
              'appearance-none cursor-pointer pr-10',
            )}
          >
            {INQUIRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom chevron */}
          <div
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
            aria-hidden="true"
          >
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          {...register(field.name)}
          aria-label={field.label}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
          placeholder={field.placeholder}
          rows={5}
          className={cn(baseInputStyles, 'resize-y min-h-[120px]')}
        />
      )
    }

    return (
      <input
        {...register(field.name)}
        type={field.type}
        aria-label={field.label}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field.name}-error` : undefined}
        placeholder={field.placeholder}
        className={baseInputStyles}
      />
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* ── Success state overlay ── */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-[var(--color-surface)]/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            >
              <CheckCircle2 className="h-16 w-16 text-[var(--color-accent-emerald)]" />
            </motion.div>
            <h3 className="mt-4 font-heading text-xl font-semibold text-[var(--color-text)]">
              Message Sent!
            </h3>
            <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
              Thank you for reaching out. Our team will get back to you within 24 hours.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error banner ── */}
      <AnimatePresence>
        {submitStatus === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 flex items-center gap-3 rounded-xl border border-red-400/30 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>
              Failed to send your message. Please try again or email us directly at{' '}
              <a
                href="mailto:info@synovainfotech.com"
                className="font-medium underline underline-offset-2 hover:text-red-800"
              >
                info@synovainfotech.com
              </a>
              .
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {FIELDS.slice(0, 4).map((field) => (
            <div key={field.name}>
              <label
                htmlFor={`field-${field.name}`}
                className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
              >
                {field.label}
                {field.required && (
                  <span className="ml-0.5 text-[var(--color-accent-blue)]">*</span>
                )}
              </label>
              {renderField(field)}
              <AnimatePresence>
                {errors[field.name]?.message && (
                  <motion.p
                    id={`${field.name}-error`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="mt-1.5 text-xs text-red-500"
                    role="alert"
                  >
                    {errors[field.name]?.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Inquiry Type (full width after row 1) */}
        <div>
          <label
            htmlFor="field-inquiryType"
            className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
          >
            Inquiry Type
            <span className="ml-0.5 text-[var(--color-accent-blue)]">*</span>
          </label>
          {renderField(FIELDS[4])}
          <AnimatePresence>
            {errors.inquiryType?.message && (
              <motion.p
                id="inquiryType-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1.5 text-xs text-red-500"
                role="alert"
              >
                {errors.inquiryType.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="field-subject"
            className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
          >
            Subject
            <span className="ml-0.5 text-[var(--color-accent-blue)]">*</span>
          </label>
          {renderField(FIELDS[5])}
          <AnimatePresence>
            {errors.subject?.message && (
              <motion.p
                id="subject-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1.5 text-xs text-red-500"
                role="alert"
              >
                {errors.subject.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="field-message"
            className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
          >
            Message
            <span className="ml-0.5 text-[var(--color-accent-blue)]">*</span>
          </label>
          {renderField(FIELDS[6])}
          <AnimatePresence>
            {errors.message?.message && (
              <motion.p
                id="message-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1.5 text-xs text-red-500"
                role="alert"
              >
                {errors.message.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* ── Submit button ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="submit"
            disabled={submitStatus === 'submitting'}
            className={cn(
              'group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden',
              'rounded-xl px-8 py-4 text-base font-semibold',
              'transition-all duration-300 ease-out',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]',
              submitStatus === 'submitting'
                ? 'cursor-not-allowed bg-[var(--color-accent-blue)]/70 text-white/70'
                : 'bg-[var(--color-accent-blue)] text-white hover:shadow-[0_0_30px_-3px_var(--color-accent-blue)] active:scale-[0.98]',
            )}
          >
            {/* Hover shine effect */}
            <span
              className={cn(
                'pointer-events-none absolute inset-0 -translate-x-full',
                'bg-gradient-to-r from-transparent via-white/10 to-transparent',
                'transition-transform duration-700',
                submitStatus !== 'submitting' && 'group-hover:translate-x-full',
              )}
              aria-hidden="true"
            />

            {submitStatus === 'submitting' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <SendHorizonal className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Send Message
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  )
}
