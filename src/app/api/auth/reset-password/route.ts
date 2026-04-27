import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { step, email, answer1, answer2, newPassword } = body;

    if (step === 1) {
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, securityAnswer1: true, securityAnswer2: true },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (!user.securityAnswer1 || !user.securityAnswer2) {
        return NextResponse.json(
          { error: "Security questions not set up for this account" },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, userId: user.id });
    }

    if (step === 2) {
      if (!email || !answer1 || !answer2) {
        return NextResponse.json(
          { error: "Email and both security answers are required" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, securityAnswer1: true, securityAnswer2: true },
      });

      if (!user || !user.securityAnswer1 || !user.securityAnswer2) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isAnswer1Valid = await bcrypt.compare(
        answer1.trim().toLowerCase(),
        user.securityAnswer1
      );
      const isAnswer2Valid = await bcrypt.compare(
        answer2.trim().toLowerCase(),
        user.securityAnswer2
      );

      if (!isAnswer1Valid || !isAnswer2Valid) {
        return NextResponse.json(
          { error: "Security answers are incorrect" },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, verified: true });
    }

    if (step === 3) {
      if (!email || !answer1 || !answer2 || !newPassword) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, securityAnswer1: true, securityAnswer2: true },
      });

      if (!user || !user.securityAnswer1 || !user.securityAnswer2) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isAnswer1Valid = await bcrypt.compare(
        answer1.trim().toLowerCase(),
        user.securityAnswer1
      );
      const isAnswer2Valid = await bcrypt.compare(
        answer2.trim().toLowerCase(),
        user.securityAnswer2
      );

      if (!isAnswer1Valid || !isAnswer2Valid) {
        return NextResponse.json(
          { error: "Security answers are incorrect" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return NextResponse.json({ success: true, passwordReset: true });
    }

    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
