import { NextResponse } from 'next/server';
import { auth } from '../../../../../../../auth';
import { prisma } from '../../../../../../../lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const session = await auth();
  const role = session?.user?.role || 'citizen';

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
  }

  
  const draft = await prisma.schemeDraft.findUnique({ where: { id } });
  if (!draft) {
    return NextResponse.json({ error: 'Draft not found.' }, { status: 404 });
  }

  if (draft.status !== 'draft') {
    return NextResponse.json({ error: Cannot discard draft with status \ }, { status: 400 });
  }

  await prisma.schemeDraft.update({
    where: { id },
    data: {
      status: 'discarded'
    }
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
