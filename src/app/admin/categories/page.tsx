"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin";
import {
  Button,
  Card,
  CardContent,
  Loading,
  Empty,
  Input,
  Modal,
} from "@/components/ui";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
    media: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/categories");
      const result = await response.json();
      setCategories(result.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setSaving(true);

    try {
      if (editingCategory) {
        await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName }),
        });
      } else {
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName }),
        });
      }

      setShowModal(false);
      setCategoryName("");
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCategoryName("");
    setEditingCategory(null);
  };

  return (
    <div>
      <AdminHeader title="Categories" />

      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12">
                <Loading />
              </div>
            ) : categories.length === 0 ? (
              <Empty
                title="No categories yet"
                description="Create categories to organize your content."
                icon={<FolderOpen className="h-12 w-12" />}
                action={
                  <Button onClick={() => setShowModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Category
                  </Button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                        Name
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                        Slug
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                        Posts
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                        Media
                      </th>
                      <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">
                            {category.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-500">{category.slug}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600">
                            {category._count.posts}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600">
                            {category._count.media}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(category.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingCategory ? "Edit Category" : "New Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saving} disabled={saving}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
