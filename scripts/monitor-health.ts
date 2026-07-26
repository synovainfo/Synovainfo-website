import http from 'http'
import https from 'https'

const BASE_URL = process.env.SITE_URL || 'http://localhost:3000'

const TARGET_ROUTES = [
  '/',
  '/about',
  '/solutions',
  '/technologies',
  '/services',
  '/industries',
  '/engagement-models',
  '/partners',
  '/case-studies',
  '/press',
  '/events',
  '/careers',
  '/contact',
  '/sitemap',
  '/privacy',
  '/terms',
]

const REQUIRED_HEADERS = [
  'strict-transport-security',
  'x-frame-options',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
]

async function checkRoute(route: string): Promise<boolean> {
  const url = `${BASE_URL}${route}`
  try {
    const res = await fetch(url, { method: 'HEAD' })
    if (res.status === 200) {
      console.log(`✅ [200 OK] ${route}`)
      return true
    } else {
      console.error(`❌ [${res.status}] ${route}`)
      return false
    }
  } catch (err) {
    console.error(`❌ [FAIL] ${route}:`, err)
    return false
  }
}

async function verifySecurityHeaders(): Promise<boolean> {
  console.log('\n--- Verifying Enterprise Security Headers ---')
  try {
    const res = await fetch(`${BASE_URL}/`, { method: 'HEAD' })
    let passed = true
    for (const h of REQUIRED_HEADERS) {
      if (res.headers.has(h)) {
        console.log(`✅ Header Present: ${h}`)
      } else {
        console.warn(`⚠️ Header Missing: ${h}`)
        passed = false
      }
    }
    return passed
  } catch (e) {
    console.error('❌ Header verification failed:', e)
    return false
  }
}

async function runHealthCheck() {
  console.log('====================================================')
  console.log(`SYNOVA CONTINUOUS HEALTH & SECURITY MONITOR`)
  console.log(`Target: ${BASE_URL}`)
  console.log('====================================================\n')

  let totalFailed = 0

  for (const route of TARGET_ROUTES) {
    const ok = await checkRoute(route)
    if (!ok) totalFailed++
  }

  const headersOk = await verifySecurityHeaders()

  console.log('\n====================================================')
  if (totalFailed === 0 && headersOk) {
    console.log('✅ ALL MONITORED ROUTES & SECURITY HEADERS HEALTHY')
    console.log('====================================================')
    process.exit(0)
  } else {
    console.error(`❌ MONITOR FAILURES: ${totalFailed} routes failed or missing headers`)
    console.log('====================================================')
    process.exit(1)
  }
}

runHealthCheck()
