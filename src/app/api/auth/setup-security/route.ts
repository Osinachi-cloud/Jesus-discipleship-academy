import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { answer1, answer2 } = body;

    if (!answer1 || !answer2) {
      return NextResponse.json(
        { error: "Both security answers are required" },
        { status: 400 }
      );
    }

    const hashedAnswer1 = await bcrypt.hash(answer1.trim().toLowerCase(), 12);
    const hashedAnswer2 = await bcrypt.hash(answer2.trim().toLowerCase(), 12);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        securityAnswer1: hashedAnswer1,
        securityAnswer2: hashedAnswer2,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting up security questions:", error);
    return NextResponse.json(
      { error: "Failed to set up security questions" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { securityAnswer1: true, securityAnswer2: true },
    });

    return NextResponse.json({
      hasSecurityQuestions: !!(user?.securityAnswer1 && user?.securityAnswer2),
    });
  } catch (error) {
    console.error("Error checking security questions:", error);
    return NextResponse.json(
      { error: "Failed to check security questions" },
      { status: 500 }
    );
  }
}
