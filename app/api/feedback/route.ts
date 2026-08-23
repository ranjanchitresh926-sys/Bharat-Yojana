import { NextResponse } from 'next/server';

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

  const { name, email, message } = body as Record<string, unknown>;

  // ── Validation ──────────────────────────────────────────────────────
  const errors: string[] = [];

  if (typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required.');
  } else if (name.trim().length > 200) {
    errors.push('Name must be 200 characters or fewer.');
  }

  if (typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email is required.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('Email is not valid.');
  }

  if (typeof message !== 'string' || message.trim().length === 0) {
    errors.push('Message is required.');
  } else if (message.trim().length > 5000) {
    errors.push('Message must be 5 000 characters or fewer.');
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: errors.join(' ') },
      { status: 422 },
    );
  }

  // ── Log server-side (no real email sending for now) ─────────────────
  const sanitized = {
    name: (name as string).trim(),
    email: (email as string).trim(),
    message: (message as string).trim(),
    receivedAt: new Date().toISOString(),
  };

  console.log('[feedback]', JSON.stringify(sanitized));

  return NextResponse.json(
    { success: true, message: 'Feedback received. Thank you!' },
    { status: 200 },
  );
}
