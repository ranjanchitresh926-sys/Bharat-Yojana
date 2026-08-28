const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const citizenId = 'test-citizen-123';
  const profileSnapshot = { age: 25, annualIncome: 50000, state: 'MH' };
  
  // Call the actual transaction logic like the API does (or just call the API if it was running, but Prisma is faster and equivalent since it's the exact same backend logic)
  // Let's actually simulate the API request exactly. Wait, I can just use fetch if I start the server, but let's just do it directly via Prisma to see the row, or start Next.js. 
  // Let's just directly insert using the transaction we wrote in the route.
  
  const [dbApplication, consentRecord] = await prisma.$transaction([
    prisma.application.create({
      data: {
        citizenId: citizenId.trim(),
        schemeId: "TEST_SCHEME",
        schemeTitle: "Test Scheme Title",
        profileSnapshot: JSON.stringify(profileSnapshot),
        status: "Submitted",
      }
    }),
    prisma.consentRecord.create({
      data: {
        citizenId: citizenId.trim(),
        purpose: "application-tracking",
        noticeVersion: "v1.0",
      }
    })
  ]);

  console.log("Consent Record created:");
  const row = await prisma.consentRecord.findUnique({ where: { id: consentRecord.id } });
  console.log(row);
}
run().catch(console.error).finally(() => prisma.$disconnect());
