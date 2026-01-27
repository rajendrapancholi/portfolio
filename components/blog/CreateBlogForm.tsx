"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { PenTool, Send, Type, Sparkles, ImageIcon } from "lucide-react";
import { createBlog } from "@/app/actions/blog";
import rehypeRaw from "rehype-raw";
import { commands } from "@uiw/react-md-editor";
import Button from "@/components/ui/Button";
import Thumbnail from "./Thumbnail";
import Image from "next/image";
import remarkGfm from "remark-gfm";
import rehypeSanitize from 'rehype-sanitize';
import rehypePrismPlus from "rehype-prism-plus";
import { formatString } from "@/lib/utils/formatter";

// Dynamic import for MD Editor (SSR safe)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export type BlogType = {
    title: string,
    content: string,
    thumbnail?: string;
    blogDocImgsLnk?: string[];
};

const CreateBlogForm = () => {
    const [blogData, setBlogData] = useState<Partial<BlogType>>({
        title: "",
        content: "## Start your story...",
        thumbnail: "",
    });
    const [isPending, setIsPending] = useState(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // This updates the <title> tag in the browser tab as you type
    useEffect(() => {
        const currentTitle = blogData.title?.trim() ?? "";
        if (currentTitle.length > 0) {
            document.title = `• ${formatString(currentTitle, 18)} | Rajendra Pancholi`;
        } else {
            document.title = "New Blog | Rajendra Pancholi";
        }
    }, [blogData.title]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBlogData((prev) => ({ ...prev, [name]: value }));
    };

    async function handleSubmit(e: React.FormEvent) {
        let toastId = toast.loading("Posting blog...");
        e.preventDefault();

        if (!blogData.title || blogData.title.length === 0) return toast.error("Title is required!", { id: toastId });

        if (!blogData.content || blogData.content.length < 10) return toast.error("Content is too short!", { id: toastId });

        setIsPending(true);
        const formData = new FormData();
        formData.append("title", blogData.title);
        formData.append("content", blogData.content);
        formData.append("thumbnail", blogData.thumbnail || "/default-blog-thumb.webp");

        try {
            await createBlog(formData);
            toast.success("Blog published to the universe!", { id: toastId });
            setBlogData({
                title: "",
                content: "",
                thumbnail: "",
                blogDocImgsLnk: []
            });
        } catch (err) {
            toast.error("Failed to publish post.", { id: toastId });
        } finally {
            setIsPending(false);
        }
    }
    const imageUploadCommand = {
        name: "image-upload",
        keyCommand: "image-upload",
        buttonProps: {
            "aria-label": "Upload Image",
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px 3px 2px 3px' // Removes default padding that might offset the icon
            }
        },
        icon: <ImageIcon size={13} />,
        execute: (_state: any, api: any) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async () => {
                const file = input.files?.[0];
                if (file) {
                    toast.loading("Uploading image...", { id: "img-up" });
                    // const url = await uploadFile(file);
                    const url = file.name;
                    setBlogData((prev) => ({
                        ...prev,
                        blogDocImgsLnk: [...(prev.blogDocImgsLnk || []), url],
                    }));
                    toast.success("Image ready!", { id: "img-up" });

                    // Insert markdown image syntax at cursor position
                    api.replaceSelection(`![image](${url})`);
                }
            };
            input.click();
        },
    };

    return (
        <div className="relative w-full mx-auto min-h-screen animate-in-view">
            {isOpen &&
                <div className="absolute inset-0">
                    <Thumbnail
                        currentUrl={blogData.thumbnail || ""}
                        blogTitle={blogData.title || ""}
                        onUpload={(url) => setBlogData((prev) => ({ ...prev, thumbnail: url }))}
                        onClose={() => setIsOpen(false)}
                    />
                </div>
            }

            <div className="glass-editor rounded-4xl shadow-2xl overflow-hidden border border-white/10">

                {/* Decorative Top Bar */}
                <div className="h-1 w-full bg-linear-to-r from-cyan-500 via-blue-500 to-purple-600" />

                <div className="p-1 md:p-3 space-y-8 rounded-4xl">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/20">
                                <Sparkles className="text-cyan-400" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">Drafting Room</h1>
                                <p className="text-gray-400 text-xs uppercase tracking-widest">Post Editor v{new Date().getFullYear()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Editor Online
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Title Input Field */}
                        <div className="relative group">
                            <label className="absolute -top-2.5 left-4 bg-[#1e293b] px-2 text-xs font-medium text-cyan-400 z-10 border border-white/10 rounded">
                                Post Title
                            </label>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-1 items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-cyan-500/50 focus-within:ring-4 focus-within:ring-cyan-500/10 transition-all duration-300">
                                    <div className="pl-4 text-gray-500">
                                        <Type size={20} />
                                    </div>
                                    <input
                                        name="title"
                                        value={blogData.title}
                                        onChange={handleChange}
                                        placeholder="Enter a captivating headline..."
                                        required
                                        className="w-full bg-transparent p-4 outline-none text-white font-medium placeholder:text-gray-600"
                                    />

                                </div>
                                {/* Submit Action */}
                                <div className="flex items-center justify-end  pl-4 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setBlogData((prev) => ({ ...prev, content: "" }))}
                                        className="glow-on-hover relative flex items-center gap-3 bg-gray-600 hover:bg-gray-500 text-white font-bold px-5 py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-cyan-900/20"
                                    >
                                        Clear Draft
                                    </button>

                                    <button
                                        disabled={isPending}
                                        className="glow-on-hover relative flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-10 py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-cyan-900/20"
                                    >
                                        {isPending ? (
                                            <span className="flex items-center gap-2">
                                                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Syncing...
                                            </span>
                                        ) : (
                                            <>
                                                <span>Publish Post</span>
                                                <Send size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Markdown Editor */}
                        <div className="space-y-3" data-color-mode="dark">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                    <PenTool size={16} className="text-cyan-400" /> Story Content
                                </label>
                                <Button
                                    title={blogData.thumbnail ? "Change Image" : "Add Thumbnail"}
                                    position="left"
                                    handleClick={(e) => {
                                        e.preventDefault();
                                        setIsOpen(true);
                                    }}
                                    otherClasses="!px-4"
                                    icon={
                                        <div className="relative overflow-hidden rounded-lg border border-white/10 w-9 h-9 flex items-center justify-center bg-slate-800/50 shadow-inner transition-all duration-300 group-hover:border-cyan-500/50 group-hover:ring-2 group-hover:ring-cyan-500/20">
                                            {blogData.thumbnail ? (
                                                <Image
                                                    alt="blog-thumbnail"
                                                    src={blogData.thumbnail || "default-blog-thumb.webp"}
                                                    sizes="36px"
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <ImageIcon
                                                    size={20}
                                                    className="text-gray-400 transition-all duration-500 group-hover:text-cyan-400 group-hover:scale-110"
                                                />
                                            )}

                                            {/* Subtle glass reflection overlay */}
                                            <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent pointer-events-none" />
                                        </div>
                                    }
                                />

                                <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">Markdown Enabled</span>
                            </div>

                            <div className="rounded-2xl overflow-hidden border border-white/10 focus-within:border-cyan-500/50 transition-colors">
                                <div className="editor-shell">
                                    <MDEditor
                                        value={blogData.content}
                                        onChange={(val) => setBlogData(prev => ({ ...prev, content: val ?? "" }))}
                                        height={600}
                                        preview="edit"
                                        className="bg-transparent"
                                        style={{ zIndex: 100 }}
                                        textareaProps={{
                                            placeholder: "Start typing your masterpiece...",
                                            className: "line-numbered-input"
                                        }}
                                        previewOptions={{
                                            remarkPlugins: [remarkGfm],
                                            rehypePlugins: [[rehypeRaw], [rehypeSanitize],
                                            [rehypePrismPlus, {
                                                ignoreMissing: true,
                                                showLineNumbers: true
                                            }]
                                            ],
                                        }}

                                        commands={[
                                            ...commands.getCommands(),
                                            imageUploadCommand

                                        ]}
                                    />

                                </div>

                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Tip Box */}
            <div className="mt-6 text-center text-gray-500 text-xs">
                Pro Tip: Use <code className="text-cyan-500">###</code> for subheadings and <code className="text-cyan-500">{`> `}</code> for quotes.
            </div>
        </div>
    );
};
export default CreateBlogForm;