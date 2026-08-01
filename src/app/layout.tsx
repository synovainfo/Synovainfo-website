import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { PageTransition } from "@/components/animations/page-transition";
import JsonLd from "./json-ld";
import { inter, plusJakartaSans, manrope, instrumentSerif } from "@/styles/fonts";
import { CookieConsent } from "@/components/ui/cookie-consent";

export { metadata } from "./seo";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakartaSans.variable} ${manrope.variable} ${instrumentSerif.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('synova-theme');if(!t){t=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t);if(t==="dark")document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark");}catch(e){}})()`,
          }}
        />
        <JsonLd />
        <link rel="alternate" hrefLang="en-IN" href="https://synovainfo.com/" />
        <link rel="alternate" hrefLang="en-US" href="https://synovainfo.com/" />
        <link rel="alternate" hrefLang="en-GB" href="https://synovainfo.com/" />
        <link rel="alternate" hrefLang="en-SG" href="https://synovainfo.com/" />
        <link rel="alternate" hrefLang="x-default" href="https://synovainfo.com/" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Skip-to-content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--color-accent-blue)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        <AuthProvider>
          <ThemeProvider>
            <Header />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
            <Footer />
            <CookieConsent />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
