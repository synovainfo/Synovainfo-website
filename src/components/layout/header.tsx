import Link from 'next/link'

const navItems = [
  ['Services', '/services'],
  ['Solutions', '/solutions'],
  ['Industries', '/industries'],
  ['Technology', '/technologies'],
  ['Case Studies', '/case-studies'],
  ['Insights', '/insights'],
  ['Careers', '/careers'],
]

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#08111f]/86 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-[min(100%-1rem,1280px)] items-center justify-between gap-4">
        <Link href="/" className="font-heading text-lg font-black tracking-[.08em]" aria-label="Synova Infotech home">
          SYNOVA
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="px-3 py-2 text-sm font-semibold text-white/72 transition hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/search" className="hidden px-3 py-2 text-sm font-semibold text-white/72 transition hover:text-white sm:inline-flex">Search</Link>
          <Link href="/contact" className="rounded-full bg-[var(--color-corporate-gold)] px-4 py-2 text-sm font-black text-[#08111f] transition hover:translate-y-[-1px]">
            Start
          </Link>
        </div>
      </div>
    </header>
  )
}
