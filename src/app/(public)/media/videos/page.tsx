import Link from "next/link";
import { MediaCard } from "@/components/public";
import prisma from "@/lib/prisma";
import { ArrowLeft, Video } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos | Jesus Discipleship Academy",
  description: "Watch sermons, Bible studies, and Christian teachings.",
};

async function getVideos() {
  return prisma.media.findMany({
    where: { type: "video" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Video Teachings
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Watch our collection of sermons, Bible studies, and teachings to
            deepen your understanding of Scripture.
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Video className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No videos available yet.</p>
            <p className="text-gray-400 text-sm">
              Check back soon for new video content!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <MediaCard key={video.id} media={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
