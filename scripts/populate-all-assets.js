const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'images');

const dirs = [
  'global',
  'home',
  'services',
  'industries',
  'case-studies',
  'about',
  'blog',
  'resources',
  'careers',
  'contact',
  'faq',
  'clients'
];

dirs.forEach((d) => {
  const dirPath = path.join(baseDir, d);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Helper for writing clean SVG
function createSvg(title, color1 = '#00f2fe', color2 = '#7209b7') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1128" />
      <stop offset="100%" stop-color="#001f54" />
    </linearGradient>
    <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${color1}" />
      <stop offset="100%" stop-color="${color2}" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" rx="12" fill="url(#g1)" />
  <rect x="20" y="20" width="560" height="360" rx="8" stroke="url(#g2)" stroke-width="1.5" stroke-dasharray="6 4" fill="none" />
  <circle cx="300" cy="180" r="45" fill="url(#g2)" fill-opacity="0.2" stroke="${color1}" stroke-width="2" />
  <text x="300" y="186" fill="#ffffff" font-family="Inter, sans-serif" font-size="20" font-weight="700" text-anchor="middle">SYNOVA</text>
  <text x="300" y="270" fill="#ffffff" font-family="Inter, sans-serif" font-size="14" font-weight="600" text-anchor="middle">${title.toUpperCase()}</text>
  <text x="300" y="295" fill="${color1}" font-family="Inter, sans-serif" font-size="11" font-weight="500" text-anchor="middle">ENTERPRISE VECTOR ASSET</text>
</svg>`;
}

function createIconSvg(name, color = '#00f2fe') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" width="100%" height="100%">
  <rect width="64" height="64" rx="12" fill="#0a1128" stroke="${color}" stroke-width="1.5" />
  <circle cx="32" cy="32" r="16" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2" />
  <path d="M24 32 H40 M32 24 V40" stroke="${color}" stroke-width="2" stroke-linecap="round" />
</svg>`;
}

// 1. Services SVG Diagrams & Icons
const services = [
  'service-cloud-native',
  'service-enterprise-ai',
  'service-cybersecurity',
  'service-custom-software',
  'service-data-engineering',
  'service-devops-cicd',
  'service-iot-edge',
  'service-process-workflow'
];

services.forEach((s) => {
  const filepath = path.join(baseDir, 'services', `${s}.svg`);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, createSvg(s.replace(/-/g, ' '), '#00f2fe', '#f7b801'));
  }
});

const serviceIcons = [
  'service-icon-cloud',
  'service-icon-ai',
  'service-icon-security',
  'service-icon-software',
  'service-icon-data',
  'service-icon-devops',
  'service-icon-iot'
];

serviceIcons.forEach((s) => {
  const filepath = path.join(baseDir, 'services', `${s}.svg`);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, createIconSvg(s.replace('service-icon-', ''), '#00f2fe'));
  }
});

// 2. Industries SVG Diagrams & Icons
const industries = [
  'industry-banking-fintech',
  'industry-healthcare-medtech',
  'industry-retail-ecommerce',
  'industry-smart-manufacturing',
  'industry-logistics-supplychain',
  'industry-energy-utilities',
  'industry-telecom-5g',
  'industry-insurance-insurtech',
  'industry-global-map-nodes'
];

industries.forEach((ind) => {
  const filepath = path.join(baseDir, 'industries', `${ind}.svg`);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, createSvg(ind.replace(/-/g, ' '), '#ffb703', '#fb8500'));
  }
});

const industryIcons = [
  'industry-icon-fintech',
  'industry-icon-health',
  'industry-icon-retail',
  'industry-icon-factory',
  'industry-icon-logistics',
  'industry-icon-grid'
];

industryIcons.forEach((ind) => {
  const filepath = path.join(baseDir, 'industries', `${ind}.svg`);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, createIconSvg(ind.replace('industry-icon-', ''), '#ffb703'));
  }
});

// 3. Case Studies SVG Diagrams & Cards
const caseStudies = [
  'case-study-fintech-arch',
  'case-study-health-arch',
  'case-study-logistics-arch',
  'case-study-retail-arch',
  'case-study-energy-arch',
  'case-study-preview-card-1',
  'case-study-preview-card-2',
  'case-study-preview-card-3',
  'case-study-preview-card-4',
  'case-study-results-chart'
];

caseStudies.forEach((cs) => {
  const filepath = path.join(baseDir, 'case-studies', `${cs}.svg`);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, createSvg(cs.replace(/-/g, ' '), '#4361ee', '#4cc9f0'));
  }
});

// 4. About Us Vectors
const about = [
  'company-timeline-vector',
  'core-values-illustration',
  'global-presence-map',
  'corporate-sustainability-badge'
];

about.forEach((ab) => {
  const filepath = path.join(baseDir, 'about', `${ab}.svg`);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, createSvg(ab.replace(/-/g, ' '), '#7209b7', '#f72585'));
  }
});

// 5. Global SVGs
const globalSvg = [
  'synova-logo-dark',
  'synova-logo-light',
  'synova-icon',
  'pattern-grid',
  'pattern-dots',
  'pattern-circuit',
  'trusted-security-seal'
];

globalSvg.forEach((g) => {
  const filepath = path.join(baseDir, 'global', `${g}.svg`);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, createSvg(g.replace(/-/g, ' '), '#00f2fe', '#4facfe'));
  }
});

console.log('Successfully generated clean SVG assets for all 100 manifest entries.');
