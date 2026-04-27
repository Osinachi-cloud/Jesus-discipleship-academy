"use client";

import { useEffect } from "react";

export function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const trackView = async () => {
      const viewedPosts = sessionStorage.getItem("viewedPosts");
      const viewed = viewedPosts ? JSON.parse(viewedPosts) : [];

      if (!viewed.includes(postId)) {
        await fetch(`/api/posts/${postId}/views`, { method: "POST" });
        viewed.push(postId);
        sessionStorage.setItem("viewedPosts", JSON.stringify(viewed));
      }
    };

    trackView();
  }, [postId]);

  return null;
}
