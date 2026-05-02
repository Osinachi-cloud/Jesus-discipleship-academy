export const dynamic = 'force-dynamic';

import Link from "next/link";
import { PostCard } from "@/components/public";
import { Badge, Button } from "@/components/ui";
import prisma from "@/lib/prisma";

interface PostsPageProps {
  searchParams: { page?: string; subcategory?: string };
}

async function getPosts(page: number, subcategorySlug?: string) {
  const pageSize = 9;

  const where: any = { status: "published" };
  if (subcategorySlug) {
    where.subcategory = { slug: subcategorySlug };
  }

  const [posts, total, subcategories] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        subcategory: { include: { series: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
    prisma.subcategory.findMany({
      include: {
        series: true,
        _count: { select: { posts: { where: { status: "published" } } } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    posts,
    total,
    totalPages: Math.ceil(total / pageSize),
    subcategories,
  };
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const page = parseInt(searchParams.page || "1");
  const { posts, total, totalPages, subcategories } = await getPosts(
    page,
    searchParams.subcategory
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
              variant={!searchParams.subcategory ? "info" : "default"}
              className="px-4 py-2 cursor-pointer hover:bg-cream-300 transition-colors"
            >
              All ({total})
            </Badge>
          </Link>
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              href={`/posts?subcategory=${subcategory.slug}`}
            >
              <Badge
                variant={
                  searchParams.subcategory === subcategory.slug ? "info" : "default"
                }
                className="px-4 py-2 cursor-pointer hover:bg-cream-300 transition-colors"
              >
                {subcategory.series ? `${subcategory.series.name} / ` : ""}{subcategory.name} ({subcategory._count.posts})
              </Badge>
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-charcoal-500 mb-4">No posts found.</p>
            {searchParams.subcategory && (
              <Link href="/posts">
                <Button variant="outline">View All Posts</Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    ...post,
                    category: post.subcategory
                      ? { name: post.subcategory.name, slug: post.subcategory.slug }
                      : null,
                  }}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/posts?page=${page - 1}${searchParams.subcategory ? `&subcategory=${searchParams.subcategory}` : ""}`}
                  >
                    <Button variant="outline">Previous</Button>
                  </Link>
                )}
                <span className="text-sm text-charcoal-600 px-4">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/posts?page=${page + 1}${searchParams.subcategory ? `&subcategory=${searchParams.subcategory}` : ""}`}
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
