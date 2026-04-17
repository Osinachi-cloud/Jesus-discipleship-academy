"use client";

import { useEffect, useState } from "react";
import { AdminHeader, StatsCard } from "@/components/admin";
import { Card, CardHeader, CardContent, Badge, Loading } from "@/components/ui";
import { FileText, MessageSquare, Image, Book, Video, Eye } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Stats {
  posts: {
    total: number;
    published: number;
    drafts: number;
  };
  comments: number;
  media: {
    total: number;
    images: number;
    books: number;
    videos: number;
  };
  recentPosts: any[];
  recentComments: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const result = await response.json();
      setStats(result.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <AdminHeader title="Dashboard" />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader title="Dashboard" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Posts"
            value={stats?.posts.total || 0}
            icon={FileText}
          />
          <StatsCard
            title="Published"
            value={stats?.posts.published || 0}
            icon={Eye}
          />
          <StatsCard
            title="Comments"
            value={stats?.comments || 0}
            icon={MessageSquare}
          />
          <StatsCard
            title="Media Files"
            value={stats?.media.total || 0}
            icon={Image}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                Media Overview
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Image className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700">Images</span>
                  </div>
                  <span className="font-semibold">
                    {stats?.media.images || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-50">
                      <Book className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-700">Books</span>
                  </div>
                  <span className="font-semibold">
                    {stats?.media.books || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-50">
                      <Video className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-gray-700">Videos</span>
                  </div>
                  <span className="font-semibold">
                    {stats?.media.videos || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Posts
              </h2>
              <Link
                href="/admin/posts"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {stats?.recentPosts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No posts yet</p>
              ) : (
                <div className="space-y-4">
                  {stats?.recentPosts.map((post: any) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="font-medium text-gray-900 hover:text-primary-600 truncate block"
                        >
                          {post.title}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                          {post.category && ` • ${post.category.name}`}
                        </p>
                      </div>
                      <Badge
                        variant={
                          post.status === "published" ? "success" : "warning"
                        }
                      >
                        {post.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Comments
            </h2>
            <Link
              href="/admin/comments"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.recentComments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No comments yet</p>
            ) : (
              <div className="space-y-4">
                {stats?.recentComments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary-700">
                        {comment.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {comment.name}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {comment.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        on{" "}
                        <Link
                          href={`/posts/${comment.post.slug}`}
                          className="text-primary-600 hover:underline"
                        >
                          {comment.post.title}
                        </Link>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
