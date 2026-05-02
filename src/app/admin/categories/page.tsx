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

interface Series {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  order?: number | null;
  subcategories: Subcategory[];
  _count: { subcategories: number };
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  order?: number | null;
  seriesId?: string | null;
  series?: Series | null;
  _count: { posts: number };
}

export default function CategoriesPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [managingSeries, setManagingSeries] = useState<Series | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set());
  const [selectedSubcategoryToAdd, setSelectedSubcategoryToAdd] = useState("");
  const [managedSubcategories, setManagedSubcategories] = useState<Subcategory[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"series" | "subcategories">("series");
  const [draggedSubcategory, setDraggedSubcategory] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [seriesRes, subcategoriesRes] = await Promise.all([
        fetch("/api/series"),
        fetch("/api/subcategories"),
      ]);
      const seriesData = await seriesRes.json();
      const subcategoriesData = await subcategoriesRes.json();
      setSeriesList(seriesData.data || []);
      setSubcategories(subcategoriesData.data || []);
      const allIds = new Set<string>();
      (seriesData.data || []).forEach((s: Series) => allIds.add(s.id));
      setExpandedSeries(allIds);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedSeries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSeries(newExpanded);
  };

  const getUnassignedSubcategories = () => {
    return subcategories.filter(s => !s.seriesId);
  };

  // Series CRUD
  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const maxOrder = seriesList.reduce((max, s) => Math.max(max, s.order || 0), 0);
      const res = await fetch("/api/series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: description || null, order: maxOrder + 1 }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to create series");
        return;
      }
      closeSeriesModal();
      fetchData();
    } catch (error) {
      console.error("Error creating series:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !editingSeries) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/series/${editingSeries.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: description || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update series");
        return;
      }
      closeSeriesModal();
      fetchData();
    } catch (error) {
      console.error("Error updating series:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSeries = async (id: string) => {
    if (!confirm("Delete this series? Subcategories will be unassigned.")) return;
    try {
      await fetch(`/api/series/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting series:", error);
    }
  };

  const handleMoveSeries = async (series: Series, direction: "up" | "down") => {
    const currentIndex = seriesList.findIndex(s => s.id === series.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= seriesList.length) return;
    const targetSeries = seriesList[targetIndex];
    const currentOrder = series.order ?? currentIndex;
    const targetOrder = targetSeries.order ?? targetIndex;
    try {
      await Promise.all([
        fetch(`/api/series/${series.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: targetOrder }),
        }),
        fetch(`/api/series/${targetSeries.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: currentOrder }),
        }),
      ]);
      fetchData();
    } catch (error) {
      console.error("Error moving series:", error);
    }
  };

  // Subcategory CRUD
  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: description || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to create subcategory");
        return;
      }
      closeSubcategoryModal();
      fetchData();
    } catch (error) {
      console.error("Error creating subcategory:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !editingSubcategory) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/subcategories/${editingSubcategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: description || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update subcategory");
        return;
      }
      closeSubcategoryModal();
      fetchData();
    } catch (error) {
      console.error("Error updating subcategory:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm("Delete this subcategory?")) return;
    try {
      await fetch(`/api/subcategories/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  // Manage subcategories in series
  const handleManageSubcategories = (series: Series) => {
    setManagingSeries(series);
    setManagedSubcategories([...series.subcategories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    setSelectedSubcategoryToAdd("");
    setShowManageModal(true);
  };

  const getAvailableForSeries = () => {
    if (!managingSeries) return [];
    const currentIds = new Set(managedSubcategories.map(s => s.id));
    return subcategories.filter(s => !currentIds.has(s.id) && (!s.seriesId || s.seriesId === managingSeries.id));
  };

  const handleAddToSeries = async () => {
    if (!selectedSubcategoryToAdd || !managingSeries) return;
    setSaving(true);
    try {
      const newOrder = managedSubcategories.length + 1;
      await fetch(`/api/subcategories/${selectedSubcategoryToAdd}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesId: managingSeries.id, order: newOrder }),
      });
      const added = subcategories.find(s => s.id === selectedSubcategoryToAdd);
      if (added) {
        setManagedSubcategories(prev => [...prev, { ...added, order: newOrder }]);
      }
      setSelectedSubcategoryToAdd("");
      fetchData();
    } catch (error) {
      console.error("Error adding to series:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFromSeries = async (subcategoryId: string) => {
    if (!confirm("Remove from this series?")) return;
    setSaving(true);
    try {
      await fetch(`/api/subcategories/${subcategoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesId: null }),
      });
      setManagedSubcategories(prev => prev.filter(s => s.id !== subcategoryId));
      fetchData();
    } catch (error) {
      console.error("Error removing from series:", error);
    } finally {
      setSaving(false);
    }
  };

  // Drag and drop
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
        managedSubcategories.map((sub, index) =>
          fetch(`/api/subcategories/${sub.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: index + 1 }),
          })
        )
      );
      closeManageModal();
      fetchData();
    } catch (error) {
      console.error("Error saving order:", error);
    } finally {
      setSaving(false);
    }
  };

  // Drag subcategory to series
  const handleSubcategoryDragStart = (e: React.DragEvent, id: string) => {
    setDraggedSubcategory(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSeriesDrop = async (e: React.DragEvent, series: Series) => {
    e.preventDefault();
    if (!draggedSubcategory) return;
    setSaving(true);
    try {
      const maxOrder = series.subcategories.reduce((max, s) => Math.max(max, s.order || 0), 0);
      await fetch(`/api/subcategories/${draggedSubcategory}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesId: series.id, order: maxOrder + 1 }),
      });
      fetchData();
    } catch (error) {
      console.error("Error assigning to series:", error);
    } finally {
      setSaving(false);
      setDraggedSubcategory(null);
    }
  };

  // Modals
  const closeSeriesModal = () => {
    setShowSeriesModal(false);
    setEditingSeries(null);
    setName("");
    setDescription("");
  };

  const closeSubcategoryModal = () => {
    setShowSubcategoryModal(false);
    setEditingSubcategory(null);
    setName("");
    setDescription("");
  };

  const closeManageModal = () => {
    setShowManageModal(false);
    setManagingSeries(null);
    setManagedSubcategories([]);
    setSelectedSubcategoryToAdd("");
    setDraggedIndex(null);
  };

  const openEditSeries = (series: Series) => {
    setEditingSeries(series);
    setName(series.name);
    setDescription(series.description || "");
    setShowSeriesModal(true);
  };

  const openEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setName(subcategory.name);
    setDescription(subcategory.description || "");
    setShowSubcategoryModal(true);
  };

  const unassignedSubcategories = getUnassignedSubcategories();

  const renderSubcategory = (sub: Subcategory, index: number, siblings: Subcategory[]) => (
    <div key={sub.id} className="flex items-center gap-3 py-3 px-4 bg-cream-50 border-b border-cream-200 last:border-b-0">
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gold-100 text-gold-700 text-sm font-bold">
        {sub.order ?? index + 1}
      </span>
      <FolderOpen className="h-4 w-4 text-gold-600 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="font-medium text-charcoal-800">{sub.name}</span>
        {sub.description && <p className="text-xs text-gray-500 truncate">{sub.description}</p>}
      </div>
      <span className="text-sm text-gray-500 flex-shrink-0">{sub._count.posts} posts</span>
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={() => openEditSubcategory(sub)} title="Edit">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDeleteSubcategory(sub.id)} title="Delete">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );

  const renderSeries = (series: Series, index: number) => {
    const hasSubcategories = series.subcategories && series.subcategories.length > 0;
    const isExpanded = expandedSeries.has(series.id);

    return (
      <div
        key={series.id}
        className={`border border-cream-300 rounded-lg overflow-hidden mb-4 transition-all ${draggedSubcategory ? "ring-2 ring-gold-300 ring-dashed" : ""}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleSeriesDrop(e, series)}
      >
        <div className="bg-navy-800 text-cream-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-700 text-gold-500 font-bold">
              {series.order ?? index + 1}
            </span>
            {hasSubcategories ? (
              <button onClick={() => toggleExpand(series.id)} className="p-1 hover:bg-navy-700 rounded">
                {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            ) : (
              <div className="w-7" />
            )}
            <FolderTree className="h-5 w-5 text-gold-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-lg">{series.name}</span>
              {series.description && <p className="text-sm text-cream-300 truncate">{series.description}</p>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm text-cream-300">{series._count.subcategories} subcategories</span>
              <Button variant="ghost" size="sm" onClick={() => handleManageSubcategories(series)} title="Manage" className="text-gold-400 hover:text-gold-300 hover:bg-navy-700">
                <Layers className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleMoveSeries(series, "up")} disabled={index === 0} title="Move up" className="text-cream-200 hover:text-white hover:bg-navy-700">
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleMoveSeries(series, "down")} disabled={index === seriesList.length - 1} title="Move down" className="text-cream-200 hover:text-white hover:bg-navy-700">
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => openEditSeries(series)} title="Edit" className="text-cream-200 hover:text-white hover:bg-navy-700">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteSeries(series.id)} title="Delete" className="text-red-400 hover:text-red-300 hover:bg-navy-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="bg-white">
            {hasSubcategories ? (
              <div>{series.subcategories.map((sub, idx) => renderSubcategory(sub, idx, series.subcategories))}</div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                {draggedSubcategory ? <span className="text-gold-600 font-medium">Drop subcategory here</span> : "No subcategories. Drag one here or use manage."}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <AdminHeader title="Series & Subcategories" />

      <div className="p-6 space-y-6">
        <div className="flex gap-2 border-b border-cream-300">
          <button
            onClick={() => setActiveTab("series")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "series" ? "border-gold-500 text-gold-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            <FolderTree className="h-4 w-4 inline mr-2" />
            Series ({seriesList.length})
          </button>
          <button
            onClick={() => setActiveTab("subcategories")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "subcategories" ? "border-gold-500 text-gold-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
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
              <p className="text-gray-600">
                <strong>Series</strong> group subcategories together. Drag subcategories from the Subcategories tab or use <Layers className="h-4 w-4 inline" /> manage.
              </p>
              <Button onClick={() => setShowSeriesModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Series
              </Button>
            </div>

            {seriesList.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <Empty
                    title="No series yet"
                    description="Create your first series."
                    icon={<FolderTree className="h-12 w-12" />}
                    action={<Button onClick={() => setShowSeriesModal(true)}><Plus className="h-4 w-4 mr-2" />Create Series</Button>}
                  />
                </CardContent>
              </Card>
            ) : (
              <div>{seriesList.map((series, index) => renderSeries(series, index))}</div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-start gap-4">
              <p className="text-gray-600">
                Create <strong>Subcategories</strong> here, then drag them onto a Series or use the manage modal.
              </p>
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
                    description="All subcategories are assigned. Create new ones here."
                    icon={<Tag className="h-12 w-12" />}
                    action={<Button onClick={() => setShowSubcategoryModal(true)}><Plus className="h-4 w-4 mr-2" />Create Subcategory</Button>}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {unassignedSubcategories.map((sub) => (
                  <div
                    key={sub.id}
                    draggable
                    onDragStart={(e) => handleSubcategoryDragStart(e, sub.id)}
                    onDragEnd={() => setDraggedSubcategory(null)}
                    className={`flex items-center gap-3 p-4 bg-white border border-cream-300 rounded-lg cursor-grab hover:shadow-md transition-all ${draggedSubcategory === sub.id ? "opacity-50 ring-2 ring-gold-500" : ""}`}
                  >
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <Tag className="h-5 w-5 text-gold-600" />
                    <div className="flex-1">
                      <span className="font-medium text-charcoal-800">{sub.name}</span>
                      {sub.description && <p className="text-sm text-gray-500">{sub.description}</p>}
                    </div>
                    <span className="text-sm text-gray-400">{sub._count.posts} posts</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditSubcategory(sub)} title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteSubcategory(sub.id)} title="Delete">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                <p className="text-sm text-gray-500 text-center mt-2">
                  Drag a subcategory to a Series to assign it.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Series Modal */}
      <Modal isOpen={showSeriesModal} onClose={closeSeriesModal} title={editingSeries ? "Edit Series" : "New Series"}>
        <form onSubmit={editingSeries ? handleUpdateSeries : handleCreateSeries} className="space-y-4">
          <Input label="Name" placeholder="e.g., Discipleship" value={name} onChange={(e) => setName(e.target.value)} required />
          <div>
            <label className="label">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." className="input min-h-[80px]" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeSeriesModal}>Cancel</Button>
            <Button type="submit" loading={saving} disabled={saving}>{editingSeries ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      {/* Subcategory Modal */}
      <Modal isOpen={showSubcategoryModal} onClose={closeSubcategoryModal} title={editingSubcategory ? "Edit Subcategory" : "New Subcategory"}>
        <form onSubmit={editingSubcategory ? handleUpdateSubcategory : handleCreateSubcategory} className="space-y-4">
          <Input label="Name" placeholder="e.g., Christology" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          <div>
            <label className="label">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." className="input min-h-[80px]" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeSubcategoryModal}>Cancel</Button>
            <Button type="submit" loading={saving} disabled={saving}>{editingSubcategory ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      {/* Manage Subcategories Modal */}
      <Modal isOpen={showManageModal} onClose={closeManageModal} title={`Manage - ${managingSeries?.name}`}>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                label="Add subcategory"
                options={[
                  { value: "", label: "Select..." },
                  ...getAvailableForSeries().map((s) => ({ value: s.id, label: s.name })),
                ]}
                value={selectedSubcategoryToAdd}
                onChange={(e) => setSelectedSubcategoryToAdd(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddToSeries} disabled={!selectedSubcategoryToAdd || saving} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="label">Subcategories ({managedSubcategories.length})</label>
            {managedSubcategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                No subcategories. Use dropdown above.
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
                    className={`flex items-center gap-3 p-3 bg-cream-50 border border-cream-200 rounded-lg cursor-move transition-all ${draggedIndex === index ? "opacity-50 border-gold-500" : ""}`}
                  >
                    <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gold-100 text-gold-700 text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-charcoal-800">{sub.name}</span>
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
