import { Suspense } from 'react';
import { BlogSearchListener } from '@/components/blog/BlogSearchListener';
import ClientSideElements from '@/components/blog/ClientElements';
import Footer from '@/components/Footer';
import { buildBlogTree } from '@/lib/utils/buildBlogTree';
import fetchAllBlogs from '@/lib/utils/fetchAllBlogs';
import BlogNavbarClient from '@/components/blog/BlogNavbarClient';

export default async function MainBlogLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const blogs = await fetchAllBlogs();
  const tree = buildBlogTree(blogs);

  return (
    <div className="relative min-h-screen bg-main-bg text-main-text">
      <BlogNavbarClient tree={tree} />

      <div
        className="shrink-0 transition-[height] duration-300 ease-out"
        style={{ height: 'var(--navbar-height, 70px)' }}
        aria-hidden="true"
      />

      <Suspense fallback={<div>Loading layout content...</div>}>
        <main
          className="relative z-10"
          style={{ minHeight: 'calc(100vh - var(--navbar-height, 70px))' }}
        >
          {children}
        </main>

        <div className="mx-auto max-w-7xl px-4">
          <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
        </div>

        {modal}
      </Suspense>

      <BlogSearchListener />
      <Footer />
      <ClientSideElements />
    </div>
  );
}
