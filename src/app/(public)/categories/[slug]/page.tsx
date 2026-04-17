export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/public";
import { Button } from "@/components/ui";
import prisma from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
  });
}

async function getCategoryPosts(categoryId: string, page: number) {
  const pageSize = 9;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { categoryId, status: "published" },
      include: {
        category: true,
        _count: { select: { comments: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where: { categoryId, status: "published" } }),
  ]);

  return {
    posts,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.name} | Jesus Discipleship Academy`,
    description: `Browse all posts in the ${category.name} category.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = await getCategory(params.slug);

  if (!category) {
    notFound();
  }

  const page = parseInt(searchParams.page || "1");
  const { posts, total, totalPages } = await getCategoryPosts(category.id, page);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/posts"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          All Posts
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          <p className="text-gray-600">
            {total} {total === 1 ? "post" : "posts"} in this category
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">
              No posts in this category yet.
            </p>
            <Link href="/posts">
              <Button variant="outline">Browse All Posts</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/categories/${params.slug}?page=${page - 1}`}
                  >
                    <Button variant="outline">Previous</Button>
                  </Link>
                )}
                <span className="text-sm text-gray-600 px-4">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/categories/${params.slug}?page=${page + 1}`}
                  >
                    <Button variant="outline">Next</Button>
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
