import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SCHEME_DB } from '../../../../lib/seedData';
import { Application } from '../../../../types/scheme';

export async function GET(req: Request) {
  // 1. Independent API Gate: Verify role is STRICTLY 'admin'
  const cookieStore = await cookies();
  const role = cookieStore.get('userRole')?.value;

  if (role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden: Admin access required.' },
      { status: 403 }
    );
  }

  /* 
    PRIVACY DESIGN NOTE: 
    This endpoint explicitly strips raw citizen data (profiles, identities).
    Even administrators do not need access to raw individual profiles for 
    high-level analytics. Returning only aggregate metrics aligns with 
    the principle of Data Minimization.
  */

  const applications: Application[] = global.globalApplications || [];
  const reports: any[] = global.globalReports || [];

  // --- Aggregate: Applications by Status ---
  const statusCounts = {
    Submitted: 0,
    'Under Review': 0,
    Verified: 0,
    Approved: 0,
    Rejected: 0
  };

  // --- Aggregate: Applications by Scheme Code ---
  const schemeCodeCounts: Record<string, number> = {};

  applications.forEach(app => {
    // Count status
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status]++;
    }
    
    // Count scheme code
    schemeCodeCounts[app.schemeId] = (schemeCodeCounts[app.schemeId] || 0) + 1;
  });

  // Convert statusCounts into an array for Recharts
  const applicationsByStatus = Object.entries(statusCounts).map(([name, count]) => ({
    name,
    count
  }));

  // Convert schemeCodeCounts into an array for Recharts
  const applicationsByScheme = Object.entries(schemeCodeCounts).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count);

  // --- Aggregate: Reports (Pending vs Resolved) ---
  const reportCounts = {
    pending: 0,
    resolved: 0
  };

  reports.forEach(report => {
    if (report.status === 'pending') {
      reportCounts.pending++;
    } else {
      reportCounts.resolved++;
    }
  });

  // --- Aggregate: Eligible-but-never-tracked Gap ---
  // Find schemes in SCHEME_DB that have 0 tracked applications
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
