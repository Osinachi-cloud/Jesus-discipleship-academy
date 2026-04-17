export const dynamic = 'force-dynamic';

import Link from "next/link";
import { MediaCard } from "@/components/public";
import { Button } from "@/components/ui";
import prisma from "@/lib/prisma";
import { ArrowLeft, Download } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books & PDFs | Jesus Discipleship Academy",
  description: "Download discipleship materials, Bible study resources, and Christian books.",
};

async function getBooks() {
  return prisma.media.findMany({
    where: { type: "book" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function BooksPage() {
  const books = await getBooks();

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
            Books & PDFs
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Download our collection of discipleship materials, Bible study guides,
            and Christian resources to aid your spiritual growth.
          </p>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Download className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No books available yet.</p>
            <p className="text-gray-400 text-sm">
              Check back soon for new resources!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <MediaCard key={book.id} media={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
