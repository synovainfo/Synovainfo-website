import Hero from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { CoreValues } from '@/components/sections/core-values'
import { Technologies } from '@/components/sections/technologies'
import { Services } from '@/components/sections/services'
import { WhySynova } from '@/components/sections/why-synova'
import { Portfolio } from '@/components/sections/portfolio'
import { Process } from '@/components/sections/process'
import { Industries } from '@/components/sections/industries'
import { Testimonials } from '@/components/sections/testimonials'
import { Stats } from '@/components/sections/stats'
import { Certifications } from '@/components/sections/certifications'
import { Careers } from '@/components/sections/careers'
import { Contact } from '@/components/sections/contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Portfolio />
      <WhySynova />

      <Process />

      <Industries />

      <Stats />

      <Certifications />

      <Technologies />

      <Testimonials />

      <About />
      <CoreValues />

      <Careers />

      <Contact />
    </>
  );
}
