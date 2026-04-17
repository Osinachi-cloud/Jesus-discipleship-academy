"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";
import { Upload, X, File, Image as ImageIcon, Video } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";

interface MediaUploaderProps {
  type: "image" | "book" | "video";
  onUpload: (data: {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
  }) => void;
  className?: string;
}

const typeConfig = {
  image: {
    accept: "image/jpeg,image/png,image/gif,image/webp",
    icon: ImageIcon,
    label: "Upload Image",
    description: "JPG, PNG, GIF, or WebP up to 50MB",
  },
  book: {
    accept: "application/pdf",
    icon: File,
    label: "Upload PDF",
    description: "PDF files up to 50MB",
  },
  video: {
    accept: "video/mp4,video/webm,video/quicktime",
    icon: Video,
    label: "Upload Video",
    description: "MP4, WebM, or MOV up to 50MB",
  },
};

export function MediaUploader({ type, onUpload, className }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const config = typeConfig[type];
  const Icon = config.icon;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    if (type === "image") {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", type);

    try {
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      onUpload(result.data);
      setSelectedFile(null);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          selectedFile
            ? "border-primary-300 bg-primary-50"
            : "border-gray-300 hover:border-gray-400"
        )}
      >
        {selectedFile ? (
          <div className="space-y-4">
            {preview && type === "image" && (
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg"
              />
            )}
            <div className="flex items-center justify-center gap-3">
              <Icon className="h-8 w-8 text-primary-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer block">
            <input
              ref={inputRef}
              type="file"
              accept={config.accept}
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{config.label}</p>
                <p className="text-sm text-gray-500">{config.description}</p>
              </div>
            </div>
          </label>
        )}
      </div>

      {selectedFile && (
        <Button
          onClick={handleUpload}
          loading={uploading}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? `Uploading...` : "Upload File"}
        </Button>
      )}
    </div>
  );
}
