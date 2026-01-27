import { createPageMetadata } from "@/lib/seo/metadata";

import { Blog } from "@/lib/models/BlogModel";
import Blogs from "./Blogs";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import fetchAllBlogs from "@/lib/utils/fetchAllBlogs";

export const metadata = createPageMetadata({
    title: "Admin Blogs",
    description: "Explore blogs, tutorials, and insights by Rajendra Pancholi.",
    canonical: "https://rajendrapancholi.vercel.app/blogs",
    noindex: true
});

export default async function AdminBlogsPage() {
    const blogs = await fetchAllBlogs();

    if (!blogs || !Array.isArray(blogs)) {
        throw new Error("Failed to fetch blogs");
    }

    return (
        <Suspense fallback={<Loading />}>
            <Blogs blogs={blogs as Blog[]} />
        </Suspense>
    );
}
