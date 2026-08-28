const fs = require('fs');

const file = 'app/api/grievances/route.ts';
let content = fs.readFileSync(file, 'utf8');

const patchCode = `
export async function PATCH(req: Request) {
  const session = await auth();
  const role = session?.user?.role || "citizen";

  // Double-gate check independent of middleware
  if (role !== "officer" && role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Only officers and admins can update grievances." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { id, status } = body as Record<string, any>;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Grievance ID is required." }, { status: 422 });
  }
  if (!status || typeof status !== "string") {
    return NextResponse.json({ error: "Status is required." }, { status: 422 });
  }

  try {
    const updatedGrievance = await prisma.grievanceRecord.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ success: true, grievance: updatedGrievance }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update grievance." }, { status: 500 });
  }
}
`;

content += '\n' + patchCode;
fs.writeFileSync(file, content, 'utf8');
console.log('Added PATCH endpoint to ' + file);
