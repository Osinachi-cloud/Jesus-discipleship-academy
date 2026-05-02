"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminHeader, RichTextEditor } from "@/components/admin";
import { Button, Input, Select, Card, CardContent, Alert, Loading } from "@/components/ui";
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  parent?: Category | null;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    status: "draft",
    categoryId: "",
    order: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchPost();
  }, [postId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?flat=true");
      const result = await response.json();
      setCategories(result.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) throw new Error("Post not found");
      const result = await response.json();
      const post = result.data;
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        featuredImage: post.featuredImage || "",
        status: post.status,
        categoryId: post.categoryId || "",
        order: post.order?.toString() || "",
      });
    } catch (error) {
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (status?: "draft" | "published") => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: status || formData.status,
          categoryId: formData.categoryId || null,
          order: formData.order ? parseInt(formData.order) : null,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to update post");
      }

      router.push("/admin/posts");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (response.ok) {
        router.push("/admin/posts");
      }
    } catch (error) {
      setError("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div>
        <AdminHeader title="Edit Post" />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader title="Edit Post" />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/admin/posts"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <Input
                    label="Title"
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />

                  <div>
                    <label className="label">Content</label>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) =>
                        setFormData((prev) => ({ ...prev, content }))
                      }
                    />
                  </div>

                  <Input
                    label="Excerpt"
                    placeholder="Brief summary of the post (optional)"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Publish</h3>
                <div className="space-y-4">
                  <Select
                    label="Status"
                    options={[
                      { value: "draft", label: "Draft" },
                      { value: "published", label: "Published" },
                    ]}
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  />

                  <Select
                    label="Category"
                    options={[
                      { value: "", label: "Select category" },
                      ...categories.map((c) => ({
                        value: c.id,
                        label: c.parent ? `${c.parent.name} → ${c.name}` : c.name,
                      })),
                    ]}
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                  />

                  <Input
                    label="Order in Category"
                    type="number"
                    placeholder="e.g., 1, 2, 3..."
                    value={formData.order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        order: e.target.value,
                      }))
                    }
                  />
                  <p className="text-xs text-gray-500 -mt-2">
                    Controls display order within the category. Lower numbers appear first.
                  </p>

                  <div className="pt-4 space-y-2">
                    {formData.status === "draft" ? (
                      <>
                        <Button
                          onClick={() => handleSubmit("published")}
                          loading={saving}
                          disabled={saving}
                          className="w-full"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Publish
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleSubmit()}
                          loading={saving}
                          disabled={saving}
                          className="w-full"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Draft
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleSubmit()}
                          loading={saving}
                          disabled={saving}
                          className="w-full"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Update
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleSubmit("draft")}
                          loading={saving}
                          disabled={saving}
                          className="w-full"
                        >
                          Unpublish
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Featured Image</h3>
                <Input
                  placeholder="Enter image URL"
                  value={formData.featuredImage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featuredImage: e.target.value,
                    }))
                  }
                />
                {formData.featuredImage && (
                  <img
                    src={formData.featuredImage}
                    alt="Preview"
                    className="mt-4 rounded-lg w-full h-40 object-cover"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
