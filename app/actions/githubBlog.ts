"use server";
import { ENV } from "@/config/env";
import { Blog } from "@/lib/models/BlogModel";
import { parseMetadata } from "@/lib/utils/formatter";
import { cache } from "react";

const BLOG_GITHUB_TOKEN = ENV.BLOG_GITHUB_TOKEN;
const REPO_OWNER = ENV.NEXT_PUBLIC_REPO_OWNER;
const REPO_NAME = ENV.NEXT_PUBLIC_REPO_NAME;
const RAW_URL_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`;

/**
 * HELPER: Fetches the last commit date from GitHub
 */
async function getFileDates(filePath: string) {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=${filePath}&page=1&per_page=1`;
    const res = await fetch(url, {
      headers: {
        ...(BLOG_GITHUB_TOKEN
          ? { Authorization: `Bearer ${BLOG_GITHUB_TOKEN}` }
          : {}),
        "User-Agent": "RajePancholi-Blog",
        Accept: "application/vnd.github+json", // API stability
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 3600 },
    });

    const commits = await res.json();
    return commits && commits.length > 0
      ? commits[0].commit.committer.date
      : null;
  } catch (error) {
    console.error("Error fetching git date:", error);
    return null;
  }
}

/**
 * Main Function: Gets all files with full content and metadata
 */
export interface BlogResponse {
  success: boolean;
  data?: Blog[] | null;
  error?: string;
}

export const getGithubMarkdownFiles = cache(async (): Promise<BlogResponse> => {
  try {
    const treeRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/main?recursive=1`,
      {
        headers: {
          ...(BLOG_GITHUB_TOKEN
            ? { Authorization: `Bearer ${BLOG_GITHUB_TOKEN}` }
            : {}),
          "User-Agent": "RajePancholi-Blog",
          Accept: "application/vnd.github+json", // API stability
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: 3600 },
      },
    );

    const treeData = await treeRes.json();
    const mdFiles = treeData.tree.filter(
      (item: any) => item.type === "blob" && item.path.endsWith(".md"),
    );

    const posts = await Promise.all(
      mdFiles.map(async (file: any) => {
        const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${file.path}`;
        const contentRes = await fetch(rawUrl);
        const rawContent = await contentRes.text();

        const { data, content: bodyContent } = parseMetadata(rawContent);
        const firstHeading =
          bodyContent.match(/^#\s+(.*)$/m)?.[1] || "Untitled";
        const gitDate = await getFileDates(file.path);

        return {
          _id: file.sha,
          type: "Post",
          slug: file.path.replace(".md", ""),
          title: data.title || firstHeading || "Untitled",
          author: data.author || {
            name: "Rajendra Pancholi",
            email: "rpancholi522@gmail.com",
            image: "",
          },
          createdAt: data.created || gitDate || new Date().toISOString(),
          updatedAt: data.updated || gitDate || new Date().toISOString(),
          description: data.description || null,
          tags: Array.isArray(data.tags) ? data.tags : [],
          keywords: Array.isArray(data.keywords) ? data.keywords : [],
          thumbnail: data.thumbnail
            ? `${RAW_URL_BASE}${data.thumbnail}`
            : "/default-blog-thumb.webp",
          content: bodyContent.trim(),
          editUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/edit/main/${file.path}`,
        } as Blog;
      }),
    );

    posts.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    return { success: true, data: posts };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "Failed to retrieve blogs!" };
  }
});

/* export const getGithubMarkdownFiles22 = cache(
  async (): Promise<BlogResponse> => {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`,
        {
          headers: {
            ...(BLOG_GITHUB_TOKEN
              ? { Authorization: `Bearer ${BLOG_GITHUB_TOKEN}` }
              : {}),
            "User-Agent": "RajePancholi-Blog",
            Accept: "application/vnd.github+json", // API stability
            "X-GitHub-Api-Version": "2022-11-28",
          },
          next: { revalidate: 3600 },
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error(`GitHub API Error: ${res.status}`, errorData);
        throw new Error(
          `GitHub API failed with status ${res.status}: ${errorData.message || "Failed to fetch!"}`,
        );
      }
      const files = await res.json();

      const mdFiles = files.filter((file: any) => file.name.endsWith(".md"));

      const posts = await Promise.all<Blog[]>(
        mdFiles.map(async (file: any) => {
          const contentRes = await fetch(file.download_url);
          const rawContent = await contentRes.text();

          const { data, content: bodyContent } = parseMetadata(rawContent);
          const firstHeading =
            bodyContent.match(/^#\s+(.*)$/m)?.[1] || "Untitled";
          const gitDate = await getFileDates(file.path);

          return {
            _id: file.sha || Math.random().toString(36).slice(2),
            type: "Post",
            slug: file.name.replace(".md", ""),
            title: data.title || firstHeading || "Untitled",
            author: data.author || {
              name: "Rajendra Pancholi",
              email: "rpancholi522@gmail.com",
              image: "",
            },
            createdAt: data.created || gitDate || new Date().toISOString(),
            updatedAt: data.updated || gitDate || new Date().toISOString(),
            description: data.description || null,
            tags: Array.isArray(data.tags) ? data.tags : [],
            keywords: Array.isArray(data.keywords) ? data.keywords : [],
            thumbnail: data.thumbnail
              ? `${RAW_URL_BASE}${data.thumbnail}`
              : "/default-blog-thumb.webp",
            content: bodyContent.trim(),
            editUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/edit/main/${file.path}`,
          } as Blog;
        }),
      );

      // Sort the posts by updated date
      posts.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      return { success: true, data: posts };
    } catch (error) {
      console.error("Error in getGithubMarkdownFiles:", error);
      return {
        success: false,
        error: "Failed to retrieve blogs!",
      };
    }
  },
); */

/**
 * Fetch the posts list
 * If the cache is empty, it triggers the initial fetch.
 */
export async function getPostList() {
  const { success, data: posts, error } = await getGithubMarkdownFiles();
  if (!success || !posts) return { success: false, error };

  const pList = posts.map(({ content, ...rest }) => rest);
  return { success: true, data: pList };
}

/**
 * Finds a single post by its slug.
 */
export async function getPostBySlug(slug: string) {
  const { success, data: posts } = await getGithubMarkdownFiles();
  if (!success || !posts)
    return { success: false, error: "Failed to fetch blog!" };
  const post = posts.find((p) => p.slug === slug) || null;
  return { success: true, data: post };
}

/*  Format of post
---
title: "How to fetch GitHub files"
description: "A deep dive into using Next.js with GitHub API"
author: ["name": "Rajendra...", "email":"rpancholi@gmail.com", "image": "https://rajendrapancholi.vercel.app/raje-avatar.jpeg"]
created: "2024-05-20"
updated: "2024-05-21"
tags: [nextjs, typescript, github]
---

# Main Heading of the Article

This is the actual content of the post. Everything above the second `---` 
is metadata and won't be rendered as text in the body.

## Sub-heading
More details here...

*/
