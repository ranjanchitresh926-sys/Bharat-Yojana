import { NextResponse } from 'next/server';
import { auth } from '../../../../../../../auth';
import { prisma } from '../../../../../../../lib/prisma';
import { SchemeEngine } from '../../../../../../../lib/astEvaluator';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const session = await auth();
  const role = session?.user?.role || 'citizen';

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
  }

  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  
  const draft = await prisma.schemeDraft.findUnique({ where: { id } });
  if (!draft) {
    return NextResponse.json({ error: 'Draft not found.' }, { status: 404 });
  }

  if (draft.status !== 'draft') {
    return NextResponse.json({ error: `Cannot publish draft with status ${draft.status}`}, { status: 400 });
  }

  let payload;
  try {
    payload = JSON.parse(draft.payload);
  } catch (e) {
    return NextResponse.json({ error: 'Draft payload is invalid JSON.' }, { status: 400 });
  }

  // 1. Validate rulesAST
  if (!payload.rulesAST) {
    return NextResponse.json({ error: 'Draft missing rulesAST.' }, { status: 400 });
  }

  // Two synthetic profiles
  const eligibleProfile = {
    income: 50000,
    age: 30,
    occupation: "farmer",
    gender: "female",
    disabilityStatus: "yes"
  };
  
  const ineligibleProfile = {
    income: 5000000,
    age: 80,
    occupation: "business",
    gender: "male",
    disabilityStatus: "no"
  };

    try {
    SchemeEngine.evaluate(eligibleProfile as any, payload as any);
    SchemeEngine.evaluate(ineligibleProfile as any, payload as any);
  } catch (err: any) {
    return NextResponse.json({ error: `Draft evaluation failed: ${err.message}`}, { status: 400 });
  }

  // 2. Upsert into Scheme table
  const schemeCode = payload.code || draft.targetSchemeCode;
  if (!schemeCode) {
    return NextResponse.json({ error: 'Scheme code is missing from payload and targetSchemeCode.' }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.scheme.upsert({
      where: { code: schemeCode },
      update: {
        title: payload.title,
        category: payload.category,
        level: payload.level,
        ministry: payload.ministry,
        rulesAST: JSON.stringify(payload.rulesAST),
        numericLimits: JSON.stringify(payload.numericLimits || {}),
        fallbackSchemeIds: JSON.stringify(payload.fallbackSchemeIds || []),
        sourceCitation: payload.sourceCitation || "Admin Draft",
        lastReviewedAt: new Date()
      },
      create: {
        code: schemeCode,
        title: payload.title,
        category: payload.category,
        level: payload.level,
        ministry: payload.ministry,
        rulesAST: JSON.stringify(payload.rulesAST),
        numericLimits: JSON.stringify(payload.numericLimits || {}),
        fallbackSchemeIds: JSON.stringify(payload.fallbackSchemeIds || []),
        sourceCitation: payload.sourceCitation || "Admin Draft",
        lastReviewedAt: new Date()
      }
    });

    await tx.schemeDraft.update({
      where: { id },
      data: {
        status: 'published',
        publishedBy: email,
        publishedAt: new Date()
      }
    });
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
