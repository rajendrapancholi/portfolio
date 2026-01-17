import Image from "next/image";
import Link from "next/link";

export const blogs = [
    {
        id: "1",
        title: "Building a Modern Web App with Next.js",
        slug: "modern-web-app-nextjs",
        description:
            "A practical guide to building scalable applications using the Next.js App Router.",
        cover: "/images/blog-1.jpg",
        author: "John Doe",
        date: "Jan 10, 2025",
        content: `
## Introduction
Next.js is a powerful framework for building full-stack React apps.

### Why Next.js?
- App Router
- Server Components
- SEO friendly

### Final Thoughts
Next.js simplifies complex workflows.
`,
    },
    {
        id: "2",
        title: "Why Markdown is Perfect for Blogs",
        slug: "markdown-for-blogs",
        description:
            "Learn why Markdown is a great choice for writing and managing blog content.",
        cover: "/images/blog-2.jpg",
        author: "John Doe",
        date: "Jan 15, 2025",
        content: `
## Simple & Clean
Markdown keeps writing distraction-free.

## Easy to Store
Perfect for databases and version control.
`,
    },
];


export default function Blogs() {
    return (
        <section className="max-w-6xl mx-auto px-4 py-14">
            <h1 className="text-4xl font-bold mb-10">Blog</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {blogs.map((blog) => (
                    <Link
                        key={blog.id}
                        href={`/blogs/${blog.slug}`}
                        className="group rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition"
                    >
                        <div className="relative h-56">
                            <Image
                                src={blog.cover}
                                alt={blog.title}
                                fill
                                className="object-cover group-hover:scale-105 transition"
                            />
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-gray-400 mb-2">
                                {blog.date} · {blog.author}
                            </p>
                            <h2 className="text-2xl font-semibold mb-3">
                                {blog.title}
                            </h2>
                            <p className="text-gray-400">{blog.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
