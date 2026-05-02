import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

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
    const { name, parentId, description, order } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    let slug = existing.slug;
    if (name !== existing.name) {
      slug = slugify(name);
      const slugExists = await prisma.category.findFirst({
        where: { slug, id: { not: params.id } },
      });
      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description: description !== undefined ? description : existing.description,
        order: order !== undefined ? order : existing.order,
        parentId: parentId !== undefined ? (parentId || null) : existing.parentId,
      },
    });

    return NextResponse.json({ data: category });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
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

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
