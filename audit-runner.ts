import fs from "fs";
import path from "path";
import http from "http";

const BASE_URL = "http://localhost:3000";

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyServer() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      if (res.ok) return true;
    } catch (e) {
      // ignore
    }
    await sleep(1000);
  }
  return false;
}

async function runAudit() {
  console.log("==========================================");
  console.log("ZERO TRUST AUDIT: API & ROUTE VERIFICATION");
  console.log("==========================================");

  const isUp = await verifyServer();
  if (!isUp) {
    console.error("❌ CRITICAL: Server failed to start or /api/health is unreachable.");
    process.exit(1);
  }
  console.log("✅ Server is running.");

  let cookies = "";
  let csrfToken = "";

  // 1. Get CSRF Token
  try {
    const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
    const setCookie = csrfRes.headers.get("set-cookie");
    if (setCookie) cookies = setCookie.split(";")[0];
    const csrfData = await csrfRes.json();
    csrfToken = csrfData.csrfToken;
    console.log("✅ CSRF Token retrieved.");
  } catch (e) {
    console.error("❌ CRITICAL: Failed to get CSRF token.", e);
  }

  // 2. Authenticate as Admin
  try {
    const authRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": cookies
      },
      body: new URLSearchParams({
        email: "admin@synovainfotech.com",
        password: "Admin@Synova2026!", // correct password from seed-config.ts
        csrfToken: csrfToken,
        json: "true"
      }).toString()
    });

    const newCookies = authRes.headers.get("set-cookie");
    if (newCookies) {
       // extract authjs.session-token
       const matches = newCookies.match(/authjs\.session-token=[^;]+/g);
       if (matches) {
         cookies += "; " + matches[0];
         console.log("✅ Authenticated as Admin successfully.");
       } else {
         console.error("❌ CRITICAL: Authentication failed, no session token received.");
       }
    }
  } catch (e) {
    console.error("❌ CRITICAL: Login failed.", e);
  }

  // 3. Test API endpoints
  const apiRoutes = [
    "/api/admin/services",
    "/api/admin/industries",
    "/api/admin/blog",
    "/api/admin/users",
    "/api/admin/statistics",
    "/api/admin/pages"
  ];

  let failedApis = 0;
  for (const route of apiRoutes) {
    const res = await fetch(`${BASE_URL}${route}`, {
      headers: { "Cookie": cookies }
    });
    if (!res.ok) {
      console.error(`❌ CRITICAL: API ${route} returned ${res.status}`);
      failedApis++;
    } else {
      const data = await res.json();
      if (!data || typeof data !== "object") {
         console.error(`❌ CRITICAL: API ${route} returned invalid JSON`);
         failedApis++;
      } else {
         console.log(`✅ API GET ${route} passed.`);
      }
    }
  }

  if (failedApis > 0) {
    console.error(`\n❌ ${failedApis} APIs failed verification.`);
    process.exit(1);
  }

  console.log("\n✅ All core APIs verified with executable evidence.");

  // 4. Test public routes
  const publicRoutes = [
    "/", "/about", "/services", "/industries", "/contact", "/blog", "/case-studies", "/careers"
  ];

  let failedRoutes = 0;
  for (const route of publicRoutes) {
    const res = await fetch(`${BASE_URL}${route}`);
    if (res.status !== 200) {
       console.error(`❌ CRITICAL: Route ${route} returned ${res.status}`);
       failedRoutes++;
    } else {
       console.log(`✅ Route GET ${route} passed.`);
    }
  }

  if (failedRoutes > 0) {
    console.error(`\n❌ ${failedRoutes} Routes failed verification.`);
    process.exit(1);
  }

  console.log("\n✅ All core routes verified with executable evidence.");
  console.log("\n==========================================");
  console.log("AUDIT SCRIPT COMPLETED SUCCESSFULLY");
  console.log("==========================================");
}

runAudit();
