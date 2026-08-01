/**
 * Curated SVG asset mapping for the Services page.
 *
 * Service records store a Lucide icon name (e.g. "Cloud", "Brain"); each
 * name resolves to a branded icon SVG (64×64 chip) for the card icon tile
 * and a larger illustration (square / banner) used as the card art band.
 * Unknown names fall back to the software assets so every card is always
 * decorated.
 */

export const SERVICE_ICON_ASSETS: Readonly<Record<string, string>> = {
  // AI / ML
  Brain: '/images/services/service-icon-ai.svg',
  Sparkles: '/images/services/service-icon-ai.svg',
  // Cloud
  Cloud: '/images/services/service-icon-cloud.svg',
  Container: '/images/services/service-icon-cloud.svg',
  // Data
  Database: '/images/services/service-icon-data.svg',
  // DevOps / Engineering
  Server: '/images/services/service-icon-devops.svg',
  Terminal: '/images/services/service-icon-devops.svg',
  Wrench: '/images/services/service-icon-devops.svg',
  Zap: '/images/services/service-icon-devops.svg',
  // Security
  Shield: '/images/services/service-icon-security.svg',
  ShieldCheck: '/images/services/service-icon-security.svg',
  // Software / Development
  Code2: '/images/services/service-icon-software.svg',
  FileCode: '/images/services/service-icon-software.svg',
  Smartphone: '/images/services/service-icon-software.svg',
  Monitor: '/images/services/service-icon-software.svg',
  // IoT / Edge
  Globe: '/images/services/service-icon-iot.svg',
  Factory: '/images/services/service-icon-iot.svg',
  Wifi: '/images/services/service-icon-iot.svg',
  ScanLine: '/images/services/service-icon-iot.svg',
}

export const SERVICE_ART_ASSETS: Readonly<Record<string, string>> = {
  // AI / ML
  Brain: '/images/services/service-ai-ml.svg',
  Sparkles: '/images/services/service-enterprise-ai.svg',
  // Cloud
  Cloud: '/images/services/service-cloud-native.svg',
  Container: '/images/services/service-cloud.svg',
  // Data
  Database: '/images/services/service-data-engineering.svg',
  // DevOps / Engineering
  Server: '/images/services/service-devops-cicd.svg',
  Terminal: '/images/services/service-devops-cicd.svg',
  Zap: '/images/services/service-devops-cicd.svg',
  Wrench: '/images/services/service-devops.svg',
  // Security
  Shield: '/images/services/service-cybersecurity.svg',
  ShieldCheck: '/images/services/service-cybersecurity.svg',
  // Software / Development
  Code2: '/images/services/service-software-dev.svg',
  FileCode: '/images/services/service-software-dev.svg',
  Smartphone: '/images/services/service-custom-software.svg',
  Monitor: '/images/services/service-software-dev.svg',
  // IoT / Edge
  Globe: '/images/services/service-iot-edge.svg',
  Factory: '/images/services/service-iot.svg',
  Wifi: '/images/services/service-iot-edge.svg',
  ScanLine: '/images/services/service-iot-edge.svg',
  // Consulting / Support
  Users: '/images/services/service-consulting.svg',
  Headphones: '/images/services/service-consulting.svg',
  // Workflow / Platform
  Layers: '/images/services/service-process-workflow.svg',
  Component: '/images/services/service-process-workflow.svg',
}

const DEFAULT_SERVICE_ICON = SERVICE_ICON_ASSETS.Code2
const DEFAULT_SERVICE_ART = SERVICE_ART_ASSETS.Code2

export function resolveServiceIconAsset(icon: string | null | undefined): string {
  if (!icon) return DEFAULT_SERVICE_ICON
  return SERVICE_ICON_ASSETS[icon] ?? DEFAULT_SERVICE_ICON
}

export function resolveServiceArtAsset(icon: string | null | undefined): string {
  if (!icon) return DEFAULT_SERVICE_ART
  return SERVICE_ART_ASSETS[icon] ?? DEFAULT_SERVICE_ART
}
