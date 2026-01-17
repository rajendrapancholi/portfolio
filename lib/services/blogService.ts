import { BlogModel } from "../models/BlogModel";

export async function getPublishedBlogs() {
  return BlogModel.find({ published: true }).sort({ createdAt: -1 }).lean();
}

export async function getBlogBySlug(slug: string) {
  return BlogModel.findOne({ slug, published: true }).lean();
}

export async function createBlog(data: {
  title: string;
  slug: string;
  description?: string;
  content: string;
}) {
  return BlogModel.create(data);
}
