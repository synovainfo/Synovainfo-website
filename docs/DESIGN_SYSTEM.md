# Synova Infotech — Enterprise Design System Tokens

## 1. Editorial Typography Scale
- **Font Family**: Plus Jakarta Sans / Geist Display (Headings), Inter / Geist Sans (Body).
- **H1 (Hero)**: `text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]`
- **H2 (Section Header)**: `text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2]`
- **H3 (Card/Panel)**: `text-xl md:text-2xl font-semibold leading-snug`
- **Body Large**: `text-lg text-[var(--color-text-secondary)] leading-[1.75]`
- **Body Regular**: `text-base text-[var(--color-text-secondary)] leading-[1.6]`
- **Micro/Eyebrow**: `text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent-cyan)]`

## 2. Enterprise Color Palette (Dark Theme Default)
- **Surface Level 0 (Background)**: `#080E18` (Deep Slate / Navy)
- **Surface Level 1 (Panels)**: `#0F1B2D`
- **Surface Level 2 (Hover/Active)**: `rgba(255, 255, 255, 0.05)`
- **Accent Blue**: `#2563EB`
- **Accent Cyan**: `#06B6D4`
- **Success Emerald (SLA/Trust)**: `#10B981`
- **Warning Amber**: `#F59E0B`
- **AI Purple**: `#8B5CF6`
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#94A3B8` (Slate 400)

## 3. Glassmorphism & Elevation Tokens
- **Glass Panel Base**: `backdrop-filter: blur(24px); background: rgba(15, 27, 45, 0.75);`
- **Glass Border**: `border: 1px solid rgba(255, 255, 255, 0.12);`
- **Glass Hover State**: `border: 1px solid rgba(6, 182, 212, 0.4); box-shadow: 0 8px 32px rgba(6, 182, 212, 0.15);`

## 4. Spacing & Grid System
- **Section Padding**: `py-24 md:py-32`
- **Grid Gap Standard**: `gap-6 md:gap-8`
- **Max Container Width**: `max-w-7xl mx-auto px-4 md:px-8`
- **Component Border Radius**: `rounded-2xl` (Panels), `rounded-full` (Pills/Buttons)
