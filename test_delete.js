async function run() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const citizenId = 'test-delete-citizen';

  // 1. Create a test application
  const [app, consent] = await prisma.$transaction([
    prisma.application.create({
      data: {
        citizenId: citizenId,
        schemeId: "TEST_DEL_SCHEME",
        schemeTitle: "Scheme to be deleted",
        profileSnapshot: JSON.stringify({ age: 30 }),
        status: "Submitted",
      }
    }),
    prisma.consentRecord.create({
      data: {
        citizenId: citizenId,
        purpose: "application-tracking",
        noticeVersion: "v1.0",
      }
    })
  ]);

  console.log("=== 1. Test Application & Consent Created ===");
  const beforeApp = await prisma.application.findUnique({ where: { id: app.id } });
  const beforeConsent = await prisma.consentRecord.findUnique({ where: { id: consent.id } });
  console.log("Application in DB:", beforeApp ? `Exists (ID: ${beforeApp.id})` : "Missing");
  console.log("Consent withdrawnAt:", beforeConsent?.withdrawnAt);

  // 2. Trigger DELETE exactly as the UI would (using fetch)
  console.log("\n=== 2. Triggering DELETE via API Endpoint (simulating UI click) ===");
  
  let res;
  try {
    res = await fetch(`http://localhost:3000/api/applications?citizenId=${citizenId}`, {
      method: 'DELETE'
    });
  } catch (e) {
    console.log("Server not running on port 3000. Start it first.");
    process.exit(1);
  }
  
  console.log("API Response Status:", res.status);
  console.log("API Response Body:", await res.json());

  // 3. Query DB again to show the row is gone
  console.log("\n=== 3. Querying Database After Deletion ===");
  const afterApp = await prisma.application.findUnique({ where: { id: app.id } });
  const afterConsent = await prisma.consentRecord.findUnique({ where: { id: consent.id } });
  
  console.log("Application in DB:", afterApp ? "Still exists" : "Successfully hard-deleted (null)");
  console.log("Consent withdrawnAt:", afterConsent?.withdrawnAt ? `Set to ${afterConsent.withdrawnAt}` : "Still null");

  await prisma.$disconnect();
  process.exit(0);
}

run().catch(console.error);
