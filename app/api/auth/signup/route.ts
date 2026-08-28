import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required." },
        { status: 400 }
      );
    }

    if (!["officer", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be 'officer' or 'admin'." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, passwordHash, role },
    });

    return NextResponse.json(
      { success: true, message: "Account created successfully." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
