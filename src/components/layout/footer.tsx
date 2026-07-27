import Link from 'next/link'

const columns = [
  { title: 'Explore', links: [['Services', '/services'], ['Solutions', '/solutions'], ['Industries', '/industries'], ['Technology', '/technologies']] },
  { title: 'Proof', links: [['Case Studies', '/case-studies'], ['Portfolio', '/portfolio'], ['Insights', '/insights'], ['Blog', '/blog']] },
  { title: 'Company', links: [['About', '/about'], ['Careers', '/careers'], ['Contact', '/contact'], ['FAQ', '/faq']] },
  { title: 'Governance', links: [['Privacy', '/privacy'], ['Terms', '/terms'], ['Sitemap', '/sitemap'], ['Search', '/search']] },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08111f] text-white">
      <div className="v2-shell grid gap-10 py-16 lg:grid-cols-[1.1fr_1.4fr]">
        <div>
          <p className="v2-eyebrow">Synova Infotech</p>
          <h2 className="max-w-xl font-heading text-4xl font-black leading-none">Enterprise technology systems engineered for trust, scale, and long-term change.</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/62">Pune-based technology partner for business-critical software, cloud, AI, data, cybersecurity, and digital operations.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-black uppercase tracking-[.16em] text-[var(--color-corporate-gold)]">{column.title}</h3>
              <ul className="mt-4 grid gap-3">
                {column.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-white/64 transition hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/44">
        (c) {new Date().getFullYear()} Synova Infotech Private Limited. All rights reserved.
      </div>
    </footer>
  )
}

