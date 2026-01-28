import { Key, Suspense } from "react";
import LoadingSidebar from "./b/loading";
import AnimatedLink from "@/components/blog/AnimatedLink";
import fetchAllBlogs from "@/lib/utils/fetchAllBlogs";

export default function LeftSidebar() {
    return (
        <div className="flex flex-col h-full w-full">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 px-2">
                Recent blogs
            </h3>
            <Suspense fallback={<LoadingSidebar />}>
                <BlogListContent />
            </Suspense>
        </div>
    );
}

async function BlogListContent() {

    const blogs = await fetchAllBlogs();
    if ((!blogs) || !Array.isArray(blogs)) {
        throw new Error("Failed to fetch blogs");
    }
    return (
        <div className="flex-1 space-y-1 px-0.5 lg:px-2">
            {blogs.map((blog: { slug: string; title: string; _id: Key | null | undefined; source: string; }) => (
                <AnimatedLink slug={blog.slug} title={blog.title} key={blog._id} source={blog.source} />
            ))}
        </div>
    );
}
