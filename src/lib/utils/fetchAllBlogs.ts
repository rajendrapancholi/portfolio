import { getBlogList } from '@/app/actions/blog';
import { getPostList } from '@/app/actions/githubBlog';
import { Blog } from '@/lib/models/BlogModel';

export default async function fetchAllBlogs(): Promise<Blog[]> {
  try {
    const [resDb, resGit] = await Promise.allSettled([
      getBlogList(),
      getPostList(),
    ]);

    const blogs: Blog[] = [];

    if (
      resDb.status === 'fulfilled' &&
      resDb.value.success &&
      resDb.value.data
    ) {
      blogs.push(
        ...resDb.value.data.map((b: Blog) => ({
          ...b,
          source: 'main' as const,
        })),
      );
    }

    if (
      resGit.status === 'fulfilled' &&
      resGit.value.success &&
      Array.isArray(resGit.value.data)
    ) {
      blogs.push(
        ...resGit.value.data.map((b: Blog) => ({
          ...b,
          source: 'git' as const,
        })),
      );
    }

    if (blogs.length === 0) {
      console.error('All blog data sources unreachable');
      return [];
    }

    return blogs.sort(
      (a, b) =>
        new Date(b.updatedAt ?? b.createdAt).getTime() -
        new Date(a.updatedAt ?? a.createdAt).getTime(),
    );
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}
