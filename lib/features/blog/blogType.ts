import { Blog } from "@/lib/models/BlogModel";

interface IBlog extends Blog {
  visited?: boolean;
}

export interface BlogState {
  blogs: IBlog[] | null;
  blog: Blog | null;
  loading: boolean;
  error: string | null;
}

export interface CreateBlogPayload {
  name: string;
  description: string;
}

export interface UpdateBlogPayload {
  slug: string;
  name?: string;
  description?: string;
}

export interface DeleteBlogPayload {
  slug: string;
}

export interface FetchBlogsResponse {
  blogs: Blog[];
}
export interface FetchBlogResponse {
  blog: IBlog;
}
