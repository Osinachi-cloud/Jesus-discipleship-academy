import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subcategory = await prisma.subcategory.findUnique({
      where: { id: params.id },
      include: {
        series: true,
        posts: {
          where: { status: "published" },
          orderBy: [{ order: "asc" }, { publishedAt: "asc" }],
        },
        _count: { select: { posts: true } },
      },
    });

    if (!subcategory) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: subcategory });
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    return NextResponse.json(
      { error: "Failed to fetch subcategory" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, order, seriesId } = body;

    const existing = await prisma.subcategory.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    let slug = existing.slug;
    const updatedName = name || existing.name;

    if (name && name !== existing.name) {
      const existingName = await prisma.subcategory.findFirst({
        where: { name, id: { not: params.id } },
      });
      if (existingName) {
        return NextResponse.json(
          { error: `A subcategory with the name "${name}" already exists` },
          { status: 400 }
        );
      }

      slug = slugify(name);
      const existingSlug = await prisma.subcategory.findFirst({
        where: { slug, id: { not: params.id } },
      });
      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const subcategory = await prisma.subcategory.update({
      where: { id: params.id },
      data: {
        name: updatedName,
        slug,
        description: description !== undefined ? description : existing.description,
        order: order !== undefined ? order : existing.order,
        seriesId: seriesId !== undefined ? (seriesId || null) : existing.seriesId,
      },
    });

    return NextResponse.json({ data: subcategory });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return NextResponse.json(
      { error: "Failed to update subcategory" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.subcategory.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return NextResponse.json(
      { error: "Failed to delete subcategory" },
      { status: 500 }
    );
  }
}
