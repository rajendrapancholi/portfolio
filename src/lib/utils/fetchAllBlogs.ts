import { cache } from 'react';
import { getBlogList } from '@/app/actions/blog';
import { getPostList } from '@/app/actions/githubBlog';

const fetchAllBlogs = cache(async () => {
  const [mongoResult, gitResult] = await Promise.allSettled([
    getBlogList(),
    getPostList(),
  ]);

  const mongoBlogs =
    mongoResult.status === 'fulfilled' ? mongoResult.value.data : [];
  const gitBlogs = gitResult.status === 'fulfilled' ? gitResult.value.data : [];

  const merged = [
    ...(mongoBlogs || []).map((b) => ({ ...b, source: 'main' as const })),
    ...(gitBlogs || []).map((b) => ({ ...b, source: 'git' as const })),
  ];

  return merged.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
});

export default fetchAllBlogs;
