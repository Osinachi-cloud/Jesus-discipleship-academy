"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader, RichTextEditor } from "@/components/admin";
import { Button, Input, Select, Card, CardContent, Alert } from "@/components/ui";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  parent?: Category | null;
}

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
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
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?flat=true");
      const result = await response.json();
      setCategories(result.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (status: "draft" | "published") => {
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
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status,
          categoryId: formData.categoryId || null,
          order: formData.order ? parseInt(formData.order) : null,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to create post");
      }

      const result = await response.json();
      router.push("/admin/posts");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader title="New Post" />

      <div className="p-6">
        <div className="mb-6">
          <Link
            href="/admin/posts"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Link>
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
                      onClick={() => handleSubmit("draft")}
                      loading={saving}
                      disabled={saving}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
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
