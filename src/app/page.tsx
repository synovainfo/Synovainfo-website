import {
  V2CaseStudyEditorial,
  V2Hero,
  V2IndustryAtlas,
  V2ProcessRail,
  V2ServicesShowcase,
  V2TechnologyTopology,
  V2Cta,
} from '@/components/v2/enterprise-visuals'
import { v2Pages } from '@/components/v2/experience-data'

export const revalidate = 60

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <V2Hero content={v2Pages.home} variant="home" />
      <V2ServicesShowcase />
      <V2IndustryAtlas />
      <V2ProcessRail />
      <V2TechnologyTopology />
      <V2CaseStudyEditorial />
      <V2Cta />
    </div>
  )
}
