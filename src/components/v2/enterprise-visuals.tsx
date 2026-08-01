import Link from "next/link"
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react"
import {
  v2Industries,
  type V2PageContent,
  v2Process,
  v2Services,
  v2TechnologyNodes,
} from "./experience-data"

interface V2HeroProps {
  content: V2PageContent
  variant?: "home" | "page" | "compact"
}

export function V2Hero({ content, variant = "page" }: V2HeroProps) {
  const isHome = variant === "home"

  return (
    <section className={`v2-hero v2-section ${isHome ? "v2-hero-home" : ""}`}>
      <div className="v2-shell v2-hero-grid">
        <div className="v2-hero-copy">
          <p className="v2-eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className="v2-lede">{content.summary}</p>
          {(content.primaryCta || content.secondaryCta) && (
            <div className="v2-actions" aria-label="Primary actions">
              {content.primaryCta && content.primaryHref && (
                <Link className="v2-button v2-button-primary" href={content.primaryHref}>
                  {content.primaryCta}
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
              )}
              {content.secondaryCta && content.secondaryHref && (
                <Link className="v2-button v2-button-secondary" href={content.secondaryHref}>
                  {content.secondaryCta}
                </Link>
              )}
            </div>
          )}
        </div>
        <EnterpriseConstellation />
      </div>
    </section>
  )
}

export function EnterpriseConstellation() {
  return (
    <div className="v2-constellation" aria-label="Enterprise architecture visualization">
      <div className="v2-orbit v2-orbit-one" />
      <div className="v2-orbit v2-orbit-two" />
      <div className="v2-core">
        <span>Synova</span>
        <strong>Operating Core</strong>
      </div>
      {["AI", "Cloud", "Data", "Security", "Apps", "Ops"].map((node, index) => (
        <span className={`v2-node v2-node-${index + 1}`} key={node}>
          {node}
        </span>
      ))}
      <svg className="v2-lines" viewBox="0 0 500 500" role="img" aria-label="Connected platform lines">
        <path d="M250 70 L410 180 L350 385 L145 385 L90 180 Z" />
        <path d="M250 70 L250 250 L410 180 M250 250 L350 385 M250 250 L145 385 M250 250 L90 180" />
      </svg>
    </div>
  )
}

export function V2ServicesShowcase() {
  return (
    <section className="v2-section v2-light">
      <div className="v2-shell">
        <div className="v2-section-heading v2-wide">
          <p className="v2-eyebrow">Chapter 2: Service Architecture</p>
          <h2>Each capability is designed as an operating system for business change.</h2>
        </div>
        <div className="v2-service-stories">
          {v2Services.map((service, index) => (
            <article className="v2-service-story" key={service.name}>
              <div className="v2-story-index">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <h3>{service.name}</h3>
                <p>{service.impact}</p>
              </div>
              <ul>
                {service.architecture.map((item) => (
                  <li key={item}>
                    <CheckCircle2 aria-hidden="true" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function V2IndustryAtlas() {
  return (
    <section className="v2-section v2-dark">
      <div className="v2-shell v2-atlas-grid">
        <div>
          <p className="v2-eyebrow">Chapter 3: Industry Atlas</p>
          <h2>Domain decisions shape the architecture before implementation begins.</h2>
          <p className="v2-muted">
            Compliance rules, uptime expectations, field workflows, integration dependencies, and data quality thresholds become design constraints.
          </p>
        </div>
        <div className="v2-map" aria-label="Industry hub map">
          {v2Industries.map((industry, index) => (
            <span className={`v2-hub v2-hub-${index + 1}`} key={industry}>
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function V2ProcessRail() {
  return (
    <section className="v2-section">
      <div className="v2-shell">
        <div className="v2-section-heading">
          <p className="v2-eyebrow">Chapter 4: Delivery System</p>
          <h2>Cinematic to read. Operationally strict to run.</h2>
        </div>
        <ol className="v2-process">
          {v2Process.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function V2TechnologyTopology() {
  return (
    <section className="v2-section v2-light">
      <div className="v2-shell v2-topology-grid">
        <div>
          <p className="v2-eyebrow">Technology Topology</p>
          <h2>We select stacks for operational maturity, not novelty.</h2>
          <p className="v2-muted">
            Architecture reviews evaluate failure modes, integration contracts, talent availability, vendor risk, security controls, and maintainability.
          </p>
        </div>
        <div className="v2-topology" aria-label="Technology dependency graph">
          {v2TechnologyNodes.map((node, index) => (
            <span className={`v2-tech-node v2-tech-${index + 1}`} key={node}>
              {node}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function V2CaseStudyEditorial() {
  return (
    <section className="v2-section">
      <div className="v2-shell v2-editorial">
        <div>
          <p className="v2-eyebrow">Case Study Model</p>
          <h2>Strategy, architecture, implementation, and operating lessons in one executive narrative.</h2>
        </div>
        <div className="v2-editorial-panel">
          <span>Editorial Framework</span>
          <p>Problem statement to decision model to reference architecture to implementation controls to measured business adoption.</p>
          <Link href="/case-studies">
            Read case studies
            <ExternalLink aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function V2Cta() {
  return (
    <section className="v2-section v2-cta">
      <div className="v2-shell v2-cta-inner">
        <p className="v2-eyebrow">Enterprise Consultation</p>
        <h2>Bring your current platform, risk register, or transformation roadmap.</h2>
        <Link className="v2-button v2-button-primary" href="/contact">
          Talk with Synova
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  )
}

export function V2PageFrame({
  content,
  children,
}: {
  content: V2PageContent
  children?: React.ReactNode
}) {
  return (
    <>
      <V2Hero content={content} />
      {children}
      <V2Cta />
    </>
  )
}
