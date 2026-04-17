import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      totalMedia,
      totalImages,
      totalBooks,
      totalVideos,
      recentPosts,
      recentComments,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "published" } }),
      prisma.post.count({ where: { status: "draft" } }),
      prisma.comment.count(),
      prisma.media.count(),
      prisma.media.count({ where: { type: "image" } }),
      prisma.media.count({ where: { type: "book" } }),
      prisma.media.count({ where: { type: "video" } }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
      prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { post: { select: { title: true, slug: true } } },
      }),
    ]);

    return NextResponse.json({
      data: {
        posts: {
          total: totalPosts,
          published: publishedPosts,
          drafts: draftPosts,
        },
        comments: totalComments,
        media: {
          total: totalMedia,
          images: totalImages,
          books: totalBooks,
          videos: totalVideos,
        },
        recentPosts,
        recentComments,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
