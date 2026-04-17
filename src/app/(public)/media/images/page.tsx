export const dynamic = 'force-dynamic';

import Link from "next/link";
import prisma from "@/lib/prisma";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Gallery | Jesus Discipleship Academy",
  description: "Browse inspiring images and graphics for spiritual encouragement.",
};

async function getImages() {
  return prisma.media.findMany({
    where: { type: "image" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function ImagesPage() {
  const images = await getImages();

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
            Image Gallery
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Browse our collection of inspiring images, scripture graphics, and
            visual content for spiritual encouragement.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No images available yet.</p>
            <p className="text-gray-400 text-sm">
              Check back soon for new visual content!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <a
                key={image.id}
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <div className="w-full p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-sm font-medium truncate">{image.title}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
