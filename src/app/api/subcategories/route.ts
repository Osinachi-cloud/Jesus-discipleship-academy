import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unassigned = searchParams.get("unassigned") === "true";

    const subcategories = await prisma.subcategory.findMany({
      where: unassigned ? { seriesId: null } : undefined,
      include: {
        series: true,
        _count: { select: { posts: true } },
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ data: subcategories });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json(
      { error: "Failed to fetch subcategories" },
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
    const { name, description, order, seriesId } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Subcategory name is required" },
        { status: 400 }
      );
    }

    const existingName = await prisma.subcategory.findUnique({ where: { name } });
    if (existingName) {
      return NextResponse.json(
        { error: `A subcategory with the name "${name}" already exists` },
        { status: 400 }
      );
    }

    let slug = slugify(name);
    const existingSlug = await prisma.subcategory.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        slug,
        description: description || null,
        order: order ?? null,
        seriesId: seriesId || null,
      },
    });

    return NextResponse.json({ data: subcategory }, { status: 201 });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json(
      { error: "Failed to create subcategory" },
      { status: 500 }
    );
  }
}
