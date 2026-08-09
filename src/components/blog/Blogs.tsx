'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { Blog } from '@/lib/models/BlogModel';

export default function Blogs({
  blogFmM,
  blogFmG,
}: {
  blogFmM: Blog[];
  blogFmG: Blog[];
}) {
  const getValidDate = (dateVal: any) => {
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const allBlogs = useMemo(() => {
    const mBlogs = (blogFmM || []).map((blog) => ({ ...blog, source: 'main' }));
    const gBlogs = (blogFmG || []).map((blog) => ({ ...blog, source: 'git' }));

    return [...mBlogs, ...gBlogs].sort((a, b) => {
      return (
        getValidDate(b.updatedAt).getTime() -
        getValidDate(a.updatedAt).getTime()
      );
    });
  }, [blogFmM, blogFmG]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
      {/* Header */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
        <div className="z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground mb-4">
            LATEST <span className="text-primary">INSIGHTS</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
            MERN stack deep-dives, real-time architecture, and modern web
            development strategies.
          </p>
        </div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/15 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {allBlogs.map((blog) => {
          const href = `/blogs/b/${blog.source}/${blog.slug}`;
          const validDate = getValidDate(blog.createdAt);

          return (
            <Link
              key={blog._id || blog.slug}
              href={href}
              className="group flex flex-col bg-card rounded-2xl md:rounded-3xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-400 flex-1"
            >
              {/* Thumbnail */}
              <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-muted">
                <Image
                  src={blog.thumbnail || '/default-blog-thumb.webp'}
                  alt={blog.title}
                  fill
                  priority={false}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent opacity-90" />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex flex-col grow">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <time dateTime={blog.createdAt?.toString?.() ?? ''}>
                    {dateFormatter.format(validDate)}
                  </time>
                  <span className="w-1 h-1 bg-border rounded-full shrink-0" />
                  <span className="truncate">
                    {blog.source === 'git' ? blog.author?.name : 'Author'}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {blog.title}
                </h2>

                <p className="text-muted-foreground text-sm line-clamp-3 mb-5 leading-relaxed grow">
                  {blog.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-primary text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read Full Case
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
