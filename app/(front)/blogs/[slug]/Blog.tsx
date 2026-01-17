"use client";

import ReactMarkdown from "react-markdown";

const Blog = ({ blog }: any) => {
    return (
        <article className="max-w-3xl mx-auto px-4 py-14">
            <p className="text-sm text-gray-400 mb-3">
                {blog.date} · {blog.author}
            </p>

            <h1 className="text-4xl font-bold mb-8">
                {blog.title}
            </h1>

            <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>
        </article>
    );
};

export default Blog;