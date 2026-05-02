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
import {
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  GripVertical,
  FolderTree,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  order?: number | null;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  _count: {
    posts: number;
    media: number;
    children?: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryOrder, setCategoryOrder] = useState<string>("");
  const [parentId, setParentId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const [hierarchyRes, parentsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/categories?parentOnly=true"),
      ]);
      const hierarchyData = await hierarchyRes.json();
      const parentsData = await parentsRes.json();
      setCategories(hierarchyData.data || []);
      setParentCategories(parentsData.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setSaving(true);

    try {
      const payload = {
        name: categoryName,
        description: categoryDescription || null,
        order: categoryOrder ? parseInt(categoryOrder) : null,
        parentId: parentId || null,
      };

      if (editingCategory) {
        await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      closeModal();
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
    setCategoryDescription(category.description || "");
    setCategoryOrder(category.order?.toString() || "");
    setParentId(category.parentId || "");
    setShowModal(true);
  };

  const handleAddSubcategory = (parent: Category) => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setCategoryOrder("");
    setParentId(parent.id);
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
    setCategoryDescription("");
    setCategoryOrder("");
    setParentId("");
    setEditingCategory(null);
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isParent = !category.parentId;

    return (
      <div key={category.id}>
        <div
          className={`flex items-center hover:bg-gray-50 border-b ${
            level > 0 ? "bg-gray-50/50" : ""
          }`}
          style={{ paddingLeft: `${level * 24 + 16}px` }}
        >
          <div className="flex items-center flex-1 py-3">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-1 hover:bg-gray-200 rounded mr-2"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            ) : (
              <span className="w-7" />
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2">
                {isParent ? (
                  <FolderTree className="h-4 w-4 text-navy-600" />
                ) : (
                  <FolderOpen className="h-4 w-4 text-gold-600" />
                )}
                <span
                  className={`font-medium ${
                    isParent ? "text-navy-800" : "text-gray-700"
                  }`}
                >
                  {category.order !== null && category.order !== undefined && (
                    <span className="text-xs bg-navy-100 text-navy-700 px-1.5 py-0.5 rounded mr-2">
                      #{category.order}
                    </span>
                  )}
                  {category.name}
                </span>
                {isParent && category._count.children !== undefined && category._count.children > 0 && (
                  <span className="text-xs text-gray-400">
                    ({category._count.children} sub-categories)
                  </span>
                )}
              </div>
              {category.description && (
                <p className="text-xs text-gray-500 mt-0.5 ml-6">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 px-4">
            <span className="text-sm text-gray-500">
              {category._count.posts} posts
            </span>
            <div className="flex items-center gap-1">
              {isParent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddSubcategory(category)}
                  title="Add sub-category"
                >
                  <Plus className="h-4 w-4 text-green-600" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(category)}
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(category.id)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {category.children!.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <AdminHeader title="Categories & Series" />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Organize content into series (parent categories) and topics (sub-categories).
          </p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Series
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
                description="Create series to organize your content into learning paths."
                icon={<FolderTree className="h-12 w-12" />}
                action={
                  <Button onClick={() => setShowModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Series
                  </Button>
                }
              />
            ) : (
              <div>
                <div className="flex items-center px-6 py-3 bg-gray-100 border-b text-sm font-medium text-gray-500">
                  <span className="flex-1">Category / Series</span>
                  <span className="w-24 text-center">Posts</span>
                  <span className="w-32 text-center">Actions</span>
                </div>
                {categories.map((category) => renderCategory(category))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={
          editingCategory
            ? "Edit Category"
            : parentId
            ? "New Sub-category"
            : "New Series"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingCategory && !parentId && (
            <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg">
              A <strong>Series</strong> is a top-level category that groups related topics together (e.g., "Discipleship", "Daily Posts").
            </div>
          )}

          {(parentId || editingCategory?.parentId) && (
            <div>
              <label className="label">Parent Series</label>
              <select
                value={parentId || editingCategory?.parentId || ""}
                onChange={(e) => setParentId(e.target.value)}
                className="input"
              >
                <option value="">-- No Parent (Make it a Series) --</option>
                {parentCategories
                  .filter((p) => p.id !== editingCategory?.id)
                  .map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <Input
            label="Name"
            placeholder={parentId ? "e.g., Christology" : "e.g., Discipleship"}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />

          <div>
            <label className="label">Description (optional)</label>
            <textarea
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Brief description of this category..."
              className="input min-h-[80px]"
            />
          </div>

          <Input
            label="Order (optional)"
            type="number"
            placeholder="e.g., 1, 2, 3..."
            value={categoryOrder}
            onChange={(e) => setCategoryOrder(e.target.value)}
          />
          <p className="text-xs text-gray-500 -mt-2">
            Use numbers to control the display order. Lower numbers appear first.
          </p>

          <div className="flex justify-end gap-2 pt-2">
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
