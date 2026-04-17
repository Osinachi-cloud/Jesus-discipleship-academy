"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin";
import {
  Button,
  Card,
  CardContent,
  Loading,
  Empty,
} from "@/components/ui";
import { Trash2, MessageSquare, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  name: string;
  email: string | null;
  message: string;
  approved: boolean;
  createdAt: string;
  post: {
    id: string;
    title: string;
    slug: string;
  };
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchComments();
  }, [page]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "20",
      });

      const response = await fetch(`/api/comments?${params}`);
      const result = await response.json();
      setComments(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await fetch(`/api/comments/${id}`, { method: "DELETE" });
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div>
      <AdminHeader title="Comments" />

      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12">
                <Loading />
              </div>
            ) : comments.length === 0 ? (
              <Empty
                title="No comments yet"
                description="Comments from visitors will appear here."
                icon={<MessageSquare className="h-12 w-12" />}
              />
            ) : (
              <div className="divide-y">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary-700">
                          {comment.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-900">
                            {comment.name}
                          </span>
                          {comment.email && (
                            <span className="text-sm text-gray-500">
                              ({comment.email})
                            </span>
                          )}
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600">{comment.message}</p>
                        <div className="mt-3 flex items-center gap-4">
                          <Link
                            href={`/posts/${comment.post.slug}`}
                            target="_blank"
                            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                          >
                            on "{comment.post.title}"
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
