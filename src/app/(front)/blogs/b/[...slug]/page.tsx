import { createPageMetadata } from '@/lib/seo/metadata';
import { ENV } from '@/config/env';
import { generateDynamicJsonLd } from '@/lib/seo/jsonld';
import { getBlogBySlug } from '@/app/actions/blog';
import Script from 'next/script';
import safeJSONStringify, { sanitizeSlug } from '@/lib/utils/safeSanitize';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa6';
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import Feedback from '@/components/blog/Feedback';
import { getHeadings } from '@/lib/utils/getHeadings';
import { getPostBySlug } from '@/app/actions/githubBlog';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import fetchAllBlogs from '@/lib/utils/fetchAllBlogs';
import { auth } from '@/lib/auth';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/Breadcrumb';
import CollapsibleToc from '@/components/blog/CollapsibleToc';
import { Pencil, Eye } from 'lucide-react';

const baseUrl = ENV.BASE_URL ?? 'https://rajendrapancholi.vercel.app';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!slug || slug.length < 2)
    return createPageMetadata({
      title: 'Invalid URL',
      description: 'The requested blog post could not be found.',
      canonical: '/blogs/b/invalid-url',
      category: 'Blog-Not-Found!',
      isDynamic: true,
    });

  const [src, ...pathSegments] = slug;
  const source = sanitizeSlug(src);
  const actualSlug = sanitizeSlug(pathSegments.join('/'));
  let blog = null;

  try {
    if (source === 'git') {
      const response = await getPostBySlug(actualSlug);
      blog = response?.data;
    } else if (source === 'main') {
      const mongoSlug = pathSegments[pathSegments.length - 1];
      const response = await getBlogBySlug(sanitizeSlug(mongoSlug));
      blog = response?.data;
    }
  } catch (error) {
    console.error('Metadata fetch failed:', error);
  }

  if (!blog) {
    return createPageMetadata({
      title: 'Blog Not Found!',
      description: 'The requested blog post could not be found.',
      canonical: `https://rajendrapancholi.vercel.app/blogs/b/blog-not-found`,
      category: 'Blog Not Found!',
      isDynamic: true,
    });
  }

  return createPageMetadata({
    type: 'article',
    title: blog.title,
    description: blog.description || `Read ${blog.title} by Rajendra Pancholi`,
    canonical: `https://rajendrapancholi.vercel.app/blogs/b/${source}/${actualSlug}`,
    image: blog.thumbnail ? blog.thumbnail : null,
    keywords: blog.keywords,
    isDynamic: blog.thumbnail ? false : true,
    category: blog.type || 'Post',
  });
}

