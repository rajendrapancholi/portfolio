import { getBlogBySlug } from "@/app/actions/blog";
import { createPageMetadata } from "@/lib/seo/metadata";

interface Props {
    params: Promise<{ slug: string; }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const { data: blog } = await getBlogBySlug(slug);

    if (!blog) {
        return createPageMetadata({
            title: "Blog Not Found",
            description: "The requested blog post could not be found.",
            canonical: `https://rajendrapancholi.vercel.app{slug}`,
        });
    }

    return createPageMetadata({
        type: "article",
        title: blog.title,
        description: blog.description || `Read ${blog.title} by Rajendra Pancholi`,
        canonical: `https://rajendrapancholi.vercel.app/blog/b/${slug}`,
        image: blog.thumbnail || "/default-blog-thumb.webp",
    });
}

export default function BlogEditPage() {
    return (
        <article>
            <h1>Blog Post</h1>

        </article>
    );
}
