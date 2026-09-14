import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const { name, email, message } = body as Record<string, unknown>;

  // ── Validation ──────────────────────────────────────────────────────
  const errors: string[] = [];

  if (typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required.");
  } else if (name.trim().length > 200) {
    errors.push("Name must be 200 characters or fewer.");
  }

  if (typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push("Email is not valid.");
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    errors.push("Message is required.");
  } else if (message.trim().length > 5000) {
    errors.push("Message must be 5000 characters or fewer.");
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: errors.join(" ") },
      { status: 422 },
    );
  }

  // ── Persist to the database (previously this only logged to console
  //    and was permanently lost on restart — see MASTER_HANDOFF.md §12.4) ──
  const dbFeedback = await prisma.feedback.create({
    data: {
      name: (name as string).trim(),
      email: (email as string).trim(),
      message: (message as string).trim(),
    },
  });

  console.log("[feedback] New feedback stored:", dbFeedback.id);

  return NextResponse.json(
    { success: true, message: "Feedback received. Thank you!" },
    { status: 200 },
  );
}

// Officer/admin-only: view submitted feedback. Previously there was no way
// for anyone to ever see Connect-page submissions except by tailing server
// logs at the exact moment of submission.
export async function GET() {
  const session = await auth();
  const role = session?.user?.role || "citizen";

  if (role !== "officer" && role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Only officers and admins can view feedback." },
      { status: 403 },
    );
  }

  const dbFeedback = await prisma.feedback.findMany({
    orderBy: { receivedAt: "desc" },
  });

  const feedback = dbFeedback.map((f: any) => ({
    id: f.id,
    name: f.name,
    email: f.email,
    message: f.message,
    receivedAt: f.receivedAt.toISOString(),
  }));

  return NextResponse.json({ feedback }, { status: 200 });
}
