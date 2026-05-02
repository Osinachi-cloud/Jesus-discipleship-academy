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
    const series = await prisma.series.findUnique({
      where: { id: params.id },
      include: {
        subcategories: {
          include: {
            _count: { select: { posts: true } },
          },
          orderBy: [{ order: "asc" }, { name: "asc" }],
        },
        _count: { select: { subcategories: true } },
      },
    });

    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    return NextResponse.json({ data: series });
  } catch (error) {
    console.error("Error fetching series:", error);
    return NextResponse.json(
      { error: "Failed to fetch series" },
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
    const { name, description, order } = body;

    const existing = await prisma.series.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    let slug = existing.slug;
    const updatedName = name || existing.name;

    if (name && name !== existing.name) {
      const existingName = await prisma.series.findFirst({
        where: { name, id: { not: params.id } },
      });
      if (existingName) {
        return NextResponse.json(
          { error: `A series with the name "${name}" already exists` },
          { status: 400 }
        );
      }

      slug = slugify(name);
      const existingSlug = await prisma.series.findFirst({
        where: { slug, id: { not: params.id } },
      });
      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const series = await prisma.series.update({
      where: { id: params.id },
      data: {
        name: updatedName,
        slug,
        description: description !== undefined ? description : existing.description,
        order: order !== undefined ? order : existing.order,
      },
    });

    return NextResponse.json({ data: series });
  } catch (error) {
    console.error("Error updating series:", error);
    return NextResponse.json(
      { error: "Failed to update series" },
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

    await prisma.series.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Series deleted successfully" });
  } catch (error) {
    console.error("Error deleting series:", error);
    return NextResponse.json(
      { error: "Failed to delete series" },
      { status: 500 }
    );
  }
}
