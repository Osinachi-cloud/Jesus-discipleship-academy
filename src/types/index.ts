import { Post, Category, Comment, Media, User } from "@prisma/client";

export type PostWithCategory = Post & {
  category: Category | null;
};

export type PostWithRelations = Post & {
  category: Category | null;
  comments: Comment[];
};

export type MediaWithCategory = Media & {
  category: Category | null;
};

export interface PostFormData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: "draft" | "published";
  categoryId?: string;
}

export interface CommentFormData {
  name: string;
  email?: string;
  message: string;
  postId: string;
}

export interface MediaFormData {
  title: string;
  type: "image" | "book" | "video";
  url: string;
  filename: string;
  size?: number;
  mimeType?: string;
  categoryId?: string;
}

export interface CategoryFormData {
  name: string;
  slug?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

declare module "next-auth" {
  interface User {
    role?: string;
    id: string;
  }

  interface Session {
    user: User & {
      role?: string;
      id: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}
