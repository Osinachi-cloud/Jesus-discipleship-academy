import Link from "next/link";
import { Badge } from "@/components/ui";
import { formatFileSize, getYouTubeId } from "@/lib/utils";
import { Download, Play, Image as ImageIcon, ExternalLink } from "lucide-react";

interface MediaCardProps {
  media: {
    id: string;
    title: string;
    type: string;
    url: string;
    filename: string;
    size: number | null;
    category: { name: string } | null;
  };
}

export function MediaCard({ media }: MediaCardProps) {
  const youtubeId = media.type === "video" ? getYouTubeId(media.url) : null;

  return (
    <div className="card group hover:shadow-lg transition-shadow overflow-hidden">
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {media.type === "image" ? (
          <a href={media.url} target="_blank" rel="noopener noreferrer">
            <img
              src={media.url}
              alt={media.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ExternalLink className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        ) : media.type === "video" && youtubeId ? (
          <a
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
              alt={media.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-primary-600 ml-1" />
              </div>
            </div>
          </a>
        ) : media.type === "book" ? (
          <a
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50"
          >
            <div className="text-center">
              <div className="w-20 h-28 mx-auto bg-white rounded shadow-lg flex items-center justify-center mb-2">
                <span className="text-primary-600 font-serif font-bold text-lg">
                  PDF
                </span>
              </div>
              <Download className="h-5 w-5 mx-auto text-primary-600" />
            </div>
          </a>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{media.title}</h3>
            {media.size && (
              <p className="text-sm text-gray-500">{formatFileSize(media.size)}</p>
            )}
          </div>
          <Badge variant="default" className="flex-shrink-0">
            {media.type}
          </Badge>
        </div>
      </div>
    </div>
  );
}
