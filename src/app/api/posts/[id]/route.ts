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
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        subcategory: {
          include: { series: true },
        },
        comments: {
          where: { approved: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
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
    const { title, content, excerpt, featuredImage, status, subcategoryId, order } = body;

    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let slug = existingPost.slug;
    if (title && title !== existingPost.title) {
      slug = slugify(title);
      const slugExists = await prisma.post.findFirst({
        where: { slug, id: { not: params.id } },
      });
      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const wasPublished = existingPost.status === "published";
    const isNowPublished = status === "published";

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: title || existingPost.title,
        slug,
        content: content !== undefined ? content : existingPost.content,
        excerpt: excerpt !== undefined ? excerpt : existingPost.excerpt,
        featuredImage:
          featuredImage !== undefined
            ? featuredImage
            : existingPost.featuredImage,
        status: status || existingPost.status,
        subcategoryId: subcategoryId !== undefined ? subcategoryId : existingPost.subcategoryId,
        order: order !== undefined ? order : existingPost.order,
        publishedAt:
          !wasPublished && isNowPublished
            ? new Date()
            : existingPost.publishedAt,
      },
      include: {
        subcategory: {
          include: { series: true },
        },
      },
    });

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
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

    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
