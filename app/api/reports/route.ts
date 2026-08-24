import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

declare global {
  var globalReports: any[];
}
global.globalReports = global.globalReports || [];

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const { schemeCode, description } = body as Record<string, unknown>;

  // Validation
  const errors: string[] = [];

  if (typeof schemeCode !== 'string' || schemeCode.trim().length === 0) {
    errors.push('Scheme code is required.');
  }

  if (typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required.');
  } else if (description.trim().length > 5000) {
    errors.push('Description must be 5000 characters or fewer.');
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: errors.join(' ') },
      { status: 422 },
    );
  }

  const sanitized = {
    id: Math.random().toString(36).substring(7),
    schemeCode: (schemeCode as string).trim(),
    description: (description as string).trim(),
    status: 'pending',
    receivedAt: new Date().toISOString(),
  };

  global.globalReports.unshift(sanitized);
  console.log('[reports] New report added:', sanitized);

  return NextResponse.json(
    { success: true, message: 'Report submitted. Thank you for helping improve our data.' },
    { status: 200 },
  );
}

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get('userRole')?.value;

  if (role !== 'officer' && role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden: Only officers and admins can view reports.' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    reports: global.globalReports
  }, { status: 200 });
}

export async function PATCH(req: Request) {
  // Independent API Gate: Verify role is 'officer'
  const cookieStore = await cookies();
  const role = cookieStore.get('userRole')?.value;

  if (role !== 'officer') {
    return NextResponse.json(
      { error: 'Forbidden: Only officers can update report statuses.' },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { id, action } = body as Record<string, unknown>;
  const report = global.globalReports.find(r => r.id === id);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  if (action === 'approve') {
    report.status = 'approved';
  } else if (action === 'dismiss') {
    report.status = 'dismissed';
  }

  return NextResponse.json({ success: true, report });
}
