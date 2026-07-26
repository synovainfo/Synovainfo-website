# Synova Third-Party Vendor & Script Risk Inventory

**Version**: 2.0  
**Phase Alignment**: Phase 17 (Vendor Risk Audit) & Phase 16 (CSP Preparation)  
**Status**: AUDITED & APPROVED  

---

## 1. Third-Party Script & Resource Inventory

| Vendor / Resource | Category | Load Behavior | Business Justification | Privacy & Data Impact | CSP Directive Requirements |
|---|---|---|---|---|---|
| **Google Fonts** | Font Asset CDN | Non-blocking / Swap | Brand Typography (Inter, Plus Jakarta Sans, Manrope) | No PII transmitted | `font-src fonts.gstatic.com`, `style-src fonts.googleapis.com` |
| **Vercel Analytics** | Site Analytics | Async (`@vercel/analytics`) | Aggregate pageview & performance telemetry | Anonymized IP hash only; no PII | `script-src 'self' va.vercel-scripts.com`, `connect-src 'self' vitals.vercel-insights.com` |
| **Sentry** | Error Telemetry | Defer (`@sentry/nextjs`) | Production client-side exception monitoring | Masked error payloads; no form input captured | `script-src 'self' *.sentry.io`, `connect-src *.sentry.io` |
| **Lucide Icons** | SVG Icon Library | Bundled NPM Package | Standardized Enterprise Iconography | 100% Local / Zero Network Overhead | None (Self-Hosted) |
| **Framer Motion** | Animation Engine | Bundled NPM Package | Hardware-Accelerated UI Micro-Interactions | 100% Local / Zero Network Overhead | None (Self-Hosted) |

---

## 2. Risk Assessment & Mitigations

1. **Inline Hydration Scripts**: Next.js requires inline scripts for initial state hydration. Mitigation: Utilizing Next.js native script hash/nonce management or `'unsafe-inline'` for script elements strictly bound to origin.
2. **Fallback Isolation**: If Sentry or Vercel Analytics fail to load due to ad-blockers or network timeouts, the application fail-safes silently without blocking page render or interactive event handlers.
3. **Data Protection Compliance**: Zero third-party marketing pixels (Meta Pixel, LinkedIn Insight Tag) are loaded prior to explicit user opt-in via the Cookie Consent Manager.

---

## 3. CSP Rollout Strategy

- **Step 1 (Complete)**: Comprehensive Vendor Inventory (this document).
- **Step 2**: Deploy `Content-Security-Policy-Report-Only` header in `next.config.ts`.
- **Step 3**: Monitor CSP violation report endpoint for 14 days.
- **Step 4**: Enforce strict `Content-Security-Policy`.
