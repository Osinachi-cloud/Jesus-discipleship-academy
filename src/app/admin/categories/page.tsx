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
  Select,
} from "@/components/ui";
import {
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FolderTree,
  ArrowUp,
  ArrowDown,
  Layers,
  GripVertical,
  X,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  order?: number | null;
  parentId?: string | null;
  children?: Category[];
  _count: {
    posts: number;
    children?: number;
  };
}

interface FlatCategory {
  id: string;
  name: string;
  parentId?: string | null;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<FlatCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showManageSubsModal, setShowManageSubsModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [managingSeries, setManagingSeries] = useState<Category | null>(null);
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategoryToAdd, setSelectedCategoryToAdd] = useState("");
  const [managedSubcategories, setManagedSubcategories] = useState<Category[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const [hierarchyRes, flatRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/categories?flat=true"),
      ]);
      const hierarchyResult = await hierarchyRes.json();
      const flatResult = await flatRes.json();
      setCategories(hierarchyResult.data || []);
      setAllCategories(flatResult.data || []);
      // Auto-expand all categories
      const allIds = new Set<string>();
      (hierarchyResult.data || []).forEach((cat: Category) => allIds.add(cat.id));
      setExpandedCategories(allIds);
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

  // Create new series
  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setSaving(true);

    try {
      const maxOrder = categories.reduce((max, c) => Math.max(max, c.order || 0), 0);
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription || null,
          order: maxOrder + 1,
          parentId: null,
        }),
      });
      closeModal();
      fetchCategories();
    } catch (error) {
      console.error("Error creating series:", error);
    } finally {
      setSaving(false);
    }
  };

  // Create sub-category under a parent
  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim() || !selectedParent) return;
    setSaving(true);

    try {
      const siblings = selectedParent.children || [];
      const maxOrder = siblings.reduce((max, c) => Math.max(max, c.order || 0), 0);
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription || null,
          order: maxOrder + 1,
          parentId: selectedParent.id,
        }),
      });
      closeSubModal();
      fetchCategories();
    } catch (error) {
      console.error("Error creating sub-category:", error);
    } finally {
      setSaving(false);
    }
  };

  // Update category
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim() || !editingCategory) return;
    setSaving(true);

    try {
      await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription || null,
        }),
      });
      closeModal();
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setSaving(false);
    }
  };

  // Move category up/down
  const handleMove = async (category: Category, direction: "up" | "down", siblings: Category[]) => {
    const currentIndex = siblings.findIndex(c => c.id === category.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    const targetCategory = siblings[targetIndex];

    // Swap orders
    const currentOrder = category.order ?? currentIndex;
    const targetOrder = targetCategory.order ?? targetIndex;

    try {
      await Promise.all([
        fetch(`/api/categories/${category.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: category.name, order: targetOrder }),
        }),
        fetch(`/api/categories/${targetCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: targetCategory.name, order: currentOrder }),
        }),
      ]);
      fetchCategories();
    } catch (error) {
      console.error("Error moving category:", error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
    setShowModal(true);
  };

  const handleAddSubcategory = (parent: Category) => {
    setSelectedParent(parent);
    setCategoryName("");
    setCategoryDescription("");
    setShowSubModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All sub-categories will also be deleted.")) return;

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
    setEditingCategory(null);
  };

  const closeSubModal = () => {
    setShowSubModal(false);
    setCategoryName("");
    setCategoryDescription("");
    setSelectedParent(null);
  };

  // Open manage subcategories modal
  const handleManageSubcategories = (series: Category) => {
    setManagingSeries(series);
    setManagedSubcategories([...(series.children || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    setSelectedCategoryToAdd("");
    setShowManageSubsModal(true);
  };

  const closeManageSubsModal = () => {
    setShowManageSubsModal(false);
    setManagingSeries(null);
    setManagedSubcategories([]);
    setSelectedCategoryToAdd("");
    setDraggedIndex(null);
  };

  // Get categories that can be added as subcategories (orphans or from other series)
  const getAvailableCategories = () => {
    if (!managingSeries) return [];
    const currentSubIds = new Set(managedSubcategories.map(c => c.id));
    return allCategories.filter(c =>
      c.id !== managingSeries.id &&
      !currentSubIds.has(c.id) &&
      c.parentId !== managingSeries.id
    );
  };

  // Add a category as subcategory
  const handleAddToSeries = async () => {
    if (!selectedCategoryToAdd || !managingSeries) return;
    setSaving(true);
    try {
      const newOrder = managedSubcategories.length + 1;
      await fetch(`/api/categories/${selectedCategoryToAdd}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentId: managingSeries.id,
          order: newOrder
        }),
      });
      // Refresh and update local state
      const catToAdd = allCategories.find(c => c.id === selectedCategoryToAdd);
      if (catToAdd) {
        setManagedSubcategories(prev => [...prev, {
          ...catToAdd,
          order: newOrder,
          _count: { posts: 0 }
        } as Category]);
      }
      setSelectedCategoryToAdd("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding subcategory:", error);
    } finally {
      setSaving(false);
    }
  };

  // Remove from series (make it a top-level category)
  const handleRemoveFromSeries = async (categoryId: string) => {
    if (!confirm("Remove this subcategory from the series? It will become a standalone series.")) return;
    setSaving(true);
    try {
      await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId: null }),
      });
      setManagedSubcategories(prev => prev.filter(c => c.id !== categoryId));
      fetchCategories();
    } catch (error) {
      console.error("Error removing subcategory:", error);
    } finally {
      setSaving(false);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newList = [...managedSubcategories];
    const draggedItem = newList[draggedIndex];
    newList.splice(draggedIndex, 1);
    newList.splice(index, 0, draggedItem);
    setManagedSubcategories(newList);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Save the new order
  const handleSaveOrder = async () => {
    if (!managingSeries) return;
    setSaving(true);
    try {
      await Promise.all(
        managedSubcategories.map((cat, index) =>
          fetch(`/api/categories/${cat.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: index + 1 }),
          })
        )
      );
      closeManageSubsModal();
      fetchCategories();
    } catch (error) {
      console.error("Error saving order:", error);
    } finally {
      setSaving(false);
    }
  };

  // Move subcategory up/down in the manage modal
  const handleMoveInModal = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= managedSubcategories.length) return;

    const newList = [...managedSubcategories];
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setManagedSubcategories(newList);
  };

  const renderSubcategory = (category: Category, index: number, siblings: Category[]) => {
    return (
      <div
        key={category.id}
        className="flex items-center gap-3 py-3 px-4 bg-cream-50 border-b border-cream-200 last:border-b-0"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gold-100 text-gold-700 text-sm font-bold">
          {category.order ?? index + 1}
        </span>
        <FolderOpen className="h-4 w-4 text-gold-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="font-medium text-charcoal-800">{category.name}</span>
          {category.description && (
            <p className="text-xs text-gray-500 truncate">{category.description}</p>
          )}
        </div>
        <span className="text-sm text-gray-500 flex-shrink-0">
          {category._count.posts} posts
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleMove(category, "up", siblings)}
            disabled={index === 0}
            title="Move up"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleMove(category, "down", siblings)}
            disabled={index === siblings.length - 1}
            title="Move down"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
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
    );
  };

  const renderSeries = (series: Category, index: number) => {
    const hasChildren = series.children && series.children.length > 0;
    const isExpanded = expandedCategories.has(series.id);

    return (
      <div key={series.id} className="border border-cream-300 rounded-lg overflow-hidden mb-4">
        <div className="bg-navy-800 text-cream-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-700 text-gold-500 font-bold">
              {series.order ?? index + 1}
            </span>
            {hasChildren && (
              <button
                onClick={() => toggleExpand(series.id)}
                className="p-1 hover:bg-navy-700 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>
            )}
            <FolderTree className="h-5 w-5 text-gold-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-lg">{series.name}</span>
              {series.description && (
                <p className="text-sm text-cream-300 truncate">{series.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm text-cream-300">
                {series._count.children || 0} topics
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleManageSubcategories(series)}
                title="Manage Subcategories"
                className="text-gold-400 hover:text-gold-300 hover:bg-navy-700"
              >
                <Layers className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMove(series, "up", categories)}
                disabled={index === 0}
                title="Move up"
                className="text-cream-200 hover:text-white hover:bg-navy-700"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMove(series, "down", categories)}
                disabled={index === categories.length - 1}
                title="Move down"
                className="text-cream-200 hover:text-white hover:bg-navy-700"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(series)}
                title="Edit"
                className="text-cream-200 hover:text-white hover:bg-navy-700"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(series.id)}
                title="Delete"
                className="text-red-400 hover:text-red-300 hover:bg-navy-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="bg-white">
            {hasChildren ? (
              <div>
                {series.children!.map((child, idx) =>
                  renderSubcategory(child, idx, series.children!)
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                No sub-categories yet
              </div>
            )}
            <div className="p-3 bg-gray-50 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddSubcategory(series)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Sub-category to {series.name}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <AdminHeader title="Series & Categories" />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-gray-600 mb-2">
              Organize your content into <strong>Series</strong> (main topics) and <strong>Sub-categories</strong> (lessons within each series).
            </p>
            <p className="text-sm text-gray-500">
              Use the arrows to reorder. Numbers indicate the display order for readers.
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Series
          </Button>
        </div>

        {loading ? (
          <div className="py-12">
            <Loading />
          </div>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <Empty
                title="No series yet"
                description="Create your first series to start organizing content."
                icon={<Layers className="h-12 w-12" />}
                action={
                  <Button onClick={() => setShowModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Series
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div>
            {categories.map((series, index) => renderSeries(series, index))}
          </div>
        )}
      </div>

      {/* Create/Edit Series Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingCategory ? "Edit Category" : "New Series"}
      >
        <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateSeries} className="space-y-4">
          {!editingCategory && (
            <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg">
              A <strong>Series</strong> groups related sub-categories together (e.g., "Discipleship" containing "Christology", "Theology").
            </div>
          )}

          <Input
            label="Name"
            placeholder="e.g., Discipleship"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />

          <div>
            <label className="label">Description (optional)</label>
            <textarea
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Brief description..."
              className="input min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saving} disabled={saving}>
              {editingCategory ? "Update" : "Create Series"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Sub-category Modal */}
      <Modal
        isOpen={showSubModal}
        onClose={closeSubModal}
        title={`Add Sub-category to "${selectedParent?.name}"`}
      >
        <form onSubmit={handleCreateSubcategory} className="space-y-4">
          <div className="bg-green-50 text-green-800 text-sm p-3 rounded-lg">
            This sub-category will be added to <strong>{selectedParent?.name}</strong> series.
          </div>

          <Input
            label="Name"
            placeholder="e.g., Christology"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            autoFocus
          />

          <div>
            <label className="label">Description (optional)</label>
            <textarea
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Brief description..."
              className="input min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeSubModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saving} disabled={saving}>
              Add Sub-category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Manage Subcategories Modal */}
      <Modal
        isOpen={showManageSubsModal}
        onClose={closeManageSubsModal}
        title={`Manage Subcategories - ${managingSeries?.name}`}
      >
        <div className="space-y-4">
          <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg">
            Drag to reorder subcategories, or use the arrows. Use the dropdown to add existing categories.
          </div>

          {/* Add existing category dropdown */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                label="Add existing category"
                options={[
                  { value: "", label: "Select a category to add..." },
                  ...getAvailableCategories().map((c) => ({
                    value: c.id,
                    label: c.parentId
                      ? `${allCategories.find(p => p.id === c.parentId)?.name} → ${c.name}`
                      : c.name,
                  })),
                ]}
                value={selectedCategoryToAdd}
                onChange={(e) => setSelectedCategoryToAdd(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddToSeries}
                disabled={!selectedCategoryToAdd || saving}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Subcategories ({managedSubcategories.length})</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddSubcategory(managingSeries!)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create New
              </Button>
            </div>

            {managedSubcategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                No subcategories yet. Add existing categories above or create new ones.
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {managedSubcategories.map((sub, index) => (
                  <div
                    key={sub.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-3 bg-cream-50 border border-cream-200 rounded-lg cursor-move transition-all ${
                      draggedIndex === index ? "opacity-50 border-gold-500" : ""
                    }`}
                  >
                    <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gold-100 text-gold-700 text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-charcoal-800">{sub.name}</span>
                      {sub.description && (
                        <p className="text-xs text-gray-500 truncate">{sub.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveInModal(index, "up")}
                        disabled={index === 0}
                        title="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveInModal(index, "down")}
                        disabled={index === managedSubcategories.length - 1}
                        title="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromSeries(sub.id)}
                        title="Remove from series"
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={closeManageSubsModal}>
              Cancel
            </Button>
            <Button onClick={handleSaveOrder} loading={saving} disabled={saving}>
              Save Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
