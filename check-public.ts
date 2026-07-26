import http from "http";

const BASE_URL = "http://localhost:3000";

async function runCheck() {
  const routes = [
    "/", "/about", "/services", "/industries", "/contact", "/blog", "/case-studies", "/careers"
  ];
  let failed = 0;
  for (const route of routes) {
    try {
      const res = await fetch(`${BASE_URL}${route}`);
      if (res.status !== 200) {
        console.error(`❌ Route ${route} returned ${res.status}`);
        failed++;
      } else {
        console.log(`✅ Route ${route} is 200 OK.`);
      }
    } catch (e) {
      console.error(`❌ Route ${route} failed to fetch:`, e);
      failed++;
    }
  }

  if (failed > 0) process.exit(1);
  console.log("All public routes verified!");
}

runCheck();
