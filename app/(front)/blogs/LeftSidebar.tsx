import { Key, Suspense } from "react";
import LoadingSidebar from "./b/loading";
import { getBlogList } from "@/app/actions/blog";
import AnimatedLink from "@/components/blog/AnimatedLink";
import { getPostList } from "@/app/actions/githubBlog";

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
    const { success: sdb, data: BlogFmM, error: sde } = await getBlogList();
    const { success, data: BlogFmG, error } = await getPostList();

    if ((!success && !sdb) || !Array.isArray(BlogFmG)) {
        throw new Error(error || sde || "Failed to fetch blogs");
    }
    if (!BlogFmM) {
        throw new Error(error || sde || "Failed to fetch blogs");
    }

    const mBlogs = BlogFmM.map((blog) => ({ ...blog, source: 'main' }));
    const gBlogs = BlogFmG.map((blog) => ({ ...blog, source: 'git' }));
    const allBlogs = [...mBlogs, ...gBlogs].sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return (
        <div className="flex-1 space-y-1 px-0.5 lg:px-2">
            {allBlogs.map((blog: { slug: string; title: string; _id: Key | null | undefined; source: string; }) => (
                <AnimatedLink slug={blog.slug} title={blog.title} key={blog._id} source={blog.source} />
            ))}
        </div>
    );
}
