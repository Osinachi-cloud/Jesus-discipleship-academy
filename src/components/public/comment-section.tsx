"use client";

import { useState } from "react";
import { Button, Input, Textarea, Alert } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { Send } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  message: string;
  createdAt: string | Date;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError("Name and message are required");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || undefined,
          message,
          postId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const result = await response.json();
      setComments((prev) => [result.data, ...prev]);
      setName("");
      setEmail("");
      setMessage("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h2>

      <div className="card p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Leave a Comment</h3>

        {success && (
          <Alert variant="success" className="mb-4">
            Your comment has been posted successfully!
          </Alert>
        )}

        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Your email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Textarea
            placeholder="Write your comment here... *"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button type="submit" loading={submitting} disabled={submitting}>
            <Send className="h-4 w-4 mr-2" />
            Post Comment
          </Button>
        </form>
      </div>

      {comments.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary-700">
                  {comment.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{comment.name}</span>
                  <span className="text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-600">{comment.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
