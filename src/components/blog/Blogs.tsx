'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Blog } from '@/lib/models/BlogModel';
import { Reveal } from '../ui/Reveal';

const MotionLink = motion.create(Link);

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
        {allBlogs.map((blog, index) => {
          const href = `/blogs/b/${blog.source}/${blog.slug}`;
          const validDate = getValidDate(blog.createdAt);

          return (
            <MotionLink
              key={blog._id || blog.slug}
              href={href}
              initial={{ opacity: 0, y: 36, scale: 0.96, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{
                once: true,
                amount: 0.25,
                margin: '0px 0px -60px 0px',
              }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: (index % 3) * 0.1,
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="group flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-colors duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/20 md:rounded-3xl"
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

                <h2 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-xl">
                  {blog.title}
                </h2>

                <p className="mb-5 grow line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {blog.description}
                </p>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary transition-all group-hover:gap-2">
                    Read Full Case
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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
            </MotionLink>
          );
        })}
      </div>
    </section>
  );
}
