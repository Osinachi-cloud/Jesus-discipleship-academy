export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import Link from "next/link";
import { CommentSection, ShareButton } from "@/components/public";
import { Badge } from "@/components/ui";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Calendar, ArrowLeft, Eye } from "lucide-react";
import { ViewTracker } from "./view-tracker";
import type { Metadata } from "next";

interface PostPageProps {
  params: { slug: string };
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug, status: "published" },
    include: {
      category: true,
      comments: {
        where: { approved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return post;
}

async function getRelatedPosts(categoryId: string | null, currentId: string) {
  if (!categoryId) return [];

  return prisma.post.findMany({
    where: {
      status: "published",
      categoryId,
      id: { not: currentId },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      featuredImage: true,
    },
    take: 3,
  });
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Jesus Discipleship Academy`,
    description: post.excerpt || undefined,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.categoryId, post.id);

  return (
    <article className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/posts"
            className="inline-flex items-center text-charcoal-600 hover:text-gold-600 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Link>

          <header className="mb-8">
            {post.category && (
              <Link href={`/categories/${post.category.slug}`}>
                <Badge variant="info" className="mb-4">
                  {post.category.name}
                </Badge>
              </Link>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-navy-800 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-charcoal-500">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {post.views} {post.views === 1 ? "view" : "views"}
              </span>
            </div>
            <ViewTracker postId={post.id} />
          </header>

          {post.featuredImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="border-t border-cream-300 mt-12 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-charcoal-500">
                Share this article
              </p>
<ShareButton title={post.title} />
            </div>
          </div>

          <CommentSection postId={post.id} comments={post.comments} />

          {relatedPosts.length > 0 && (
            <section className="mt-12 pt-12 border-t border-cream-300">
              <h2 className="text-2xl font-serif font-bold text-navy-800 mb-6">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/posts/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="card overflow-hidden hover:shadow-lg transition-shadow">
                      {relatedPost.featuredImage && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-medium text-navy-800 group-hover:text-gold-600 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
