'use client';
import ModalWrapper from "@/components/ui/ModalWrapper";
import { Search, FileText, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Blog } from "@/lib/models/BlogModel";
import { useRouter } from "next/navigation";
import fetchAllBlogs from "@/lib/utils/fetchAllBlogs";

export default function SearchModal() {
    const [query, setQuery] = useState("");
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

    // Filter results
    const filteredResults = blogs.filter(blog =>
        blog.title.toLowerCase().includes(query.toLowerCase())
    );
    const onDismiss = useCallback(() => {
        router.back();
    }, [router]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);


    const handleSelection = (source: string, slug: string) => {
        router.back();
        setTimeout(() => {
            router.push(`/blogs/b/${source}/${slug}`);
        }, 50);
    };
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onDismiss();
            }

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((prev) =>
                    prev < filteredResults.length - 1 ? prev + 1 : prev
                );
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
            }

            if (e.key === "Enter") {
                if (filteredResults[activeIndex]) {
                    const selectedBlog = filteredResults[activeIndex];
                    handleSelection(selectedBlog.source, selectedBlog.slug);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [filteredResults, activeIndex, router, onDismiss]);

    useEffect(() => {
        let isMounted = true;
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);
                const response = await fetchAllBlogs();


                if (isMounted && response.length > 0) {
                    setBlogs(response);
                }
            } catch (error) {
                if (isMounted) console.error("Search fetch error:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchBlogs();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <ModalWrapper>
            <div className="flex flex-col h-125">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    {isLoading ? (
                        <Loader2 className="size-5 text-[#007acc] animate-spin" />
                    ) : (
                        <Search className="size-5 text-slate-400" />
                    )}
                    <input
                        ref={searchInputRef}
                        autoFocus
                        placeholder="Search tutorials, code, workflows..."
                        className="flex-1 bg-transparent border-none outline-none text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                            <Loader2 className="animate-spin" />
                            <p className="text-sm">Loading index...</p>
                        </div>
                    ) : filteredResults.length > 0 ? (
                        filteredResults.map((blog) => (
                            <Link
                                key={blog._id}
                                href={`/blogs/b/${blog.source}/${blog.slug}`}
                                onClick={(e) => {
                                    e.preventDefault(); // Stop default navigation
                                    handleSelection(blog.source, blog.slug);
                                }}

                                className={`flex items-center justify-between p-3 rounded-xl transition-colors group ${filteredResults[activeIndex]?._id === blog._id
                                    ? "bg-[#007acc]/10 ring-1 ring-[#007acc]/30"
                                    : "hover:bg-[#007acc]/10"
                                    }`}
                                onMouseEnter={() => setActiveIndex(blogs.indexOf(blog))}>
                                <div className="flex items-center gap-3">
                                    <FileText className="size-4 text-slate-400" />
                                    <div>
                                        <div className="font-medium group-hover:text-[#007acc]">
                                            {blog.title}
                                        </div>
                                        {/* Optional: Add tags or date if available in your schema */}
                                        {/* <div className="text-xs text-slate-500">{blog.slug || 'Tutorial'}</div> */}
                                    </div>
                                </div>
                                <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#007acc]" />
                            </Link>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            {query ? `No results found for "${query}"` : "Start typing to search..."}
                        </div>
                    )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 flex gap-4">
                    <span><kbd className="kbd kbd-xs">ENTER</kbd> select</span>
                    <span><kbd className="kbd kbd-xs">ESC</kbd> close</span>
                    <span className="ml-auto">{filteredResults.length} blogs found</span>
                </div>
            </div>
        </ModalWrapper>
    );
}
