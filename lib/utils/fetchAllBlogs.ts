import { getBlogList } from "@/app/actions/blog";
import { getPostList } from "@/app/actions/githubBlog";
import { Blog } from "../models/BlogModel";

export default async function fetchAllBlogs() {
  const [resDb, resGit] = await Promise.allSettled([
    getBlogList(),
    getPostList(),
  ]);

  const blogs: Blog[] = [];
  let dbError = null;
  let gitError = null;

  // Process Database Results
  if (resDb.status === "fulfilled" && resDb.value.success && resDb.value.data) {
    blogs.push(
      ...resDb.value.data.map((b: Blog) => ({ ...b, source: "main" as const })),
    );
  } else {
    dbError =
      resDb.status === "fulfilled" ? resDb.value.error : "DB connection failed";
  }

  // Process GitHub Results
  if (
    resGit.status === "fulfilled" &&
    resGit.value.success &&
    Array.isArray(resGit.value.data)
  ) {
    blogs.push(
      ...resGit.value.data.map((b: Blog) => ({ ...b, source: "git" as const })),
    );
  } else {
    gitError =
      resGit.status === "fulfilled"
        ? resGit.value.error
        : "GitHub fetch failed";
  }

  // Only throw if BOTH failed AND we have no blogs
  if (blogs.length === 0) {
    throw new Error("All data sources are currently unreachable.");
  }

  // Returns sorted blogs: newest first
  return blogs.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}
