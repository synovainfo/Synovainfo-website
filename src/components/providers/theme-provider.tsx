'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'synova-theme'

/* ── Inline script to prevent flash of unstyled content ──────────
 * Injected into <head> so it runs before any React hydration.
 * Reads saved preference or falls back to system prefers-color-scheme.
 * Sets both data-theme attribute and class on <html> for maximum
 * compatibility with CSS variables and Tailwind dark: variants.      */
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: [
          '(function(){',
          'try{',
          `var t=localStorage.getItem('${STORAGE_KEY}');`,
          'if(!t){t=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"}',
          'document.documentElement.setAttribute("data-theme",t);',
          'if(t==="dark")document.documentElement.classList.add("dark");',
          'else document.documentElement.classList.remove("dark");',
          '}catch(e){}',
          '})()',
        ].join(''),
      }}
    />
  )
}

/* ── Theme Provider ─────────────────────────────────────────────── */

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  // Sync state with DOM (already set by inline script before hydration)
  useEffect(() => {
    const id = setTimeout(() => {
      const current = (
        document.documentElement.getAttribute('data-theme') || 'light'
      ) as Theme
      setThemeState(current)
    }, 0)
    return () => clearTimeout(id)
  }, [])

  const applyTheme = useCallback((t: Theme) => {
    document.documentElement.setAttribute('data-theme', t)
    document.documentElement.classList.toggle('dark', t === 'dark')
  }, [])

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next)
      localStorage.setItem(STORAGE_KEY, next)
      applyTheme(next)
    },
    [applyTheme],
  )

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  // Listen for system preference changes — only when user has no explicit choice
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const next: Theme = e.matches ? 'dark' : 'light'
        setThemeState(next)
        applyTheme(next)
      }
    }

    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [applyTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/* ── Hook ────────────────────────────────────────────────────────── */

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}
