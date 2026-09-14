import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
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

  const [applications, reports, grievances, allSchemes] = await Promise.all([
    prisma.application.findMany(),
    prisma.report.findMany(),
    prisma.grievanceRecord.findMany(),
    prisma.scheme.findMany(),
  ]);

  const statusCounts: Record<string, number> = {
    Submitted: 0,
    "Under Review": 0,
    Verified: 0,
    Approved: 0,
    Rejected: 0,
  };

  const schemeCodeCounts: Record<string, number> = {};

  applications.forEach((app: { status: string; schemeId: string }) => {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status]++;
    }
    schemeCodeCounts[app.schemeId] = (schemeCodeCounts[app.schemeId] || 0) + 1;
  });

  const applicationsByStatus = Object.entries(statusCounts).map(([name, count]) => ({
    name,
    count,
  }));

  const applicationsByScheme = Object.entries(schemeCodeCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const reportCounts = { pending: 0, resolved: 0 };
  reports.forEach((report: { status: string }) => {
    if (report.status === "pending") reportCounts.pending++;
    else reportCounts.resolved++;
  });

  // Aggregate-only: counts of pending/resolved grievances - no raw content ever exposed.
  const grievanceCounts = { pending: 0, resolved: 0 };
  grievances.forEach((g: { status: string }) => {
    if (g.status === "pending") grievanceCounts.pending++;
    else grievanceCounts.resolved++;
  });

  const untrackedSchemes = allSchemes
    .filter((scheme) => !schemeCodeCounts[scheme.code])
    .map((scheme) => ({
      code: scheme.code,
      title: scheme.title,
      category: scheme.category,
    }));

  return NextResponse.json(
    {
      metrics: {
        applicationsByStatus,
        applicationsByScheme,
        reportCounts,
        grievanceCounts,
        untrackedSchemes,
      },
    },
    { status: 200 }
  );
}
