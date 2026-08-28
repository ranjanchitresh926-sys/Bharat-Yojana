async function run() {
  console.log("=== 1. Attempting PATCH as Citizen (No Session) ===");
  const res1 = await fetch('http://localhost:3000/api/grievances', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'dummy-id', status: 'resolved' })
  });
  const body1 = await res1.json();
  console.log(`Status: ${res1.status}`);
  console.log(`Body:`, body1);

  console.log("\n=== 2. Logging in as Officer ===");
  // Fetch CSRF token
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;
  let cookies = csrfRes.headers.get('set-cookie') || '';
  
  const csrfCookieMatch = cookies.match(/authjs\.csrf-token=([^;]+)/);
  const csrfCookie = csrfCookieMatch ? csrfCookieMatch[0] : '';

  // Log in
  const loginRes = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': csrfCookie
    },
    body: new URLSearchParams({
      email: 'officer@example.com',
      password: 'password123',
      csrfToken: csrfToken,
      json: 'true'
    })
  });
  
  const loginCookies = loginRes.headers.get('set-cookie') || '';
  const sessionCookieMatch = loginCookies.match(/authjs\.session-token=([^;]+)/);
  if (!sessionCookieMatch) {
    console.log("Failed to get session cookie. Headers:", loginRes.headers);
    return;
  }
  const sessionCookie = sessionCookieMatch[0];
  console.log("Successfully retrieved officer session cookie.");

  // Get a real grievance ID to patch
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const g = await prisma.grievanceRecord.findFirst();
  const targetId = g ? g.id : 'dummy-id';
  await prisma.$disconnect();

  console.log(`\n=== 3. Attempting PATCH as Officer (With Session) on ID: ${targetId} ===`);
  const res2 = await fetch('http://localhost:3000/api/grievances', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie
    },
    body: JSON.stringify({ id: targetId, status: 'resolved' })
  });
  const body2 = await res2.json();
  console.log(`Status: ${res2.status}`);
  console.log(`Body:`, body2);
  
  process.exit(0);
}

run().catch(console.error);
