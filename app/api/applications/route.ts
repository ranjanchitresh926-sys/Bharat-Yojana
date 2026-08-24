import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Application, ApplicationStatus, CitizenProfile } from '../../../types/scheme';

declare global {
  var globalApplications: Application[];
}
global.globalApplications = global.globalApplications || [];

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { schemeId, schemeTitle, profileSnapshot, citizenId } = body as Record<string, any>;

  // Validation
  const errors: string[] = [];

  if (typeof schemeId !== 'string' || schemeId.trim().length === 0) {
    errors.push('Scheme ID is required.');
  }

  if (typeof schemeTitle !== 'string' || schemeTitle.trim().length === 0) {
    errors.push('Scheme Title is required.');
  }

  if (!profileSnapshot || typeof profileSnapshot !== 'object') {
    errors.push('Profile snapshot is required.');
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(' ') }, { status: 422 });
  }

  const now = new Date().toISOString();
  const application: Application = {
    id: Math.random().toString(36).substring(7),
    citizenId: typeof citizenId === 'string' ? citizenId.trim() : undefined,
    schemeId: schemeId.trim(),
    schemeTitle: schemeTitle.trim(),
    profileSnapshot: profileSnapshot as CitizenProfile,
    status: 'Submitted',
    submittedAt: now,
    updatedAt: now,
  };

  global.globalApplications.unshift(application);
  console.log('[applications] New application tracked:', application.id);

  return NextResponse.json({ success: true, application }, { status: 200 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const citizenId = searchParams.get('citizenId');

  let applications = global.globalApplications;

  if (citizenId) {
    // Return only the requested citizen's applications
    applications = applications.filter(a => a.citizenId === citizenId);
  } else {
    // If no citizenId is provided, caller must be an officer or admin to see the full list
    const cookieStore = await cookies();
    const role = cookieStore.get('userRole')?.value;
    
    if (role !== 'officer' && role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only officers and admins can view all applications.' },
        { status: 403 }
      );
    }
  }

  return NextResponse.json({ applications }, { status: 200 });
}

export async function PATCH(req: Request) {
  // Independent API Gate: Verify role is 'officer'
  const cookieStore = await cookies();
  const role = cookieStore.get('userRole')?.value;

  if (role !== 'officer') {
    return NextResponse.json(
      { error: 'Forbidden: Only officers can update application statuses.' },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { id, status, rejectionReason } = body as Record<string, any>;
  const application = global.globalApplications.find(a => a.id === id);
  
  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  if (status) {
    const validStatuses: ApplicationStatus[] = ['Submitted', 'Under Review', 'Verified', 'Approved', 'Rejected'];
    if (validStatuses.includes(status)) {
      application.status = status;
    }
  }

  if (rejectionReason !== undefined) {
    application.rejectionReason = rejectionReason;
  }

  application.updatedAt = new Date().toISOString();

  return NextResponse.json({ success: true, application });
}
