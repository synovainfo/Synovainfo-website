const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'images');

// ── SERVICES SVGs ──────────────────────────────────────────────

const servicesMap = {
  'service-cloud-native.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <rect width="600" height="400" rx="12" fill="#090d16" />
  <text x="30" y="40" fill="#38bdf8" font-family="Inter, sans-serif" font-size="14" font-weight="700">CLOUD NATIVE KUBERNETES &amp; SERVICE MESH</text>
  <rect x="40" y="70" width="240" height="280" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
  <text x="60" y="100" fill="#94a3b8" font-family="Inter, sans-serif" font-size="12" font-weight="600">CLUSTER ALPHA (AWS EKS)</text>
  <rect x="60" y="120" width="200" height="50" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
  <circle cx="85" cy="145" r="8" fill="#38bdf8" />
  <text x="105" y="142" fill="#fff" font-family="Inter, sans-serif" font-size="11" font-weight="600">Ingress NGINX</text>
  <text x="105" y="156" fill="#64748b" font-family="Inter, sans-serif" font-size="9">TLS Termination</text>
  <rect x="60" y="185" width="200" height="50" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
  <circle cx="85" cy="210" r="8" fill="#818cf8" />
  <text x="105" y="207" fill="#fff" font-family="Inter, sans-serif" font-size="11" font-weight="600">Istio Service Proxy</text>
  <text x="105" y="221" fill="#64748b" font-family="Inter, sans-serif" font-size="9">mTLS Envoy Mesh</text>
  <rect x="60" y="250" width="200" height="80" rx="6" fill="#1e293b" stroke="#818cf8" stroke-width="1" />
  <text x="75" y="275" fill="#f8fafc" font-family="Inter, sans-serif" font-size="11" font-weight="600">Pods (3/3 Replicas)</text>
  <circle cx="85" cy="300" r="6" fill="#4ade80" />
  <circle cx="105" cy="300" r="6" fill="#4ade80" />
  <circle cx="125" cy="300" r="6" fill="#4ade80" />
  <text x="145" y="304" fill="#94a3b8" font-family="Inter, sans-serif" font-size="10">Auto-Scaled HPA</text>
  <rect x="320" y="70" width="240" height="280" rx="10" fill="#0f172a" stroke="#818cf8" stroke-width="1.5" />
  <text x="340" y="100" fill="#94a3b8" font-family="Inter, sans-serif" font-size="12" font-weight="600">CLUSTER BETA (AZURE AKS)</text>
  <rect x="340" y="120" width="200" height="210" rx="6" fill="#1e293b" stroke="#818cf8" stroke-width="1" />
  <text x="355" y="150" fill="#818cf8" font-family="Inter, sans-serif" font-size="12" font-weight="600">Cross-Cloud Mesh Sync</text>
  <path d="M280 210 H320" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 4" />
</svg>`,

  'service-enterprise-ai.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <rect width="600" height="400" rx="12" fill="#0c0a09" />
  <text x="30" y="40" fill="#fbbf24" font-family="Inter, sans-serif" font-size="14" font-weight="700">ENTERPRISE AI &amp; LLM INFERENCE RAG ENGINE</text>
  <circle cx="300" cy="200" r="110" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="6 4" />
  <circle cx="300" cy="200" r="70" fill="#1c1917" stroke="#f59e0b" stroke-width="2" />
  <text x="300" y="195" fill="#fff" font-family="Inter, sans-serif" font-size="14" font-weight="800" text-anchor="middle">AUTONOMOUS LLM</text>
  <text x="300" y="215" fill="#fbbf24" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">Vector Vector Embedding</text>
  <!-- Nodes around -->
  <g fill="#f59e0b">
    <circle cx="300" cy="90" r="14" />
    <circle cx="410" cy="200" r="14" />
    <circle cx="300" cy="310" r="14" />
    <circle cx="190" cy="200" r="14" />
  </g>
  <text x="300" y="94" fill="#000" font-family="Inter, sans-serif" font-size="9" font-weight="700" text-anchor="middle">API</text>
  <text x="410" y="204" fill="#000" font-family="Inter, sans-serif" font-size="9" font-weight="700" text-anchor="middle">RAG</text>
  <text x="300" y="314" fill="#000" font-family="Inter, sans-serif" font-size="9" font-weight="700" text-anchor="middle">DATA</text>
  <text x="190" y="204" fill="#000" font-family="Inter, sans-serif" font-size="9" font-weight="700" text-anchor="middle">MODEL</text>
</svg>`,

  'service-cybersecurity.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <rect width="600" height="400" rx="12" fill="#020617" />
  <text x="30" y="40" fill="#38bdf8" font-family="Inter, sans-serif" font-size="14" font-weight="700">ZERO TRUST CYBERSECURITY SHIELD</text>
  <path d="M300 90 L420 150 V260 C420 330 300 370 300 370 C300 370 180 330 180 260 V150 L300 90 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="3" />
  <path d="M300 120 L390 165 V245 C390 300 300 335 300 335 C300 335 210 300 210 245 V165 L300 120 Z" fill="#1e293b" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="6 4" />
  <circle cx="300" cy="225" r="22" fill="#38bdf8" />
  <path d="M292 225 L298 231 L310 219" stroke="#020617" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  <text x="300" y="275" fill="#fff" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">AES-256 HSM KEY VAULT</text>
</svg>`,

  'service-custom-software.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <rect width="600" height="400" rx="12" fill="#050505" />
  <text x="30" y="40" fill="#a855f7" font-family="Inter, sans-serif" font-size="14" font-weight="700">DISTRIBUTED MICROSERVICES SOFTWARE</text>
  <rect x="50" y="90" width="140" height="220" rx="8" fill="#18181b" stroke="#a855f7" stroke-width="1.5" />
  <text x="120" y="120" fill="#a855f7" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Frontend Layer</text>
  <rect x="70" y="140" width="100" height="40" rx="6" fill="#27272a" />
  <text x="120" y="164" fill="#fff" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">Next.js App</text>
  <rect x="230" y="90" width="140" height="220" rx="8" fill="#18181b" stroke="#ec4899" stroke-width="1.5" />
  <text x="300" y="120" fill="#ec4899" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">API Mesh</text>
  <rect x="250" y="140" width="100" height="40" rx="6" fill="#27272a" />
  <text x="300" y="164" fill="#fff" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">GraphQL / gRPC</text>
  <rect x="410" y="90" width="140" height="220" rx="8" fill="#18181b" stroke="#3b82f6" stroke-width="1.5" />
  <text x="480" y="120" fill="#3b82f6" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Data Services</text>
  <rect x="430" y="140" width="100" height="40" rx="6" fill="#27272a" />
  <text x="480" y="164" fill="#fff" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">PostgreSQL / Redis</text>
</svg>`,

  'service-data-engineering.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <rect width="600" height="400" rx="12" fill="#030712" />
  <text x="30" y="40" fill="#10b981" font-family="Inter, sans-serif" font-size="14" font-weight="700">REAL-TIME KAFKA DATA STREAMING PIPELINE</text>
  <path d="M50 200 C 150 120, 250 280, 350 200 T 550 200" stroke="#10b981" stroke-width="4" fill="none" />
  <circle cx="150" cy="160" r="10" fill="#34d399" />
  <circle cx="250" cy="240" r="10" fill="#34d399" />
  <circle cx="350" cy="200" r="10" fill="#059669" />
  <circle cx="450" cy="160" r="10" fill="#34d399" />
  <rect x="200" y="290" width="200" height="60" rx="8" fill="#111827" stroke="#10b981" stroke-width="1.5" />
  <text x="300" y="325" fill="#fff" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">1,000,000 Events / Sec</text>
</svg>`,

  'service-devops-cicd.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <rect width="600" height="400" rx="12" fill="#0f172a" />
  <text x="30" y="40" fill="#f43f5e" font-family="Inter, sans-serif" font-size="14" font-weight="700">GITOPS DEVOPS CI/CD PIPELINE</text>
  <!-- Infinity Loop -->
  <path d="M200 200 C 100 120, 100 280, 200 200 C 300 120, 500 120, 400 200 C 300 280, 100 280, 200 200 Z" stroke="#f43f5e" stroke-width="4" fill="none" />
  <circle cx="150" cy="170" r="12" fill="#fb7185" />
  <text x="150" y="174" fill="#000" font-family="Inter, sans-serif" font-size="9" font-weight="700" text-anchor="middle">PLAN</text>
  <circle cx="450" cy="170" r="12" fill="#fb7185" />
  <text x="450" y="174" fill="#000" font-family="Inter, sans-serif" font-size="9" font-weight="700" text-anchor="middle">DEPLOY</text>
</svg>`,

  'service-iot-edge.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <rect width="600" height="400" rx="12" fill="#030712" />
  <text x="30" y="40" fill="#06b6d4" font-family="Inter, sans-serif" font-size="14" font-weight="700">INDUSTRIAL IOT EDGE TELEMETRY MESH</text>
  <rect x="220" y="140" width="160" height="120" rx="10" fill="#111827" stroke="#06b6d4" stroke-width="2" />
  <text x="300" y="195" fill="#fff" font-family="Inter, sans-serif" font-size="14" font-weight="800" text-anchor="middle">EDGE GATEWAY</text>
  <!-- Sensor nodes around -->
  <circle cx="100" cy="100" r="25" fill="#164e63" stroke="#22d3ee" stroke-width="1.5" />
  <text x="100" y="104" fill="#fff" font-family="Inter, sans-serif" font-size="9" font-weight="700" text-anchor="middle">SENSOR 1</text>
  <circle cx="500" cy="100" r="25" fill="#164e63" stroke="#22d3ee" stroke-width="1.5" />
  <text x="500" y="104" fill="#fff" font-family="Inter, sans-serif" font-size="9" font-weight="700" text-anchor="middle">SENSOR 2</text>
  <circle cx="100" cy="300" r="25" fill="#164e63" stroke="#22d3ee" stroke-width="1.5" />
  <text x="100" y="304" fill="#fff" font-family="Inter, sans-serif" font-size="9" font-weight="700" text-anchor="middle">SENSOR 3</text>
  <circle cx="500" cy="300" r="25" fill="#164e63" stroke="#22d3ee" stroke-width="1.5" />
  <text x="500" y="304" fill="#fff" font-family="Inter, sans-serif" font-size="9" font-weight="700" text-anchor="middle">SENSOR 4</text>
  <!-- Lines -->
  <line x1="125" y1="115" x2="220" y2="160" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="4 4" />
  <line x1="475" y1="115" x2="380" y2="160" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="4 4" />
  <line x1="125" y1="285" x2="220" y2="240" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="4 4" />
  <line x1="475" y1="285" x2="380" y2="240" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="4 4" />
</svg>`,

  'service-process-workflow.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 400" fill="none" width="100%" height="100%">
  <rect width="1000" height="400" rx="16" fill="#090d16" />
  <text x="40" y="45" fill="#f59e0b" font-family="Inter, sans-serif" font-size="16" font-weight="700">ENTERPRISE 6-PHASE ENGINEERING LIFECYCLE</text>
  <g transform="translate(40, 100)">
    <!-- Phase 1 -->
    <rect x="0" y="0" width="135" height="180" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
    <text x="67" y="35" fill="#38bdf8" font-family="Inter, sans-serif" font-size="12" font-weight="800" text-anchor="middle">PHASE 1</text>
    <text x="67" y="60" fill="#fff" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Discovery</text>
    <text x="67" y="85" fill="#94a3b8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">Architecture Audit</text>

    <!-- Phase 2 -->
    <rect x="150" y="0" width="135" height="180" rx="10" fill="#1e293b" stroke="#818cf8" stroke-width="1.5" />
    <text x="217" y="35" fill="#818cf8" font-family="Inter, sans-serif" font-size="12" font-weight="800" text-anchor="middle">PHASE 2</text>
    <text x="217" y="60" fill="#fff" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Design</text>
    <text x="217" y="85" fill="#94a3b8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">Domain Blueprints</text>

    <!-- Phase 3 -->
    <rect x="300" y="0" width="135" height="180" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" />
    <text x="367" y="35" fill="#f59e0b" font-family="Inter, sans-serif" font-size="12" font-weight="800" text-anchor="middle">PHASE 3</text>
    <text x="367" y="60" fill="#fff" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Develop</text>
    <text x="367" y="85" fill="#94a3b8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">Microservices Build</text>

    <!-- Phase 4 -->
    <rect x="450" y="0" width="135" height="180" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
    <text x="517" y="35" fill="#10b981" font-family="Inter, sans-serif" font-size="12" font-weight="800" text-anchor="middle">PHASE 4</text>
    <text x="517" y="60" fill="#fff" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Test</text>
    <text x="517" y="85" fill="#94a3b8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">Security &amp; Load</text>

    <!-- Phase 5 -->
    <rect x="600" y="0" width="135" height="180" rx="10" fill="#1e293b" stroke="#ec4899" stroke-width="1.5" />
    <text x="667" y="35" fill="#ec4899" font-family="Inter, sans-serif" font-size="12" font-weight="800" text-anchor="middle">PHASE 5</text>
    <text x="667" y="60" fill="#fff" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Deploy</text>
    <text x="667" y="85" fill="#94a3b8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">Zero-Downtime Rollout</text>

    <!-- Phase 6 -->
    <rect x="750" y="0" width="135" height="180" rx="10" fill="#1e293b" stroke="#06b6d4" stroke-width="1.5" />
    <text x="817" y="35" fill="#06b6d4" font-family="Inter, sans-serif" font-size="12" font-weight="800" text-anchor="middle">PHASE 6</text>
    <text x="817" y="60" fill="#fff" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Operate</text>
    <text x="817" y="85" fill="#94a3b8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">24/7 SLA Telemetry</text>
  </g>
</svg>`
};

