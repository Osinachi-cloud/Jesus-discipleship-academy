"use client";

import { useEffect, useState } from "react";
import { AdminHeader, MediaUploader } from "@/components/admin";
import {
  Button,
  Card,
  CardContent,
  Badge,
  Loading,
  Empty,
  Input,
  Select,
  Modal,
} from "@/components/ui";
import {
  Trash2,
  Image as ImageIcon,
  File,
  Video,
  Download,
  Plus,
  ExternalLink,
} from "lucide-react";
import { formatDate, formatFileSize, getYouTubeId } from "@/lib/utils";

interface Media {
  id: string;
  title: string;
  type: "image" | "book" | "video";
  url: string;
  filename: string;
  size: number | null;
  mimeType: string | null;
  category: { id: string; name: string } | null;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
}

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<"image" | "book" | "video">("image");
  const [newMediaTitle, setNewMediaTitle] = useState("");
  const [newMediaCategory, setNewMediaCategory] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchMedia();
  }, [typeFilter]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const result = await response.json();
      setCategories(result.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ pageSize: "50" });
      if (typeFilter) params.append("type", typeFilter);

      const response = await fetch(`/api/media?${params}`);
      const result = await response.json();
      setMedia(result.data || []);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (data: {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
  }) => {
    try {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newMediaTitle || data.filename,
          type: uploadType,
          url: data.url,
          filename: data.filename,
          size: data.size,
          mimeType: data.mimeType,
          categoryId: newMediaCategory || null,
        }),
      });

      setShowUploadModal(false);
      setNewMediaTitle("");
      setNewMediaCategory("");
      fetchMedia();
    } catch (error) {
      console.error("Error saving media:", error);
    }
  };

  const handleYouTubeAdd = async () => {
    const videoId = getYouTubeId(youtubeUrl);
    if (!videoId) {
      alert("Invalid YouTube URL");
      return;
    }

    try {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newMediaTitle || "YouTube Video",
          type: "video",
          url: youtubeUrl,
          filename: `youtube-${videoId}`,
          categoryId: newMediaCategory || null,
        }),
      });

      setShowUploadModal(false);
      setNewMediaTitle("");
      setNewMediaCategory("");
      setYoutubeUrl("");
      fetchMedia();
    } catch (error) {
      console.error("Error saving video:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      await fetch(`/api/media/${id}`, { method: "DELETE" });
      fetchMedia();
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      case "book":
        return <File className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  return (
    <div>
      <AdminHeader title="Media Library" />

      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Select
            options={[
              { value: "", label: "All Types" },
              { value: "image", label: "Images" },
              { value: "book", label: "Books" },
              { value: "video", label: "Videos" },
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-40"
          />

          <Button onClick={() => setShowUploadModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12">
                <Loading />
              </div>
            ) : media.length === 0 ? (
              <Empty
                title="No media found"
                description="Upload your first media file to get started."
                action={
                  <Button onClick={() => setShowUploadModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Media
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : item.type === "video" && getYouTubeId(item.url) ? (
                        <img
                          src={`https://img.youtube.com/vi/${getYouTubeId(item.url)}/hqdefault.jpg`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400">
                          {getIcon(item.type)}
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.size ? formatFileSize(item.size) : "External"}
                        {" • "}
                        {formatDate(item.createdAt)}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setNewMediaTitle("");
          setNewMediaCategory("");
          setYoutubeUrl("");
        }}
        title="Upload Media"
        className="max-w-lg"
      >
        <div className="space-y-4">
          <Select
            label="Media Type"
            options={[
              { value: "image", label: "Image" },
              { value: "book", label: "Book (PDF)" },
              { value: "video", label: "Video" },
            ]}
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value as any)}
          />

          <Input
            label="Title"
            placeholder="Enter media title"
            value={newMediaTitle}
            onChange={(e) => setNewMediaTitle(e.target.value)}
          />

          <Select
            label="Category (optional)"
            options={[
              { value: "", label: "No category" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
            value={newMediaCategory}
            onChange={(e) => setNewMediaCategory(e.target.value)}
          />

          {uploadType === "video" && (
            <div className="space-y-2">
              <Input
                label="YouTube URL (optional)"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              {youtubeUrl && (
                <Button onClick={handleYouTubeAdd} className="w-full">
                  Add YouTube Video
                </Button>
              )}
              <p className="text-center text-sm text-gray-500">
                — or upload a video file —
              </p>
            </div>
          )}

          <MediaUploader type={uploadType} onUpload={handleUpload} />
        </div>
      </Modal>
    </div>
  );
}