export async function generateStaticParams() {
  const blogs = await fetchAllBlogs();
  return blogs.map((blog) => ({
    slug: [blog.source, blog.slug],
  }));
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  if (!slug || slug.length < 2) notFound();
  const [source, ...pathSegments] = slug;
  const actualSlug = sanitizeSlug(pathSegments.join('/'));
  const allBlogs = await fetchAllBlogs();
  let blog = null;
  let success = false;

  try {
    if (source === 'git') {
      const response = await getPostBySlug(actualSlug);
      success = response.success;
      blog = response?.data;
    } else {
      const response = await getBlogBySlug(
        pathSegments[pathSegments.length - 1],
      );
      success = response.success;
      blog = response?.data;
    }
  } catch (error) {
    console.error('Fetch failed!', error);
  }

  if (!blog) notFound();
  if (!success || !blog || !blog.content) {
    notFound();
  }

  const currentIndex = allBlogs.findIndex((b) => b.slug === actualSlug);
  const blogF = allBlogs[currentIndex];
  if (!blogF) notFound();

  const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextBlog =
    currentIndex !== -1 && currentIndex < allBlogs.length - 1
      ? allBlogs[currentIndex + 1]
      : null;

  const jsonLd = generateDynamicJsonLd({
    type: 'blog',
    title: blog.title || 'Rajendra Pancholi',
    url: baseUrl,
    description: blog.description || `Read ${blog.title} by Rajendra Pancholi`,
    author: blog.author.name || 'Rajendra Pancholi',
    publishedAt: blog.createdAt,
    logo: `${baseUrl}/android-chrome-192x192.png`,
    image: blog.thumbnail || '/default-blog-thumb-webp',
    updatedAt: blog.updatedAt,
    priceCurrency: 'rs',
  });

  const headings = getHeadings(blog.content);

  const session = await auth();
  const canEdit =
    session?.user?.role === 'admin' || session?.user?.role === 'author';
  const githubUrl = blog.editUrl
    ? canEdit
      ? blog.editUrl
      : blog.editUrl.replace('/edit/', '/blob/')
    : null;

  return (
    <>
      <Script
        id={blog.slug}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJSONStringify(jsonLd, { decodeUri: true }),
        }}
      />

      <div className="flex relative">
        <article className="min-w-0 flex-1 md:px-2 overflow-visible">
          <div
            className="sticky z-15 py-1 mt-3 mb-4 backdrop-blur-md border-b border-border/50 transition-[top] duration-300 ease-out"
            style={{ top: 'var(--navbar-height, 70px)' }}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="min-w-0 flex-1">
                <Breadcrumb className="uppercase tracking-widest font-medium">
                  <BreadcrumbList className="text-[10px] md:text-xs flex-wrap">
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          href="/blogs"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          BLOGS
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>

                    {pathSegments.map((segment, i) => {
                      const isLast = i === pathSegments.length - 1;
                      const breadcrumbPath = `/blogs/b/${source}/${pathSegments
                        .slice(0, i + 1)
                        .join('/')}`;

                      return (
                        <React.Fragment key={i}>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem className="min-w-0">
                            {isLast ? (
                              <BreadcrumbPage className="text-primary truncate max-w-48 sm:max-w-[16rem] md:max-w-88 lg:max-w-none">
                                {segment.replace(/-/g, ' ')}
                              </BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink asChild>
                                <Link
                                  href={breadcrumbPath}
                                  className="text-muted-foreground hover:text-primary/80 transition-colors truncate max-w-32 sm:max-w-48 inline-block"
                                >
                                  {segment.replace(/-/g, ' ')}
                                </Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </React.Fragment>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className="flex shrink-0 items-center gap-2 text-[11px] font-semibold mr-1">
                <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-md bg-primary/10 border border-primary/20 text-primary whitespace-nowrap">
                  <span className="text-muted-foreground">
                    {blog.author.name}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-primary/60 uppercase text-[9px]">
                    Updated :
                  </span>
                  <time dateTime={new Date(blog.updatedAt).toISOString()}>
                    {new Date(blog.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              </div>
            </div>
          </div>

          <header className="relative mb-8 overflow-visible">
            {(!headings ||
              headings.length === 0 ||
              headings[0].level !== 1) && (
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-black …">
                  {blog.title}
                </h1>
                <div className="h-1.5 w-24 bg-linear-to-r from-primary to-primary/60 rounded-full" />
              </div>
            )}
          </header>

          <MarkdownRenderer content={blog.content} />

          <footer className="mt-20 border-t border-border py-16">
            <div className="flex flex-col gap-12">
              {/* Like Button */}
              <div
                aria-label="Like this post"
                className="flex justify-center items-center gap-4"
              >
                <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-muted border border-border hover:border-pink-500/50 transition-all duration-300 shadow-sm">
                  <Heart className="w-5 h-5 text-muted-foreground group-hover:text-pink-500 group-active:scale-125 transition-all" />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                    Like this post
                  </span>
                </button>
              </div>

              {/* Previous / Next */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevBlog ? (
                  <Link
                    href={`/blogs/b/${prevBlog.source}/${prevBlog.slug}`}
                    className="group p-6 rounded-2xl bg-card border border-border hover:bg-muted/40 hover:border-primary/30 transition-all duration-300 flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-widest font-semibold">
                        Previous
                      </span>
                    </div>
                    <span className="text-foreground font-medium line-clamp-1">
                      {prevBlog.title}
                    </span>
                  </Link>
                ) : (
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border opacity-50 flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                      No Previous Post
                    </span>
                  </div>
                )}

                {nextBlog ? (
                  <Link
                    href={`/blogs/b/${nextBlog.source}/${nextBlog.slug}`}
                    className="group p-6 rounded-2xl bg-card border border-border hover:bg-muted/40 hover:border-primary/30 transition-all duration-300 flex flex-col items-end gap-2 text-right"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                      <span className="text-xs uppercase tracking-widest font-semibold">
                        Next
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <span className="text-foreground font-medium line-clamp-1">
                      {nextBlog.title}
                    </span>
                  </Link>
                ) : (
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border opacity-50 flex flex-col items-end gap-2 text-right">
                    <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                      No Next Post
                    </span>
                  </div>
                )}
              </div>

              {/* Author + Source */}
              <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border gap-6">
                <p className="text-muted-foreground text-sm">
                  &#64; {' ' + blog.author.name}
                </p>
                {source === 'git' && githubUrl && (
                  <Link
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-4 py-2 rounded-lg transition-all"
                  >
                    {canEdit ? (
                      <>
                        <Pencil className="w-4 h-4" />
                        <span>Edit on GitHub</span>
                      </>
                    ) : (
                      <>
                        <FaGithub className="w-4 h-4" />
                        <span>View on GitHub</span>
                      </>
                    )}
                  </Link>
                )}
              </div>

              <Feedback />
            </div>
          </footer>
        </article>
        <CollapsibleToc headings={headings} />
      </div>
    </>
  );
}
