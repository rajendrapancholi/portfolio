"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Blog } from "@/lib/models/BlogModel";

export default function Blogs({ blogFmM, blogFmG }: { blogFmM: Blog[]; blogFmG: Blog[]; }) {
    const getValidDate = (dateVal: any) => {
        const d = new Date(dateVal);
        return isNaN(d.getTime()) ? new Date() : d;
    };

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const allBlogs = useMemo(() => {
        const mBlogs = (blogFmM || []).map(blog => ({ ...blog, source: 'main' }));
        const gBlogs = (blogFmG || []).map(blog => ({ ...blog, source: 'git' }));

        return [...mBlogs, ...gBlogs].sort((a, b) => {
            return getValidDate(b.updatedAt).getTime() - getValidDate(a.updatedAt).getTime();
        });
    }, [blogFmM, blogFmG]);

    return (
        <section className="max-w-7xl mx-auto px-6 py-20">
            {/* Header Section */}
            <div className="relative flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div className="z-10">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
                        LATEST <span className="text-blue-500">INSIGHTS</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                        MERN stack deep-dives, real-time architecture, and modern web development strategies.
                    </p>
                </div>
                {/* Decorative background element */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-600/10 blur-[100px] rounded-full" />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allBlogs.map((blog) => {
                    const href = `/blogs/b/${blog.source}/${blog.slug}`;
                    const validDate = getValidDate(blog.createdAt);
                    return (
                        <Link
                            key={blog._id || blog.slug}
                            href={href}
                            className="group flex flex-col bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden hover:border-blue-500/40 hover:bg-[#111] transition-all duration-500 flex-1"
                        >
                            {/* Image Container */}
                            <div className="relative h-60 w-full overflow-hidden">
                                <Image
                                    src={blog.thumbnail || "/default-blog-thumb.webp"}
                                    alt={blog.title}
                                    fill
                                    priority={false}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />

                                {/* Top Badges */}
                                <div className="absolute top-4 left-4 flex gap-2 z-20">
                                    <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-blue-600 text-white rounded-full">
                                        {blog.type || "Code"}
                                    </span>
                                    {blog.source === 'git' && (
                                        <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-white/10 text-white backdrop-blur-md rounded-full border border-white/10">
                                            GitHub
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col grow">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                    <time dateTime={blog.createdAt.toString()}>
                                        {dateFormatter.format(validDate)}
                                    </time>
                                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                    <span className="truncate">
                                        {blog.source === 'git' ? blog.author?.name : "Author"}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {blog.title}
                                </h2>

                                <p className="text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed grow">
                                    {blog.description}
                                </p>

                                {/* Bottom Meta */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-blue-400 text-xs font-bold uppercase tracking-tighter inline-flex items-center group-hover:gap-2 transition-all">
                                        Read Full Case
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
