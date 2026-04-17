import Link from "next/link";
import { Badge } from "@/components/ui";
import { formatDate, truncate } from "@/lib/utils";
import { Calendar, MessageSquare } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    createdAt: string | Date;
    category: { name: string; slug: string } | null;
    _count?: { comments: number };
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="card group hover:shadow-lg transition-shadow">
      {post.featuredImage && (
        <Link href={`/posts/${post.slug}`}>
          <div className="aspect-video overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}
      <div className="p-6">
        {post.category && (
          <Link href={`/categories/${post.category.slug}`}>
            <Badge variant="info" className="mb-3">
              {post.category.name}
            </Badge>
          </Link>
        )}
        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-xl font-serif font-bold text-navy-800 mb-2 group-hover:text-gold-600 transition-colors">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="text-charcoal-700 mb-4 line-clamp-2">
            {truncate(post.excerpt, 150)}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-charcoal-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(post.createdAt)}
          </span>
          {post._count && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {post._count.comments} comments
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
