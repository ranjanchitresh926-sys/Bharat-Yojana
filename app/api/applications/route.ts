import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { ApplicationStatus, CitizenProfile } from "../../../types/scheme";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { schemeId, schemeTitle, profileSnapshot, citizenId, consentVersion } = body as Record<string, any>;
  const errors: string[] = [];

  if (typeof schemeId !== "string" || schemeId.trim().length === 0) errors.push("Scheme ID is required.");
  if (typeof schemeTitle !== "string" || schemeTitle.trim().length === 0) errors.push("Scheme Title is required.");
  if (!profileSnapshot || typeof profileSnapshot !== "object") errors.push("Profile snapshot is required.");
  if (typeof consentVersion !== "string" || consentVersion.trim().length === 0) errors.push("Consent version is required.");
  if (typeof citizenId !== "string" || citizenId.trim().length === 0) errors.push("Citizen ID is required for consent tracking.");

  if (errors.length > 0) return NextResponse.json({ error: errors.join(" ") }, { status: 422 });

  const [dbApplication, consentRecord] = await prisma.$transaction([
    prisma.application.create({
      data: {
        citizenId: citizenId.trim(),
        schemeId: schemeId.trim(),
        schemeTitle: schemeTitle.trim(),
        profileSnapshot: JSON.stringify(profileSnapshot),
        status: "Submitted",
      }
    }),
    prisma.consentRecord.create({
      data: {
        citizenId: citizenId.trim(),
        purpose: "application-tracking",
        noticeVersion: consentVersion.trim(),
      }
    })
  ]);

  const application = {
    id: dbApplication.id,
    citizenId: dbApplication.citizenId || undefined,
    schemeId: dbApplication.schemeId,
    schemeTitle: dbApplication.schemeTitle,
    profileSnapshot: JSON.parse(dbApplication.profileSnapshot) as CitizenProfile,
    status: dbApplication.status as ApplicationStatus,
    submittedAt: dbApplication.submittedAt.toISOString(),
    updatedAt: dbApplication.updatedAt.toISOString(),
  };

  return NextResponse.json({ success: true, application }, { status: 200 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const citizenId = searchParams.get("citizenId");

  if (citizenId) {
    const dbApplications = await prisma.application.findMany({
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
      profileSnapshot: JSON.parse(dbApp.profileSnapshot) as CitizenProfile,
      status: dbApp.status as ApplicationStatus,
      rejectionReason: dbApp.rejectionReason || undefined,
      submittedAt: dbApp.submittedAt.toISOString(),
      updatedAt: dbApp.updatedAt.toISOString(),
    }));
    return NextResponse.json({ applications, consentRecords }, { status: 200 });
  } else {
    const session = await auth();
    const role = session?.user?.role || "citizen";
    
    if (role !== "officer" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Only officers and admins can view all applications." }, { status: 403 });
    }
    const dbApplications = await prisma.application.findMany({
      orderBy: { submittedAt: "desc" },
    });
    const applications = dbApplications.map((dbApp: any) => ({
      id: dbApp.id,
      citizenId: dbApp.citizenId || undefined,
      schemeId: dbApp.schemeId,
      schemeTitle: dbApp.schemeTitle,
      profileSnapshot: JSON.parse(dbApp.profileSnapshot) as CitizenProfile,
      status: dbApp.status as ApplicationStatus,
      rejectionReason: dbApp.rejectionReason || undefined,
      submittedAt: dbApp.submittedAt.toISOString(),
      updatedAt: dbApp.updatedAt.toISOString(),
    }));
    return NextResponse.json({ applications }, { status: 200 });
  }
}

export async function PATCH(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Branch 1: Citizen withdrawing consent
  if (body.action === 'withdraw' && body.citizenId) {
    try {
      await prisma.consentRecord.updateMany({
        where: { citizenId: body.citizenId.trim(), withdrawnAt: null },
        data: { withdrawnAt: new Date() }
      });
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to withdraw consent." }, { status: 500 });
    }
  }

  // Branch 2: Officer updating application status
  const session = await auth();
  const role = session?.user?.role || "citizen";

  if (role !== "officer") {
    return NextResponse.json(
      { error: "Forbidden: Only officers can update application statuses." },
      { status: 403 }
    );
  }

  const { id, status, rejectionReason } = body;
  const existingApp = await prisma.application.findUnique({ where: { id } });

  if (!existingApp) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const updateData: any = {};
  if (status) {
    const validStatuses: ApplicationStatus[] = ["Submitted", "Under Review", "Verified", "Approved", "Rejected"];
    if (validStatuses.includes(status)) updateData.status = status;
  }
  if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;

  const updatedDbApp = await prisma.application.update({ where: { id }, data: updateData });
  return NextResponse.json({ success: true, application: updatedDbApp });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const citizenId = searchParams.get("citizenId");
  
  if (!citizenId || typeof citizenId !== "string" || citizenId.trim().length === 0) {
    return NextResponse.json({ error: "Valid citizenId is required." }, { status: 400 });
  }

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
