import { notFound } from "next/navigation";
import { blogs } from "../Blogs";
import Blog from "./Blog";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; }>; }): Promise<Metadata> {
    const resolvedParams = await params;
    return {
        title: `${resolvedParams.slug}`,
    };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string; }>; }) {
    const resolvedParams = await params;
    const blog = blogs.find((b) => b.slug === resolvedParams.slug);

    if (!blog) notFound();

    return (
        <Blog blog={blog} />
    );
}
