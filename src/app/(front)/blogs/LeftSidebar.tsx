import { Suspense } from 'react';
import LoadingSidebar from './b/loading';
import fetchAllBlogs from '@/lib/utils/fetchAllBlogs';
import SidebarTree from '@/components/blog/SidebarTree';
import { buildBlogTree } from '@/lib/utils/buildBlogTree';

export default function LeftSidebar() {
  return (
    <div className="flex h-full w-full flex-col">
      <Suspense fallback={<LoadingSidebar />}>
        <BlogListContent />
      </Suspense>
    </div>
  );
}

async function BlogListContent() {
  const blogs = await fetchAllBlogs();
  if (!blogs || !Array.isArray(blogs)) {
    throw new Error('Failed to fetch blogs');
  }
  const tree = buildBlogTree(blogs);
  return (
    <div className="flex-1 mx-2 pr-2">
      <SidebarTree nodes={tree} />
    </div>
  );
}
