import { createPageMetadata } from "@/lib/seo/metadata";
import { ENV } from "@/config/env";
import { generateDynamicJsonLd } from "@/lib/seo/jsonld";
import { getBlogBySlug } from "@/app/actions/blog";
import Script from "next/script";
import safeJSONStringify, { sanitizeSlug } from "@/lib/utils/safeSanitize";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import Feedback from "@/components/blog/Feedback";
import TocSidebar from "@/components/blog/TOCSidebar";
import { getHeadings } from "@/lib/utils/getHeadings";
import { getPostBySlug } from "@/app/actions/githubBlog";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import fetchAllBlogs from "@/lib/utils/fetchAllBlogs";

const baseUrl = ENV.BASE_URL ?? "https://rajendrapancholi.vercel.app";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!slug || slug.length < 2)
    return createPageMetadata({
      title: "Invalid URL",
      description: "The requested blog post could not be found.",
      canonical: "/blogs/b/invalid-url",
      category: "Blog-Not-Found!",
      isDynamic: true,
    });
  let [src, acS] = slug;
  const source = sanitizeSlug(src);
  const actualSlug = sanitizeSlug(acS);

  let blog = null;

  try {
    if (source === "git") {
      const response = await getPostBySlug(actualSlug);
      blog = response?.data;
    } else if (source === "main") {
      const response = await getBlogBySlug(actualSlug);
      blog = response?.data;
    }
  } catch (error) {
    console.error("Metadata fetch failed:", error);
  }

  if (!blog) {
    return createPageMetadata({
      title: "Blog Not Found!",
      description: "The requested blog post could not be found.",
      canonical: `https://rajendrapancholi.vercel.app/blog/b/blog-not-found`,
      category: "Blog Not Found!",
      isDynamic: true,
    });
  }

  return createPageMetadata({
    type: "article",
    title: blog.title,
    description: blog.description || `Read ${blog.title} by Rajendra Pancholi`,
    canonical: `https://rajendrapancholi.vercel.app/blog/b/${source}/${actualSlug}`,
    image: blog.thumbnail ? blog.thumbnail : null,
    keywords: blog.tags,
    isDynamic: blog.thumbnail ? false : true,
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
  if (!slug || slug.length < 2) {
    notFound();
  }
  let [src, acS] = slug;
  const source = sanitizeSlug(src);
  const actualSlug = sanitizeSlug(acS);

  const allBlogs = await fetchAllBlogs();
  let blog = null;
  let success = false;
  try {
    if (source === "git") {
      const response = await getPostBySlug(actualSlug);
      success = response.success;
      blog = response?.data;
    } else if (source === "main") {
      const response = await getBlogBySlug(actualSlug);
      success = response.success;
      blog = response?.data;
    } else {
      throw new Error("Invalid url or blog not exists!");
    }
  } catch (error) {
    console.error("Metadata fetch failed!", error);
  }

  if (!blog) notFound();

  if (!success || !blog || !blog.content) {
    notFound();
  }

  const currentIndex = allBlogs.findIndex((b) => b.slug === actualSlug);
  const blogF = allBlogs[currentIndex];
  if (!blogF) notFound();

  const nextBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const prevBlog =
    currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  const jsonLd = generateDynamicJsonLd({
    type: "blog",
    title: blog.title || "Rajendra Pancholi",
    url: baseUrl,
    description: blog.description || `Read ${blog.title} by Rajendra Pancholi`,
    author: blog.author.name || "Rajendra Pancholi",
    publishedAt: blog.createdAt,
    logo: `${baseUrl}/android-chrome-192x192.png`,
    image: blog.thumbnail || "/default-blog-thumb-webp",
    updatedAt: blog.updatedAt,
    priceCurrency: "rs",
  });
  const headings = getHeadings(blog.content);
  return (
    <>
      <Script
        id={blog.slug}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJSONStringify(jsonLd, { decodeUri: true }),
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-5 justify-between gap-2 mx-1.5">
        <article className="col-span-4 w-full px-2">
          <header className="mb-10">
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-4 dark:bg-cyan-400/10 bg-cyan-400/20 w-fit px-2 py-1 rounded">
              <p className="text-gray-500">Last update: </p>
              <time dateTime={new Date(blog.updatedAt).toISOString()}>
                {new Date(blog.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <span className="text-slate-600">•</span>
              <span>{blog.author.name}</span>
            </div>

            {headings?.length > 0 && headings[0].level !== 1 && (
              <>
                <h1 className="text-2xl md:text-4xl font-extrabold dark:text-white mb-6 leading-tight tracking-tight">
                  {blog.title}
                </h1>
                <div className="h-1 w-20 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full" />
              </>
            )}
          </header>
          <MarkdownRenderer content={blog.content} />
          <footer className="mt-20 border-t border-slate-800/60 py-16">
            <div className="flex flex-col gap-12">
              {/* Interaction Layer: Like Button */}
              <div
                aria-label="Like this post"
                className="flex justify-center items-center gap-4"
              >
                <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 border border-slate-800 hover:border-pink-500/50 transition-all duration-300 shadow-xl shadow-black/20">
                  <Heart className="w-5 h-5 text-slate-500 group-hover:text-pink-500 group-active:scale-125 transition-all" />
                  <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200">
                    Like this post
                  </span>
                </button>
              </div>

              {/* Navigation Layer: Previous/Next */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Previous Blog */}
                {prevBlog ? (
                  <Link
                    href={`/blogs/b/${prevBlog.source}/${prevBlog.slug}`}
                    className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/40 hover:border-cyan-500/30 transition-all duration-300 flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2 text-slate-500 group-hover:text-cyan-400 transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-widest font-semibold">
                        Previous
                      </span>
                    </div>
                    <span className="text-slate-300 font-medium line-clamp-1">
                      {prevBlog.title}
                    </span>
                  </Link>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800/30 opacity-50 flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-widest font-semibold text-slate-600">
                      No Previous Post
                    </span>
                  </div>
                )}

                {/* Next Blog */}
                {nextBlog ? (
                  <Link
                    href={`/blogs/b/${nextBlog.source}/${nextBlog.slug}`}
                    className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/40 hover:border-cyan-500/30 transition-all duration-300 flex flex-col items-end gap-2 text-right"
                  >
                    <div className="flex items-center gap-2 text-slate-500 group-hover:text-cyan-400 transition-colors">
                      <span className="text-xs uppercase tracking-widest font-semibold">
                        Next
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <span className="text-slate-300 font-medium line-clamp-1">
                      {nextBlog.title}
                    </span>
                  </Link>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800/30 opacity-50 flex flex-col items-end gap-2 text-right">
                    <span className="text-xs uppercase tracking-widest font-semibold text-slate-600">
                      No Next Post
                    </span>
                  </div>
                )}
              </div>

              {/* Utility Layer: GitHub & Socials */}
              <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800/40 gap-6">
                <p className="text-slate-500 text-sm">
                  &#64; {" " + blog.author.name}
                </p>
                {source === "git" ||
                  (blog.editUrl && (
                    <Link
                      href={blog.editUrl}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 px-4 py-2 rounded-lg transition-all"
                    >
                      <FaGithub className="w-4 h-4" />
                      <span>Source Code</span>
                    </Link>
                  ))}
              </div>
              <Feedback />
            </div>
          </footer>
        </article>
        {/* Right Sidebar - Sticky TOC */}
        <aside className="hidden col-span-1 md:block">
          <div className="sticky top-4 bottom-2  h-[calc(100vh-64px)] overflow-hidden">
            <TocSidebar headings={headings} />
          </div>
        </aside>
      </div>
    </>
  );
}
