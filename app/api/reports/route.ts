import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const { schemeCode, description } = body as Record<string, unknown>;

  const errors: string[] = [];

  if (typeof schemeCode !== "string" || schemeCode.trim().length === 0) {
    errors.push("Scheme code is required.");
  }

  if (typeof description !== "string" || description.trim().length === 0) {
    errors.push("Description is required.");
  } else if (description.trim().length > 5000) {
    errors.push("Description must be 5000 characters or fewer.");
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: errors.join(" ") },
      { status: 422 },
    );
  }

  const dbReport = await prisma.report.create({
    data: {
      schemeCode: (schemeCode as string).trim(),
      description: (description as string).trim(),
      status: "pending",
    }
  });

  const sanitized = {
    id: dbReport.id,
    schemeCode: dbReport.schemeCode,
    description: dbReport.description,
    status: dbReport.status,
    receivedAt: dbReport.receivedAt.toISOString(),
  };



  return NextResponse.json(
    { success: true, message: "Report submitted. Thank you for helping improve our data." },
    { status: 200 },
  );
}

export async function GET() {
  const session = await auth();
  const role = session?.user?.role || "citizen";

  if (role !== "officer" && role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Only officers and admins can view reports." },
      { status: 403 }
    );
  }

  const dbReports = await prisma.report.findMany({
    orderBy: { receivedAt: "desc" }
  });

  const reports = dbReports.map((r: any) => ({
    id: r.id,
    schemeCode: r.schemeCode,
    description: r.description,
    status: r.status,
    receivedAt: r.receivedAt.toISOString(),
  }));

  return NextResponse.json({
    reports
  }, { status: 200 });
}

export async function PATCH(req: Request) {
  const session = await auth();
  const role = session?.user?.role || "citizen";

  if (role !== "officer") {
    return NextResponse.json(
      { error: "Forbidden: Only officers can update report statuses." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { id, action } = body as Record<string, unknown>;
  
  if (typeof id !== "string") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const existingReport = await prisma.report.findUnique({
    where: { id }
  });

  if (!existingReport) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  let newStatus = existingReport.status;
  if (action === "approve") {
    newStatus = "approved";
  } else if (action === "dismiss") {
    newStatus = "dismissed";
  }

  const updatedDbReport = await prisma.report.update({
    where: { id },
    data: { status: newStatus }
  });

  const report = {
    id: updatedDbReport.id,
    schemeCode: updatedDbReport.schemeCode,
    description: updatedDbReport.description,
    status: updatedDbReport.status,
    receivedAt: updatedDbReport.receivedAt.toISOString(),
  };

  return NextResponse.json({ success: true, report });
}
