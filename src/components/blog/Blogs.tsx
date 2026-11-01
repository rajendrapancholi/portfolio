'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Blog } from '@/lib/models/BlogModel';

type BlogWithSource = Blog & { source: 'main' | 'git' };

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const getValidDate = (dateVal: unknown) => {
  const d = new Date(dateVal as string);
  return isNaN(d.getTime()) ? new Date(0) : d;
};

function BlogCard({ blog }: { blog: BlogWithSource }) {
  const href = `/blogs/b/${blog.source}/${blog.slug}`;
  const date = getValidDate(blog.createdAt);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={blog.thumbnail || '/default-blog-thumb.webp'}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="flex grow flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={date.toISOString()}>
            {dateFormatter.format(date)}
          </time>
          {blog.source === 'git' && blog.author?.name && (
            <>
              <span aria-hidden className="h-1 w-1 rounded-full bg-border" />
              <span className="truncate">{blog.author.name}</span>
            </>
          )}
        </div>

        <h2 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {blog.title}
        </h2>

        {blog.description && (
          <p className="mb-4 line-clamp-3 grow text-sm leading-relaxed text-muted-foreground">
            {blog.description}
          </p>
        )}

        <span className="mt-auto text-sm font-medium text-primary">
          Read article →
        </span>
      </div>
    </Link>
  );
}

export default function Blogs({
  blogFmM,
  blogFmG,
}: {
  blogFmM: Blog[];
  blogFmG: Blog[];
}) {
  const allBlogs = useMemo<BlogWithSource[]>(() => {
    const mBlogs = (blogFmM || []).map((blog) => ({
      ...blog,
      source: 'main' as const,
    }));
    const gBlogs = (blogFmG || []).map((blog) => ({
      ...blog,
      source: 'git' as const,
    }));

    return [...mBlogs, ...gBlogs].sort(
      (a, b) =>
        getValidDate(b.updatedAt).getTime() -
        getValidDate(a.updatedAt).getTime(),
    );
  }, [blogFmM, blogFmG]);

  if (allBlogs.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">
        No posts found.
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
      <header className="mb-10 max-w-2xl md:mb-12">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Blog
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          MERN stack deep-dives, real-time architecture, and modern web
          development strategies.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allBlogs.map((blog) => (
          <BlogCard key={blog._id || blog.slug} blog={blog} />
        ))}
      </div>
    </section>
  );
}
