import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentOnly = searchParams.get("parentOnly") === "true";
    const flat = searchParams.get("flat") === "true";

    if (parentOnly) {
      const categories = await prisma.category.findMany({
        where: { parentId: null },
        include: {
          _count: {
            select: { posts: true, media: true, children: true },
          },
        },
        orderBy: [{ order: "asc" }, { name: "asc" }],
      });
      return NextResponse.json({ data: categories });
    }

    if (flat) {
      const categories = await prisma.category.findMany({
        include: {
          parent: true,
          _count: {
            select: { posts: true, media: true, children: true },
          },
        },
        orderBy: [{ order: "asc" }, { name: "asc" }],
      });
      return NextResponse.json({ data: categories });
    }

    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            _count: {
              select: { posts: true, media: true },
            },
          },
          orderBy: [{ order: "asc" }, { name: "asc" }],
        },
        _count: {
          select: { posts: true, media: true, children: true },
        },
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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
    const { name, parentId, description, order } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    let slug = slugify(name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        order: order ?? null,
        parentId: parentId || null,
      },
    });

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
