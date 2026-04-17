export const dynamic = 'force-dynamic';

import Link from "next/link";
import { PostCard } from "@/components/public";
import { Badge, Button } from "@/components/ui";
import prisma from "@/lib/prisma";

interface PostsPageProps {
  searchParams: { page?: string; category?: string };
}

async function getPosts(page: number, categorySlug?: string) {
  const pageSize = 9;

  const where: any = { status: "published" };
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  const [posts, total, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        category: true,
        _count: { select: { comments: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({
      include: { _count: { select: { posts: { where: { status: "published" } } } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    posts,
    total,
    totalPages: Math.ceil(total / pageSize),
    categories,
  };
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const page = parseInt(searchParams.page || "1");
  const { posts, total, totalPages, categories } = await getPosts(
    page,
    searchParams.category
  );

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy-800 mb-4">
            All Posts
          </h1>
          <p className="text-charcoal-700 max-w-2xl">
            Explore our collection of articles, teachings, and devotionals to
            help you grow in your faith journey.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/posts">
            <Badge
              variant={!searchParams.category ? "info" : "default"}
              className="px-4 py-2 cursor-pointer hover:bg-cream-300 transition-colors"
            >
              All ({total})
            </Badge>
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/posts?category=${category.slug}`}
            >
              <Badge
                variant={
                  searchParams.category === category.slug ? "info" : "default"
                }
                className="px-4 py-2 cursor-pointer hover:bg-cream-300 transition-colors"
              >
                {category.name} ({category._count.posts})
              </Badge>
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-charcoal-500 mb-4">No posts found.</p>
            {searchParams.category && (
              <Link href="/posts">
                <Button variant="outline">View All Posts</Button>
              </Link>
            )}
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
                    href={`/posts?page=${page - 1}${searchParams.category ? `&category=${searchParams.category}` : ""}`}
                  >
                    <Button variant="outline">Previous</Button>
                  </Link>
                )}
                <span className="text-sm text-charcoal-600 px-4">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/posts?page=${page + 1}${searchParams.category ? `&category=${searchParams.category}` : ""}`}
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
