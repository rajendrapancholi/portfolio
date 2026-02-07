import { ENV } from "@/config/env";
import fetchAllBlogs from "@/lib/utils/fetchAllBlogs";
import { MetadataRoute } from "next";

export default async function sitemap() {
  const baseUrl = ENV.BASE_URL;

  const allBlogs = await fetchAllBlogs();

  const blogEntries: MetadataRoute.Sitemap = allBlogs.map((blog) => {
    const date = new Date(blog.updatedAt);
    const validDate = isNaN(date.getTime()) ? new Date() : date;

    return {
      url: encodeURI(`${baseUrl}/blogs/${blog.slug}`),
      lastModified: validDate,
      changeFrequency: "weekly",
      priority: 0.7,
    };
  });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
  return [...staticPages, ...blogEntries];
}
