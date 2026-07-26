import { fetch } from 'undici';

async function run() {
  console.log("Fetching CSRF token...");
  const csrfRes = await fetch("http://localhost:3001/api/auth/csrf");
  const csrfData = (await csrfRes.json()) as { csrfToken: string };
  const csrfToken = csrfData.csrfToken;
  
  // Extract NextAuth cookies
  const setCookieHeader = csrfRes.headers.get("set-cookie");
  console.log("CSRF Token:", csrfToken);
  console.log("Set-Cookie:", setCookieHeader);

  // We need to parse the cookies for the next request
  let cookies = "";
  if (setCookieHeader) {
    // Basic extraction
    const match = setCookieHeader.match(/(authjs\.csrf-token|next-auth\.csrf-token)=[^;]+/);
    if (match) cookies = match[0];
  }

  const formData = new URLSearchParams();
  formData.append("csrfToken", csrfToken);
  formData.append("email", "admin@synovainfotech.com");
  formData.append("password", "Admin@Synova2026!");
  formData.append("redirect", "false");

  console.log("\nAttempting Login POST...");
  const loginRes = await fetch("http://localhost:3001/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookies,
    },
    body: formData.toString()
  });

  const loginData = await loginRes.json();
  console.log("Login Response:", loginData);
  
  const loginCookies = loginRes.headers.get("set-cookie");
  console.log("Login Set-Cookie:", loginCookies);
  
  // Extract session cookie
  let sessionCookie = "";
  if (loginCookies) {
    const parts = loginCookies.split(',');
    for (const p of parts) {
      const match = p.match(/(authjs\.session-token|next-auth\.session-token)=[^;]+/);
      if (match) {
        sessionCookie = match[0];
        break;
      }
    }
  }

  if (!sessionCookie) {
    console.error("❌ Failed to get session cookie.");
    return;
  }

  console.log("\nSession Cookie:", sessionCookie);

  console.log("\nTesting APIs with session...");
  
  const endpoints = [
    "/api/admin/services",
    "/api/admin/pages",
    "/api/admin/users",
    "/api/admin/roles",
    "/api/admin/settings",
    "/api/admin/media",
    "/api/admin/leads",
    "/api/admin/newsletter",
    "/api/admin/forms",
    "/api/admin/resources",
    "/api/admin/downloads"
  ];

  let successCount = 0;
  for (const endpoint of endpoints) {
    const res = await fetch(`http://localhost:3001${endpoint}`, {
      headers: { "Cookie": sessionCookie }
    });
    
    if (res.status === 200 || res.status === 201) {
      console.log(`✅ ${endpoint} - ${res.status}`);
      successCount++;
    } else {
      console.error(`❌ ${endpoint} - ${res.status}`);
      const text = await res.text();
      console.log(`   Response: ${text.slice(0, 100)}...`);
    }
  }
  
  console.log(`\nTest complete: ${successCount}/${endpoints.length} APIs successful.`);
}

run().catch(console.error);
