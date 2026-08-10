'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Blog } from '@/lib/models/BlogModel';
import { Reveal } from '../ui/Reveal';

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px', ...options },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function BlogCard({
  blog,
  index,
  dateFormatter,
  getValidDate,
}: {
  blog: Blog & { source: 'main' | 'git' };
  index: number;
  dateFormatter: Intl.DateTimeFormat;
  getValidDate: (dateVal: any) => Date;
}) {
  const { ref, isVisible } = useInView<HTMLAnchorElement>();
  const href = `/blogs/b/${blog.source}/${blog.slug}`;
  const validDate = getValidDate(blog.createdAt);
  const delayMs = (index % 3) * 100;

  return (
    <Link
      ref={ref}
      href={href}
      style={{ transitionDelay: isVisible ? `${delayMs}ms` : '0ms' }}
      className={`group flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-elevated hover:shadow-primary/10 active:scale-[0.99] md:rounded-3xl ${
        isVisible
          ? 'translate-y-0 opacity-100 blur-none'
          : 'translate-y-8 opacity-0 blur-[6px]'
      }`}
    >
      <div className="relative h-52 w-full overflow-hidden bg-muted sm:h-60">
        <Image
          src={blog.thumbnail || '/default-blog-thumb.webp'}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-card via-card/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-70" />
        <div className="absolute inset-0 opacity-0 ring-1 ring-inset ring-primary/30 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex grow flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={validDate.toISOString()}>
            {dateFormatter.format(validDate)}
          </time>
          <span className="h-1 w-1 shrink-0 rounded-full bg-border" />
          <span className="truncate">
            {blog.source === 'git' ? blog.author?.name : 'Author'}
          </span>
        </div>

        <h2 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary sm:text-xl">
          {blog.title}
        </h2>

        <p className="mb-5 grow line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {blog.description}
        </p>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary transition-all duration-200 group-hover:gap-2">
            Read Full Case
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
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
}

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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
      <Reveal
        direction="up"
        className="relative mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end"
      >
        <div className="z-10">
          <h1 className="mb-4 text-4xl font-black tracking-tighter text-foreground md:text-5xl lg:text-6xl">
            LATEST <span className="text-primary">INSIGHTS</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            MERN stack deep-dives, real-time architecture, and modern web
            development strategies.
          </p>
        </div>
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-[100px]" />
      </Reveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {allBlogs.map((blog, index) => (
          <BlogCard
            key={blog._id || blog.slug}
            blog={blog}
            index={index}
            dateFormatter={dateFormatter}
            getValidDate={getValidDate}
          />
        ))}
      </div>
    </section>
  );
}
