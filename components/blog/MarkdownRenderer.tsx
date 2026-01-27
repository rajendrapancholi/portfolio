"use client";

import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";

import { ENV } from "@/config/env";
import { usePathname } from "next/navigation";

const RAW_URL_BASE = `https://raw.githubusercontent.com/${ENV.NEXT_PUBLIC_REPO_OWNER}/${ENV.NEXT_PUBLIC_REPO_NAME}/main`;

const MarkdownComponents = {
    img: ({ src, alt, ...props }: any) => {
        const imageSrc = typeof src === 'string' ? src : '';

        return (
            <span className="group block **:block relative my-8 max-w-fit self-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-all duration-300  hover:shadow-xl hover:shadow-blue-500/10  dark:border-slate-800 dark:bg-slate-900/50 dark:hover:shadow-blue-400/5">

                {/* Aspect Ratio Container to prevent layout shift */}
                <span className="relative overflow-hidden">
                    <img
                        {...props}
                        src={imageSrc}
                        alt={alt || ''}
                        loading="lazy"
                        className="w-full object-cover transition-transform duration-500 ease-out 
                       group-hover:scale-[1.03] cursor-zoom-in"
                    />

                    {/* Glossy Overlay on Hover */}
                    <span className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/40 via-transparent to-transparent  opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </span>

                {/* Theme-aware Caption with Glassmorphism */}
                {alt && (
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[80%] translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                        <span className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-center text-sm font-medium text-white shadow-lg backdrop-blur-md  dark:border-slate-700/50 dark:bg-slate-800/40">
                            {alt}
                        </span>
                    </span>
                )}
            </span>
        );
    }
};

const MarkdownRenderer = ({ content }: { content: string; }) => {
    const pathname = usePathname();
    const isGit = pathname.includes('/b/git');
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    type ColorMode = "light" | "dark";
    useEffect(() => {
        setMounted(true);
    }, []);
    const currentTheme = (mounted ? (resolvedTheme) : 'light') as ColorMode;

    if (!mounted) {
        return <Loading />;
    }
    return (
        <div className="markdown-render-blue-topaz md:px-2 bg-canvas"
            data-color-mode={currentTheme} >
            <MarkdownPreview
                components={MarkdownComponents}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                urlTransform={(uri) =>
                    isGit ? `${RAW_URL_BASE}/${uri}` : uri
                }
                source={content} />
        </div>
    );
};

export default MarkdownRenderer;
