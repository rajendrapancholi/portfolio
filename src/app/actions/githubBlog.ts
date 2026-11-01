'use server';
import { ENV } from '@/config/env';
import { Blog } from '@/lib/models/BlogModel';
import { parseMetadata } from '@/lib/utils/formatter';
import { cache } from 'react';
// Written at build time by scripts/sync-github-blogs.mjs (no GitHub calls at runtime)
import rawPosts from '@/data/github-blogs.json';

const REPO_OWNER = ENV.NEXT_PUBLIC_REPO_OWNER;
const REPO_NAME = ENV.NEXT_PUBLIC_REPO_NAME;
const RAW_URL_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`;

type RawPost = { path: string; sha: string; raw: string; date: string | null };

export interface BlogResponse {
  success: boolean;
  data?: Blog[] | null;
  error?: string;
}

// Parsed once per server instance, then reused
let parsed: Blog[] | null = null;

function buildPosts(): Blog[] {
  const posts = (rawPosts as RawPost[]).map((file) => {
    const { data, content: bodyContent } = parseMetadata(file.raw);
    const firstHeading = bodyContent.match(/^#\s+(.*)$/m)?.[1] || 'Untitled';
    const now = new Date().toISOString();

    return {
      _id: file.sha,
      type: 'Post',
      slug: file.path.replace('.md', ''),
      title: data.title || firstHeading || 'Untitled',
      author: data.author || {
        name: 'Rajendra Pancholi',
        email: 'rpancholi522@gmail.com',
        image: '',
      },
      createdAt: data.created || file.date || now,
      updatedAt: data.updated || file.date || now,
      description: data.description || null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      thumbnail: data.thumbnail
        ? `${RAW_URL_BASE}${data.thumbnail}`
        : '/default-blog-thumb.webp',
      content: bodyContent.trim(),
      editUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/edit/main/${file.path}`,
    } as Blog;
  });

  return posts.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export const getGithubMarkdownFiles = cache(async (): Promise<BlogResponse> => {
  try {
    if (!parsed) parsed = buildPosts();
    return { success: true, data: parsed };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: 'Failed to retrieve blogs!' };
  }
});

export async function getPostList() {
  const { success, data: posts, error } = await getGithubMarkdownFiles();
  if (!success || !posts) return { success: false, error };

  const pList = posts.map(({ content, ...rest }) => rest);
  return { success: true, data: pList };
}

export async function getPostBySlug(slug: string) {
  const { success, data: posts } = await getGithubMarkdownFiles();
  if (!success || !posts)
    return { success: false, error: 'Failed to fetch blog!' };
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
1. [Docker Interview Questions](devops/docker/docker-interview-questions.md)
## Sub-heading
More details here...

*/
