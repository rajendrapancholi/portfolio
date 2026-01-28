import { getBlogList } from "@/app/actions/blog";
import { getPostList } from "@/app/actions/githubBlog";
import { Blog } from "../models/BlogModel";

/**
 * Asynchronously fetches and merges blog posts from two sources: a local database and GitHub.
 *
 * This function handles parallel data retrieval using Promise.allSettled to ensure that
 * a failure in one source does not prevent data from being returned from the other.
 * It tags each blog with its origin ('main' or 'git'), handles errors gracefully,
 * and returns a single array sorted by the most recent update.
 *
 * @async
 * @function fetchAllBlogs
 * @returns {Promise<Blog[]>} A promise that resolves to an array of Blog objects sorted by date.
 * @throws {Error} Throws an error only if no blogs are successfully retrieved from either source.
 *
 * @example
 * // Basic usage in a React Server Component or API route:
 * try {
 *    const allPosts = await fetchAllBlogs();
 *    console.log(allPosts[0].source); // "main" or "git"
 * } catch (err) {
 *    console.error(err.message); // "All data sources are currently unreachable."
 * }
 */
export default async function fetchAllBlogs(): Promise<Blog[]> {
  try {
    const [resDb, resGit] = await Promise.allSettled([
      getBlogList(),
      getPostList(),
    ]);

    const blogs: Blog[] = [];
    let dbError = null;
    let gitError = null;

    // Process Database Results
    if (
      resDb.status === "fulfilled" &&
      resDb.value.success &&
      resDb.value.data
    ) {
      blogs.push(
        ...resDb.value.data.map((b: Blog) => ({
          ...b,
          source: "main" as const,
        })),
      );
    } else {
      dbError =
        resDb.status === "fulfilled"
          ? resDb.value.error
          : "DB connection failed";
    }

    // Process GitHub Results
    if (
      resGit.status === "fulfilled" &&
      resGit.value.success &&
      Array.isArray(resGit.value.data)
    ) {
      blogs.push(
        ...resGit.value.data.map((b: Blog) => ({
          ...b,
          source: "git" as const,
        })),
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
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  } catch (error) {
    console.log("Falid to fetch blogs: ", error);
    return [];
  }
}
