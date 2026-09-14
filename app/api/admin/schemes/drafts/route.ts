import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { prisma } from '../../../../../lib/prisma';

export async function POST(req: Request) {
  const session = await auth();
  const role = session?.user?.role || 'citizen';

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
  }

  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized: User email required.' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { targetSchemeCode, payload } = body;

  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ error: 'Missing or invalid payload.' }, { status: 400 });
  }

  // Ensure rulesAST is present and a valid object/array
  if (!payload.rulesAST || typeof payload.rulesAST !== 'object') {
    return NextResponse.json({ error: 'Payload must contain a valid rulesAST object.' }, { status: 400 });
  }

  const draft = await prisma.schemeDraft.create({
    data: {
      targetSchemeCode: targetSchemeCode || null,
      payload: JSON.stringify(payload),
      status: 'draft',
      createdBy: email,
    }
  });

  return NextResponse.json({ success: true, draft }, { status: 201 });
}

export async function GET(req: Request) {
  const session = await auth();
  const role = session?.user?.role || 'citizen';

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
  }

  const drafts = await prisma.schemeDraft.findMany({
    orderBy: { createdAt: 'desc' },
    where: { status: 'draft' } // only pending drafts
  });

  return NextResponse.json({ success: true, drafts }, { status: 200 });
}
