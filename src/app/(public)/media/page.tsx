export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Button } from "@/components/ui";
import prisma from "@/lib/prisma";
import { BookOpen, Video, Image as ImageIcon, ArrowRight, ArrowLeft } from "lucide-react";

async function getMediaStats() {
  const stats = await prisma.media.groupBy({
    by: ["type"],
    _count: { id: true },
  });

  return {
    books: stats.find((s) => s.type === "book")?._count.id || 0,
    videos: stats.find((s) => s.type === "video")?._count.id || 0,
    images: stats.find((s) => s.type === "image")?._count.id || 0,
  };
}

export default async function MediaPage() {
  const stats = await getMediaStats();

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

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Media Library
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explore our collection of discipleship resources including books,
            videos, and images for your spiritual growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/media/books" className="group">
            <div className="card p-8 text-center hover:shadow-lg transition-shadow h-full">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                Books & PDFs
              </h2>
              <p className="text-gray-500 mb-4">
                Download discipleship materials, Bible study guides, and
                Christian resources.
              </p>
              <p className="text-3xl font-bold text-green-600 mb-4">
                {stats.books} {stats.books === 1 ? "book" : "books"}
              </p>
              <Button variant="outline" className="group-hover:bg-green-50">
                Browse Books
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Link>

          <Link href="/media/videos" className="group">
            <div className="card p-8 text-center hover:shadow-lg transition-shadow h-full">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-6 group-hover:scale-110 transition-transform">
                <Video className="h-10 w-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                Video Teachings
              </h2>
              <p className="text-gray-500 mb-4">
                Watch sermons, Bible studies, and teachings to deepen your
                understanding of Scripture.
              </p>
              <p className="text-3xl font-bold text-purple-600 mb-4">
                {stats.videos} {stats.videos === 1 ? "video" : "videos"}
              </p>
              <Button variant="outline" className="group-hover:bg-purple-50">
                Watch Videos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Link>

          <Link href="/media/images" className="group">
            <div className="card p-8 text-center hover:shadow-lg transition-shadow h-full">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6 group-hover:scale-110 transition-transform">
                <ImageIcon className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                Image Gallery
              </h2>
              <p className="text-gray-500 mb-4">
                Browse inspiring images, scripture graphics, and visual content
                for encouragement.
              </p>
              <p className="text-3xl font-bold text-blue-600 mb-4">
                {stats.images} {stats.images === 1 ? "image" : "images"}
              </p>
              <Button variant="outline" className="group-hover:bg-blue-50">
                View Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
