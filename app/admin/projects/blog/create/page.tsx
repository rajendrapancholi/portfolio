"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
    ssr: false,
});

export default function CreateBlogPage() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");

    async function submit() {
        await fetch("/api/admin/blogs", {
            method: "POST",
            body: JSON.stringify({ title, slug, content }),
        });
    }

    return (
        <div className="max-w-4xl mx-auto py-10 space-y-4">
            <input
                placeholder="Title"
                className="w-full p-2 border"
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                placeholder="Slug"
                className="w-full p-2 border"
                onChange={(e) => setSlug(e.target.value)}
            />

            <MDEditor value={content} onChange={setContent} />

            <button onClick={submit} className="px-4 py-2 bg-black text-white">
                Publish
            </button>
        </div>
    );
}
