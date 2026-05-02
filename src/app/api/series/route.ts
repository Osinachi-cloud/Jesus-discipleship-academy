import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const series = await prisma.series.findMany({
      include: {
        subcategories: {
          include: {
            _count: { select: { posts: true } },
          },
          orderBy: [{ order: "asc" }, { name: "asc" }],
        },
        _count: { select: { subcategories: true } },
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ data: series });
  } catch (error) {
    console.error("Error fetching series:", error);
    return NextResponse.json(
      { error: "Failed to fetch series" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, order } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Series name is required" },
        { status: 400 }
      );
    }

    const existingName = await prisma.series.findUnique({ where: { name } });
    if (existingName) {
      return NextResponse.json(
        { error: `A series with the name "${name}" already exists` },
        { status: 400 }
      );
    }

    let slug = slugify(name);
    const existingSlug = await prisma.series.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const series = await prisma.series.create({
      data: {
        name,
        slug,
        description: description || null,
        order: order ?? null,
      },
    });

    return NextResponse.json({ data: series }, { status: 201 });
  } catch (error) {
    console.error("Error creating series:", error);
    return NextResponse.json(
      { error: "Failed to create series" },
      { status: 500 }
    );
  }
}
