<?php
/**
 * Preview seed — creates laravel/database/preview.sqlite with the tables the
 * public Laravel routes need and seeds representative corporate content.
 *
 * Run from the repo root:  php .freebuff/seed-preview.php
 * DB is gitignored (database/.gitignore → *.sqlite*). Re-run to reset.
 */

$dbPath = __DIR__ . '/../laravel/database/preview.sqlite';
@unlink($dbPath);
$pdo = new PDO('sqlite:' . $dbPath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec('PRAGMA foreign_keys = ON');

$now = date('Y-m-d H:i:s');

// ---------------------------------------------------------------------------
// PAGES + SECTIONS (feed homepage + about/approach/architecture)
// ---------------------------------------------------------------------------
$pdo->exec('CREATE TABLE pages (
    id TEXT PRIMARY KEY, title TEXT, slug TEXT, content TEXT, excerpt TEXT,
    status TEXT, featured_image TEXT, template TEXT, published_at TEXT,
    scheduled_at TEXT, author_id TEXT, parent_id TEXT, custom_css TEXT,
    created_at TEXT, updated_at TEXT, deleted_at TEXT
)');
$pdo->exec('CREATE TABLE page_sections (
    id TEXT PRIMARY KEY, page_id TEXT, section_type TEXT, title TEXT,
    content TEXT, settings TEXT, is_visible INTEGER, "order" INTEGER,
    created_at TEXT, updated_at TEXT
)');

$insertPage = $pdo->prepare('INSERT INTO pages
    (id, title, slug, content, excerpt, status, template, published_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
$pages = [
    ['page-home',   'Enterprise Software Solutions & Digital Transformation', '/',
     '<p>Synova Infotech architects mission-critical enterprise platforms.</p>',
     'Cloud-native engineering, AI-driven automation, and zero-trust security.',
     'PUBLISHED', 'home', $now, $now, $now],
    ['page-about',  'About Us — Enterprise Technology Consulting', 'about',
     '<p>Premier enterprise technology consultancy for Fortune 500 environments.</p>',
     'Large-scale digital transformation, custom ecosystem development.',
     'PUBLISHED', 'default', $now, $now, $now],
    ['page-approach', 'Our Approach — Enterprise Architecture Methodology', 'approach',
     '<h2>Architecture-first engineering</h2><p>A disciplined methodology from discovery to governed delivery.</p>',
     'Discover the Synova delivery methodology.', 'PUBLISHED', 'default', $now, $now, $now],
    ['page-architecture', 'Architecture — Mission-Critical Platform Design', 'architecture',
     '<h2>Multi-cloud, zero-trust, AI-native</h2><p>Resilient platform design with observability baked in.</p>',
     'Platform design for mission-critical workloads.', 'PUBLISHED', 'default', $now, $now, $now],
];
foreach ($pages as $p) { $insertPage->execute($p); }

// ---------------------------------------------------------------------------
// USERS (author/creator relations)
// ---------------------------------------------------------------------------
$pdo->exec('CREATE TABLE users (
    id TEXT PRIMARY KEY, name TEXT, email TEXT, password TEXT, image TEXT,
    is_active INTEGER, last_login_at TEXT, email_verified_at TEXT,
    remember_token TEXT, created_at TEXT, updated_at TEXT
)');
$pdo->exec("INSERT INTO users (id, name, email, password, is_active, created_at, updated_at)
    VALUES ('user-1', 'Synova Editorial', 'editorial@synovainfo.com', '', 1, '$now', '$now')");

// ---------------------------------------------------------------------------
// SERVICES
// ---------------------------------------------------------------------------
$pdo->exec('CREATE TABLE services (
    id TEXT PRIMARY KEY, title TEXT, slug TEXT, short_description TEXT,
    full_description TEXT, icon TEXT, category TEXT, benefits TEXT,
    business_outcomes TEXT, status INTEGER, seo_title TEXT, seo_description TEXT,
    seo_keywords TEXT, created_by_id TEXT, updated_by_id TEXT,
    created_at TEXT, updated_at TEXT, deleted_at TEXT
)');
$insertService = $pdo->prepare('INSERT INTO services
    (id, title, slug, short_description, full_description, icon, category, benefits, business_outcomes, status, seo_title, seo_description, seo_keywords, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)');
$services = [
    ['srv-1', 'Cloud-Native Engineering', 'cloud-native-engineering',
     'Design and operate resilient, scalable cloud platforms with Kubernetes, serverless, and multi-cloud strategy.',
     '<p>We design cloud-native architectures that scale with your business.</p>',
     'images/services/service-cloud-native.svg', 'Platform',
     json_encode(['Kubernetes orchestration', 'Serverless compute', 'Multi-cloud strategy']),
     json_encode(['30% lower infrastructure cost', '99.99% uptime']),
     'Cloud-Native Engineering | Synova Infotech', 'Cloud-native consulting for the enterprise.', 'kubernetes, serverless, cloud', $now, $now],
    ['srv-2', 'Enterprise AI & Automation', 'enterprise-ai-automation',
     'Operationalize machine learning and intelligent automation across the enterprise.',
     '<p>From ML pipelines to LLM-powered copilots, we put AI to work.</p>',
     'images/services/service-enterprise-ai.svg', 'Intelligence',
     json_encode(['MLOps pipelines', 'LLM integration', 'Intelligent document processing']),
     json_encode(['5× faster process throughput', 'AI-driven decisioning']),
     'Enterprise AI & Automation | Synova Infotech', 'AI engineering services.', 'machine learning, MLOps, LLM', $now, $now],
    ['srv-3', 'Zero-Trust Cybersecurity', 'zero-trust-cybersecurity',
     'Defense-in-depth security architecture aligned to ISO 27001 and SOC 2.',
     '<p>Zero-trust architecture that protects identity, data, and workloads.</p>',
     'images/services/service-cybersecurity.svg', 'Security',
     json_encode(['Identity-first access', 'Data encryption at rest & in transit', 'Continuous compliance']),
     json_encode(['Reduced breach surface', 'Audit-ready compliance']),
     'Zero-Trust Cybersecurity | Synova Infotech', 'Enterprise security architecture.', 'zero trust, ISO 27001, SOC 2', $now, $now],
    ['srv-4', 'Data Engineering & Analytics', 'data-engineering-analytics',
     'Unify fragmented data into governed, decision-ready analytics platforms.',
     '<p>Modern data stacks that turn raw data into boardroom decisions.</p>',
     'images/services/service-data-engineering.svg', 'Data',
     json_encode(['Lakehouse architecture', 'Real-time streaming', 'Semantic layers']),
     json_encode(['Single source of truth', 'Real-time KPIs']),
     'Data Engineering & Analytics | Synova Infotech', 'Modern data platform engineering.', 'data engineering, lakehouse, analytics', $now, $now],
];
foreach ($services as $s) { $insertService->execute($s); }

// ---------------------------------------------------------------------------
// INDUSTRIES
// ---------------------------------------------------------------------------
$pdo->exec('CREATE TABLE industries (
    id TEXT PRIMARY KEY, name TEXT, slug TEXT, description TEXT, icon TEXT,
    capabilities TEXT, status INTEGER, created_by_id TEXT, updated_by_id TEXT,
    created_at TEXT, updated_at TEXT, deleted_at TEXT
)');
$insertIndustry = $pdo->prepare('INSERT INTO industries
    (id, name, slug, description, icon, capabilities, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)');
$industries = [
    ['ind-1', 'Banking & Fintech', 'banking-fintech',
     'Mission-critical systems for payments, lending, and wealth management.',
     'images/industries/industry-banking-fintech.svg',
     json_encode(['Core banking modernization', 'Real-time payments', 'Regulatory compliance']), $now, $now],
    ['ind-2', 'Healthcare & MedTech', 'healthcare-medtech',
     'HIPAA-aligned platforms connecting care teams and patient data.',
     'images/industries/industry-healthcare-medtech.svg',
     json_encode(['Interoperability (FHIR)', 'Clinical data platforms', 'Telehealth systems']), $now, $now],
    ['ind-3', 'Energy & Utilities', 'energy-utilities',
     'Grid-scale platforms for smart metering, forecasting, and asset management.',
     'images/industries/industry-energy-utilities.svg',
     json_encode(['Smart grid analytics', 'Predictive maintenance', 'Energy trading systems']), $now, $now],
];
foreach ($industries as $i) { $insertIndustry->execute($i); }

// ---------------------------------------------------------------------------
// TECHNOLOGIES
// ---------------------------------------------------------------------------
$pdo->exec('CREATE TABLE technologies (
    id TEXT PRIMARY KEY, name TEXT, slug TEXT, category TEXT, description TEXT,
    icon TEXT, website_url TEXT, proficiency_level TEXT, status INTEGER,
    created_by_id TEXT, updated_by_id TEXT, created_at TEXT, updated_at TEXT
)');
$insertTech = $pdo->prepare('INSERT INTO technologies
    (id, name, slug, category, description, icon, website_url, proficiency_level, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)');
$techs = [
    ['tech-1', 'Kubernetes', 'kubernetes', 'Cloud & Infrastructure', 'Container orchestration at enterprise scale.',
     'images/technologies/kubernetes.svg', 'https://kubernetes.io', 'Expert', $now, $now],
    ['tech-2', 'React', 'react', 'Frontend', 'Component-driven interfaces for the enterprise.',
     'images/technologies/react.svg', 'https://react.dev', 'Expert', $now, $now],
    ['tech-3', 'Python', 'python', 'Data & AI', 'The backbone of our ML and automation practice.',
     'images/technologies/python.svg', 'https://python.org', 'Expert', $now, $now],
];
foreach ($techs as $t) { $insertTech->execute($t); }

// ---------------------------------------------------------------------------
// SOLUTIONS
// ---------------------------------------------------------------------------
$pdo->exec('CREATE TABLE solutions (
    id TEXT PRIMARY KEY, title TEXT, slug TEXT, short_description TEXT,
    full_description TEXT, icon TEXT, features TEXT, benefits TEXT, status INTEGER,
    seo_title TEXT, seo_description TEXT, created_by_id TEXT, updated_by_id TEXT,
    created_at TEXT, updated_at TEXT, deleted_at TEXT
)');
$insertSolution = $pdo->prepare('INSERT INTO solutions
    (id, title, slug, short_description, full_description, icon, features, benefits, status, seo_title, seo_description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)');
$solutions = [
    ['sol-1', 'AI Command Center', 'ai-command-center',
     'A unified operations layer where AI agents monitor, predict, and act across your estate.',
     '<p>Every KPI, anomaly, and decision in one glass pane.</p>',
     'images/solutions/ai-tech.webp',
     json_encode(['Unified observability', 'Predictive alerting', 'Automated runbooks']),
     json_encode(['Faster MTTR', 'Agentic operations']),
     'AI Command Center | Synova Infotech', 'AI-driven operations platform.', $now, $now],
    ['sol-2', 'Legacy Modernization', 'legacy-modernization',
     'Strangler-fig migrations from monoliths to event-driven microservices with zero downtime.',
     '<p>Modernize without stopping the business.</p>',
     'images/solutions/coding-workspace.webp',
     json_encode(['Domain decomposition', 'Strangler pattern', 'Blue/green releases']),
     json_encode(['Zero downtime', '40% cost reduction']),
     'Legacy Modernization | Synova Infotech', 'Enterprise modernization program.', $now, $now],
];
foreach ($solutions as $s) { $insertSolution->execute($s); }

// ---------------------------------------------------------------------------
// PORTFOLIOS (controller orders by camelCase publishedAt — mirror both columns)
// ---------------------------------------------------------------------------
$pdo->exec('CREATE TABLE portfolios (
    id TEXT PRIMARY KEY, title TEXT, slug TEXT, description TEXT, client_name TEXT,
    featured_image TEXT, gallery TEXT, project_url TEXT, category TEXT,
    tech_stack TEXT, status INTEGER, published_at TEXT, "publishedAt" TEXT,
    seo_title TEXT, seo_description TEXT, created_by_id TEXT, updated_by_id TEXT,
    created_at TEXT, updated_at TEXT, deleted_at TEXT
)');
$insertPortfolio = $pdo->prepare('INSERT INTO portfolios
    (id, title, slug, description, client_name, featured_image, gallery, project_url, category, tech_stack, status, published_at, "publishedAt", seo_title, seo_description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)');
$portfolios = [
    ['pf-1', 'Global Payments Replatform', 'global-payments-replatform',
     'A Fortune 500 bank replaced its legacy payments core with a real-time, event-driven platform.',
     'Meridian Bank Group', 'images/case-studies/case-study-fintech-arch.svg',
     json_encode(['images/case-studies/case-study-dashboard.png']), 'https://meridian.example',
     'Fintech', json_encode(['Kafka', 'Kubernetes', 'Java']), $now, $now,
     'Global Payments Replatform | Synova Infotech', 'Real-time payments for banking.', $now, $now],
    ['pf-2', 'Connected Care Cloud', 'connected-care-cloud',
     'A regional health network unified 14 hospitals onto one interoperable clinical cloud.',
     'Aurora Health Network', 'images/case-studies/case-study-health-arch.svg',
     json_encode(['images/case-studies/case-study-dashboard.png']), 'https://aurora.example',
     'Healthcare', json_encode(['FHIR', 'Azure', 'React']), $now, $now,
     'Connected Care Cloud | Synova Infotech', 'Interoperable clinical platforms.', $now, $now],
];
foreach ($portfolios as $pf) { $insertPortfolio->execute($pf); }

// ---------------------------------------------------------------------------
// CASE STUDIES
// ---------------------------------------------------------------------------
$pdo->exec('CREATE TABLE case_studies (
    id TEXT PRIMARY KEY, title TEXT, slug TEXT, summary TEXT, challenge TEXT,
    solution TEXT, results TEXT, client_name TEXT, client_logo TEXT,
    featured_image TEXT, gallery TEXT, industry TEXT, tech_stack TEXT,
    metrics TEXT, status INTEGER, published_at TEXT, seo_title TEXT,
    seo_description TEXT, created_by_id TEXT, updated_by_id TEXT,
    created_at TEXT, updated_at TEXT, deleted_at TEXT
)');
$insertCase = $pdo->prepare('INSERT INTO case_studies
    (id, title, slug, summary, challenge, solution, results, client_name, featured_image, industry, tech_stack, metrics, status, published_at, seo_title, seo_description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)');
$caseStudies = [
    ['cs-1', 'Real-Time Payments at Scale', 'real-time-payments-at-scale',
     'Modernized a national payment switch handling 1.2M transactions per minute.',
     'The legacy switch could not scale to real-time clearing and failed audits.',
     'An event-driven core with Kafka streaming and idempotent settlement.',
     '99.999% availability across three regions during peak.',
     'Meridian Bank Group', 'images/case-studies/case-study-fintech-arch.svg',
     'Banking', json_encode(['Kafka', 'Kubernetes', 'Java']),
     json_encode(['1.2M tx/min', '99.999% uptime', '3 regions']), $now,
     'Real-Time Payments at Scale | Synova Infotech', 'Payments modernization case study.', $now, $now],
    ['cs-2', 'Unifying 14 Hospitals on One Cloud', 'unifying-14-hospitals-one-cloud',
     'A health network consolidated fragmented patient records across 14 facilities.',
     'Clinicians could not see a complete patient history across facilities.',
     'A FHIR-native clinical data platform with regional data residency.',
     '98% of clinicians report faster, safer decisioning.',
     'Aurora Health Network', 'images/case-studies/case-study-health-arch.svg',
     'Healthcare', json_encode(['FHIR', 'Azure', 'React']),
     json_encode(['14 hospitals', '98% satisfaction', '24/7 uptime']), $now,
     'Unifying 14 Hospitals | Synova Infotech', 'Healthcare interoperability case study.', $now, $now],
];
foreach ($caseStudies as $cs) { $insertCase->execute($cs); }

// ---------------------------------------------------------------------------
// BLOG (status stored as enum string; controller orders by camelCase publishedAt)
// ---------------------------------------------------------------------------
$pdo->exec('CREATE TABLE blog_categories (
    id TEXT PRIMARY KEY, name TEXT, slug TEXT, description TEXT,
    created_at TEXT, updated_at TEXT
)');
$pdo->exec("INSERT INTO blog_categories (id, name, slug, description, created_at, updated_at)
    VALUES ('cat-1', 'Engineering', 'engineering', 'Deep dives into architecture and delivery.', '$now', '$now'),
           ('cat-2', 'AI & Automation', 'ai-automation', 'Practical AI for the enterprise.', '$now', '$now')");

$pdo->exec('CREATE TABLE blog_posts (
    id TEXT PRIMARY KEY, title TEXT, slug TEXT, content TEXT, excerpt TEXT,
    featured_image TEXT, author_id TEXT, category_id TEXT, status TEXT,
    published_at TEXT, "publishedAt" TEXT, scheduled_at TEXT, seo_title TEXT,
    seo_description TEXT, seo_keywords TEXT, canonical_url TEXT, og_image TEXT,
    view_count INTEGER, created_at TEXT, updated_at TEXT, deleted_at TEXT
)');
$insertPost = $pdo->prepare("INSERT INTO blog_posts
    (id, title, slug, content, excerpt, featured_image, author_id, category_id, status, published_at, \"publishedAt\", view_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'user-1', ?, 'PUBLISHED', ?, ?, ?, ?, ?)");
$posts = [
    ['post-1', 'The Case for Event-Driven Architecture in 2026', 'event-driven-architecture-2026',
     '<p>Event-driven systems are now the default for mission-critical workloads.</p><h2>Why events win</h2><p>Decoupled, resilient, and auditable by design.</p>',
     'Why forward-thinking enterprises are betting on events, not requests.',
     'images/blog/blog-featured-1.png', 'cat-1', $now, $now, 1284, $now, $now],
    ['post-2', 'Operationalizing LLMs Without the Hype', 'operationalizing-llms-without-hype',
     '<p>LLMs deliver value only when governed, evaluated, and embedded in real workflows.</p><h2>Govern first</h2><p>Evaluation harnesses and human-in-the-loop review.</p>',
     'A sober playbook for taking generative AI to production.',
     'images/blog/blog-featured-2.png', 'cat-2', $now, $now, 946, $now, $now],
    ['post-3', 'Zero-Trust: Architecture, Not a Product', 'zero-trust-architecture-not-product',
     '<p>Zero trust is an architectural stance, not a firewall SKU.</p><h2>Identity is the perimeter</h2><p>Verify every request, everywhere.</p>',
     'How to actually implement zero-trust across cloud and edge.',
     'images/blog/blog-featured-3.png', 'cat-1', $now, $now, 731, $now, $now],
];
foreach ($posts as $p) { $insertPost->execute($p); }

$pdo->exec('CREATE TABLE tags (id TEXT PRIMARY KEY, name TEXT, slug TEXT, created_at TEXT, updated_at TEXT)');
$pdo->exec("INSERT INTO tags (id, name, slug, created_at, updated_at)
    VALUES ('tag-1', 'Architecture', 'architecture', '$now', '$now'),
           ('tag-2', 'AI', 'ai', '$now', '$now')");
$pdo->exec('CREATE TABLE tags_on_posts (
    id TEXT PRIMARY KEY, post_id TEXT, tag_id TEXT, created_at TEXT, updated_at TEXT
)');
$pdo->exec("INSERT INTO tags_on_posts (id, post_id, tag_id, created_at, updated_at)
    VALUES ('tp-1', 'post-1', 'tag-1', '$now', '$now'),
           ('tp-2', 'post-2', 'tag-2', '$now', '$now'),
           ('tp-3', 'post-3', 'tag-1', '$now', '$now')");

// ---------------------------------------------------------------------------
// CAREERS
// ---------------------------------------------------------------------------
$pdo->exec('CREATE TABLE careers (
    id TEXT PRIMARY KEY, title TEXT, slug TEXT, department TEXT, location TEXT,
    type TEXT, description TEXT, requirements TEXT, benefits TEXT,
    salary_min INTEGER, salary_max INTEGER, status INTEGER,
    created_by_id TEXT, updated_by_id TEXT, created_at TEXT, updated_at TEXT,
    deleted_at TEXT
)');
$insertCareer = $pdo->prepare('INSERT INTO careers
    (id, title, slug, department, location, type, description, requirements, benefits, salary_min, salary_max, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)');
$careers = [
    ['job-1', 'Senior Cloud Architect', 'senior-cloud-architect', 'Platform Engineering', 'Pune, India',
     'FULL_TIME', 'Design and own multi-cloud platforms for Fortune 500 clients.',
     json_encode(['8+ years in cloud architecture', 'Kubernetes at scale', 'Terraform/IaC']),
     json_encode(['Remote-first culture', 'Annual learning budget', 'Health cover for family']),
     2800000, 4200000, $now, $now],
    ['job-2', 'Lead AI Engineer', 'lead-ai-engineer', 'Data & AI', 'Pune, India',
     'FULL_TIME', 'Ship production ML systems and agentic workflows.',
     json_encode(['5+ years ML engineering', 'Python & PyTorch', 'LLM evaluation experience']),
     json_encode(['Remote-first culture', 'GPU access', 'Conference budget']),
     3200000, 4800000, $now, $now],
    ['job-3', 'Enterprise Frontend Lead', 'enterprise-frontend-lead', 'Experience Engineering', 'Pune, India',
     'REMOTE', 'Lead design-system driven product engineering for global brands.',
     json_encode(['7+ years React/TypeScript', 'Design system ownership', 'Accessibility (WCAG)']),
     json_encode(['Remote-first culture', 'Home-office stipend', 'Flexible hours']),
     2400000, 3600000, $now, $now],
];
foreach ($careers as $job) { $insertCareer->execute($job); }

// ---------------------------------------------------------------------------
// CONTACTS (contact form submissions)
// ---------------------------------------------------------------------------
$pdo->exec('CREATE TABLE contacts (
    id TEXT PRIMARY KEY, name TEXT, company TEXT, email TEXT, phone TEXT,
    message TEXT, source TEXT, ip_address TEXT, browser TEXT, status TEXT,
    assigned_to_id TEXT, notes TEXT, created_at TEXT, updated_at TEXT
)');

echo "Seeded preview DB at: $dbPath\n";
