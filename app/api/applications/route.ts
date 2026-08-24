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

  const { schemeId, schemeTitle, profileSnapshot, citizenId } = body as Record<string, any>;

  const errors: string[] = [];

  if (typeof schemeId !== "string" || schemeId.trim().length === 0) {
    errors.push("Scheme ID is required.");
  }

  if (typeof schemeTitle !== "string" || schemeTitle.trim().length === 0) {
    errors.push("Scheme Title is required.");
  }

  if (!profileSnapshot || typeof profileSnapshot !== "object") {
    errors.push("Profile snapshot is required.");
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 422 });
  }

  const dbApplication = await prisma.application.create({
    data: {
      citizenId: typeof citizenId === "string" ? citizenId.trim() : null,
      schemeId: schemeId.trim(),
      schemeTitle: schemeTitle.trim(),
      profileSnapshot: JSON.stringify(profileSnapshot),
      status: "Submitted",
    }
  });

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

  console.log("[applications] New application tracked:", application.id);

  return NextResponse.json({ success: true, application }, { status: 200 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const citizenId = searchParams.get("citizenId");

  let dbApplications;

  if (citizenId) {
    dbApplications = await prisma.application.findMany({
      where: { citizenId },
      orderBy: { submittedAt: "desc" },
    });
  } else {
    const session = await auth();
    const role = session?.user?.role || "citizen";
    
    if (role !== "officer" && role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only officers and admins can view all applications." },
        { status: 403 }
      );
    }
    dbApplications = await prisma.application.findMany({
      orderBy: { submittedAt: "desc" },
    });
  }

  const applications = dbApplications.map(dbApp => ({
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

export async function PATCH(req: Request) {
  const session = await auth();
  const role = session?.user?.role || "citizen";

  if (role !== "officer") {
    return NextResponse.json(
      { error: "Forbidden: Only officers can update application statuses." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { id, status, rejectionReason } = body as Record<string, any>;
  
  const existingApp = await prisma.application.findUnique({
    where: { id }
  });

  if (!existingApp) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const updateData: any = {};

  if (status) {
    const validStatuses: ApplicationStatus[] = ["Submitted", "Under Review", "Verified", "Approved", "Rejected"];
    if (validStatuses.includes(status)) {
      updateData.status = status;
    }
  }

  if (rejectionReason !== undefined) {
    updateData.rejectionReason = rejectionReason;
  }

  const updatedDbApp = await prisma.application.update({
    where: { id },
    data: updateData
  });

  const application = {
    id: updatedDbApp.id,
    citizenId: updatedDbApp.citizenId || undefined,
    schemeId: updatedDbApp.schemeId,
    schemeTitle: updatedDbApp.schemeTitle,
    profileSnapshot: JSON.parse(updatedDbApp.profileSnapshot) as CitizenProfile,
    status: updatedDbApp.status as ApplicationStatus,
    rejectionReason: updatedDbApp.rejectionReason || undefined,
    submittedAt: updatedDbApp.submittedAt.toISOString(),
    updatedAt: updatedDbApp.updatedAt.toISOString(),
  };

  return NextResponse.json({ success: true, application });
}
