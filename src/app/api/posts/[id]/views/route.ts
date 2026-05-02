import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role === "ADMIN") {
      const post = await prisma.post.findUnique({
        where: { id: params.id },
        select: { views: true },
      });
      return NextResponse.json({ views: post?.views || 0, skipped: true });
    }

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        views: true,
      },
    });

    return NextResponse.json({ views: post.views });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update views" },
      { status: 500 }
    );
  }
}
