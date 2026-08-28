import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { email, requestType, details } = body as Record<string, any>;

  const errors: string[] = [];
  if (typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required.");
  }
  if (typeof requestType !== "string" || requestType.trim().length === 0) {
    errors.push("Request type is required.");
  }
  if (typeof details !== "string" || details.trim().length === 0) {
    errors.push("Details are required.");
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 422 });
  }

  const grievance = await prisma.grievanceRecord.create({
    data: {
      email: email.trim(),
      requestType: requestType.trim(),
      details: details.trim(),
    },
  });

  return NextResponse.json({ success: true, grievance }, { status: 201 });
}

export async function GET(req: Request) {
  const session = await auth();
  const role = session?.user?.role || "citizen";
  
  // Double-gate check independent of middleware
  if (role !== "officer" && role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Only officers and admins can view grievances." },
      { status: 403 }
    );
  }

  const dbGrievances = await prisma.grievanceRecord.findMany({
    orderBy: { receivedAt: "desc" },
  });

  return NextResponse.json({ grievances: dbGrievances }, { status: 200 });
}


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
