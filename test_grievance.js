const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  // 1. Submit a grievance directly simulating the UI fetch POST
  const grievance = await prisma.grievanceRecord.create({
    data: {
      email: "citizen@example.com",
      requestType: "delete",
      details: "Please delete my data, I no longer want to be tracked. My citizenId is xyz.",
    }
  });

  console.log("=== Grievance submitted ===");
  
  // 2. Query the actual row
  const row = await prisma.grievanceRecord.findUnique({
    where: { id: grievance.id }
  });
  console.log("=== Database Row ===");
  console.log(row);

  // 3. Simulate Officer VerifyDashboard view (which calls /api/grievances GET, fetching via prisma)
  const dashboardGrievances = await prisma.grievanceRecord.findMany({
    orderBy: { receivedAt: "desc" },
  });
  console.log("=== Officer VerifyDashboard View ===");
  console.log(dashboardGrievances);
}

run().catch(console.error).finally(() => prisma.$disconnect());
