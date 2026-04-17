"use client";

import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
}

export function ShareButton({ title }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      });
    }
  };

  return (
    <button
      className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  );
}
