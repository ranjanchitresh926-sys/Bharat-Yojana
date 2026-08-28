const fs = require('fs');

const file = 'app/api/applications/route.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Extend GET to include consentRecords when citizenId is present
content = content.replace(
  /if \(citizenId\) \{\n      dbApplications = await prisma\.application\.findMany\(\{\n        where: \{ citizenId \},\n        orderBy: \{ submittedAt: "desc" \},\n      \}\);\n    \}/,
  `if (citizenId) {
      dbApplications = await prisma.application.findMany({
        where: { citizenId },
        orderBy: { submittedAt: "desc" },
      });
      const consentRecords = await prisma.consentRecord.findMany({
        where: { citizenId },
        orderBy: { consentedAt: "desc" }
      });
      const applications = dbApplications.map((dbApp: any) => ({
        id: dbApp.id,
        citizenId: dbApp.citizenId || undefined,
        schemeId: dbApp.schemeId,
        schemeTitle: dbApp.schemeTitle,
        profileSnapshot: JSON.parse(dbApp.profileSnapshot),
        status: dbApp.status,
        rejectionReason: dbApp.rejectionReason || undefined,
        submittedAt: dbApp.submittedAt.toISOString(),
        updatedAt: dbApp.updatedAt.toISOString(),
      }));
      return NextResponse.json({ applications, consentRecords }, { status: 200 });
    }`
);

// 2. We need to add DELETE and PATCH endpoints for data rights
const additionalEndpoints = `
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const citizenId = searchParams.get("citizenId");
  
  if (!citizenId || typeof citizenId !== "string" || citizenId.trim().length === 0) {
    return NextResponse.json({ error: "Valid citizenId is required." }, { status: 400 });
  }

  // Hard-delete applications and mark consents as withdrawn inside a transaction
  try {
    await prisma.$transaction([
      prisma.application.deleteMany({
        where: { citizenId: citizenId.trim() }
      }),
      prisma.consentRecord.updateMany({
        where: { citizenId: citizenId.trim(), withdrawnAt: null },
        data: { withdrawnAt: new Date() }
      })
    ]);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete data." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { citizenId, action } = body as Record<string, any>;

  if (!citizenId || typeof citizenId !== "string" || citizenId.trim().length === 0) {
    return NextResponse.json({ error: "Valid citizenId is required." }, { status: 400 });
  }

  if (action !== 'withdraw') {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  try {
    await prisma.consentRecord.updateMany({
      where: { citizenId: citizenId.trim(), withdrawnAt: null },
      data: { withdrawnAt: new Date() }
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to withdraw consent." }, { status: 500 });
  }
}
`;

content += '\n' + additionalEndpoints;

fs.writeFileSync(file, content, 'utf8');
console.log('Patched API for self-service rights');