// ── Write Services ─────────────────────────────────────────────
Object.entries(servicesMap).forEach(([filename, content]) => {
  const filepath = path.join(baseDir, 'services', filename);
  fs.writeFileSync(filepath, content);
});

// ── INDUSTRIES SVGs ────────────────────────────────────────────

const industriesMap = {
  'industry-banking-fintech.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <rect width="600" height="400" rx="12" fill="#0a0915" />
  <text x="30" y="40" fill="#f59e0b" font-family="Inter, sans-serif" font-size="14" font-weight="700">CORE BANKING &amp; HIGH-THROUGHPUT FINTECH ENGINE</text>
  <rect x="150" y="100" width="300" height="200" rx="12" fill="#181528" stroke="#f59e0b" stroke-width="2" />
  <text x="300" y="140" fill="#fff" font-family="Inter, sans-serif" font-size="16" font-weight="800" text-anchor="middle">100,000 TPS ENGINE</text>
  <rect x="180" y="170" width="240" height="40" rx="6" fill="#2d2645" />
  <text x="300" y="195" fill="#f59e0b" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">ISO 20022 Financial Messaging</text>
  <rect x="180" y="225" width="240" height="40" rx="6" fill="#2d2645" />
  <text x="300" y="250" fill="#10b981" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Sub-Millisecond Settlement</text>
</svg>`,

  'industry-healthcare-medtech.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <rect width="600" height="400" rx="12" fill="#02141a" />
  <text x="30" y="40" fill="#06b6d4" font-family="Inter, sans-serif" font-size="14" font-weight="700">HIPAA COMPLIANT DIGITAL HEALTHCARE PLATFORM</text>
  <circle cx="300" cy="200" r="90" fill="#083344" stroke="#06b6d4" stroke-width="2" />
  <path d="M300 140 V260 M240 200 H360" stroke="#22d3ee" stroke-width="8" stroke-linecap="round" />
  <text x="300" y="325" fill="#fff" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">FHIR API &amp; Medical Diagnostic AI</text>
</svg>`,

  'industry-retail-ecommerce.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <rect width="600" height="400" rx="12" fill="#0f0c1b" />
  <text x="30" y="40" fill="#ec4899" font-family="Inter, sans-serif" font-size="14" font-weight="700">COMPOSABLE HEADLESS RETAIL COMMERCE</text>
  <rect x="80" y="120" width="120" height="160" rx="8" fill="#241b38" stroke="#ec4899" stroke-width="1.5" />
  <text x="140" y="200" fill="#fff" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Storefront</text>
  <rect x="240" y="120" width="120" height="160" rx="8" fill="#241b38" stroke="#a855f7" stroke-width="1.5" />
  <text x="300" y="200" fill="#fff" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">GraphQL Mesh</text>
  <rect x="400" y="120" width="120" height="160" rx="8" fill="#241b38" stroke="#3b82f6" stroke-width="1.5" />
  <text x="460" y="200" fill="#fff" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Inventory ERP</text>
</svg>`,

  'industry-smart-manufacturing.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <rect width="600" height="400" rx="12" fill="#140f07" />
  <text x="30" y="40" fill="#f97316" font-family="Inter, sans-serif" font-size="14" font-weight="700">SMART FACTORY INDUSTRY 4.0 DIGITAL TWIN</text>
  <circle cx="200" cy="210" r="60" stroke="#f97316" stroke-width="3" fill="none" stroke-dasharray="8 4" />
  <circle cx="400" cy="210" r="60" stroke="#f97316" stroke-width="3" fill="none" stroke-dasharray="8 4" />
  <path d="M260 210 H340" stroke="#fbcfe8" stroke-width="4" />
  <text x="300" y="320" fill="#fff" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Predictive Robotics &amp; Edge Sensors</text>
</svg>`,

  'industry-logistics-supplychain.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" width="100%" height="100%">
  <rect width="600" height="400" rx="12" fill="#031525" />
  <text x="30" y="40" fill="#38bdf8" font-family="Inter, sans-serif" font-size="14" font-weight="700">GLOBAL SUPPLY CHAIN VISIBILITY ENGINE</text>
  <path d="M80 300 Q 200 100, 300 200 T 520 120" stroke="#38bdf8" stroke-width="3" fill="none" stroke-dasharray="6 4" />
  <circle cx="80" cy="300" r="10" fill="#38bdf8" />
  <circle cx="300" cy="200" r="10" fill="#0284c7" />
  <circle cx="520" cy="120" r="10" fill="#38bdf8" />
  <text x="300" y="325" fill="#fff" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Real-Time Autonomous Fleet Route Optimization</text>
</svg>`
};

Object.entries(industriesMap).forEach(([filename, content]) => {
  const filepath = path.join(baseDir, 'industries', filename);
  fs.writeFileSync(filepath, content);
});

console.log('Successfully generated distinct SVG vector graphics for all major enterprise domains!');
