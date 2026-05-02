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
  Tag,
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
  slug: string;
  description?: string | null;
  parentId?: string | null;
  _count?: { posts: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<FlatCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [managingSeries, setManagingSeries] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategoryToAdd, setSelectedCategoryToAdd] = useState("");
  const [managedSubcategories, setManagedSubcategories] = useState<Category[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"series" | "subcategories">("series");

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

  // Get unassigned subcategories (categories with a parentId that points to a non-existent parent, or standalone non-series)
  const getUnassignedSubcategories = () => {
    const seriesIds = new Set(categories.map(c => c.id));
    return allCategories.filter(c => {
      // Has no parent and has no children = standalone subcategory
      const isStandaloneSubcategory = !c.parentId && !categories.find(s => s.id === c.id);
      return isStandaloneSubcategory;
    });
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
          isSeries: true,
        }),
      });
      closeSeriesModal();
      fetchCategories();
    } catch (error) {
      console.error("Error creating series:", error);
    } finally {
      setSaving(false);
    }
  };

  // Create standalone subcategory
  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription || null,
          parentId: null,
        }),
      });
      closeSubcategoryModal();
      fetchCategories();
    } catch (error) {
      console.error("Error creating subcategory:", error);
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
      closeSeriesModal();
      closeSubcategoryModal();
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
    const currentOrder = category.order ?? currentIndex;
    const targetOrder = targetCategory.order ?? targetIndex;
    try {
      await Promise.all([
        fetch(`/api/categories/${category.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: targetOrder }),
        }),
        fetch(`/api/categories/${targetCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: currentOrder }),
        }),
      ]);
      fetchCategories();
    } catch (error) {
      console.error("Error moving category:", error);
    }
  };

  const handleEditSeries = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
    setShowSeriesModal(true);
  };

  const handleEditSubcategory = (category: FlatCategory) => {
    setEditingCategory(category as Category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
    setShowSubcategoryModal(true);
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

  const closeSeriesModal = () => {
    setShowSeriesModal(false);
    setCategoryName("");
    setCategoryDescription("");
    setEditingCategory(null);
  };

  const closeSubcategoryModal = () => {
    setShowSubcategoryModal(false);
    setCategoryName("");
    setCategoryDescription("");
    setEditingCategory(null);
  };

  // Manage subcategories modal
  const handleManageSubcategories = (series: Category) => {
    setManagingSeries(series);
    setManagedSubcategories([...(series.children || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    setSelectedCategoryToAdd("");
    setShowManageModal(true);
  };

  const closeManageModal = () => {
    setShowManageModal(false);
    setManagingSeries(null);
    setManagedSubcategories([]);
    setSelectedCategoryToAdd("");
    setDraggedIndex(null);
  };

  // Get categories available to add (unassigned ones)
  const getAvailableForSeries = () => {
    if (!managingSeries) return [];
    const currentSubIds = new Set(managedSubcategories.map(c => c.id));
    // Show all categories that are not this series, not already in this series, and don't have children (not a series themselves)
    return allCategories.filter(c => {
      if (c.id === managingSeries.id) return false;
      if (currentSubIds.has(c.id)) return false;
      // Check if it's a series (has children)
      const isSeries = categories.find(s => s.id === c.id);
      if (isSeries) return false;
      return true;
    });
  };

  // Add category to series via dropdown
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
          order: newOrder,
        }),
      });
      const catToAdd = allCategories.find(c => c.id === selectedCategoryToAdd);
      if (catToAdd) {
        setManagedSubcategories(prev => [...prev, {
          ...catToAdd,
          order: newOrder,
          _count: { posts: catToAdd._count?.posts || 0 },
        } as Category]);
      }
      setSelectedCategoryToAdd("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding to series:", error);
    } finally {
      setSaving(false);
    }
  };

  // Remove from series
  const handleRemoveFromSeries = async (categoryId: string) => {
    if (!confirm("Remove from this series? It will become unassigned.")) return;
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
      console.error("Error removing from series:", error);
    } finally {
      setSaving(false);
    }
  };

  // Drag handlers
  const handleDragStart = (index: number) => setDraggedIndex(index);
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
  const handleDragEnd = () => setDraggedIndex(null);

  const handleMoveInModal = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= managedSubcategories.length) return;
    const newList = [...managedSubcategories];
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setManagedSubcategories(newList);
  };

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
      closeManageModal();
      fetchCategories();
    } catch (error) {
      console.error("Error saving order:", error);
    } finally {
      setSaving(false);
    }
  };

  // Drag from unassigned list to a series
  const [draggedSubcategory, setDraggedSubcategory] = useState<string | null>(null);

  const handleSubcategoryDragStart = (e: React.DragEvent, categoryId: string) => {
    setDraggedSubcategory(categoryId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSeriesDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleSeriesDrop = async (e: React.DragEvent, series: Category) => {
    e.preventDefault();
    if (!draggedSubcategory) return;

    setSaving(true);
    try {
      const siblings = series.children || [];
      const maxOrder = siblings.reduce((max, c) => Math.max(max, c.order || 0), 0);
      await fetch(`/api/categories/${draggedSubcategory}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentId: series.id,
          order: maxOrder + 1,
        }),
      });
      fetchCategories();
    } catch (error) {
      console.error("Error assigning to series:", error);
    } finally {
      setSaving(false);
      setDraggedSubcategory(null);
    }
  };

  const unassignedSubcategories = getUnassignedSubcategories();

  const renderSubcategory = (category: Category, index: number, siblings: Category[]) => (
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
        <Button variant="ghost" size="sm" onClick={() => handleMove(category, "up", siblings)} disabled={index === 0} title="Move up">
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleMove(category, "down", siblings)} disabled={index === siblings.length - 1} title="Move down">
          <ArrowDown className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleEditSubcategory(category)} title="Edit">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)} title="Delete">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );

  const renderSeries = (series: Category, index: number) => {
    const hasChildren = series.children && series.children.length > 0;
    const isExpanded = expandedCategories.has(series.id);

    return (
      <div
        key={series.id}
        className={`border border-cream-300 rounded-lg overflow-hidden mb-4 transition-all ${
          draggedSubcategory ? "ring-2 ring-gold-300 ring-dashed" : ""
        }`}
        onDragOver={handleSeriesDragOver}
        onDrop={(e) => handleSeriesDrop(e, series)}
      >
        <div className="bg-navy-800 text-cream-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-700 text-gold-500 font-bold">
              {series.order ?? index + 1}
            </span>
            {hasChildren ? (
              <button onClick={() => toggleExpand(series.id)} className="p-1 hover:bg-navy-700 rounded">
                {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            ) : (
              <div className="w-7" />
            )}
            <FolderTree className="h-5 w-5 text-gold-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-lg">{series.name}</span>
              {series.description && (
                <p className="text-sm text-cream-300 truncate">{series.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm text-cream-300">{series._count.children || 0} subcategories</span>
              <Button variant="ghost" size="sm" onClick={() => handleManageSubcategories(series)} title="Manage Subcategories" className="text-gold-400 hover:text-gold-300 hover:bg-navy-700">
                <Layers className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleMove(series, "up", categories)} disabled={index === 0} title="Move up" className="text-cream-200 hover:text-white hover:bg-navy-700">
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleMove(series, "down", categories)} disabled={index === categories.length - 1} title="Move down" className="text-cream-200 hover:text-white hover:bg-navy-700">
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleEditSeries(series)} title="Edit" className="text-cream-200 hover:text-white hover:bg-navy-700">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(series.id)} title="Delete" className="text-red-400 hover:text-red-300 hover:bg-navy-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="bg-white">
            {hasChildren ? (
              <div>{series.children!.map((child, idx) => renderSubcategory(child, idx, series.children!))}</div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                {draggedSubcategory ? (
                  <span className="text-gold-600 font-medium">Drop subcategory here</span>
                ) : (
                  "No subcategories yet. Drag one here or use the manage button."
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <AdminHeader title="Series & Categories" />

      <div className="p-6 space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-cream-300">
          <button
            onClick={() => setActiveTab("series")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "series"
                ? "border-gold-500 text-gold-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <FolderTree className="h-4 w-4 inline mr-2" />
            Series ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab("subcategories")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "subcategories"
                ? "border-gold-500 text-gold-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Tag className="h-4 w-4 inline mr-2" />
            Subcategories ({unassignedSubcategories.length} unassigned)
          </button>
        </div>

        {loading ? (
          <div className="py-12"><Loading /></div>
        ) : activeTab === "series" ? (
          <>
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-gray-600 mb-2">
                  <strong>Series</strong> are main topics that contain subcategories. Drag subcategories from the Subcategories tab onto a series, or use the <Layers className="h-4 w-4 inline" /> manage button.
                </p>
              </div>
              <Button onClick={() => setShowSeriesModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Series
              </Button>
            </div>

            {categories.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <Empty
                    title="No series yet"
                    description="Create your first series to start organizing content."
                    icon={<FolderTree className="h-12 w-12" />}
                    action={
                      <Button onClick={() => setShowSeriesModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Series
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            ) : (
              <div>{categories.map((series, index) => renderSeries(series, index))}</div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-gray-600 mb-2">
                  Create <strong>Subcategories</strong> here, then drag them onto a Series to assign them. Or use the dropdown in the Series manage modal.
                </p>
              </div>
              <Button onClick={() => setShowSubcategoryModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Subcategory
              </Button>
            </div>

            {unassignedSubcategories.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <Empty
                    title="No unassigned subcategories"
                    description="All subcategories are assigned to a series. Create new ones here."
                    icon={<Tag className="h-12 w-12" />}
                    action={
                      <Button onClick={() => setShowSubcategoryModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Subcategory
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {unassignedSubcategories.map((cat) => (
                  <div
                    key={cat.id}
                    draggable
                    onDragStart={(e) => handleSubcategoryDragStart(e, cat.id)}
                    onDragEnd={() => setDraggedSubcategory(null)}
                    className={`flex items-center gap-3 p-4 bg-white border border-cream-300 rounded-lg cursor-grab hover:shadow-md transition-all ${
                      draggedSubcategory === cat.id ? "opacity-50 ring-2 ring-gold-500" : ""
                    }`}
                  >
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <Tag className="h-5 w-5 text-gold-600" />
                    <div className="flex-1">
                      <span className="font-medium text-charcoal-800">{cat.name}</span>
                      {cat.description && (
                        <p className="text-sm text-gray-500">{cat.description}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">
                      {cat._count?.posts || 0} posts
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditSubcategory(cat)} title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)} title="Delete">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                <p className="text-sm text-gray-500 text-center mt-2">
                  Drag a subcategory to the Series tab and drop it on a series to assign it.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Series Modal */}
      <Modal isOpen={showSeriesModal} onClose={closeSeriesModal} title={editingCategory ? "Edit Series" : "New Series"}>
        <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateSeries} className="space-y-4">
          {!editingCategory && (
            <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg">
              A <strong>Series</strong> groups subcategories together (e.g., "Discipleship" containing "Christology", "Theology").
            </div>
          )}
          <Input label="Name" placeholder="e.g., Discipleship" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
          <div>
            <label className="label">Description (optional)</label>
            <textarea value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder="Brief description..." className="input min-h-[80px]" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeSeriesModal}>Cancel</Button>
            <Button type="submit" loading={saving} disabled={saving}>{editingCategory ? "Update" : "Create Series"}</Button>
          </div>
        </form>
      </Modal>

      {/* Create/Edit Subcategory Modal */}
      <Modal isOpen={showSubcategoryModal} onClose={closeSubcategoryModal} title={editingCategory ? "Edit Subcategory" : "New Subcategory"}>
        <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateSubcategory} className="space-y-4">
          {!editingCategory && (
            <div className="bg-green-50 text-green-800 text-sm p-3 rounded-lg">
              Create a <strong>Subcategory</strong> first, then assign it to a Series using drag-drop or the dropdown.
            </div>
          )}
          <Input label="Name" placeholder="e.g., Christology" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required autoFocus />
          <div>
            <label className="label">Description (optional)</label>
            <textarea value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder="Brief description..." className="input min-h-[80px]" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeSubcategoryModal}>Cancel</Button>
            <Button type="submit" loading={saving} disabled={saving}>{editingCategory ? "Update" : "Create Subcategory"}</Button>
          </div>
        </form>
      </Modal>

      {/* Manage Subcategories Modal */}
      <Modal isOpen={showManageModal} onClose={closeManageModal} title={`Manage - ${managingSeries?.name}`}>
        <div className="space-y-4">
          <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg">
            Drag to reorder, or use arrows. Use the dropdown to add subcategories.
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                label="Add subcategory"
                options={[
                  { value: "", label: "Select a subcategory to add..." },
                  ...getAvailableForSeries().map((c) => ({
                    value: c.id,
                    label: c.parentId ? `(from another series) ${c.name}` : c.name,
                  })),
                ]}
                value={selectedCategoryToAdd}
                onChange={(e) => setSelectedCategoryToAdd(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddToSeries} disabled={!selectedCategoryToAdd || saving} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="label">Subcategories ({managedSubcategories.length})</label>
            {managedSubcategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                No subcategories. Use the dropdown above or drag from the Subcategories tab.
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
                      {sub.description && <p className="text-xs text-gray-500 truncate">{sub.description}</p>}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => handleMoveInModal(index, "up")} disabled={index === 0} title="Move up">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleMoveInModal(index, "down")} disabled={index === managedSubcategories.length - 1} title="Move down">
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveFromSeries(sub.id)} title="Remove" className="text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={closeManageModal}>Cancel</Button>
            <Button onClick={handleSaveOrder} loading={saving} disabled={saving}>Save Order</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
