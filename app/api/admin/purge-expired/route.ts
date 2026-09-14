import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { prisma } from '../../../../lib/prisma';

// This should be triggered by a real scheduled job (e.g. Vercel Cron) once hosting is finalized — currently manual-only, consistent with what the Privacy Notice actually states.
export async function POST(req: Request) {
  const session = await auth();
  const role = session?.user?.role || 'citizen';

  if (role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden: Admin access required.' },
      { status: 403 }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    // Ignore empty body
  }

  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - 30);

  const expiredApps = await prisma.application.findMany({
    where: {
      status: { in: ['Approved', 'Rejected'] },
      updatedAt: { lt: thresholdDate }
    }
  });

  if (body.dryRun) {
    return NextResponse.json({ success: true, count: expiredApps.length });
  }

  if (expiredApps.length === 0) {
    return NextResponse.json({ success: true, applicationsDeleted: 0, consentRecordsMarkedWithdrawn: 0 });
  }

  const citizenIds = expiredApps.map(app => app.citizenId).filter(Boolean) as string[];

  try {
    const result = await prisma.$transaction(async (tx) => {
      const { count: appsDeleted } = await tx.application.deleteMany({
        where: { id: { in: expiredApps.map(app => app.id) } }
      });

      let consentsUpdated = 0;
      if (citizenIds.length > 0) {
        const updateResult = await tx.consentRecord.updateMany({
          where: {
            citizenId: { in: citizenIds },
            withdrawnAt: null
          },
          data: { withdrawnAt: new Date() }
        });
        consentsUpdated = updateResult.count;
      }

      await tx.retentionLog.create({
        data: {
          applicationsDeleted: appsDeleted,
          consentRecordsMarkedWithdrawn: consentsUpdated
        }
      });

      return { appsDeleted, consentsUpdated };
    });

    return NextResponse.json({
      success: true,
      applicationsDeleted: result.appsDeleted,
      consentRecordsMarkedWithdrawn: result.consentsUpdated
    });
  } catch (error) {
    console.error('Purge error:', error);
    return NextResponse.json({ error: 'Failed to execute retention purge.' }, { status: 500 });
  }
}
