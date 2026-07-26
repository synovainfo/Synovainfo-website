import type { ReactNode } from 'react'

interface CareersLayoutProps {
  children: ReactNode
}

export default function CareersLayout({ children }: CareersLayoutProps) {
  return <>{children}</>
}
