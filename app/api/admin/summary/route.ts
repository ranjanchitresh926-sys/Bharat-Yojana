import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { SCHEME_DB } from "../../../../lib/seedData";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  const role = session?.user?.role || "citizen";

  if (role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Admin access required." },
      { status: 403 }
    );
  }

  const applications = await prisma.application.findMany();
  const reports = await prisma.report.findMany();

  const statusCounts: Record<string, number> = {
    Submitted: 0,
    "Under Review": 0,
    Verified: 0,
    Approved: 0,
    Rejected: 0
  };

  const schemeCodeCounts: Record<string, number> = {};

  applications.forEach(app => {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status]++;
    }
    schemeCodeCounts[app.schemeId] = (schemeCodeCounts[app.schemeId] || 0) + 1;
  });

  const applicationsByStatus = Object.entries(statusCounts).map(([name, count]) => ({
    name,
    count
  }));

  const applicationsByScheme = Object.entries(schemeCodeCounts).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count);

  const reportCounts = {
    pending: 0,
    resolved: 0
  };

  reports.forEach(report => {
    if (report.status === "pending") {
      reportCounts.pending++;
    } else {
      reportCounts.resolved++;
    }
  });

  const untrackedSchemes = SCHEME_DB
    .filter(scheme => !schemeCodeCounts[scheme.code])
    .map(scheme => ({
      code: scheme.code,
      title: scheme.title,
      category: scheme.category
    }));

  return NextResponse.json({
    metrics: {
      applicationsByStatus,
      applicationsByScheme,
      reportCounts,
      untrackedSchemes
    }
  }, { status: 200 });
}
